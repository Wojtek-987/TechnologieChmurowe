import {useState, useEffect, type JSX} from 'react';
import { useNavigate } from 'react-router-dom';
import axios, {type AxiosRequestConfig } from 'axios';

interface Stats {
    total: number;
    completed: number;
    pending: number;
    dueSoon: number;
}

const STATS_API_URL = 'http://localhost:4002';

export default function Stats(): JSX.Element {
    const [stats, setStats] = useState<Stats | null>(null);
    const navigate = useNavigate();

    const axiosConfig: AxiosRequestConfig = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get<Stats>(`${STATS_API_URL}/stats`, axiosConfig);
            setStats(response.data);
        } catch (err) {
            console.error('Unable to fetch statistics', err);
            localStorage.removeItem('token');
            navigate('/login', {replace: true});
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.replace('/login');
    };

    if (!stats) {
        return <div className="container"><p>Loading statistics…</p></div>;
    }

    return (
        <div className="container">
            <nav style={{ marginBottom: '1rem' }}>
                <a href="/tasks" style={{ marginRight: '1rem' }}>Tasks</a>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <h1>Statistics</h1>
            <ul>
                <li>Total tasks: {stats.total}</li>
                <li>Completed: {stats.completed}</li>
                <li>Pending: {stats.pending}</li>
                <li>Due soon: {stats.dueSoon}</li>
            </ul>
        </div>
    );
}