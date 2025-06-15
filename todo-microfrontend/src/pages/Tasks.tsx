import {useState, useEffect, type FormEvent, type JSX} from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { type AxiosRequestConfig } from 'axios';

interface Task {
    _id: string;
    title: string;
    dueDate: string;
    completed: boolean;
}

const TASK_API_URL = 'http://localhost:4000';

export default function Tasks(): JSX.Element {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTitle, setNewTitle] = useState<string>('');
    const [newDueDate, setNewDueDate] = useState<string>('');
    const navigate = useNavigate();

    const axiosConfig: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get<Task[]>(`${TASK_API_URL}/tasks`, axiosConfig);
            setTasks(response.data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
            localStorage.removeItem('token');
            navigate('/login', {replace: true});
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAdd = async (e: FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newDueDate) return;
        try {
            await axios.post(
                `${TASK_API_URL}/tasks`,
                { title: newTitle.trim(), dueDate: newDueDate },
                axiosConfig
            );
            setNewTitle('');
            setNewDueDate('');
            fetchTasks();
        } catch (err) {
            console.error('Could not add task', err);
        }
    };

    const handleToggle = async (task: Task) => {
        try {
            await axios.put(
                `${TASK_API_URL}/tasks/${task._id}`,
                { ...task, completed: !task.completed },
                axiosConfig
            );
            fetchTasks();
        } catch (err) {
            console.error('Could not update task', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.replace('/login');
    };

    return (
        <div className="container">
            <nav style={{ marginBottom: '1rem' }}>
                <a href="/stats" style={{ marginRight: '1rem' }}>Statistics</a>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <h1>My Tasks</h1>
            <form onSubmit={handleAdd} style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Task title"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    style={{ marginRight: '0.5rem', padding: '0.5rem' }}
                    required
                />
                <input
                    type="datetime-local"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    style={{ marginRight: '0.5rem', padding: '0.5rem' }}
                    required
                />
                <button type="submit">Add Task</button>
            </form>

            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {tasks.map(task => (
                    <li key={task._id} style={{ marginBottom: '0.75rem' }}>
                        <label style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggle(task)}
                                style={{ marginRight: '0.5rem' }}
                            />
                            {task.title} (due: {new Date(task.dueDate).toLocaleString()})
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}