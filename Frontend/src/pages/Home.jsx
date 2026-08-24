import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', paddingTop: '4rem' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#ea580c', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', width: 'fit-content', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
            ✨ REVOLUTIONISING HEALTHCARE BOOKINGS
          </span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', color: 'var(--text-dark)', margin: 0 }}>
            Next-Gen <span style={{ background: 'linear-gradient(to right, #f97316, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Healthcare</span> Scheduling
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
            Get instant pre-visit symptom analysis powered by advanced AI, live slot availability, and integrated Google Calendar sync.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/book" className="btn" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              Book Appointment Now
            </Link>
            <Link to="/doctors" className="btn btn-outline" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              Explore Specialists
            </Link>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 60%)', zIndex: -1 }}></div>
          <img src="/hero.jpg" alt="Doctor" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.2)', border: '1px solid rgba(255, 255, 255, 0.8)', objectFit: 'cover' }} />
        </div>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.25rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
          Why Choose <span style={{ color: '#ea580c' }}>MediSlot</span>
        </h2>
        <div className="grid grid-cols-3">
          <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2.5rem 2rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🤖</span>
            <h3 style={{ margin: 0, color: '#ea580c', fontSize: '1.35rem', fontWeight: '700' }}>AI Symptom Summary</h3>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Submit symptoms in advance and receive instant AI analysis with urgency evaluation.
            </p>
          </div>
          <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2.5rem 2rem' }}>
            <span style={{ fontSize: '2.5rem' }}>⚡</span>
            <h3 style={{ margin: 0, color: '#ea580c', fontSize: '1.35rem', fontWeight: '700' }}>Real-time Slots</h3>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              WebSocket integration synchronized slot selections immediately across all devices.
            </p>
          </div>
          <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2.5rem 2rem' }}>
            <span style={{ fontSize: '2.5rem' }}>📅</span>
            <h3 style={{ margin: 0, color: '#ea580c', fontSize: '1.35rem', fontWeight: '700' }}>Calendar Sync</h3>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Confirm your visit and instantly map Google Calendar events for doctors and patients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
