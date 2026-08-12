import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Booking() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading doctors...</div>;
  }

  return (
    <div style={{ background: '#f0f9ff', minHeight: 'calc(100vh - 70px)', padding: '3rem 2rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: '#0369a1', fontSize: '2.5rem', marginBottom: '1rem' }}>Book Your Appointment</h1>
          <p style={{ color: '#0ea5e9', fontSize: '1.2rem' }}>Select a specialist to view their available slots.</p>
        </div>

        <div className="grid grid-cols-2">
          {doctors.map(doc => (
            <div key={doc._id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid #bae6fd' }}>
              <img src="/doctor_avatar.jpg" alt="Doctor" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#0284c7', margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>{doc.user?.name}</h3>
                <p style={{ margin: '0 0 0.25rem 0', color: '#475569' }}>{doc.specialization}</p>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>₹{doc.fees}</p>
                <button 
                  className="btn" 
                  onClick={() => navigate(`/book/${doc.user?._id}`)} 
                  style={{ background: '#38bdf8' }}
                >
                  View Slots
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
