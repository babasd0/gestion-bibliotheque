import { useState } from 'react';
import Livres from './Livres';
import Adherents from './Adherents';
import Emprunts from './Emprunts';
import Reservations from './Reservations';
import Utilisateurs from './Utilisateurs';

function Dashboard({ onLogout }) {
  const [page, setPage] = useState('livres');

  const tabs = [
    { key: 'livres', label: 'Livres', icon: 'ti-book' },
    { key: 'adherents', label: 'Adherents', icon: 'ti-users' },
    { key: 'emprunts', label: 'Emprunts', icon: 'ti-arrows-exchange' },
    { key: 'reservations', label: 'Reservations', icon: 'ti-bookmark' },
    { key: 'utilisateurs', label: 'Utilisateurs', icon: 'ti-user-cog' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0d1b2e', fontFamily: 'Segoe UI, sans-serif', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{ width: 260, background: '#071020', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10 }}>

        {/* Logo */}
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

        {/* Admin info */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #c9a84c, #f0d080)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-user" style={{ fontSize: 18, color: '#0a1628' }}></i>
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Administrateur</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>admin@biblio.com</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, letterSpacing: 2, padding: '6px 10px', marginBottom: 6 }}>NAVIGATION</div>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setPage(tab.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 4, background: page === tab.key ? 'rgba(201,168,76,0.12)' : 'transparent', color: page === tab.key ? '#c9a84c' : 'rgba(255,255,255,0.5)', fontWeight: page === tab.key ? 600 : 400, fontSize: 14, textAlign: 'left', borderLeft: page === tab.key ? '3px solid #c9a84c' : '3px solid transparent', transition: 'all 0.2s' }}>
              <i className={`ti ${tab.icon}`} style={{ fontSize: 18 }}></i>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.1)', color: '#f87171', fontSize: 14, fontWeight: 600 }}>
            <i className="ti ti-logout" style={{ fontSize: 18 }}></i>
            Deconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ background: '#0d1f35', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 36px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className={`ti ${tabs.find(t => t.key === page)?.icon}`} style={{ fontSize: 22, color: 'white' }}></i>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>
              {tabs.find(t => t.key === page)?.label}
            </span>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 20, padding: '5px 16px' }}>
            <span style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600 }}>Administrateur</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 36px', flex: 1 }}>
          {page === 'livres' && <Livres />}
          {page === 'adherents' && <Adherents />}
          {page === 'emprunts' && <Emprunts />}
          {page === 'reservations' && <Reservations />}
          {page === 'utilisateurs' && <Utilisateurs />}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;