import { useState, useEffect } from 'react';
import api from '../api/axios';

function Emprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [livres, setLivres] = useState([]);
  const [adherents, setAdherents] = useState([]);
  const [form, setForm] = useState({ livre_id: '', adherent_id: '', date_emprunt: '', date_retour_prevue: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAll = async () => {
    const [e, l, a] = await Promise.all([
      api.get('/emprunts'),
      api.get('/livres'),
      api.get('/adherents'),
    ]);
    setEmprunts(e.data);
    setLivres(l.data);
    setAdherents(a.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/emprunts', form);
      setMessage('OK Emprunt enregistre avec succes.');
      setForm({ livre_id: '', adherent_id: '', date_emprunt: '', date_retour_prevue: '' });
      fetchAll();
    } catch (err) {
      setMessage('ERR Erreur : ' + (err.response?.data?.message || 'inconnue'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRetour = async (id) => {
    if (!confirm('Marquer comme retourne ?')) return;
    try {
      await api.put(`/emprunts/${id}`, {
        statut: 'retourne',
        date_retour: new Date().toISOString().split('T')[0],
      });
      setMessage('OK Retour enregistre avec succes.');
      fetchAll();
    } catch (err) {
      setMessage('ERR Erreur lors du retour.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet emprunt ?')) return;
    await api.delete(`/emprunts/${id}`);
    setMessage('OK Emprunt supprime.');
    fetchAll();
    setTimeout(() => setMessage(''), 3000);
  };

  const statutConfig = (s) => {
    if (s === 'retourne') return { label: 'Retourne', bg: 'rgba(22,163,74,0.15)', color: '#4ade80' };
    if (s === 'en_retard') return { label: 'En retard', bg: 'rgba(220,38,38,0.15)', color: '#f87171' };
    return { label: 'En cours', bg: 'rgba(217,119,6,0.15)', color: '#fbbf24' };
  };

  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <i className="ti ti-plus" style={{ fontSize: 20, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 18 }}>Nouvel emprunt</h2>
        </div>

        {message && (
          <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 16, background: message.startsWith('OK') ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: message.startsWith('OK') ? '#4ade80' : '#f87171', border: `1px solid ${message.startsWith('OK') ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className={`ti ${message.startsWith('OK') ? 'ti-check' : 'ti-alert-circle'}`} style={{ fontSize: 16 }}></i>
            {message.replace('OK ', '').replace('ERR ', '')}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Livre *</label>
              <select value={form.livre_id} onChange={e => setForm({ ...form, livre_id: e.target.value })} required style={inputStyle}>
                <option value="">-- Choisir un livre --</option>
                {livres.filter(l => l.stock > 0).map(l => (
                  <option key={l.id} value={l.id}>{l.titre} (stock: {l.stock})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Adherent *</label>
              <select value={form.adherent_id} onChange={e => setForm({ ...form, adherent_id: e.target.value })} required style={inputStyle}>
                <option value="">-- Choisir un adherent --</option>
                {adherents.map(a => (
                  <option key={a.id} value={a.id}>{a.nom} {a.prenom}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Date emprunt *</label>
              <input type="date" value={form.date_emprunt} onChange={e => setForm({ ...form, date_emprunt: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Date retour prevue *</label>
              <input type="date" value={form.date_retour_prevue} onChange={e => setForm({ ...form, date_retour_prevue: e.target.value })} required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, padding: '11px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, height: 44 }}>
              <i className="ti ti-check" style={{ fontSize: 16 }}></i>
              {loading ? '...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-arrows-exchange" style={{ fontSize: 20, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 18 }}>
            Liste des emprunts <span style={{ color: '#c9a84c' }}>({emprunts.length})</span>
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>LIVRE</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ADHERENT</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>DATE EMPRUNT</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>DATE RETOUR PREVUE</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>STATUT</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 32 }}>Aucun emprunt enregistre</td></tr>
            ) : emprunts.map(em => {
              const s = statutConfig(em.statut);
              return (
                <tr key={em.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600, fontSize: 14 }}>{em.livre?.titre || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{em.adherent ? `${em.adherent.nom} ${em.adherent.prenom}` : '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{em.date_emprunt?.split('T')[0] || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{em.date_retour_prevue?.split('T')[0] || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {em.statut === 'en_cours' && (
                      <button onClick={() => handleRetour(em.id)} style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', marginRight: 8, padding: '6px 12px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <i className="ti ti-check" style={{ fontSize: 14 }}></i> Retourne
                      </button>
                    )}
                    <button onClick={() => handleDelete(em.id)} style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', padding: '6px 12px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <i className="ti ti-trash" style={{ fontSize: 14 }}></i> Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Emprunts;