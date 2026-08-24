import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  return (
    <nav className="global-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span style={{ color: '#059669', fontWeight: 'bold' }}>MediSlot</span> Hospital
        </Link>

        <div className="navbar-links" style={{ gap: '1rem' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/doctors" className="nav-link">Specialists</Link>
        </div>

        <div className="navbar-actions">
          {role === 'patient' && (
            <Link to="/book" className="btn btn-outline" style={{ marginRight: '1.5rem' }}>
              Book Appointment
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {role === 'admin' && (
                <Link to="/admin" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#059669', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.4)' }}>
                  Admin Panel
                </Link>
              )}
              {role === 'doctor' && (
                <Link to="/doctor" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#059669', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.4)' }}>
                  Doctor Panel
                </Link>
              )}
              {role === 'patient' && (
                <Link to="/patient" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#059669', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.4)' }}>
                  My Bookings
                </Link>
              )}
              {role !== 'admin' && (
                <Link to="/profile" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#0ea5e9', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.4)' }}>
                  Profile
                </Link>
              )}
              <button className="btn" style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }} onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="btn">LOGIN</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
