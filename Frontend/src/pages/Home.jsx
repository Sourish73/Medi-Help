import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>WE ARE HERE FOR YOUR CARE</h1>
          <h2 style={{ color: '#059669', fontSize: '3rem', margin: '1rem 0' }}>Best Care</h2>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 2rem 0' }}>Better Doctor</h2>
          <Link to="/book" className="btn btn-large" style={{ background: '#059669' }}>
            Book A Appointment
          </Link>
        </div>
        <div className="hero-image-container">
          <img src="/hero.jpg" alt="Doctor" className="hero-image" />
        </div>
      </div>
      
      <div className="services-section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Services</h2>
        <div className="grid grid-cols-3 container">
          <div className="card text-center">
            <h3>24/7 Emergency</h3>
            <p>Always here when you need us most.</p>
          </div>
          <div className="card text-center">
            <h3>Expert Doctors</h3>
            <p>Top specialists from around the world.</p>
          </div>
          <div className="card text-center">
            <h3>Modern Facilities</h3>
            <p>State of the art technology.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
