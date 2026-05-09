import React from 'react';

function Home({ onLogin }) {

  const features = [
    { img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', title: 'Gestion des Livres', desc: 'Ajoutez, modifiez et supprimez des livres. Suivez le stock en temps reel.' },
    { img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', title: 'Gestion des Adherents', desc: 'Gerez les membres de la bibliotheque avec leurs informations de contact.' },
    { img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80', title: 'Gestion des Emprunts', desc: 'Enregistrez les emprunts et retours. Suivi automatique du statut.' },
  ];

  const etapes = [
    { num: '1', title: 'Connexion', desc: 'Connectez-vous avec vos identifiants.' },
    { num: '2', title: 'Gestion', desc: 'Gerez livres, adherents et emprunts.' },
    { num: '3', title: 'Suivi', desc: 'Suivez les retours et le stock en temps reel.' },
  ];

  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>

      <nav style={{ background: 'white', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>📚</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>Bibliotheque</span>
        </div>
        <button onClick={onLogin} style={{ background: '#4f46e5', color: 'white', padding: '9px 22px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>Connexion</button>
      </nav>

      <div style={{ backgroundImage: 'linear-gradient(rgba(79,70,229,0.85), rgba(124,58,237,0.85)), url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', padding: '100px 40px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>Systeme de Gestion de Bibliotheque</h1>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 600, margin: '0 auto 32px' }}>Gerez vos livres, adherents et emprunts en toute simplicite.</p>
        <button onClick={onLogin} style={{ background: 'white', color: '#4f46e5', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16 }}>Acceder au systeme</button>
      </div>

      <div style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40, color: '#1a1a2e' }}>Fonctionnalites principales</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: hovered === i ? '0 12px 32px rgba(79,70,229,0.25)' : '0 2px 8px rgba(0,0,0,0.08)', transform: hovered === i ? 'translateY(-8px)' : 'translateY(0)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
              <img src={f.img} alt={f.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <div style={{ padding: 24, textAlign: 'center' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#1a1a2e' }}>{f.title}</h3>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', padding: '60px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40, color: '#1a1a2e' }}>Comment ca marche ?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {etapes.map((e, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#4f46e5', color: 'white', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{e.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>{e.title}</h3>
                <p style={{ color: '#666', fontSize: 14 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ background: '#1a1a2e', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px 40px', fontSize: 13 }}>
        <p>2026 Bibliotheque Academique</p>
      </footer>

    </div>
  );
}

export default Home;
