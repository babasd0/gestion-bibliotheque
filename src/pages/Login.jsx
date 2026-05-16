import { useState } from 'react';
import api from '../api/axios';

function Login({ onLogin, onBack }) {
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
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Segoe UI, sans-serif' }}>

      <div style={{ flex: 1, backgroundImage: 'linear-gradient(rgba(10,22,40,0.85), rgba(10,22,40,0.85)), url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 60 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #c9a84c, #f0d080)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-books" style={{ fontSize: 24, color: '#0a1628' }}></i>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>Bibliotheque Academique</div>
            <div style={{ color: '#c9a84c', fontSize: 12, letterSpacing: 1 }}>ECOLE SUPERIEURE POLYTECHNIQUE</div>
          </div>
        </div>
        <h2 style={{ color: 'white', fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>
          Bienvenue sur votre<br />
          <span style={{ color: '#c9a84c' }}>espace administrateur</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.8, maxWidth: 400 }}>
          Gerez les livres, les adherents et les emprunts de la bibliotheque de l'ESP en toute simplicite.
        </p>
        <div style={{ marginTop: 60, display: 'flex', gap: 40 }}>
          {[
            { value: '1000+', label: 'Livres' },
            { value: '500+', label: 'Adherents' },
            { value: '200+', label: 'Emprunts' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#c9a84c' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: 480, background: '#0a1628', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, textAlign: 'left', marginBottom: 40, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-arrow-left" style={{ fontSize: 16 }}></i>
          Retour a l'accueil
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <i className="ti ti-lock" style={{ fontSize: 24, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>Connexion</h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 36 }}>Entrez vos identifiants administrateur</p>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 16 }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Adresse email</label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-mail" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'rgba(255,255,255,0.3)' }}></i>
              <input type="email" placeholder="admin@biblio.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-key" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'rgba(255,255,255,0.3)' }}></i>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, fontSize: 15, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <i className="ti ti-login" style={{ fontSize: 18 }}></i>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: 'auto', paddingTop: 60, color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center' }}>
          ESP — Ecole Superieure Polytechnique · UCAD Dakar
        </div>
      </div>

    </div>
  );
}

export default Login;