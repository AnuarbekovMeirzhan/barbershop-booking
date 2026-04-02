import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#" className="logo">
          <Scissors size={28} color="var(--accent-gold)" />
          <span className="logo-text">LUXE</span>
        </a>
        
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li><a href="#services" onClick={() => setIsOpen(false)}>{t('nav.services')}</a></li>
          <li><a href="#barbers" onClick={() => setIsOpen(false)}>{t('nav.barbers')}</a></li>
          <li><a href="#booking" className="nav-btn" onClick={() => setIsOpen(false)}>{t('nav.book')}</a></li>
          
          <li className="lang-switcher">
             <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active-lang' : ''}>EN</button>
             <span className="lang-sep">|</span>
             <button onClick={() => changeLanguage('ru')} className={i18n.language === 'ru' ? 'active-lang' : ''}>RU</button>
             <span className="lang-sep">|</span>
             <button onClick={() => changeLanguage('kk')} className={i18n.language === 'kk' ? 'active-lang' : ''}>KK</button>
          </li>
        </ul>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
