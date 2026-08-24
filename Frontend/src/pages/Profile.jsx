import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const navigate = useNavigate();
  const { role } = useSelector(state => state.auth);
  const isDoctor = role === 'doctor';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    dob: '',
    age: '',
    location: '',
    Profession: '',
    address: '',
    Height: '',
    Weight: '',
    specialization: '',
    experience: '',
    consultationFee: '',
    clinicAddress: '',
    about: ''
  });

  React.useEffect(() => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      try {
        setFormData(prev => ({ ...prev, ...JSON.parse(savedData) }));
      } catch(e) {}
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('profileData', JSON.stringify(formData));
    alert('Profile saved successfully!');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', marginBottom: '16px', color: '#38bdf8', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ marginRight: '8px' }}>👤</span> {isDoctor ? 'Doctor Profile' : 'Patient Profile'}
            </div>
            <h1 style={{ fontSize: '42px', margin: '0 0 10px 0', color: 'white' }}>Build your <span style={{ color: '#38bdf8' }}>Personal profile</span></h1>
          </div>
          <button onClick={() => navigate('/')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            ← Back to Home Page
          </button>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {isDoctor ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>👤</span> Full Name
                  </label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Dr. John Doe" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>✉️</span> Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@example.com" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>🩺</span> Specialization
                  </label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Cardiologist" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>⭐</span> Experience (Years)
                  </label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="10" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>💰</span> Consultation Fee
                  </label>
                  <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} placeholder="500" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>📍</span> Clinic Address
                  </label>
                  <input type="text" name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} placeholder="Main Hospital" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>📝</span> About
                  </label>
                  <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Tell us about your background..." style={{...inputStyle, height: '100px', resize: 'none'}} />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>👤</span> Full Name
                  </label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ravi kumar" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>✉️</span> Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ravikumar@gmail.com" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>📞</span> Mobile Number
                  </label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="08250348341" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>📅</span> Date of Birth
                  </label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>🎂</span> Age
                  </label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="20" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>📍</span> Location
                  </label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="DELHI" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>🏫</span> Profession
                  </label>
                  <input type="text" name="Profession" value={formData.Profession} onChange={handleChange} placeholder="Student" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>🏠</span> Address
                  </label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="KAROL BAGH" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>🫀</span> Height
                  </label>
                  <input type="text" name="Height" value={formData.Height} onChange={handleChange} placeholder="175cm" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '6px' }}>📝</span> Weight
                  </label>
                  <input type="text" name="Weight" value={formData.Weight} onChange={handleChange} placeholder="70kg" style={inputStyle} />
                </div>
              </>
            )}

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="submit" className="btn">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  fontSize: '15px',
  color: 'white',
  outline: 'none',
  boxSizing: 'border-box'
};

export default Profile;
