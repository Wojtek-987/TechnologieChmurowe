import express, { Request, Response } from 'express';import cors from 'cors';
import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import { User } from './models/User';

const app = express();
const PORT = 4001;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';

app.use(cors());
app.use(express.json());

async function start() {
    await connectDB();


    app.post(
        '/register',
        async (
            req: Request<{}, { id: string; username: string } | { message: string }, { username?: string; password?: string }>,
            res: Response<{ id: string; username: string } | { message: string }>
        ): Promise<void> => {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ message: 'Username and password required' });
                return;
            }

            try {
                const exists = await User.findOne({ username });
                if (exists) {
                    res.status(409).json({ message: 'Username already taken' });
                    return;
                }

                const user = await User.create({ username, password });
                res.status(201).json({ id: String((user as any)._id), username: user.username });
                return;
            } catch (err) {
                console.error('Error registering user:', err);
                res.status(500).json({ message: 'Server error' });
                return;
            }
        }
    );

    app.post(
        '/login',
        async (
            req: Request<{}, { token: string } | { message: string }, { username: string; password: string }>,
            res: Response<{ token: string } | { message: string }>
        ): Promise<void> => {
            const { username, password } = req.body;

            try {
                const user = await User.findOne({ username });
                if (!user || user.password !== password) {
                    res.status(401).json({ message: 'Invalid credentials' });
                    return;
                }

                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
                return;
            } catch (err) {
                console.error('Error during login:', err);
                res.status(500).json({ message: 'Server error' });
                return;
            }
        }
    );

    app.listen(PORT, () => {
        console.log(`Auth Service listening on http://localhost:${PORT}`);
    });
}

start().catch(err => {
    console.error('Failed to start Auth Service:', err);
    process.exit(1);
});