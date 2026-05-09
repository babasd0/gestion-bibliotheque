import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('home');
  };

  if (token) return <Dashboard onLogout={handleLogout} />;
  if (page === 'login') return <Login onLogin={handleLogin} onBack={() => setPage('home')} />;
  return <Home onLogin={() => setPage('login')} />;
}

export default App;