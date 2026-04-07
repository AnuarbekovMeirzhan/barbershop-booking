import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Barbers from './components/Barbers';
import Booking from './components/Booking';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import BarberDashboard from './components/BarberDashboard';

function App() {
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') setCurrentView('admin');
      else if (window.location.hash === '#barber') setCurrentView('barber');
      else setCurrentView('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentView === 'admin') {
    return <AdminDashboard onBack={() => window.location.hash = ''} />;
  }

  if (currentView === 'barber') {
    return <BarberDashboard onBack={() => window.location.hash = ''} />;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Barbers />
      <Booking />
      <Footer />
    </>
  );
}

export default App;
