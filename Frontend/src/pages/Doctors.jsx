import React from 'react';

export default function Doctors() {
  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#059669', fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose Our Doctors?</h1>
        <p style={{ color: '#4b5563', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          We provide world-class healthcare with the best specialists and modern facilities to ensure your quick recovery.
        </p>
      </div>

      <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
        
        {/* Card 1 */}
        <div className="card text-center" style={{ padding: '2rem 1.5rem', background: '#f0fdf4', border: '1px solid #86efac' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
          <h3 style={{ color: '#047857', marginBottom: '1rem' }}>Best Quality Doctors</h3>
          <p style={{ color: '#4b5563' }}>Our team consists of highly qualified, board-certified specialists with decades of experience in their respective fields.</p>
        </div>

        {/* Card 2 */}
        <div className="card text-center" style={{ padding: '2rem 1.5rem', background: '#f0fdf4', border: '1px solid #86efac' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
          <h3 style={{ color: '#047857', marginBottom: '1rem' }}>Advanced Diagnostics</h3>
          <p style={{ color: '#4b5563' }}>In-house diagnostic services including advanced X-Ray, Ultrasound, MRI, and comprehensive pathology labs.</p>
        </div>

        {/* Card 3 */}
        <div className="card text-center" style={{ padding: '2rem 1.5rem', background: '#f0fdf4', border: '1px solid #86efac' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚑</div>
          <h3 style={{ color: '#047857', marginBottom: '1rem' }}>24x7 Availability</h3>
          <p style={{ color: '#4b5563' }}>Medical emergencies can happen anytime. Our dedicated trauma and emergency team is available 24 hours a day, 7 days a week.</p>
        </div>

        {/* Card 4 */}
        <div className="card text-center" style={{ padding: '2rem 1.5rem', background: '#f0fdf4', border: '1px solid #86efac' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
          <h3 style={{ color: '#047857', marginBottom: '1rem' }}>Reasonable Pricing</h3>
          <p style={{ color: '#4b5563' }}>We believe quality healthcare should be accessible to everyone. We offer transparent and highly reasonable consultation fees.</p>
        </div>

      </div>
    </div>
  );
}
