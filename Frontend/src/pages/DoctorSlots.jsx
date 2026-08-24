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
  
  const [aiChecklist, setAiChecklist] = useState([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  const [symptoms, setSymptoms] = useState('');
  const [bookingSlot, setBookingSlot] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (selectedDate) fetchSlots();
  }, [doctorId, selectedDate]);

  useEffect(() => {
    fetchDoctorInfo();
  }, [doctorId]);

  const fetchDoctorInfo = async () => {
    try {
      const res = await api.get('/doctors');
      const doc = res.data.data.find(d => d.user?._id === doctorId);
      setDoctorInfo(doc);
      
      if (doc) {
        api.get(`/ai/checklist/${doc.specialization}`)
           .then(r => setAiChecklist(r.data.data))
           .finally(() => setAiLoading(false));
      }
    } catch (error) {
      setToast({ message: 'Failed to fetch doctor AI tips', type: 'error' });
      setAiLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/appointments/available-slots/${doctorId}?date=${selectedDate}`);
      setSlots(res.data.data);
    } catch (error) {
      setToast({ message: 'Failed to load available slots', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async () => {
    if (!bookingSlot) return;
    try {
      const res = await api.post('/appointments/book', {
        doctorId,
        startTime: bookingSlot.startTime,
        endTime: bookingSlot.endTime,
        symptoms,
      });
      
      const appointment = res.data.data;
      initiateRazorpayPayment(appointment._id, appointment.amount);
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Error booking slot', type: 'error' });
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
            setToast({ message: 'Payment verification failed', type: 'error' });
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#f97316' }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setToast({ message: 'Error establishing payment gateway', type: 'error' });
    }
  };

  if (!doctorInfo) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dark)' }}>Loading doctor info...</div>;

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', padding: '3rem 2rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <button className="btn btn-outline" onClick={() => navigate('/book')} style={{ marginBottom: '2rem' }}>
          &larr; Back to Doctors
        </button>

        {doctorInfo && (
          <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
             <img src="/doctor_avatar.jpg" alt="Doctor" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
             <div style={{ flex: 1 }}>
                <h2 style={{ color: '#ea580c', margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>{doctorInfo.user?.name}</h2>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#ea580c', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid rgba(249, 115, 22, 0.2)' }}>{doctorInfo.specialization}</span>
                  <span style={{ background: 'rgba(251, 146, 60, 0.1)', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid rgba(251, 146, 60, 0.2)' }}>₹{doctorInfo.fees} / Consultation</span>
                </div>
             </div>
          </div>
        )}

        {!aiLoading && aiChecklist.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
            <h3 style={{ color: '#ea580c', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span> AI Pre-Appointment Checklist
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>How to prepare for your {doctorInfo?.specialization} consultation:</p>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-dark)' }}>
              {aiChecklist.map((tip, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#ea580c', margin: '0 0 1rem 0' }}>
              {selectedDate ? 'Available Time Slots' : 'Select a Date for your Appointment'}
            </h2>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              min={new Date().toISOString().split('T')[0]}
              style={{ padding: '0.75rem 1.5rem', background: 'rgba(255, 255, 255, 0.65)', border: '2px solid #f97316', borderRadius: '12px', outline: 'none', fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 'bold' }}
            />
          </div>
          
          {selectedDate && (
            loading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>Loading slots...</p>
            ) : slots.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No slots available for this date. Please try another date.</p>
            ) : (
              <div className="grid grid-cols-4">
                {slots.map((slot, i) => (
                  <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(249, 115, 22, 0.1)', cursor: 'pointer' }} onClick={() => setBookingSlot(slot)}>
                    <p style={{ margin: '0 0 0.75rem 0', fontWeight: 'bold', color: '#ea580c', fontSize: '1.1rem' }}>
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: '100%' }}>
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {bookingSlot && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
            <div className="card" style={{ width: '450px', background: 'white', border: '1px solid rgba(249,115,22,0.2)', padding: '2rem' }}>
              <h3 style={{ color: '#ea580c', marginTop: 0 }}>Confirm Booking Details</h3>
              <p style={{ color: 'var(--text-dark)' }}><strong>Time:</strong> {new Date(bookingSlot.startTime).toLocaleString()}</p>
              
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label" style={{ color: 'var(--text-dark)' }}>Tell the doctor about your symptoms</label>
                <textarea 
                  className="form-input" 
                  style={{ height: '100px', resize: 'none' }}
                  value={symptoms} 
                  onChange={(e) => setSymptoms(e.target.value)} 
                  placeholder="e.g. fever, headache for 2 days"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button className="btn" onClick={confirmBooking} style={{ flex: 1 }}>Confirm & Book</button>
                <button className="btn" style={{ background: 'transparent', color: '#ef4444', border: '1.5px solid #ef4444', flex: 1 }} onClick={() => setBookingSlot(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div style={{ position: 'fixed', bottom: '20px', left: '20px', background: toast.type === 'error' ? '#fee2e2' : '#dcfce7', border: `1px solid ${toast.type === 'error' ? '#f87171' : '#4ade80'}`, color: toast.type === 'error' ? '#991b1b' : '#166534', padding: '1rem 1.5rem', borderRadius: '8px', zIndex: 1200, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'inherit' }}>×</button>
          </div>
        )}

      </div>
    </div>
  );
}
