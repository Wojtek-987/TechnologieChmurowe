import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './db';
import { Task, ITask } from './models/Task';
import { FlattenMaps } from 'mongoose';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';

app.use(cors());
app.use(express.json());

// —————— Authentication middleware —————————————
interface AuthRequest extends Request {
    user?: { username: string };
}

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Missing Authorization header' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { username: string };
        req.user = { username: payload.username };
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

async function start() {
    await connectDB();

    app.use(authenticate);

    app.get('/tasks', async (req: AuthRequest, res: Response) => {
        const owner = req.user!.username;
        const tasks = await Task.find({ owner }).lean();
        res.json(tasks);
        return;
    });

    app.post('/tasks', async (req: AuthRequest, res: Response) => {
        const owner = req.user!.username;
        const { title, dueDate } = req.body;

        if (!title || !dueDate) {
            res.status(400).json({ message: 'Title and dueDate required' });
        }

        try {
            const newTask = await Task.create({ title, dueDate, owner });
            res.status(201).json(newTask);
        } catch (err) {
            console.error('Error creating task:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    app.put('/tasks/:id', async (req: AuthRequest, res: Response) => {
        const owner = req.user!.username;
        const { id } = req.params;

        try {
            const updated = await Task.findOneAndUpdate(
                { _id: id, owner },
                req.body,
                { new: true }
            );
            if (!updated) {
                res.status(404).json({ message: 'Task not found or unauthorized' });
            }
            res.json(updated);
        } catch (err) {
            console.error('Error updating task:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });


    app.delete('/tasks/:id', async (req: AuthRequest, res: Response) => {
        const owner = req.user!.username;
        const { id } = req.params;

        try {
            const result = await Task.deleteOne({ _id: id, owner });
            if (result.deletedCount === 0) {
                res.status(404).json({ message: 'Task not found or unauthorized' });
            }
            res.status(204).end();
        } catch (err) {
            console.error('Error deleting task:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Task Service listening on http://localhost:${PORT}`);
    });
}

start().catch(err => {
    console.error('Failed to start service:', err);
    process.exit(1);
});