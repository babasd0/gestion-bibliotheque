import { useState } from 'react';
import api from '../api/axios';

function MembreLogin({ onLogin, onBack }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/membre/login', form);
      onLogin(res.data.adherent, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/membre/register', registerForm);
      setSuccess('Compte cree avec succes. Vous pouvez vous connecter.');
      setMode('login');
      setForm({ email: registerForm.email, password: '' });
      setRegisterForm({ nom: '', prenom: '', email: '', telephone: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la creation du compte.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Segoe UI, sans-serif' }}>

      <div style={{ flex: 1, backgroundImage: 'linear-gradient(rgba(10,22,40,0.85), rgba(10,22,40,0.85)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
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
          Espace<br />
          <span style={{ color: '#c9a84c' }}>Membre</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.8, maxWidth: 400 }}>
          Consultez vos emprunts, vos reservations et l'historique de vos activites a la bibliotheque de l'ESP.
        </p>
      </div>

      <div style={{ width: 520, background: '#0a1628', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, textAlign: 'left', marginBottom: 32, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-arrow-left" style={{ fontSize: 16 }}></i>
          Retour a l'accueil
        </button>

        <div style={{ display: 'flex', marginBottom: 32, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
          <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: mode === 'login' ? 'linear-gradient(135deg, #c9a84c, #f0d080)' : 'transparent', color: mode === 'login' ? '#0a1628' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 14 }}>
            Connexion
          </button>
          <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: mode === 'register' ? 'linear-gradient(135deg, #c9a84c, #f0d080)' : 'transparent', color: mode === 'register' ? '#0a1628' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 14 }}>
            Creer un compte
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 16 }}></i>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', color: '#4ade80', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-check" style={{ fontSize: 16 }}></i>
            {success}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Adresse email</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-mail" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'rgba(255,255,255,0.3)' }}></i>
                <input type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ ...inputStyle, paddingLeft: 42 }} />
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-key" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'rgba(255,255,255,0.3)' }}></i>
                <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ ...inputStyle, paddingLeft: 42 }} />
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <button type="button" onClick={() => setShowForgot(!showForgot)} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: 13 }}>
                Mot de passe oublie ?
              </button>
            </div>

            {showForgot && (
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <i className="ti ti-info-circle" style={{ fontSize: 16, color: '#c9a84c' }}></i>
                  <span style={{ color: '#c9a84c', fontWeight: 600, fontSize: 14 }}>Mot de passe oublie</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>
                  Veuillez contacter le bibliothecaire de l'ESP avec votre nom, prenom et email pour reinitialiser votre mot de passe.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 8 }}>
                  Contact : bibliotheque@esp.sn
                </p>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, fontSize: 15, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <i className="ti ti-login" style={{ fontSize: 18 }}></i>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Nom *</label>
                <input placeholder="Nom" value={registerForm.nom} onChange={e => setRegisterForm({ ...registerForm, nom: e.target.value })} required style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Prenom *</label>
                <input placeholder="Prenom" value={registerForm.prenom} onChange={e => setRegisterForm({ ...registerForm, prenom: e.target.value })} required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Email *</label>
              <input type="email" placeholder="votre@email.com" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Telephone</label>
              <input placeholder="Ex: 77 000 00 00" value={registerForm.telephone} onChange={e => setRegisterForm({ ...registerForm, telephone: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Mot de passe *</label>
              <input type="password" placeholder="••••••••" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, fontSize: 15, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <i className="ti ti-user-plus" style={{ fontSize: 18 }}></i>
              {loading ? 'Creation...' : 'Creer mon compte'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 40, color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center' }}>
          ESP — Ecole Superieure Polytechnique · UCAD Dakar
        </div>
      </div>
    </div>
  );
}

export default MembreLogin;