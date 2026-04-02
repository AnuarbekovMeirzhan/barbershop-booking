import React from 'react';
import { useTranslation } from 'react-i18next';
import './Hero.css';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="hero" id="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content animate-fade-up">
        <h2 className="hero-subtitle">{t('hero.subtitle')}</h2>
        <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t('hero.title') }}></h1>
        <p className="hero-description">
          {t('hero.desc')}
        </p>
        <div className="hero-actions">
          <a href="#booking" className="btn-primary">{t('hero.book_btn')}</a>
          <a href="#services" className="btn-outline">{t('hero.services_btn')}</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
