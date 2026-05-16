import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MembreLogin from './pages/MembreLogin';
import MembreDashboard from './pages/MembreDashboard';

function App() {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [membreToken, setMembreToken] = useState(localStorage.getItem('membreToken'));
  const [adherent, setAdherent] = useState(JSON.parse(localStorage.getItem('adherent') || 'null'));

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

  const handleMembreLogin = (adherentData, token) => {
    localStorage.setItem('membreToken', token);
    localStorage.setItem('adherent', JSON.stringify(adherentData));
    setMembreToken(token);
    setAdherent(adherentData);
    setPage('membre');
  };

  const handleMembreLogout = () => {
    localStorage.removeItem('membreToken');
    localStorage.removeItem('adherent');
    setMembreToken(null);
    setAdherent(null);
    setPage('home');
  };

  if (token) return <Dashboard onLogout={handleLogout} />;
  if (membreToken && adherent) return <MembreDashboard adherent={adherent} onLogout={handleMembreLogout} />;
  if (page === 'login') return <Login onLogin={handleLogin} onBack={() => setPage('home')} />;
  if (page === 'membre-login') return <MembreLogin onLogin={handleMembreLogin} onBack={() => setPage('home')} />;
  return <Home onLogin={() => setPage('login')} onMembreLogin={() => setPage('membre-login')} />;
}

export default App;