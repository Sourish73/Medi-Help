import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
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
    Weight: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile saved successfully!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ffe8ef, #fff0f5)',
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', marginBottom: '16px', color: '#c2185b' }}>
              <span style={{ marginRight: '8px' }}>👤</span> Patient Profile
            </div>
            <h1 style={{ fontSize: '42px', margin: '0 0 10px 0', color: '#333' }}>Build your <span style={{ color: '#ff6b00' }}>Personal profile</span></h1>
            <p style={{ color: '#666', fontSize: '16px', margin: 0, maxWidth: '600px' }}>

            </p>
          </div>
          <button onClick={() => navigate('/')} style={{
            background: '#e91e63', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
          }}>
            ← Back to Home Page
          </button>
        </div>

        <div style={{
          background: '#fff9fb', border: '1px solid #f8bbd0', borderRadius: '16px', padding: '40px'
        }}>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>👤</span> Full Name
              </label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ravi kumar" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>✉️</span> Email
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ravikumar@gmail.com" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>📞</span> Mobile Number
              </label>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="08250348341" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>📅</span> Date of Birth
              </label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>🎂</span> Age
              </label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="20" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>📍</span> Location
              </label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="DELHI" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>🏫</span> Profession
              </label>
              <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="DPS" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>🏠</span> Address
              </label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="KAROL BAGH" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>🫀</span> Height
              </label>
              <input type="text" name="tenthMarks" value={formData.tenthMarks} onChange={handleChange} placeholder="95%" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>📝</span> BMI
              </label>
              <input type="text" name="twelfthMarks" value={formData.twelfthMarks} onChange={handleChange} placeholder="90%" style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="submit" style={{
                background: '#ff6b00', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(255,107,0,0.3)'
              }}>
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
  border: '1px solid #f8bbd0',
  background: '#fff',
  fontSize: '15px',
  color: '#333',
  outline: 'none',
  boxSizing: 'border-box'
};

export default Profile;
