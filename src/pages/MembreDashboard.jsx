import { useState, useEffect } from 'react';
import api from '../api/axios';

function MembreDashboard({ adherent, onLogout }) {
  const [emprunts, setEmprunts] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [livres, setLivres] = useState([]);
  const [page, setPage] = useState('catalogue');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReservForm, setShowReservForm] = useState(null);
  const [reservDate, setReservDate] = useState('');
  const [reservDateRetour, setReservDateRetour] = useState('');

  const fetchData = async () => {
    const [e, r, l] = await Promise.all([
      api.get(`/membre/emprunts?adherent_id=${adherent.id}`),
      api.get(`/membre/reservations?adherent_id=${adherent.id}`),
      api.get('/catalogue'),
    ]);
    setEmprunts(e.data);
    setReservations(r.data);
    setLivres(l.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleReserver = async () => {
    if (!reservDate) {
      setMessage('ERR Veuillez choisir une date de reservation.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setLoading(true);
    try {
      await api.post('/membre/reservations', {
        livre_id: showReservForm,
        adherent_id: adherent.id,
        date_reservation: reservDate,
        date_retour_souhaitee: reservDateRetour,
      });
      setMessage('OK Reservation enregistree avec succes. En attente de validation.');
      setShowReservForm(null);
      setReservDate('');
      setReservDateRetour('');
      fetchData();
    } catch (err) {
      setMessage('ERR ' + (err.response?.data?.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const getCover = (isbn) => {
    if (!isbn) return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80';
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  };

  const filteredLivres = livres.filter(l =>
    l.titre.toLowerCase().includes(search.toLowerCase()) ||
    l.auteur.toLowerCase().includes(search.toLowerCase()) ||
    (l.genre && l.genre.toLowerCase().includes(search.toLowerCase()))
  );

  const livreSelectionne = livres.find(l => l.id === showReservForm);

  const statutEmprunt = (s) => {
    if (s === 'retourne') return { label: 'Retourne', bg: 'rgba(22,163,74,0.15)', color: '#4ade80' };
    if (s === 'en_retard') return { label: 'En retard', bg: 'rgba(220,38,38,0.15)', color: '#f87171' };
    return { label: 'En cours', bg: 'rgba(217,119,6,0.15)', color: '#fbbf24' };
  };

  const statutReservation = (s) => {
    if (s === 'validee') return { label: 'Validee', bg: 'rgba(22,163,74,0.15)', color: '#4ade80' };
    if (s === 'refusee') return { label: 'Refusee', bg: 'rgba(220,38,38,0.15)', color: '#f87171' };
    if (s === 'annulee') return { label: 'Annulee', bg: 'rgba(100,100,100,0.15)', color: '#9ca3af' };
    return { label: 'En attente', bg: 'rgba(217,119,6,0.15)', color: '#fbbf24' };
  };

  const tabs = [
    { key: 'catalogue', label: 'Catalogue', icon: 'ti-books' },
    { key: 'emprunts', label: 'Mes Emprunts', icon: 'ti-arrows-exchange' },
    { key: 'reservations', label: 'Mes Reservations', icon: 'ti-bookmark' },
  ];

  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1b2e', fontFamily: 'Segoe UI, sans-serif', display: 'flex' }}>

      <div style={{ width: 260, background: '#071020', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #c9a84c, #f0d080)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-books" style={{ fontSize: 22, color: '#0a1628' }}></i>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Bibliotheque</div>
              <div style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 1 }}>ESP — UCAD</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #c9a84c, #f0d080)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-user" style={{ fontSize: 18, color: '#0a1628' }}></i>
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{adherent.nom} {adherent.prenom}</div>
              <div style={{ color: '#c9a84c', fontSize: 12 }}>{adherent.numero_adherent}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{adherent.email}</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, letterSpacing: 2, padding: '6px 10px', marginBottom: 6 }}>MON ESPACE</div>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setPage(tab.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 4, background: page === tab.key ? 'rgba(201,168,76,0.12)' : 'transparent', color: page === tab.key ? '#c9a84c' : 'rgba(255,255,255,0.5)', fontWeight: page === tab.key ? 600 : 400, fontSize: 14, textAlign: 'left', borderLeft: page === tab.key ? '3px solid #c9a84c' : '3px solid transparent', transition: 'all 0.2s' }}>
              <i className={`ti ${tab.icon}`} style={{ fontSize: 18 }}></i>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.1)', color: '#f87171', fontSize: 14, fontWeight: 600 }}>
            <i className="ti ti-logout" style={{ fontSize: 18 }}></i>
            Deconnexion
          </button>
        </div>
      </div>

      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ background: '#0d1f35', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 36px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className={`ti ${tabs.find(t => t.key === page)?.icon}`} style={{ fontSize: 22, color: 'white' }}></i>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>{tabs.find(t => t.key === page)?.label}</span>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 20, padding: '5px 16px' }}>
            <span style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600 }}>Membre</span>
          </div>
        </div>

        <div style={{ padding: '32px 36px', flex: 1 }}>

          {adherent.sanctionne && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 12, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className="ti ti-ban" style={{ fontSize: 24, color: '#f87171' }}></i>
              <div>
                <div style={{ color: '#f87171', fontWeight: 700, fontSize: 15 }}>Compte suspendu</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Motif : {adherent.motif_sanction}</div>
              </div>
            </div>
          )}

          {message && (
            <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 20, background: message.startsWith('OK') ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: message.startsWith('OK') ? '#4ade80' : '#f87171', border: `1px solid ${message.startsWith('OK') ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className={`ti ${message.startsWith('OK') ? 'ti-check' : 'ti-alert-circle'}`} style={{ fontSize: 16 }}></i>
              {message.replace('OK ', '').replace('ERR ', '')}
            </div>
          )}

          {/* Formulaire reservation */}
          {showReservForm && livreSelectionne && (
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <i className="ti ti-bookmark-plus" style={{ fontSize: 20, color: '#c9a84c' }}></i>
                <h3 style={{ color: 'white', fontSize: 16 }}>Reserver : {livreSelectionne.titre}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Date de reservation *</label>
                  <input type="date" value={reservDate} onChange={e => setReservDate(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Date retour souhaitee</label>
                  <input type="date" value={reservDateRetour} onChange={e => setReservDateRetour(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleReserver} disabled={loading} style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', fontWeight: 700, padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                    Confirmer
                  </button>
                  <button onClick={() => { setShowReservForm(null); setReservDate(''); setReservDateRetour(''); }} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 14 }}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {page === 'catalogue' && (
            <div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="ti ti-search" style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)' }}></i>
                <input placeholder="Rechercher par titre, auteur ou genre..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 14, outline: 'none', width: '100%' }} />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                  <i className="ti ti-x" style={{ fontSize: 16 }}></i>
                </button>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
                {filteredLivres.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.4)' }}>Aucun livre trouve</p>
                ) : filteredLivres.map(l => (
                  <div key={l.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ position: 'relative' }}>
                      <img src={getCover(l.isbn)} alt={l.titre} style={{ width: '100%', height: 180, objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80'; }} />
                      <span style={{ position: 'absolute', top: 8, right: 8, background: l.stock > 0 ? '#16a34a' : '#dc2626', color: 'white', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                        {l.stock > 0 ? `${l.stock} dispo` : 'Epuise'}
                      </span>
                    </div>
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: 'white', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.titre}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{l.auteur}</div>
                      <button
                        onClick={() => { setShowReservForm(l.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={l.stock === 0 || adherent.sanctionne}
                        style={{ width: '100%', background: l.stock > 0 && !adherent.sanctionne ? 'linear-gradient(135deg, #c9a84c, #f0d080)' : 'rgba(255,255,255,0.06)', color: l.stock > 0 && !adherent.sanctionne ? '#0a1628' : 'rgba(255,255,255,0.3)', padding: '7px', fontSize: 11, borderRadius: 6, border: 'none', cursor: l.stock > 0 && !adherent.sanctionne ? 'pointer' : 'not-allowed', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <i className="ti ti-bookmark-plus" style={{ fontSize: 13 }}></i>
                        {l.stock > 0 ? 'Reserver' : 'Indisponible'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'emprunts' && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-arrows-exchange" style={{ fontSize: 20, color: '#c9a84c' }}></i>
                <h2 style={{ color: 'white', fontSize: 18 }}>Mes emprunts <span style={{ color: '#c9a84c' }}>({emprunts.length})</span></h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                <thead>
                  <tr style={{ background: 'rgba(201,168,76,0.15)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>LIVRE</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>DATE EMPRUNT</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>DATE RETOUR PREVUE</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>STATUT</th>
                  </tr>
                </thead>
                <tbody>
                  {emprunts.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 32 }}>Aucun emprunt en cours</td></tr>
                  ) : emprunts.map(em => {
                    const s = statutEmprunt(em.statut);
                    return (
                      <tr key={em.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600, fontSize: 14 }}>{em.livre?.titre || '-'}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{em.date_emprunt?.split('T')[0] || '-'}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{em.date_retour_prevue?.split('T')[0] || '-'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: s.bg, color: s.color, padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {page === 'reservations' && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-bookmark" style={{ fontSize: 20, color: '#c9a84c' }}></i>
                <h2 style={{ color: 'white', fontSize: 18 }}>Mes reservations <span style={{ color: '#c9a84c' }}>({reservations.length})</span></h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                <thead>
                  <tr style={{ background: 'rgba(201,168,76,0.15)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>LIVRE</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>DATE RESERVATION</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>DATE RETOUR SOUHAITEE</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>STATUT</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#c9a84c', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>MOTIF REFUS</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 32 }}>Aucune reservation</td></tr>
                  ) : reservations.map(r => {
                    const s = statutReservation(r.statut);
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600, fontSize: 14 }}>{r.livre?.titre || '-'}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{r.date_reservation?.split('T')[0] || '-'}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{r.date_retour_souhaitee?.split('T')[0] || '-'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: s.bg, color: s.color, padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.motif_refus || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MembreDashboard;