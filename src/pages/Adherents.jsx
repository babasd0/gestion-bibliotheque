import { useState, useEffect } from 'react';
import api from '../api/axios';

function Adherents() {
  const [adherents, setAdherents] = useState([]);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [historique, setHistorique] = useState(null);
  const [adherentSelectionne, setAdherentSelectionne] = useState(null);
  const [motifSanction, setMotifSanction] = useState('');
  const [showSanctionForm, setShowSanctionForm] = useState(null);

  const fetchAdherents = async () => {
    const res = await api.get('/adherents');
    setAdherents(res.data);
  };

  useEffect(() => { fetchAdherents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/adherents/${editId}`, form);
        setMessage('OK Adherent modifie avec succes.');
      } else {
        await api.post('/adherents', form);
        setMessage('OK Adherent ajoute avec succes.');
      }
      setForm({ nom: '', prenom: '', email: '', telephone: '' });
      setEditId(null);
      fetchAdherents();
    } catch (err) {
      setMessage('ERR Erreur : ' + (err.response?.data?.message || 'inconnue'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (a) => {
    setForm({ nom: a.nom, prenom: a.prenom, email: a.email, telephone: a.telephone || '' });
    setEditId(a.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet adherent ?')) return;
    await api.delete(`/adherents/${id}`);
    setMessage('OK Adherent supprime.');
    fetchAdherents();
    setTimeout(() => setMessage(''), 3000);
  };

  const voirHistorique = async (a) => {
    const res = await api.get(`/adherents/${a.id}`);
    setAdherentSelectionne(res.data);
    setHistorique(res.data.emprunts);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sanctionner = async (id) => {
    await api.post(`/adherents/${id}/sanctionner`, { motif_sanction: motifSanction });
    setMessage('OK Sanction appliquee.');
    setShowSanctionForm(null);
    setMotifSanction('');
    fetchAdherents();
    setTimeout(() => setMessage(''), 3000);
  };

  const leverSanction = async (id) => {
    await api.post(`/adherents/${id}/lever-sanction`);
    setMessage('OK Sanction levee.');
    fetchAdherents();
    setTimeout(() => setMessage(''), 3000);
  };

  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>

      {/* Formulaire sanction EN HAUT */}
      {showSanctionForm && (
        <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <i className="ti ti-ban" style={{ fontSize: 20, color: '#fbbf24' }}></i>
            <h3 style={{ color: 'white', fontSize: 16 }}>Appliquer une sanction</h3>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Motif de la sanction</label>
              <input placeholder="Ex: Retard de 7 jours sur le livre X" value={motifSanction} onChange={e => setMotifSanction(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={() => sanctionner(showSanctionForm)} style={{ background: '#d97706', color: 'white', fontWeight: 700, padding: '11px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>
              Confirmer
            </button>
            <button onClick={() => { setShowSanctionForm(null); setMotifSanction(''); }} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '11px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 14 }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Historique EN HAUT */}
      {historique && (
        <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="ti ti-history" style={{ fontSize: 20, color: '#60a5fa' }}></i>
              <h3 style={{ color: 'white', fontSize: 16 }}>
                Historique de {adherentSelectionne?.nom} {adherentSelectionne?.prenom}
              </h3>
            </div>
            <button onClick={() => setHistorique(null)} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13 }}>
              Fermer
            </button>
          </div>
          {historique.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Aucun emprunt pour cet adherent.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: '#60a5fa', fontSize: 12, fontWeight: 600 }}>LIVRE</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: '#60a5fa', fontSize: 12, fontWeight: 600 }}>DATE EMPRUNT</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: '#60a5fa', fontSize: 12, fontWeight: 600 }}>DATE RETOUR PREVUE</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: '#60a5fa', fontSize: 12, fontWeight: 600 }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {historique.map(em => (
                  <tr key={em.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 14px', color: 'white', fontSize: 14 }}>{em.livre?.titre || '-'}</td>
                    <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{em.date_emprunt?.split('T')[0] || '-'}</td>
                    <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{em.date_retour_prevue?.split('T')[0] || '-'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        background: em.statut === 'retourne' ? 'rgba(22,163,74,0.15)' : em.statut === 'en_retard' ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)',
                        color: em.statut === 'retourne' ? '#4ade80' : em.statut === 'en_retard' ? '#f87171' : '#fbbf24',
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600
                      }}>
                        {em.statut === 'retourne' ? 'Retourne' : em.statut === 'en_retard' ? 'En retard' : 'En cours'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Formulaire ajout/modification */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <i className={`ti ${editId ? 'ti-edit' : 'ti-user-plus'}`} style={{ fontSize: 20, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 18 }}>{editId ? 'Modifier un adherent' : 'Ajouter un adherent'}</h2>
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
              <input placeholder="Nom de famille" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Prenom *</label>
              <input placeholder="Prenom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Email *</label>
              <input type="email" placeholder="exemple@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Telephone</label>
              <input placeholder="Ex: 77 000 00 00" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, padding: '11px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <i className={`ti ${editId ? 'ti-check' : 'ti-plus'}`} style={{ fontSize: 16 }}></i>
              {loading ? '...' : editId ? 'Modifier' : 'Ajouter'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ nom: '', prenom: '', email: '', telephone: '' }); }} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '11px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 14 }}>
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
            Liste des adherents <span style={{ color: '#c9a84c' }}>({adherents.length})</span>
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>N° ADHERENT</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>NOM</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>PRENOM</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>EMAIL</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>TELEPHONE</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>STATUT</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {adherents.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 32 }}>Aucun adherent enregistre</td></tr>
            ) : adherents.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 16px', color: '#c9a84c', fontSize: 13, fontWeight: 600 }}>{a.numero_adherent || '-'}</td>
                <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600, fontSize: 14 }}>{a.nom}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{a.prenom}</td>
                <td style={{ padding: '14px 16px', color: '#c9a84c', fontSize: 14 }}>{a.email}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{a.telephone || '-'}</td>
                <td style={{ padding: '14px 16px' }}>
                  {a.sanctionne ? (
                    <span style={{ background: 'rgba(220,38,38,0.15)', color: '#f87171', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Sanctionne</span>
                  ) : (
                    <span style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Actif</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => voirHistorique(a)} style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <i className="ti ti-history" style={{ fontSize: 13 }}></i> Historique
                    </button>
                    <button onClick={() => handleEdit(a)} style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <i className="ti ti-edit" style={{ fontSize: 13 }}></i> Modifier
                    </button>
                    {a.sanctionne ? (
                      <button onClick={() => leverSanction(a.id)} style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-lock-open" style={{ fontSize: 13 }}></i> Lever sanction
                      </button>
                    ) : (
                      <button onClick={() => { setShowSanctionForm(a.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'rgba(217,119,6,0.15)', color: '#fbbf24', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-ban" style={{ fontSize: 13 }}></i> Sanctionner
                      </button>
                    )}
                    <button onClick={() => handleDelete(a.id)} style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', padding: '6px 10px', fontSize: 12, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <i className="ti ti-trash" style={{ fontSize: 13 }}></i> Supprimer
                    </button>
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

export default Adherents;