import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Stats from './pages/Stats';

export default function AppRouter() {
    const isAuth = Boolean(localStorage.getItem('token'));

    return (
        <BrowserRouter>
            <Routes>
                {!isAuth && (
                    <>
                        <Route path="/login"    element={<Login   />} />
                        <Route path="/register" element={<Register/>} />
                        {/* All other paths → login */}
                        <Route path="*"          element={<Navigate to="/login" replace />} />
                    </>
                )}

                {isAuth && (
                    <>
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/stats" element={<Stats />} />
                        {/* Root or unknown → tasks */}
                        <Route path="/"        element={<Navigate to="/tasks" replace />} />
                        <Route path="*"        element={<Navigate to="/tasks" replace />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}