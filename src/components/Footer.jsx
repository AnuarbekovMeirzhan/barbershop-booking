import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scissors, Instagram, Twitter, Facebook } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <a href="#" className="logo">
            <Scissors size={28} color="var(--accent-gold)" />
            <span className="logo-text">LUXE</span>
          </a>
          <p className="footer-bio">{t('footer.bio')}</p>
          <div className="social-links">
            <a href="#"><Instagram /></a>
            <a href="#"><Twitter /></a>
            <a href="#"><Facebook /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>{t('footer.explore')}</h4>
          <ul>
            <li><a href="#hero">{t('footer.home')}</a></li>
            <li><a href="#services">{t('nav.services')}</a></li>
            <li><a href="#barbers">{t('nav.barbers')}</a></li>
            <li><a href="#booking">{t('nav.book')}</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>{t('footer.contact')}</h4>
          <p>123 Luxury Ave, NY 10001</p>
          <p>hello@luxebarbers.com</p>
          <p>+1 (555) 123-4567</p>
          <br />
          <p>Mon - Fri: 9am - 8pm</p>
          <p>Sat - Sun: 10am - 6pm</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
