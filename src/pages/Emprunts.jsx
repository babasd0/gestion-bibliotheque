import { useState, useEffect } from 'react';
import api from '../api/axios';

function Emprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [livres, setLivres] = useState([]);
  const [adherents, setAdherents] = useState([]);
  const [form, setForm] = useState({ livre_id: '', adherent_id: '', date_emprunt: '' });
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
      setMessage('✅ Emprunt enregistré avec succès.');
      setForm({ livre_id: '', adherent_id: '', date_emprunt: '' });
      fetchAll();
    } catch (err) {
      setMessage('❌ Erreur : ' + (err.response?.data?.message || 'inconnue'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRetour = async (id) => {
    if (!confirm('Marquer comme retourné ?')) return;
    try {
      await api.put(`/emprunts/${id}`, {
        statut: 'retourne',
        date_retour: new Date().toISOString().split('T')[0],
      });
      setMessage('✅ Retour enregistré avec succès.');
      fetchAll();
    } catch (err) {
      setMessage('❌ Erreur lors du retour.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet emprunt ?')) return;
    await api.delete(`/emprunts/${id}`);
    setMessage('✅ Emprunt supprimé.');
    fetchAll();
    setTimeout(() => setMessage(''), 3000);
  };

  const statutConfig = (s) => {
    if (s === 'retourne') return { label: 'Retourné', bg: '#f0fdf4', color: '#16a34a' };
    if (s === 'en_retard') return { label: 'En retard', bg: '#fff0f0', color: '#dc2626' };
    return { label: 'En cours', bg: '#fffbeb', color: '#d97706' };
  };

  return (
    <div>
      {/* Formulaire */}
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 28,
        marginBottom: 28,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ marginBottom: 20, color: '#1a1a2e', fontSize: 18 }}>➕ Nouvel emprunt</h2>

        {message && (
          <div style={{
            padding: '10px 16px',
            borderRadius: 8,
            marginBottom: 16,
            background: message.startsWith('✅') ? '#f0fdf4' : '#fff0f0',
            color: message.startsWith('✅') ? '#16a34a' : '#dc2626',
            border: `1px solid ${message.startsWith('✅') ? '#bbf7d0' : '#fecaca'}`,
            fontSize: 14
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div>
              <label>Livre *</label>
              <select value={form.livre_id} onChange={e => setForm({ ...form, livre_id: e.target.value })} required>
                <option value="">-- Choisir un livre --</option>
                {livres.filter(l => l.stock > 0).map(l => (
                  <option key={l.id} value={l.id}>{l.titre} (stock: {l.stock})</option>
                ))}
              </select>
            </div>
            <div>
              <label>Adhérent *</label>
              <select value={form.adherent_id} onChange={e => setForm({ ...form, adherent_id: e.target.value })} required>
                <option value="">-- Choisir un adhérent --</option>
                {adherents.map(a => (
                  <option key={a.id} value={a.id}>{a.nom} {a.prenom}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Date emprunt *</label>
              <input type="date" value={form.date_emprunt} onChange={e => setForm({ ...form, date_emprunt: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} style={{
              background: '#4f46e5', color: 'white', fontWeight: 600,
              padding: '10px 20px', marginBottom: 0, height: 42
            }}>
              {loading ? '...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      {/* Tableau */}
      <div style={{ background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: 20, color: '#1a1a2e', fontSize: 18 }}>
          📋 Liste des emprunts <span style={{ color: '#4f46e5', fontWeight: 700 }}>({emprunts.length})</span>
        </h2>
        <table>
          <thead>
            <tr>
              <th>Livre</th>
              <th>Adhérent</th>
              <th>Date emprunt</th>
              <th>Date retour</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: 32 }}>Aucun emprunt enregistré</td></tr>
            ) : emprunts.map(em => {
              const s = statutConfig(em.statut);
              return (
                <tr key={em.id}>
                  <td style={{ fontWeight: 600 }}>{em.livre?.titre || '—'}</td>
                  <td>{em.adherent ? `${em.adherent.nom} ${em.adherent.prenom}` : '—'}</td>
                  <td>{em.date_emprunt?.split('T')[0] || '—'}</td>
                  <td>{em.date_retour?.split('T')[0] || <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td>
                    <span style={{
                      background: s.bg, color: s.color,
                      padding: '3px 12px', borderRadius: 20,
                      fontSize: 13, fontWeight: 600
                    }}>
                      {s.label}
                    </span>
                  </td>
                  <td>
                    {em.statut === 'en_cours' && (
                      <button onClick={() => handleRetour(em.id)} style={{
                        background: '#f0fdf4', color: '#16a34a',
                        marginRight: 8, padding: '6px 12px', fontSize: 13
                      }}>
                        ✅ Retour
                      </button>
                    )}
                    <button onClick={() => handleDelete(em.id)} style={{
                      background: '#fff0f0', color: '#dc2626',
                      padding: '6px 12px', fontSize: 13
                    }}>
                      🗑️ Supprimer
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