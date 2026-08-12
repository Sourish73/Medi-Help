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
    <div>
      <nav className="navbar">
        <div className="navbar-brand">MediSlot Doctor</div>
        <div className="navbar-nav">
          <span>Dr. {user?.name}</span>
          <button className="btn btn-secondary" onClick={() => dispatch(logout())}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <h2>Your Appointments</h2>
        {appointments.length === 0 ? <p>No booked appointments yet.</p> : (
          <div className="grid grid-cols-2">
            {appointments.map((apt) => (
              <div key={apt._id} className="card">
                <h3>Patient: {apt.patient?.name}</h3>
                <p>Status: <strong>{apt.status}</strong></p>
                <p>Payment: {apt.paymentStatus}</p>
                <p>Time: {new Date(apt.slot?.startTime).toLocaleString()}</p>
                {apt.status === 'CONFIRMED' && (
                  <button className="btn" onClick={() => markComplete(apt._id)} style={{marginTop: '1rem'}}>
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
