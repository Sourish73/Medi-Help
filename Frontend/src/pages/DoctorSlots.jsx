import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';

export default function DoctorSlots() {
  const { doctorId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [slots, setSlots] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
    fetchDoctorInfo();
  }, [doctorId]);

  const fetchDoctorInfo = async () => {
    try {
      // In a real app we'd fetch specific doctor info, but for now we'll fetch all and filter 
      // since there isn't a getDoctorById endpoint readily available in this context.
      const res = await api.get('/doctors');
      const doc = res.data.data.find(d => d.user?._id === doctorId);
      setDoctorInfo(doc);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSlots = async () => {
    try {
      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;
      
      const res = await api.get(`/appointments/available-slots/${doctorId}?date=${today}`);
      setSlots(res.data.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      alert(error.response?.data?.message || 'Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async (slotId, startTime, endTime) => {
    try {
      const res = await api.post('/appointments/book', {
        doctorId,
        startTime,
        endTime
      });
      
      const appointment = res.data.data;
      initiateRazorpayPayment(appointment._id, appointment.amount);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error booking slot');
    }
  };

  const initiateRazorpayPayment = async (appointmentId, amount) => {
    const options = {
      key: 'rzp_test_TOlHjo5HTdStDQ',
      amount: amount * 100,
      currency: 'INR',
      name: 'MediSlot Hospital',
      description: 'Appointment Booking',
      handler: async function (response) {
        try {
          await api.post('/payments/verify', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            appointmentId
          });
          navigate('/success');
        } catch (error) {
          alert('Payment verification failed.');
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: { color: '#059669' }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading slots...</div>;

  return (
    <div style={{ background: '#f0f9ff', minHeight: 'calc(100vh - 70px)', padding: '3rem 2rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <button className="btn btn-outline" onClick={() => navigate('/book')} style={{ marginBottom: '2rem' }}>
          &larr; Back to Doctors
        </button>

        {doctorInfo && (
          <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'white', marginBottom: '2rem' }}>
             <img src="/doctor_avatar.jpg" alt="Doctor" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
             <div>
                <h2 style={{ color: '#0369a1', margin: '0 0 0.25rem 0' }}>{doctorInfo.user?.name}</h2>
                <p style={{ margin: '0 0 0.25rem 0', color: '#475569' }}>{doctorInfo.specialization}</p>
                <p style={{ margin: '0' }}>Consultation Fee: <strong>₹{doctorInfo.fees}</strong></p>
             </div>
          </div>
        )}

        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#0369a1', marginBottom: '1.5rem', textAlign: 'center' }}>Available Time Slots for Today</h2>
          
          {slots.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No slots available right now. Please try again later.</p>
          ) : (
            <div className="grid grid-cols-4">
              {slots.map((slot, i) => (
                <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center', background: '#f0f9ff', border: '1px solid #7dd3fc', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'} onMouseLeave={(e) => e.currentTarget.style.background = '#f0f9ff'}>
                  <p style={{ margin: '0 0 0.75rem 0', fontWeight: 'bold', color: '#0369a1', fontSize: '1.1rem' }}>
                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <button className="btn" onClick={() => bookSlot(slot._id, slot.startTime, slot.endTime)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: '100%', background: '#0284c7' }}>
                    Book & Pay
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
