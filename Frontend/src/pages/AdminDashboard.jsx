import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'General Physician',
    fees: 500,
    experienceYears: 2,
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    slotDurationMinutes: 30,
    leaveDaysInput: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors/admin/list');
      setDoctors(res.data.data);
    } catch (error) {
      setToast({ message: 'Failed to retrieve doctors list', type: 'error' });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        specialization: form.specialization,
        fees: Number(form.fees),
        experienceYears: Number(form.experienceYears),
        workingHours: { start: form.workingHoursStart, end: form.workingHoursEnd },
        slotDurationMinutes: Number(form.slotDurationMinutes),
        leaveDays: form.leaveDaysInput ? form.leaveDaysInput.split(',').map(s => s.trim()) : [],
      };

      if (editingId) {
        await api.put(`/doctors/admin/${editingId}`, payload);
        setToast({ message: 'Doctor profile and leave days updated successfully!', type: 'success' });
      } else {
        await api.post('/doctors/admin', { ...payload, password: form.password });
        setToast({ message: 'Doctor registered successfully!', type: 'success' });
      }

      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: 'General Physician',
        fees: 500,
        experienceYears: 2,
        workingHoursStart: '09:00',
        workingHoursEnd: '17:00',
        slotDurationMinutes: 30,
        leaveDaysInput: '',
      });
      setEditingId(null);
      fetchDoctors();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Operation failed', type: 'error' });
    }
  };

  const startEdit = (doc) => {
    setEditingId(doc._id);
    setForm({
      name: doc.user?.name || '',
      email: doc.user?.email || '',
      password: '',
      phone: doc.user?.phone || '',
      specialization: doc.specialization,
      fees: doc.fees,
      experienceYears: doc.experienceYears,
      workingHoursStart: doc.workingHours?.start || '09:00',
      workingHoursEnd: doc.workingHours?.end || '17:00',
      slotDurationMinutes: doc.slotDurationMinutes || 30,
      leaveDaysInput: (doc.leaveDays || []).join(', '),
    });
  };

  const deleteDoc = async (id) => {
    try {
      await api.delete(`/doctors/admin/${id}`);
      setToast({ message: 'Doctor profile deleted successfully', type: 'success' });
      fetchDoctors();
    } catch (error) {
      setToast({ message: 'Failed to delete doctor profile', type: 'error' });
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', padding: '3rem 2rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#ea580c' }}>Admin Control Center</h1>

        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#ea580c', marginTop: 0 }}>{editingId ? 'Edit Doctor Profile & Leaves' : 'Add New Doctor'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="form-input" />
              </div>
              {!editingId && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} required className="form-input" />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input type="text" name="specialization" value={form.specialization} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fees (₹)</label>
                <input type="number" name="fees" value={form.fees} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Working Hours Start (HH:MM)</label>
                <input type="text" name="workingHoursStart" value={form.workingHoursStart} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Working Hours End (HH:MM)</label>
                <input type="text" name="workingHoursEnd" value={form.workingHoursEnd} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Slot Duration (Minutes)</label>
                <input type="number" name="slotDurationMinutes" value={form.slotDurationMinutes} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Leave Days (comma separated YYYY-MM-DD)</label>
                <input type="text" name="leaveDaysInput" placeholder="e.g. 2026-08-30, 2026-09-02" value={form.leaveDaysInput} onChange={handleChange} className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn" style={{ flex: 1 }}>
                  {editingId ? 'Save Updates' : 'Register Doctor'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setForm({ name: '', email: '', password: '', phone: '', specialization: 'General Physician', fees: 500, experienceYears: 2, workingHoursStart: '09:00', workingHoursEnd: '17:00', slotDurationMinutes: 30, leaveDaysInput: '' }); }} style={{ flex: 1 }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '700px', overflowY: 'auto' }}>
            <h2 style={{ color: '#ea580c', marginTop: 0 }}>Doctors List</h2>
            {doctors.map(doc => (
              <div key={doc._id} style={{ background: 'rgba(255, 255, 255, 0.45)', border: '1px solid rgba(249, 115, 22, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#ea580c' }}>{doc.user?.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>{doc.specialization} • ₹{doc.fees}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: '500' }}>Leaves: {(doc.leaveDays || []).join(', ') || 'None'}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" onClick={() => startEdit(doc)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Edit</button>
                  <button className="btn" style={{ background: 'transparent', color: '#ef4444', border: '1.5px solid #ef4444', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => deleteDoc(doc._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', background: toast.type === 'error' ? '#fee2e2' : '#dcfce7', border: `1px solid ${toast.type === 'error' ? '#f87171' : '#4ade80'}`, color: toast.type === 'error' ? '#991b1b' : '#166534', padding: '1rem 1.5rem', borderRadius: '8px', zIndex: 1200, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'inherit' }}>×</button>
        </div>
      )}
    </div>
  );
}
