import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Ticket, AlertCircle } from 'lucide-react';
import styles from './OrderSummary.module.css';

const OrderSummary = ({ movie, selectedSeats, date, time }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  // Calculate totals
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const convenienceFee = selectedSeats.length * 30; // 30 per ticket
  const total = subtotal + convenienceFee;

  // Countdown timer logic
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setTimeLeft(120);
      setIsExpired(false);
      return;
    }

    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [selectedSeats.length, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProceed = () => {
    if (isExpired) return;
    // Simulate lock API success and navigate to checkout
    navigate('/checkout', { 
      state: { movie, selectedSeats, date, time, total, convenienceFee, subtotal } 
    });
  };

  if (!movie) return null;

  return (
    <div className={styles.summaryPanel}>
      <h3 className={styles.title}>Booking Summary</h3>
      
      <div className={styles.movieInfo}>
        <img src={movie.posterUrl} alt={movie.title} className={styles.poster} />
        <div>
          <h4 className={styles.movieTitle}>{movie.title}</h4>
          <p className={styles.movieDetails}>{movie.languages[0]} • 2D</p>
          <div className={styles.dateTime}>
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 ? (
        <>
          <div className={styles.seatsList}>
            <div className={styles.seatsHeader}>
              <span>{selectedSeats.length} Ticket(s)</span>
              <span className={styles.seatsNames}>
                {selectedSeats.map(s => s.id).join(', ')}
              </span>
            </div>
            
            <div className={styles.priceRow}>
              <span>Tickets Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Convenience Fee</span>
              <span>₹{convenienceFee}</span>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span>Amount Payable</span>
            <span>₹{total}</span>
          </div>

          {/* Timer */}
          <div className={`${styles.timerBox} ${timeLeft < 30 ? styles.timerWarning : ''}`}>
            {isExpired ? (
              <>
                <AlertCircle size={18} />
                <span>Session expired. Please select seats again.</span>
              </>
            ) : (
              <>
                <Clock size={18} />
                <span>Seats reserved for {formatTime(timeLeft)}</span>
              </>
            )}
          </div>

          <button 
            className={`btn-primary ${styles.proceedBtn}`}
            onClick={handleProceed}
            disabled={isExpired}
          >
            {isExpired ? 'Session Expired' : 'Proceed to Payment'}
          </button>
        </>
      ) : (
        <div className={styles.emptyState}>
          <Ticket size={48} className={styles.emptyIcon} />
          <p>Please select your seats to continue</p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
