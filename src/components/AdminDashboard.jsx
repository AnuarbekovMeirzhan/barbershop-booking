import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Trash2, Calendar, Clock, User, Scissors, LogOut, Check, X, ChevronLeft, ChevronRight, List, CalendarDays, CalendarRange, Users, Search } from 'lucide-react';
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
  
  const [filterBarber, setFilterBarber] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const HARDCODED_PASSWORD = "admin123";

  // Unique lists for filters
  const [uniqueBarbers, setUniqueBarbers] = useState([]);

  // Top level tabs
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'clients'

  // Client CRM State
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearch, setClientSearch] = useState('');

  // Calendar View State
  const [viewMode, setViewMode] = useState('daily'); // 'list', 'daily', 'weekly'
  const [calendarDate, setCalendarDate] = useState(new Date()); 
  const [selectedBooking, setSelectedBooking] = useState(null);

  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:00 PM"];

  const getDayStr = (d) => {
    const copy = new Date(d);
    copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
    return copy.toISOString().split('T')[0];
  };

  const getWeekDays = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const firstDay = new Date(date.setDate(diff));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(firstDay);
      nextDay.setDate(firstDay.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const navigateDate = (dir) => {
    const newDate = new Date(calendarDate);
    if (viewMode === 'daily') {
      newDate.setDate(newDate.getDate() + dir);
    } else {
      newDate.setDate(newDate.getDate() + dir * 7);
    }
    setCalendarDate(newDate);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      const barbersSet = new Set();
      
      snapshot.forEach(doc => {
        const docData = { id: doc.id, ...doc.data() };
        data.push(docData);
        if (docData.barber) barbersSet.add(docData.barber);
      });
      
      setAppointments(data);
      setUniqueBarbers(Array.from(barbersSet));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const clientsData = React.useMemo(() => {
    const grouped = {};
    appointments.forEach(app => {
      if (!app.phone || app.phone.trim() === '') return;
      if (!grouped[app.phone]) {
        grouped[app.phone] = { phone: app.phone, name: app.name, visits: [], barbers: {} };
      }
      grouped[app.phone].visits.push(app);
      if (app.barber) {
        grouped[app.phone].barbers[app.barber] = (grouped[app.phone].barbers[app.barber] || 0) + 1;
      }
      if (!grouped[app.phone].name && app.name) {
        grouped[app.phone].name = app.name;
      }
    });

    return Object.values(grouped).map(client => {
      let favorite = "N/A";
      let max = 0;
      for (const [barber, count] of Object.entries(client.barbers)) {
        if (count > max) { max = count; favorite = barber; }
      }
      // Sort visits descending (most recent first)
      client.visits.sort((a,b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return 0; // naive sort fallback
      });
      return { ...client, favoriteBarber: favorite, totalVisits: client.visits.length };
    }).sort((a,b) => b.totalVisits - a.totalVisits); 
  }, [appointments]);

  const SERVICE_PRICES = {
    // Basic hardcoded map for basic financial tracking
    // English
    "Signature Haircut": 45, "Classic Beard Trim": 25, "Luxury Wet Shave": 35, "Hair & Scalp Treatment": 30,
    // Russian
    "Фирменная стрижка": 45, "Классическое оформление бороды": 25, "Роскошное влажное бритье": 35, "Уход за волосами и кожей головы": 30,
    // Kazakh
    "Фирмалық шаш үлгісі": 45, "Классикалық сақал күтімі": 25, "Сәнді ылғалды қырыну": 35, "Шаш және бас терісіне күтім": 30,
  };
  const DEFAULT_PRICE = 35;

  const financials = React.useMemo(() => {
    let todayRev = 0, weekRev = 0, totalRev = 0;
    let todayCount = 0, weekCount = 0, totalCount = 0;

    const todayStr = getDayStr(new Date());
    const weekDays = getWeekDays(new Date()).map(d => getDayStr(d));

    appointments.forEach(app => {
      // Basic accounting: only count if not cancelled
      if (app.status === 'cancelled') return;
      
      const price = SERVICE_PRICES[app.service] || DEFAULT_PRICE;
      
      totalRev += price;
      totalCount += 1;

      if (app.date === todayStr) {
        todayRev += price;
        todayCount += 1;
      }
      
      if (weekDays.includes(app.date)) {
        weekRev += price;
        weekCount += 1;
      }
    });

    return { todayRev, weekRev, totalRev, todayCount, weekCount, totalCount };
  }, [appointments]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update status.");
    }
  };

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
          
          <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>Appointments</button>
            <button className={`admin-tab ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>Clients CRM</button>
          </div>

          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="container admin-content">
        {activeTab === 'appointments' && (
          <>
            <div className="financial-stats-grid fade-in">
              <div className="stat-card">
                <span className="sc-label">Today's Revenue</span>
                <strong className="sc-value">${financials.todayRev}</strong>
                <span className="sc-sub">{financials.todayCount} bookings</span>
              </div>
              <div className="stat-card">
                <span className="sc-label">This Week's Revenue</span>
                <strong className="sc-value">${financials.weekRev}</strong>
                <span className="sc-sub">{financials.weekCount} bookings</span>
              </div>
              <div className="stat-card">
                <span className="sc-label">Total Earnings</span>
                <strong className="sc-value">${financials.totalRev}</strong>
                <span className="sc-sub">{financials.totalCount} bookings</span>
              </div>
            </div>

            <div className="admin-controls-wrapper">
              <div className="admin-header-row">
                <div className="view-toggles">
                  <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List View"><List size={18} /></button>
                  <button className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`} onClick={() => setViewMode('daily')} title="Daily Calendar"><CalendarDays size={18} /></button>
                  <button className={`toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`} onClick={() => setViewMode('weekly')} title="Weekly Calendar"><CalendarRange size={18} /></button>
                </div>
                
                {viewMode !== 'list' && (
                  <div className="calendar-nav">
                    <button onClick={() => navigateDate(-1)} aria-label="Previous"><ChevronLeft size={20} /></button>
                    <div className="calendar-current-date">
                      {viewMode === 'daily' 
                        ? calendarDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                        : `${getWeekDays(calendarDate)[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${getWeekDays(calendarDate)[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                      }
                    </div>
                    <button onClick={() => navigateDate(1)} aria-label="Next"><ChevronRight size={20} /></button>
                    <button className="btn-today" onClick={() => setCalendarDate(new Date())}>Today</button>
                  </div>
                )}
              </div>
              
              <div className="admin-filters">
                <select 
                  value={filterBarber} 
                  onChange={(e) => setFilterBarber(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="">All Barbers</option>
                  {uniqueBarbers.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                
                {viewMode === 'list' && (
                  <input 
                    type="date" 
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="admin-filter-date"
                  />
                )}
                {(filterBarber || (filterDate && viewMode === 'list')) && (
                  <button className="btn-clear-filters" onClick={() => { setFilterBarber(''); setFilterDate(''); }}>Clear</button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="loading-state">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">No appointments found.</div>
            ) : (
              <>
                {viewMode === 'list' && (
                  <div className="appointments-table-container fade-in">
                    <table className="appointments-table">
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Contact</th>
                          <th>Service & Barber</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments
                          .filter(app => !filterBarber || app.barber === filterBarber)
                          .filter(app => !filterDate || app.date === filterDate)
                          .map(app => (
                          <tr key={app.id}>
                            <td>
                              <div className="client-info">
                                <strong>{app.name || "N/A"}</strong>
                              </div>
                            </td>
                            <td>
                              <div className="contact-info">
                                <span>{app.phone || "N/A"}</span>
                              </div>
                            </td>
                            <td>
                              <div className="service-info">
                                <strong>{app.service}</strong>
                                <span className="barber-name"><User size={12} /> {app.barber}</span>
                              </div>
                            </td>
                            <td>
                              <div className="datetime-info">
                                <strong><Calendar size={12} /> {app.date}</strong>
                                <span><Clock size={12} /> {app.time}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge ${app.status || 'pending'}`}>
                                {app.status || 'Pending'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                {(app.status !== 'confirmed') && (
                                  <button 
                                    className="btn-action confirm" 
                                    onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                    title="Confirm"
                                  >
                                    <Check size={16} />
                                  </button>
                                )}
                                {(app.status !== 'cancelled') && (
                                  <button 
                                    className="btn-action cancel" 
                                    onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                                    title="Cancel"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                                <button 
                                  className="btn-action delete" 
                                  onClick={() => handleDelete(app.id)}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {viewMode === 'daily' && (
                  <div className="calendar-wrapper daily-view fade-in">
                    <div className="calendar-grid-header">
                      <div className="time-col-header">Time</div>
                      <div className="day-col-header">{calendarDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                    </div>
                    <div className="calendar-grid-body">
                      {timeSlots.map(time => {
                        const dateStr = getDayStr(calendarDate);
                        const slotApps = appointments.filter(a => a.date === dateStr && a.time === time && (!filterBarber || a.barber === filterBarber));
                        return (
                          <div className="calendar-row" key={time}>
                            <div className="time-label">{time}</div>
                            <div className="day-cell">
                              {slotApps.length > 0 ? (
                                slotApps.map(app => (
                                  <div key={app.id} className={`booking-block ${app.status || 'pending'}`} onClick={() => setSelectedBooking(app)}>
                                    <strong>{app.name || "N/A"}</strong>
                                    <span>{app.service} ({app.barber})</span>
                                  </div>
                                ))
                              ) : (
                                <div className="free-slot">Available</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {viewMode === 'weekly' && (() => {
                  const weekDays = getWeekDays(calendarDate);
                  return (
                  <div className="calendar-wrapper weekly-view fade-in">
                    <div className="calendar-grid-header weekly">
                      <div className="time-col-header">Time</div>
                      {weekDays.map((d, i) => (
                        <div className="day-col-header" key={i}>
                          <span className="weekday">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                          <span className="daynum">{d.getDate()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="calendar-grid-body weekly">
                      {timeSlots.map(time => (
                        <div className="calendar-row weekly" key={time}>
                          <div className="time-label">{time}</div>
                          {weekDays.map((d, i) => {
                            const dateStr = getDayStr(d);
                            const slotApps = appointments.filter(a => a.date === dateStr && a.time === time && (!filterBarber || a.barber === filterBarber));
                            return (
                              <div className="day-cell" key={i}>
                                {slotApps.length > 0 ? (
                                  slotApps.map(app => (
                                    <div key={app.id} className={`booking-block compact ${app.status || 'pending'}`} onClick={() => setSelectedBooking(app)}>
                                      <strong>{app.name || "N/A"}</strong>
                                    </div>
                                  ))
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )})() }
              </>
            )}
          </>
        )}

        {activeTab === 'clients' && (
          <div className="clients-crm fade-in">
            <div className="admin-controls-wrapper">
              <div className="admin-controls" style={{borderBottom: 'none', paddingBottom: 0, marginBottom: 0}}>
                <h3>Client Database</h3>
                <span className="badge">{clientsData.length} Total</span>
              </div>
              <div className="admin-filters">
                <div className="search-bar">
                  <Search size={18} className="icon-search" />
                  <input 
                    type="text" 
                    placeholder="Search phone or name..." 
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="admin-search-input"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">Scanning records...</div>
            ) : clientsData.length === 0 ? (
              <div className="empty-state">No clients found.</div>
            ) : (
              <div className="appointments-table-container">
                <table className="appointments-table clients-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Phone Number</th>
                      <th>Total Visits</th>
                      <th>Favorite Barber</th>
                      <th>Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientsData
                      .filter(c => c.name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone?.includes(clientSearch))
                      .map((client, idx) => (
                      <tr key={idx} onClick={() => setSelectedClient(client)} className="client-row clickable">
                        <td><strong>{client.name || "Unknown"}</strong></td>
                        <td>{client.phone}</td>
                        <td><span className="badge">{client.totalVisits}</span></td>
                        <td><span className="barber-name"><User size={12} /> {client.favoriteBarber}</span></td>
                        <td>{client.visits[0]?.date || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content animate-fade-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details</h3>
              <button className="btn-close" onClick={() => setSelectedBooking(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-item"><strong>Client:</strong> {selectedBooking.name || "N/A"}</div>
              <div className="detail-item"><strong>Phone:</strong> {selectedBooking.phone || "N/A"}</div>
              <div className="detail-item"><strong>Barber:</strong> {selectedBooking.barber}</div>
              <div className="detail-item"><strong>Service:</strong> {selectedBooking.service}</div>
              <div className="detail-item"><strong>Date:</strong> {selectedBooking.date} at {selectedBooking.time}</div>
              <div className="detail-item">
                <strong>Status:</strong> <span className={`status-badge ${selectedBooking.status || 'pending'}`}>{selectedBooking.status || 'Pending'}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-modal cancel" 
                onClick={() => { handleUpdateStatus(selectedBooking.id, 'cancelled'); setSelectedBooking(null); }}
                disabled={selectedBooking.status === 'cancelled'}
              >
                Cancel
              </button>
              <button 
                className="btn-modal confirm" 
                onClick={() => { handleUpdateStatus(selectedBooking.id, 'confirmed'); setSelectedBooking(null); }}
                disabled={selectedBooking.status === 'confirmed'}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedClient && (
        <div className="modal-overlay" onClick={() => setSelectedClient(null)}>
          <div className="modal-content client-modal animate-fade-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Client Profile</h3>
              <button className="btn-close" onClick={() => setSelectedClient(null)}><X size={20} /></button>
            </div>
            <div className="modal-body client-body">
              <div className="client-profile-header">
                <div className="cph-avatar"><User size={30} /></div>
                <div className="cph-info">
                  <h2>{selectedClient.name || "Unknown"}</h2>
                  <p>{selectedClient.phone}</p>
                </div>
              </div>
              <div className="client-stats">
                <div className="stat-box"><span>Total Visits</span><strong>{selectedClient.totalVisits}</strong></div>
                <div className="stat-box"><span>Favorite Barber</span><strong>{selectedClient.favoriteBarber}</strong></div>
              </div>
              <h4 className="history-title">Appointment History</h4>
              <div className="client-history-list">
                {selectedClient.visits.map(v => (
                  <div key={v.id} className="history-card">
                    <div className="hc-left">
                      <strong>{v.date}</strong>
                      <span>{v.time}</span>
                    </div>
                    <div className="hc-mid">
                      <strong>{v.service}</strong>
                      <span>with {v.barber}</span>
                    </div>
                    <div className="hc-right">
                      <span className={`status-badge ${v.status || 'pending'}`}>{v.status || "Pending"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
