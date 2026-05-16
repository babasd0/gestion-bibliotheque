import { useState, useEffect } from 'react';
import api from '../api/axios';

function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'bibliothecaire' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/users/${editId}`, form);
        setMessage('OK Compte modifie avec succes.');
      } else {
        await api.post('/users', form);
        setMessage('OK Compte cree avec succes.');
      }
      setForm({ name: '', email: '', password: '', role: 'bibliothecaire' });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      setMessage('ERR ' + (err.response?.data?.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setEditId(u.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce compte ?')) return;
    try {
      await api.delete(`/users/${id}`);
      setMessage('OK Compte supprime.');
      fetchUsers();
    } catch (err) {
      setMessage('ERR ' + (err.response?.data?.message || 'Erreur'));
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      {/* Formulaire */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <i className={`ti ${editId ? 'ti-edit' : 'ti-user-plus'}`} style={{ fontSize: 20, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 18 }}>{editId ? 'Modifier un compte' : 'Creer un compte'}</h2>
        </div>

        {message && (
          <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 16, background: message.startsWith('OK') ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: message.startsWith('OK') ? '#4ade80' : '#f87171', border: `1px solid ${message.startsWith('OK') ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className={`ti ${message.startsWith('OK') ? 'ti-check' : 'ti-alert-circle'}`} style={{ fontSize: 16 }}></i>
            {message.replace('OK ', '').replace('ERR ', '')}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Nom *</label>
              <input placeholder="Nom complet" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Email *</label>
              <input type="email" placeholder="email@exemple.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>{editId ? 'Nouveau mot de passe (laisser vide si inchange)' : 'Mot de passe *'}</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editId} style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Role *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                <option value="bibliothecaire">Bibliothecaire</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, padding: '11px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <i className={`ti ${editId ? 'ti-check' : 'ti-plus'}`} style={{ fontSize: 16 }}></i>
              {loading ? '...' : editId ? 'Modifier' : 'Creer'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ name: '', email: '', password: '', role: 'bibliothecaire' }); }} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '11px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 14 }}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tableau */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-users" style={{ fontSize: 20, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 18 }}>
            Comptes utilisateurs <span style={{ color: '#c9a84c' }}>({users.length})</span>
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>NOM</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>EMAIL</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ROLE</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 32 }}>Aucun compte enregistre</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600, fontSize: 14 }}>{u.name}</td>
                <td style={{ padding: '14px 16px', color: '#c9a84c', fontSize: 14 }}>{u.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: u.role === 'admin' ? 'rgba(201,168,76,0.15)' : 'rgba(59,130,246,0.15)', color: u.role === 'admin' ? '#c9a84c' : '#60a5fa', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {u.role === 'admin' ? 'Administrateur' : 'Bibliothecaire'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleEdit(u)} style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <i className="ti ti-edit" style={{ fontSize: 13 }}></i> Modifier
                    </button>
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDelete(u.id)} style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-trash" style={{ fontSize: 13 }}></i> Supprimer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Utilisateurs;