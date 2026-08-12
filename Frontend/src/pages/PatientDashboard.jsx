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
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/${id}/cancel`);
      alert("Appointment cancelled successfully.");
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: '#0369a1', marginBottom: '2rem' }}>My Appointments</h1>
      
      {appointments.length === 0 ? (
        <div className="card text-center">
          <p>You have no booked appointments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {appointments.map((apt) => (
            <div key={apt._id} className="card" style={{ position: 'relative' }}>
              <h3 style={{ color: '#0284c7', margin: '0 0 0.5rem 0' }}>Dr. {apt.doctor?.name}</h3>
              <p><strong>Status:</strong> {apt.status}</p>
              <p><strong>Payment:</strong> {apt.paymentStatus}</p>
              <p><strong>Time:</strong> {new Date(apt.slot?.startTime).toLocaleString()}</p>
              
              {(apt.status === 'CONFIRMED' || apt.status === 'PENDING') && (
                <button 
                  className="btn" 
                  style={{ background: '#ef4444', color: 'white', marginTop: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
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
