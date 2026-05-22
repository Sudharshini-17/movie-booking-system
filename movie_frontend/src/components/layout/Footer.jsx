import React from 'react';
import styles from './Footer.module.css';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.brandSection}>
          <h2 className={styles.logo}>
            Show<span className={styles.accent}>Time</span>
          </h2>
          <p className={styles.tagline}>
            Your ultimate destination for movie tickets and entertainment. Experience the magic of cinema.
          </p>
          <div className={styles.socials}>
            <button className={styles.socialBtn}><Facebook size={20} /></button>
            <button className={styles.socialBtn}><Twitter size={20} /></button>
            <button className={styles.socialBtn}><Instagram size={20} /></button>
            <button className={styles.socialBtn}><Youtube size={20} /></button>
          </div>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Movies</h3>
            <a href="#" className={styles.link}>Now Showing</a>
            <a href="#" className={styles.link}>Coming Soon</a>
            <a href="#" className={styles.link}>Exclusive</a>
            <a href="#" className={styles.link}>Cinemas</a>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Support</h3>
            <a href="#" className={styles.link}>Help Center</a>
            <a href="#" className={styles.link}>Terms of Service</a>
            <a href="#" className={styles.link}>Privacy Policy</a>
            <a href="#" className={styles.link}>Contact Us</a>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomContent}`}>
          <p>&copy; {new Date().getFullYear()} ShowTime. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
