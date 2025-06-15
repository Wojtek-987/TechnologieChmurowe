import {useState, type FormEvent, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { type AxiosResponse } from 'axios';

interface RegisterResponse {
    id: string;
    username: string;
}

const AUTH_API_URL = 'http://localhost:4001';

export default function Register(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response: AxiosResponse<RegisterResponse> = await axios.post(
                `${AUTH_API_URL}/register`,
                {username, password},
                {headers: {'Content-Type': 'application/json'}}
            );
            setSuccess(`User “${response.data.username}” created! Redirecting to login…`);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.response?.status === 409) {
                setError('Username already taken.');
            } else {
                setError('Registration failed—please try again later.');
            }
        }
    };

    return (
        <div className="container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '1rem'}}>
                    <label htmlFor="username">Choose a username</label><br/>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{width: '100%', padding: '0.5rem'}}
                    />
                </div>

                <div style={{marginBottom: '1rem'}}>
                    <label htmlFor="password">Choose a password</label><br/>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{width: '100%', padding: '0.5rem'}}
                    />
                </div>

                {error && (
                    <p style={{color: 'red', marginBottom: '1rem'}}>
                        {error}
                    </p>
                )}
                {success && (
                    <p style={{color: 'green', marginBottom: '1rem'}}>
                        {success}
                    </p>
                )}

                <button type="submit">Sign up</button>
            </form>
            <p style={{marginTop: '1rem'}}>
                Already have an account?{' '}
                <a href="/login" style={{color: '#0069d9'}}>Log in</a>
            </p>
        </div>
    );
}