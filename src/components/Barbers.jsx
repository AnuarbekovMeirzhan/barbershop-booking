import React from 'react';
import { useTranslation } from 'react-i18next';
import './Barbers.css';

const Barbers = () => {
  const { t } = useTranslation();

  const barbersList = [
    {
      name: t('barbers.b1_name'),
      role: t('barbers.b1_role'),
      image: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: t('barbers.b2_name'),
      role: t('barbers.b2_role'),
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: t('barbers.b3_name'),
      role: t('barbers.b3_role'),
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section className="section barbers-section" id="barbers">
      <div className="container">
        <h2 className="section-title animate-fade-up">{t('barbers.title')}</h2>
        <p className="section-subtitle animate-fade-up delay-1">{t('barbers.subtitle')}</p>
        
        <div className="barbers-grid">
          {barbersList.map((barber, idx) => (
            <div className={`barber-card animate-fade-up delay-${idx+1}`} key={idx}>
              <div className="barber-image-wrap">
                <img src={barber.image} alt={barber.name} className="barber-image" />
                <div className="barber-overlay">
                  <button className="btn-outline book-barber-btn">{t('barbers.book')} {barber.name.split(' ')[0]}</button>
                </div>
              </div>
              <div className="barber-info">
                <h3 className="barber-name">{barber.name}</h3>
                <p className="barber-role">{barber.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Barbers;
