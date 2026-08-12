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
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (selectedDate) fetchSlots();
  }, [doctorId, selectedDate]);

  useEffect(() => {
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
      setLoading(true);
      const res = await api.get(`/appointments/available-slots/${doctorId}?date=${selectedDate}`);
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
    try {
      const orderRes = await api.post('/payments/create-order', { amount, appointmentId });
      const order = orderRes.data.order;

      const options = {
        key: 'rzp_test_TOlHjo5HTdStDQ',
        amount: amount * 100,
        currency: 'INR',
        name: 'MediSlot Hospital',
        description: 'Appointment Booking',
        order_id: order.id,
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
    } catch (error) {
      console.error(error);
      alert('Error creating payment order');
    }
  };

  if (!doctorInfo) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading doctor info...</div>;

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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#0369a1', margin: '0 0 1rem 0' }}>
              {selectedDate ? 'Available Time Slots' : 'Select a Date for your Appointment'}
            </h2>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              min={new Date().toISOString().split('T')[0]}
              style={{ padding: '0.75rem 1.5rem', border: '2px solid #0284c7', borderRadius: '12px', outline: 'none', fontSize: '1.1rem', color: '#0369a1', fontWeight: 'bold' }}
            />
          </div>
          
          {selectedDate && (
            loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Loading slots...</p>
            ) : slots.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No slots available for this date. Please try another date.</p>
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
            )
          )}
        </div>
      </div>
    </div>
  );
}
