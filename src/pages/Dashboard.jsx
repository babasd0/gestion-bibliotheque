import { useState } from 'react';
import Livres from './Livres';
import Adherents from './Adherents';
import Emprunts from './Emprunts';

function Dashboard({ onLogout }) {
  const [page, setPage] = useState('livres');

  const tabs = [
    { key: 'livres', label: '📖 Livres' },
    { key: 'adherents', label: '👤 Adhérents' },
    { key: 'emprunts', label: '🔄 Emprunts' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        boxShadow: '0 2px 12px rgba(79,70,229,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>📚</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>Bibliothèque Académique</span>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 18px',
            borderRadius: 8,
            fontWeight: 500
          }}
        >
          Déconnexion
        </button>
      </nav>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 32px',
        display: 'flex',
        gap: 4
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setPage(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: page === tab.key ? '3px solid #4f46e5' : '3px solid transparent',
              color: page === tab.key ? '#4f46e5' : '#666',
              fontWeight: page === tab.key ? 700 : 500,
              padding: '18px 24px',
              borderRadius: 0,
              fontSize: 15,
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
        {page === 'livres' && <Livres />}
        {page === 'adherents' && <Adherents />}
        {page === 'emprunts' && <Emprunts />}
      </div>
    </div>
  );
}

export default Dashboard;