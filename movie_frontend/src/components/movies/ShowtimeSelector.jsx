import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import styles from './ShowtimeSelector.module.css';

const ShowtimeSelector = ({ movieId, showtimes }) => {
  const navigate = useNavigate();
  const availableDates = Object.keys(showtimes || {});
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);

  if (!showtimes || availableDates.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.noShowtimes}>No showtimes available currently.</p>
      </div>
    );
  }

  const handleTimeClick = (time) => {
    // In a real app, we'd pass date/time via context or state manager
    // For now, we'll navigate to the booking page with query params
    navigate(`/movie/${movieId}/book?date=${selectedDate}&time=${time}`);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    // Adjust for timezone issues by appending T00:00:00
    const d = new Date(dateString + 'T00:00:00');
    return d.toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Calendar size={20} className={styles.icon} />
        <h3>Select Date & Time</h3>
      </div>

      <div className={styles.dateSelector}>
        {availableDates.map(date => (
          <button
            key={date}
            className={`${styles.dateBtn} ${selectedDate === date ? styles.dateBtnActive : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            <div className={styles.month}>{formatDate(date).split(' ')[1]}</div>
            <div className={styles.day}>{formatDate(date).split(' ')[2]}</div>
            <div className={styles.weekday}>{formatDate(date).split(' ')[0]}</div>
          </button>
        ))}
      </div>

      <div className={styles.timeSelector}>
        <div className={styles.theaterGroup}>
          <h4 className={styles.theaterName}>ShowTime Multiplex</h4>
          <div className={styles.timesList}>
            {showtimes[selectedDate]?.map(time => (
              <button 
                key={time} 
                className={styles.timeBtn}
                onClick={() => handleTimeClick(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeSelector;
