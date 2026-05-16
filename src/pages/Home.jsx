import React from 'react';

function Home({ onLogin, onMembreLogin }) {
  const [hovered, setHovered] = React.useState(null);

  const features = [
    { img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', icon: 'ti-book', title: 'Catalogue des Livres', desc: 'Gerez et consultez tous les ouvrages disponibles dans la bibliotheque.' },
    { img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', icon: 'ti-users', title: 'Gestion des Adherents', desc: 'Suivez les etudiants et enseignants membres de la bibliotheque.' },
    { img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80', icon: 'ti-arrows-exchange', title: 'Suivi des Emprunts', desc: 'Enregistrez et suivez tous les emprunts et retours en temps reel.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', fontFamily: 'Segoe UI, sans-serif' }}>

      <nav style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 60px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #c9a84c, #f0d080)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-books" style={{ fontSize: 22, color: '#0a1628' }}></i>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Bibliotheque Academique</div>
            <div style={{ color: '#c9a84c', fontSize: 11, letterSpacing: 1 }}>ECOLE SUPERIEURE POLYTECHNIQUE</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={onMembreLogin} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '9px 22px', borderRadius: 8, fontWeight: 600, fontSize: 14, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
            Espace Membre
          </button>
          <button onClick={onLogin} style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', padding: '9px 22px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
            Espace Admin
          </button>
        </div>
      </nav>

      <div style={{ backgroundImage: 'linear-gradient(rgba(10,22,40,0.8), rgba(10,22,40,0.9)), url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', padding: '120px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 20, padding: '6px 20px', marginBottom: 24 }}>
          <span style={{ color: '#c9a84c', fontSize: 13, letterSpacing: 2 }}>ESP — UCAD DAKAR</span>
        </div>
        <h1 style={{ color: 'white', fontSize: 52, fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
          Systeme de Gestion de Bibliotheque Academique
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 600, margin: '0 auto 40px' }}>
          Plateforme administrative pour la gestion des livres, adherents et emprunts de la bibliotheque de l'ESP.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={onLogin} style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#0a1628', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            Espace Admin
          </button>
          <button onClick={onMembreLogin} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 36px', borderRadius: 10, fontWeight: 600, fontSize: 16, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
            Espace Membre
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '40px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, textAlign: 'center' }}>
          {[
            { value: '1000+', label: 'Ouvrages disponibles' },
            { value: '500+', label: 'Etudiants inscrits' },
            { value: '24/7', label: 'Acces administrateur' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#c9a84c' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '80px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 50, color: 'white' }}>
          Fonctionnalites principales
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
          {features.map((f, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ background: hovered === i ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)', border: hovered === i ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', transform: hovered === i ? 'translateY(-8px)' : 'translateY(0)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
              <img src={f.img} alt={f.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <i className={`ti ${f.icon}`} style={{ fontSize: 20, color: '#c9a84c' }}></i>
                  <h3 style={{ color: '#c9a84c', fontSize: 17, fontWeight: 700 }}>{f.title}</h3>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', padding: '30px 60px' }}>
        <div style={{ color: '#c9a84c', fontWeight: 700, marginBottom: 6 }}>Bibliotheque Academique — ESP</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Ecole Superieure Polytechnique — UCAD Dakar</div>
      </footer>

    </div>
  );
}

export default Home;