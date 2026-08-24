import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSelector } from 'react-redux';

export default function DoctorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/doctor');
      setAppointments(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitComplete = async () => {
    if (!selectedApt) return;
    try {
      await api.patch(`/appointments/${selectedApt._id}/complete`, {
        clinicalNotes: notes,
        prescription,
      });
      alert('Appointment completed successfully');
      setSelectedApt(null);
      setNotes('');
      setPrescription('');
      fetchAppointments();
    } catch (error) {
      alert('Error updating appointment');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', padding: '3rem 2rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ background: 'rgba(56, 189, 248, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
             👨‍⚕️
           </div>
           <div>
             <h1 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0' }}>Welcome, Dr. {user?.name}</h1>
             <p style={{ color: '#94a3b8', margin: 0 }}>Review patient pre-visit summaries and complete visits.</p>
           </div>
        </div>

        <div className="card">
          <h2 style={{ color: '#38bdf8', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            📅 Patients & Appointments
          </h2>
          
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <span style={{ fontSize: '3rem' }}>📭</span>
              <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '1.1rem' }}>No bookings found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              {appointments.map((apt) => (
                <div key={apt._id} className="card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#38bdf8', margin: 0 }}>{apt.patient?.name}</h3>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', background: apt.status === 'COMPLETED' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: apt.status === 'COMPLETED' ? '#34d399' : '#fbbf24' }}>
                      {apt.status}
                    </span>
                  </div>

                  <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                    <p style={{ margin: '0.25rem 0' }}><strong>Time:</strong> {new Date(apt.slot?.startTime).toLocaleString()}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Symptoms:</strong> {apt.symptoms || 'None specified'}</p>
                  </div>

                  {apt.preVisitSummary && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderLeft: '3px solid #38bdf8', padding: '0.75rem 1rem', borderRadius: '4px' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#38bdf8' }}>AI pre-visit analysis</p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Urgency:</strong> <span style={{ color: apt.preVisitSummary.urgency === 'High' ? '#ef4444' : apt.preVisitSummary.urgency === 'Medium' ? '#fbbf24' : '#34d399', fontWeight: 'bold' }}>{apt.preVisitSummary.urgency}</span></p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Chief Complaint:</strong> {apt.preVisitSummary.chiefComplaint}</p>
                      <p style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: 'bold' }}>Suggested Questions:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                        {(apt.preVisitSummary.suggestedQuestions || []).map((q, idx) => (
                          <li key={idx} style={{ color: '#94a3b8' }}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {apt.status === 'COMPLETED' && apt.postVisitSummary && (
                    <div style={{ background: 'rgba(52, 211, 153, 0.05)', borderLeft: '3px solid #34d399', padding: '0.75rem 1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#34d399' }}>AI Patient Friendly Summary</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>{apt.postVisitSummary}</p>
                    </div>
                  )}

                  {apt.status === 'CONFIRMED' && (
                    <button className="btn" onClick={() => setSelectedApt(apt)} style={{ marginTop: 'auto' }}>
                      Complete Consult
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedApt && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
            <div className="card" style={{ width: '500px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
              <h3 style={{ color: '#38bdf8', marginTop: 0 }}>Consult Notes & Prescription</h3>
              
              <div className="form-group">
                <label className="form-label">Clinical Notes</label>
                <textarea className="form-input" style={{ height: '100px', resize: 'none' }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Diagnosis details, clinical observations..." />
              </div>

              <div className="form-group">
                <label className="form-label">Prescription & Instructions</label>
                <textarea className="form-input" style={{ height: '80px', resize: 'none' }} value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="e.g. Paracetamol 500mg, Daily, 5 days" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn" onClick={submitComplete} style={{ flex: 1 }}>Submit & Mark Complete</button>
                <button className="btn" style={{ background: 'transparent', color: '#ef4444', border: '1.5px solid #ef4444', flex: 1 }} onClick={() => { setSelectedApt(null); setNotes(''); setPrescription(''); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
