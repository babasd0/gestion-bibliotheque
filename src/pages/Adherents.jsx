import { useState, useEffect } from 'react';
import api from '../api/axios';

function Adherents() {
  const [adherents, setAdherents] = useState([]);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        setMessage('✅ Adhérent modifié avec succès.');
      } else {
        await api.post('/adherents', form);
        setMessage('✅ Adhérent ajouté avec succès.');
      }
      setForm({ nom: '', prenom: '', email: '', telephone: '' });
      setEditId(null);
      fetchAdherents();
    } catch (err) {
      setMessage('❌ Erreur : ' + (err.response?.data?.message || 'inconnue'));
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
    if (!confirm('Supprimer cet adhérent ?')) return;
    await api.delete(`/adherents/${id}`);
    setMessage('✅ Adhérent supprimé.');
    fetchAdherents();
    setTimeout(() => setMessage(''), 3000);
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
        <h2 style={{ marginBottom: 20, color: '#1a1a2e', fontSize: 18 }}>
          {editId ? '✏️ Modifier un adhérent' : '➕ Ajouter un adhérent'}
        </h2>

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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label>Nom *</label>
              <input placeholder="Nom de famille" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
            </div>
            <div>
              <label>Prénom *</label>
              <input placeholder="Prénom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
            </div>
            <div>
              <label>Email *</label>
              <input type="email" placeholder="exemple@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label>Téléphone</label>
              <input placeholder="Ex: 77 000 00 00" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{
              background: '#4f46e5', color: 'white', fontWeight: 600, padding: '10px 24px'
            }}>
              {loading ? '...' : editId ? 'Modifier' : 'Ajouter'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ nom: '', prenom: '', email: '', telephone: '' }); }}
                style={{ background: '#f3f4f6', color: '#555' }}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tableau */}
      <div style={{ background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: 20, color: '#1a1a2e', fontSize: 18 }}>
          📋 Liste des adhérents <span style={{ color: '#4f46e5', fontWeight: 700 }}>({adherents.length})</span>
        </h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adherents.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: 32 }}>Aucun adhérent enregistré</td></tr>
            ) : adherents.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.nom}</td>
                <td>{a.prenom}</td>
                <td style={{ color: '#4f46e5' }}>{a.email}</td>
                <td>{a.telephone || <span style={{ color: '#ccc' }}>—</span>}</td>
                <td>
                  <button onClick={() => handleEdit(a)} style={{ background: '#eef2ff', color: '#4f46e5', marginRight: 8, padding: '6px 12px', fontSize: 13 }}>✏️ Modifier</button>
                  <button onClick={() => handleDelete(a.id)} style={{ background: '#fff0f0', color: '#dc2626', padding: '6px 12px', fontSize: 13 }}>🗑️ Supprimer</button>
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