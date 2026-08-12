import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/patient');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="centered-layout">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#10b981', fontSize: '3rem', marginBottom: '1rem' }}>🎉</h1>
        <h2 style={{ color: '#10b981' }}>Payment Successful!</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          Your appointment has been confirmed and locked in.
        </p>
        <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
