import { useState, useEffect } from 'react';
import api from '../services/api';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/patient');
      setAppointments(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/${id}/cancel`);
      alert("Appointment cancelled successfully.");
      fetchAppointments();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', minHeight: 'calc(100vh - 70px)' }}>
      <h1 style={{ color: '#38bdf8', marginBottom: '2rem', textAlign: 'center' }}>My Health Records & Appointments</h1>
      
      {appointments.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>You have no booked appointments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
          {appointments.map((apt) => (
            <div key={apt._id} className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#38bdf8', margin: 0 }}>Dr. {apt.doctor?.name}</h3>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', background: apt.status === 'COMPLETED' ? 'rgba(52, 211, 153, 0.1)' : apt.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(56, 189, 248, 0.1)', color: apt.status === 'COMPLETED' ? '#34d399' : apt.status === 'CANCELLED' ? '#ef4444' : '#38bdf8' }}>
                  {apt.status}
                </span>
              </div>

              <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                <p style={{ margin: '0.25rem 0' }}><strong>Time:</strong> {new Date(apt.slot?.startTime).toLocaleString()}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>My Symptoms:</strong> {apt.symptoms || 'None'}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Payment status:</strong> {apt.paymentStatus}</p>
              </div>

              {apt.status === 'COMPLETED' && (
                <div style={{ marginTop: '0.5rem', background: 'rgba(52, 211, 153, 0.05)', borderLeft: '3px solid #34d399', padding: '0.75rem 1rem', borderRadius: '4px' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#34d399' }}>AI Patient Friendly Summary</p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1', fontSize: '0.9rem' }}>{apt.postVisitSummary}</p>
                  {apt.prescription && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#38bdf8' }}>Prescription:</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>{apt.prescription}</p>
                    </div>
                  )}
                </div>
              )}

              {(apt.status === 'CONFIRMED' || apt.status === 'PENDING') && (
                <button 
                  className="btn" 
                  style={{ background: 'transparent', color: '#ef4444', border: '1.5px solid #ef4444', marginTop: 'auto' }}
                  onClick={() => handleCancel(apt._id)}
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
