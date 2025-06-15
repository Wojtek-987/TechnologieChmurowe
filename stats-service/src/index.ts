import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 4002;
const TASK_API_URL = process.env.TASK_API_URL || 'http://task-service:4000/tasks';
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';


app.use(cors());
app.use(express.json());

interface AuthRequest extends Request {
    user?: { username: string };
}

interface Task {
    _id: string;
    title: string;
    dueDate: string;
    completed: boolean;
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

app.use(authenticate);

app.get('/stats', async (req: AuthRequest, res: Response) => {
    const token = req.headers.authorization;
    try {
        const response = await axios.get<Task[]>(TASK_API_URL, {
            headers: { Authorization: token! }
        });
        const tasks = response.data;
        const total     = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending   = total - completed;
        const dueSoon   = tasks.filter(t => {
            const diff = new Date(t.dueDate).getTime() - Date.now();
            return diff > 0 && diff <= 1000 * 60 * 60; // due within 1h
        }).length;

        res.json({ total, completed, pending, dueSoon });
    } catch (err: any) {
        console.error('Error fetching tasks for stats:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(502).json({ message: 'Bad gateway' });
    }
});

app.listen(PORT, () => {
    console.log(`Stats Service listening on http://localhost:${PORT}`);
});