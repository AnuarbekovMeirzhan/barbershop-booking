import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Trash2, Calendar, Clock, User, Scissors, LogOut } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ onBack }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('luxeAdminAuth') === 'true'
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const HARDCODED_PASSWORD = "admin123";

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === HARDCODED_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('luxeAdminAuth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('luxeAdminAuth');
    setPasswordInput('');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteDoc(doc(db, "appointments", id));
      } catch (error) {
        console.error("Error deleting appointment:", error);
        alert("Failed to delete the appointment. Check console or Firestore permissions.");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard login-mode">
        <div className="container login-container animate-fade-up">
           <button onClick={onBack} className="btn-back" style={{ marginBottom: '2rem' }}>
              <ArrowLeft size={20} />
              <span>Back to Site</span>
           </button>
           <div className="login-box">
              <h2>Admin Login</h2>
              <p>Enter the master password to access the panel.</p>
              <form onSubmit={handleLogin} className="login-form">
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password"
                  className="login-input"
                  autoFocus
                />
                {authError && <div className="error-text">{authError}</div>}
                <button type="submit" className="btn-primary login-btn">Login</button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container header-container">
          <button onClick={onBack} className="btn-back">
            <ArrowLeft size={20} />
            <span>Back to Site</span>
          </button>
          <h2>Admin Control Panel</h2>
          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="container admin-content">
        <div className="admin-controls">
          <h3>Recent Bookings</h3>
          <span className="badge">{appointments.length} Total</span>
        </div>

        {loading ? (
          <div className="loading-state">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">No appointments found.</div>
        ) : (
          <div className="appointments-grid">
            {appointments.map(app => (
              <div className="appointment-card animate-fade-up" key={app.id}>
                <div className="card-header">
                  <div className="date-badge">
                    <Calendar size={14} />
                    {app.date}
                  </div>
                  <button 
                    onClick={() => handleDelete(app.id)} 
                    className="btn-delete"
                    title="Delete Booking"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <Clock size={16} className="icon-gold" />
                    <strong>{app.time}</strong>
                  </div>
                  <div className="info-row">
                    <User size={16} className="icon-gold" />
                    <span>{app.barber}</span>
                  </div>
                  <div className="info-row">
                    <Scissors size={16} className="icon-gold" />
                    <span className="service-text">{app.service}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <small>Booked: {new Date(app.createdAt).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
