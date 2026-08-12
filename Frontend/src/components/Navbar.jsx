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
          <Link to="/" className="nav-link" style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>Home</Link>
          <Link to="/doctors" className="nav-link" style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>Doctors</Link>
        </div>

        <div className="navbar-actions">
          {role === 'patient' && (
            <Link to="/book" className="btn btn-outline" style={{ marginRight: '1.5rem' }}>
              Book A Appointment
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" style={{ background: '#fef3c7', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#92400e', fontWeight: 'bold' }}>
                Profile
              </Link>
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
