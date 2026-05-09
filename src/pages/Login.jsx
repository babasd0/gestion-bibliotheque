import { useState } from 'react';
import api from '../api/axios';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', form);
      onLogin(res.data.token);
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '48px 40px',
        width: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>Bibliothèque</h1>
          <p style={{ color: '#888', marginTop: 6, fontSize: 14 }}>Système de gestion académique</p>
        </div>

        {error && (
          <div style={{
            background: '#fff0f0',
            border: '1px solid #ffcccc',
            color: '#cc0000',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@biblio.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#a5b4fc' : '#4f46e5',
              color: 'white',
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 8
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;