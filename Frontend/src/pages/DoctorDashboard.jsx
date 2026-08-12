import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function DoctorDashboard() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/doctor');
      setAppointments(res.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const markComplete = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}/complete`, {});
      fetchAppointments();
    } catch (error) {
      alert('Error updating appointment');
    }
  };

  return (
    <div style={{ background: '#f0fdf4', minHeight: 'calc(100vh - 70px)', padding: '3rem 2rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ background: '#dcfce7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
             👨‍⚕️
           </div>
           <div>
             <h1 style={{ color: '#166534', margin: '0 0 0.5rem 0' }}>Welcome, Dr. {user?.name}</h1>
             <p style={{ color: '#15803d', margin: 0 }}>Manage your patient appointments and schedules below.</p>
           </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#166534', marginBottom: '1.5rem', borderBottom: '2px solid #f0fdf4', paddingBottom: '1rem' }}>
            📅 Your Appointments
          </h2>
          
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px' }}>
              <span style={{ fontSize: '3rem' }}>📭</span>
              <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1.1rem' }}>No booked appointments yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              {appointments.map((apt) => (
                <div key={apt._id} className="card" style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #86efac', 
                  borderRadius: '12px', 
                  padding: '1.5rem',
                  position: 'relative',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>🧑‍🦱</span>
                    <h3 style={{ color: '#166534', margin: 0, fontSize: '1.25rem' }}>{apt.patient?.name}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#374151' }}>
                    <p style={{ margin: 0 }}><strong>Status:</strong> <span style={{ color: apt.status === 'CONFIRMED' ? '#059669' : '#dc2626' }}>{apt.status}</span></p>
                    <p style={{ margin: 0 }}><strong>Payment:</strong> <span style={{ color: apt.paymentStatus === 'PAID' ? '#059669' : '#d97706' }}>{apt.paymentStatus}</span></p>
                    <p style={{ margin: 0 }}><strong>Time:</strong> {new Date(apt.slot?.startTime).toLocaleString()}</p>
                  </div>

                  {apt.status === 'CONFIRMED' && (
                    <button 
                      className="btn" 
                      onClick={() => markComplete(apt._id)} 
                      style={{
                        marginTop: '1.5rem', 
                        width: '100%', 
                        background: '#16a34a', 
                        color: 'white',
                        padding: '0.75rem',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Mark as Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
