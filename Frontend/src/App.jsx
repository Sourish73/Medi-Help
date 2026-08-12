import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Booking from './pages/Booking';
import DoctorSlots from './pages/DoctorSlots';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Doctors from './pages/Doctors';
import Success from './pages/Success';
import Profile from './pages/Profile';
import './index.css';

function App() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/auth" element={!isAuthenticated ? <Auth /> : (role === 'doctor' ? <Navigate to="/doctor" /> : <Navigate to="/book" />)} />
            
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="/book" element={isAuthenticated && role === 'patient' ? <Booking /> : <Navigate to="/auth" />} />
            <Route path="/book/:doctorId" element={isAuthenticated && role === 'patient' ? <DoctorSlots /> : <Navigate to="/auth" />} />
            <Route path="/patient" element={isAuthenticated && role === 'patient' ? <PatientDashboard /> : <Navigate to="/auth" />} />
            <Route path="/doctor" element={isAuthenticated && role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/auth" />} />
            <Route path="/success" element={isAuthenticated ? <Success /> : <Navigate to="/auth" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
