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
            <div key={apt._id} className="card">
              <h3 style={{ color: '#0284c7', margin: '0 0 0.5rem 0' }}>Dr. {apt.doctor?.name}</h3>
              <p><strong>Status:</strong> {apt.status}</p>
              <p><strong>Payment:</strong> {apt.paymentStatus}</p>
              <p><strong>Time:</strong> {new Date(apt.slot?.startTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
