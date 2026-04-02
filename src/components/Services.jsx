import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scissors, Menu, Droplets, SprayCan } from 'lucide-react';
import './Services.css';

const Services = () => {
  const { t } = useTranslation();

  const servicesList = [
    {
      icon: <Scissors size={32} />,
      title: t('services.s1_title'),
      desc: t('services.s1_desc'),
      price: "$45",
    },
    {
      icon: <Menu size={32} />, 
      title: t('services.s2_title'),
      desc: t('services.s2_desc'),
      price: "$30",
    },
    {
      icon: <Droplets size={32} />,
      title: t('services.s3_title'),
      desc: t('services.s3_desc'),
      price: "$55",
    },
    {
      icon: <SprayCan size={32} />,
      title: t('services.s4_title'),
      desc: t('services.s4_desc'),
      price: "$25",
    }
  ];

  return (
    <section className="section services-section" id="services">
      <div className="container">
        <h2 className="section-title animate-fade-up">{t('services.title')}</h2>
        <p className="section-subtitle animate-fade-up delay-1">{t('services.subtitle')}</p>
        
        <div className="services-grid">
          {servicesList.map((srv, idx) => (
            <div className={`service-card animate-fade-up delay-${(idx % 3) + 1}`} key={idx}>
              <div className="service-icon">{srv.icon}</div>
              <div className="service-info">
                <h3 className="service-title">{srv.title}</h3>
                <p className="service-desc">{srv.desc}</p>
              </div>
              <div className="service-price">{srv.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
