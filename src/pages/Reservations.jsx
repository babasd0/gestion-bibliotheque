import { useState, useEffect } from 'react';
import api from '../api/axios';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [livres, setLivres] = useState([]);
  const [adherents, setAdherents] = useState([]);
  const [form, setForm] = useState({ livre_id: '', adherent_id: '', date_reservation: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [motifRefus, setMotifRefus] = useState('');
  const [showRefusForm, setShowRefusForm] = useState(null);

  const fetchAll = async () => {
    const [r, l, a] = await Promise.all([
      api.get('/reservations'),
      api.get('/livres'),
      api.get('/adherents'),
    ]);
    setReservations(r.data);
    setLivres(l.data);
    setAdherents(a.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reservations', form);
      setMessage('OK Reservation enregistree avec succes.');
      setForm({ livre_id: '', adherent_id: '', date_reservation: '' });
      fetchAll();
    } catch (err) {
      setMessage('ERR ' + (err.response?.data?.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleValider = async (id) => {
    try {
      await api.post(`/reservations/${id}/valider`);
      setMessage('OK Reservation validee.');
      fetchAll();
    } catch (err) {
      setMessage('ERR ' + (err.response?.data?.message || 'Erreur'));
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRefuser = async (id) => {
    try {
      await api.post(`/reservations/${id}/refuser`, { motif_refus: motifRefus });
      setMessage('OK Reservation refusee.');
      setShowRefusForm(null);
      setMotifRefus('');
      fetchAll();
    } catch (err) {
      setMessage('ERR Erreur lors du refus.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette reservation ?')) return;
    await api.delete(`/reservations/${id}`);
    setMessage('OK Reservation supprimee.');
    fetchAll();
    setTimeout(() => setMessage(''), 3000);
  };

  const statutConfig = (s) => {
    if (s === 'validee') return { label: 'Validee', bg: 'rgba(22,163,74,0.15)', color: '#4ade80' };
    if (s === 'refusee') return { label: 'Refusee', bg: 'rgba(220,38,38,0.15)', color: '#f87171' };
    if (s === 'annulee') return { label: 'Annulee', bg: 'rgba(100,100,100,0.15)', color: '#9ca3af' };
    return { label: 'En attente', bg: 'rgba(217,119,6,0.15)', color: '#fbbf24' };
  };

  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>

      {/* Formulaire refus EN HAUT */}
      {showRefusForm && (
        <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <i className="ti ti-x" style={{ fontSize: 20, color: '#f87171' }}></i>
            <h3 style={{ color: 'white', fontSize: 16 }}>Motif du refus</h3>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <input placeholder="Ex: Livre reserve pour un autre membre..." value={motifRefus} onChange={e => setMotifRefus(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={() => handleRefuser(showRefusForm)} style={{ background: '#dc2626', color: 'white', fontWeight: 700, padding: '11px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>
              Confirmer
            </button>
            <button onClick={() => { setShowRefusForm(null); setMotifRefus(''); }} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '11px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 14 }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Formulaire ajout */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <i className="ti ti-bookmark-plus" style={{ fontSize: 20, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 18 }}>Nouvelle reservation</h2>
        </div>

        {message && (
          <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 16, background: message.startsWith('OK') ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: message.startsWith('OK') ? '#4ade80' : '#f87171', border: `1px solid ${message.startsWith('OK') ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className={`ti ${message.startsWith('OK') ? 'ti-check' : 'ti-alert-circle'}`} style={{ fontSize: 16 }}></i>
            {message.replace('OK ', '').replace('ERR ', '')}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Livre *</label>
              <select value={form.livre_id} onChange={e => setForm({ ...form, livre_id: e.target.value })} required style={inputStyle}>
                <option value="">-- Choisir un livre --</option>
                {livres.map(l => (
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
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Date reservation *</label>
              <input type="date" value={form.date_reservation} onChange={e => setForm({ ...form, date_reservation: e.target.value })} required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, padding: '11px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, height: 44 }}>
              <i className="ti ti-plus" style={{ fontSize: 16 }}></i>
              {loading ? '...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      {/* Tableau */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-bookmark" style={{ fontSize: 20, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 18 }}>
            Liste des reservations <span style={{ color: '#c9a84c' }}>({reservations.length})</span>
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>LIVRE</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ADHERENT</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>DATE</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>STATUT</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>MOTIF REFUS</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 32 }}>Aucune reservation enregistree</td></tr>
            ) : reservations.map(r => {
              const s = statutConfig(r.statut);
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600, fontSize: 14 }}>{r.livre?.titre || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{r.adherent ? `${r.adherent.nom} ${r.adherent.prenom}` : '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{r.date_reservation?.split('T')[0] || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: s.bg, color: s.color, padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.motif_refus || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.statut === 'en_attente' && (
                        <>
                          <button onClick={() => handleValider(r.id)} style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <i className="ti ti-check" style={{ fontSize: 13 }}></i> Valider
                          </button>
                          <button onClick={() => { setShowRefusForm(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <i className="ti ti-x" style={{ fontSize: 13 }}></i> Refuser
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(r.id)} style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-trash" style={{ fontSize: 13 }}></i> Supprimer
                      </button>
                    </div>
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

export default Reservations;