import {useState, type FormEvent, type JSX } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios, {type AxiosResponse } from 'axios';

interface LoginResponse {
    token: string;
}

const AUTH_API_URL = 'http://localhost:4001';

export default function Login(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError]       = useState<string | null>(null);
    const navigate                = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        console.log('[Login] submitting', { username, password });

        try {
            const response: AxiosResponse<LoginResponse> = await axios.post(
                `${AUTH_API_URL}/login`,
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                window.location.replace('/tasks');
                navigate('/tasks', { replace: true });
            } else {
                setError('No token received from server.');
            }
        } catch (err: any) {
            console.error('Login failed:', err);
            setError('Invalid credentials, please try again.');
        }
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="username">Username</label><br />
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password">Password</label><br />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>

                {error && (
                    <p style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </p>
                )}

                <button type="submit">Log in</button>
            </form>

            <p style={{ marginTop: '1rem' }}>
                Don’t have an account?{' '}
                <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
}