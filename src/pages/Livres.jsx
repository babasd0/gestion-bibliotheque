import { useState, useEffect } from 'react';
import api from '../api/axios';

function Livres() {
  const [livres, setLivres] = useState([]);
  const [form, setForm] = useState({ titre: '', auteur: '', genre: '', isbn: '', stock: 1 });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  const fetchLivres = async () => {
    const res = await api.get('/livres');
    setLivres(res.data);
  };

  useEffect(() => { fetchLivres(); }, []);

  const getCover = (isbn) => {
    if (!isbn) return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80';
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  };

  const filteredLivres = livres.filter(l =>
    l.titre.toLowerCase().includes(search.toLowerCase()) ||
    l.auteur.toLowerCase().includes(search.toLowerCase()) ||
    (l.genre && l.genre.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/livres/${editId}`, form);
        setMessage('OK Livre modifie avec succes.');
      } else {
        await api.post('/livres', form);
        setMessage('OK Livre ajoute avec succes.');
      }
      setForm({ titre: '', auteur: '', genre: '', isbn: '', stock: 1 });
      setEditId(null);
      fetchLivres();
    } catch (err) {
      setMessage('ERR Erreur : ' + (err.response?.data?.message || 'inconnue'));
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
    setMessage('OK Livre supprime.');
    fetchLivres();
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      {/* Formulaire */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <i className={`ti ${editId ? 'ti-edit' : 'ti-plus'}`} style={{ fontSize: 20, color: '#c9a84c' }}></i>
          <h2 style={{ color: 'white', fontSize: 18 }}>{editId ? 'Modifier un livre' : 'Ajouter un livre'}</h2>
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
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Titre *</label>
              <input placeholder="Titre du livre" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} required style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Auteur *</label>
              <input placeholder="Nom de l'auteur" value={form.auteur} onChange={e => setForm({ ...form, auteur: e.target.value })} required style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Genre</label>
              <input placeholder="Ex: Informatique, Roman..." value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>ISBN</label>
              <input placeholder="Ex: 978-0-13-110362-7" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Stock</label>
              <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, padding: '11px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <i className={`ti ${editId ? 'ti-check' : 'ti-plus'}`} style={{ fontSize: 16 }}></i>
              {loading ? '...' : editId ? 'Modifier' : 'Ajouter'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ titre: '', auteur: '', genre: '', isbn: '', stock: 1 }); }} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '11px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 14 }}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Barre de recherche */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className="ti ti-search" style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)' }}></i>
        <input
          placeholder="Rechercher par titre, auteur ou genre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 14, outline: 'none', width: '100%' }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
            <i className="ti ti-x" style={{ fontSize: 16 }}></i>
          </button>
        )}
      </div>

      {/* Header liste */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'white', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-list" style={{ fontSize: 20, color: '#c9a84c' }}></i>
          Liste des livres <span style={{ color: '#c9a84c', fontWeight: 700 }}>({filteredLivres.length})</span>
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setView('grid')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: view === 'grid' ? 'linear-gradient(135deg, #c9a84c, #f0d080)' : 'rgba(255,255,255,0.06)', color: view === 'grid' ? '#0a1628' : 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <i className="ti ti-layout-grid" style={{ fontSize: 16 }}></i>
            Grille
          </button>
          <button onClick={() => setView('table')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: view === 'table' ? 'linear-gradient(135deg, #c9a84c, #f0d080)' : 'rgba(255,255,255,0.06)', color: view === 'table' ? '#0a1628' : 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <i className="ti ti-table" style={{ fontSize: 16 }}></i>
            Tableau
          </button>
        </div>
      </div>

      {/* Vue grille */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
          {filteredLivres.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Aucun livre trouve</p>
          ) : filteredLivres.map(l => (
            <div key={l.id}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
              <div style={{ position: 'relative' }}>
                <img src={getCover(l.isbn)} alt={l.titre} style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80'; }} />
                <span style={{ position: 'absolute', top: 8, right: 8, background: l.stock > 0 ? '#16a34a' : '#dc2626', color: 'white', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                  {l.stock > 0 ? `${l.stock} dispo` : 'Epuise'}
                </span>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'white', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.titre}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>{l.auteur}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleEdit(l)} style={{ flex: 1, background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '5px 8px', fontSize: 11, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ti ti-edit" style={{ fontSize: 13 }}></i>
                  </button>
                  <button onClick={() => handleDelete(l.id)} style={{ flex: 1, background: 'rgba(220,38,38,0.1)', color: '#f87171', padding: '5px 8px', fontSize: 11, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ti ti-trash" style={{ fontSize: 13 }}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue tableau */}
      {view === 'table' && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>COUVERTURE</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>TITRE</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>AUTEUR</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>GENRE</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>STOCK</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLivres.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 32 }}>Aucun livre trouve</td></tr>
              ) : filteredLivres.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img src={getCover(l.isbn)} alt={l.titre} style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80'; }} />
                  </td>
                  <td style={{ padding: '12px 16px', color: 'white', fontWeight: 600, fontSize: 14 }}>{l.titre}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{l.auteur}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{l.genre || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: l.stock > 0 ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)', color: l.stock > 0 ? '#4ade80' : '#f87171', padding: '3px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      {l.stock}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleEdit(l)} style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', marginRight: 8, padding: '6px 12px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <i className="ti ti-edit" style={{ fontSize: 14 }}></i> Modifier
                    </button>
                    <button onClick={() => handleDelete(l.id)} style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', padding: '6px 12px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <i className="ti ti-trash" style={{ fontSize: 14 }}></i> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Livres;