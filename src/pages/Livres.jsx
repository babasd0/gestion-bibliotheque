import { useState, useEffect } from 'react';
import api from '../api/axios';

function Livres() {
  const [livres, setLivres] = useState([]);
  const [form, setForm] = useState({ titre: '', auteur: '', genre: '', isbn: '', stock: 1 });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchLivres = async () => {
    const res = await api.get('/livres');
    setLivres(res.data);
  };

  useEffect(() => { fetchLivres(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/livres/${editId}`, form);
        setMessage('✅ Livre modifié avec succès.');
      } else {
        await api.post('/livres', form);
        setMessage('✅ Livre ajouté avec succès.');
      }
      setForm({ titre: '', auteur: '', genre: '', isbn: '', stock: 1 });
      setEditId(null);
      fetchLivres();
    } catch (err) {
      setMessage('❌ Erreur : ' + (err.response?.data?.message || 'inconnue'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (livre) => {
    setForm({ titre: livre.titre, auteur: livre.auteur, genre: livre.genre || '', isbn: livre.isbn || '', stock: livre.stock });
    setEditId(livre.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce livre ?')) return;
    await api.delete(`/livres/${id}`);
    setMessage('✅ Livre supprimé.');
    fetchLivres();
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <div style={{ background: 'white', borderRadius: 12, padding: 28, marginBottom: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: 20, color: '#1a1a2e', fontSize: 18 }}>
          {editId ? '✏️ Modifier un livre' : '➕ Ajouter un livre'}
        </h2>
        {message && (
          <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 16, background: message.startsWith('✅') ? '#f0fdf4' : '#fff0f0', color: message.startsWith('✅') ? '#16a34a' : '#dc2626', border: `1px solid ${message.startsWith('✅') ? '#bbf7d0' : '#fecaca'}`, fontSize: 14 }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><label>Titre *</label><input placeholder="Titre du livre" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} required /></div>
            <div><label>Auteur *</label><input placeholder="Nom de l'auteur" value={form.auteur} onChange={e => setForm({ ...form, auteur: e.target.value })} required /></div>
            <div><label>Genre</label><input placeholder="Ex: Informatique, Roman..." value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} /></div>
            <div><label>ISBN</label><input placeholder="Ex: 978-0-13-110362-7" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} /></div>
            <div><label>Stock</label><input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{ background: '#4f46e5', color: 'white', fontWeight: 600, padding: '10px 24px' }}>
              {loading ? '...' : editId ? 'Modifier' : 'Ajouter'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ titre: '', auteur: '', genre: '', isbn: '', stock: 1 }); }} style={{ background: '#f3f4f6', color: '#555' }}>Annuler</button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: 20, color: '#1a1a2e', fontSize: 18 }}>
          📋 Liste des livres <span style={{ color: '#4f46e5', fontWeight: 700 }}>({livres.length})</span>
        </h2>
        <table>
          <thead>
            <tr><th>Titre</th><th>Auteur</th><th>Genre</th><th>ISBN</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {livres.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: 32 }}>Aucun livre enregistré</td></tr>
            ) : livres.map(l => (
              <tr key={l.id}>
                <td style={{ fontWeight: 600 }}>{l.titre}</td>
                <td>{l.auteur}</td>
                <td>{l.genre || '—'}</td>
                <td style={{ fontSize: 12, color: '#888' }}>{l.isbn || '—'}</td>
                <td>
                  <span style={{ background: l.stock > 0 ? '#f0fdf4' : '#fff0f0', color: l.stock > 0 ? '#16a34a' : '#dc2626', padding: '2px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                    {l.stock}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(l)} style={{ background: '#eef2ff', color: '#4f46e5', marginRight: 8, padding: '6px 12px', fontSize: 13 }}>✏️ Modifier</button>
                  <button onClick={() => handleDelete(l.id)} style={{ background: '#fff0f0', color: '#dc2626', padding: '6px 12px', fontSize: 13 }}>🗑️ Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Livres;