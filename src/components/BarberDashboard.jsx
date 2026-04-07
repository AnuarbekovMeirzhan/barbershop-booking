import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, User, Calendar, Clock, Check, X, LogOut, Scissors } from 'lucide-react';
import './BarberDashboard.css';

const BarberDashboard = ({ onBack }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueBarbers, setUniqueBarbers] = useState([]);
  
  // Barber selection state
  const [selectedBarber, setSelectedBarber] = useState(
    localStorage.getItem('luxeBarberName') || ''
  );

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      const barbersSet = new Set();
      snapshot.forEach(doc => {
        const docData = { id: doc.id, ...doc.data() };
        data.push(docData);
        if (docData.barber && docData.barber !== 'Any Available' && docData.barber !== 'Любой свободный' && docData.barber !== 'Кез келген бос') {
          barbersSet.add(docData.barber);
        }
      });
      setAppointments(data);
      setUniqueBarbers(Array.from(barbersSet));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectBarber = (barberName) => {
    setSelectedBarber(barberName);
    localStorage.setItem('luxeBarberName', barberName);
  };

  const handleLogout = () => {
    setSelectedBarber('');
    localStorage.removeItem('luxeBarberName');
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update status.");
    }
  };

  if (!selectedBarber) {
    return (
      <div className="barber-dashboard selection-mode">
        <div className="container selection-container animate-fade-up">
           <button onClick={onBack} className="btn-back">
              <ArrowLeft size={20} />
              <span>Back to Site</span>
           </button>
           <div className="selection-box">
              <h2>Barber Portal</h2>
              <p>Select your profile to view your schedule.</p>
              
              {loading ? (
                <div className="loading-state">Loading profiles...</div>
              ) : (
                <div className="barber-list">
                  {uniqueBarbers.length === 0 && <p className="empty-state">No barbers found in records.</p>}
                  {uniqueBarbers.map(b => (
                    <button 
                      key={b} 
                      className="btn-barber-select"
                      onClick={() => handleSelectBarber(b)}
                    >
                      <User size={20} className="icon-gold" />
                      <span>{b}</span>
                    </button>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  // Helper date functions
  const getTodayStr = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const todayStr = getTodayStr();

  const myAppointments = appointments.filter(app => app.barber === selectedBarber);
  const todayAppointments = myAppointments.filter(app => app.date === todayStr);
  const upcomingAppointments = myAppointments.filter(app => app.date > todayStr);

  const renderCards = (apps) => {
    if (apps.length === 0) {
      return <div className="empty-state-card">No appointments scheduled.</div>;
    }

    // Sort early times/dates first if needed. Currently they are ordered by createdAt desc.
    // For a schedule, ordered by date/time ascending is better.
    const sortedApps = [...apps].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      // naive time string comparison is ok because the array is sorted if AM/PM format is handled, 
      // but assuming fixed timeslots logic:
      return new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`);
    });

    return (
      <div className="mobile-cards-grid">
        {sortedApps.map(app => (
          <div className="mobile-card animate-fade-up" key={app.id}>
            <div className="mc-header">
              <div className="mc-time">
                <Clock size={16} /> {app.time}
              </div>
              <div className={`status-badge ${app.status || 'pending'}`}>
                {app.status || 'Pending'}
              </div>
            </div>
            
            <div className="mc-body">
              <h4 className="mc-client">{app.name || "N/A"}</h4>
              {app.phone && <a href={`tel:${app.phone}`} className="mc-phone">{app.phone}</a>}
              <div className="mc-service">
                <Scissors size={14} className="icon-gold" />
                <span>{app.service}</span>
              </div>
              <div className="mc-date">
                <Calendar size={14} className="icon-gold" />
                <span>{app.date}</span>
              </div>
            </div>

            <div className="mc-footer">
              {(app.status !== 'completed') && (
                <button 
                  className="btn-mc complete"
                  onClick={() => handleUpdateStatus(app.id, 'completed')}
                >
                  <Check size={16} /> Complete
                </button>
              )}
              {(app.status !== 'cancelled') && (
                <button 
                  className="btn-mc cancel"
                  onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="barber-dashboard">
      <div className="bd-header">
        <div className="container bd-header-content">
          <div className="bd-header-top">
            <button onClick={onBack} className="btn-back">
              <ArrowLeft size={20} />
            </button>
            <button onClick={handleLogout} className="btn-logout" title="Switch Barber">
              <LogOut size={20} />
            </button>
          </div>
          <div className="bd-user-info">
            <h2>{selectedBarber}'s Schedule</h2>
          </div>
        </div>
      </div>

      <div className="container bd-content">
        <section className="bd-section">
          <div className="section-header">
            <h3>Today</h3>
            <span className="badge">{todayAppointments.length}</span>
          </div>
          {renderCards(todayAppointments)}
        </section>

        <section className="bd-section">
          <div className="section-header">
            <h3>Upcoming</h3>
            <span className="badge">{upcomingAppointments.length}</span>
          </div>
          {renderCards(upcomingAppointments)}
        </section>
      </div>
    </div>
  );
};

export default BarberDashboard;
