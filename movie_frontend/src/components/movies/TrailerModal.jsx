import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import styles from './TrailerModal.module.css';

const TrailerModal = ({ isOpen, onClose, trailerUrl }) => {
  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Validate YouTube embed URL format
      const isValid = trailerUrl && trailerUrl.includes('youtube.com/embed/');
      setIsValidUrl(isValid);
    }
  }, [isOpen, trailerUrl]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className={styles.videoContainer}>
          {!isValidUrl ? (
            <div className={styles.errorState}>
              <AlertCircle size={48} className={styles.errorIcon} />
              <h3>Trailer Unavailable</h3>
              <p>The trailer for this movie is currently unavailable or has been removed.</p>
            </div>
          ) : (
            <iframe
              className={styles.iframe}
              src={`${trailerUrl}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-presentation"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
