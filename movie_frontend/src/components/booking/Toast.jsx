import React, { useEffect } from 'react';
import { Mail, X } from 'lucide-react';
import styles from './Toast.module.css';

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast}>
        <div className={styles.iconWrapper}>
          <Mail size={20} />
        </div>
        <div className={styles.content}>
          <h4>Email Sent!</h4>
          <p>{message}</p>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
