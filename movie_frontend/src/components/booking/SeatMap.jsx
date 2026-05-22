import React from 'react';
import styles from './SeatMap.module.css';

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 14;

// Mock function to generate layout with some pre-booked/locked seats
const generateSeatLayout = () => {
  const layout = [];
  SEAT_ROWS.forEach((row, rowIndex) => {
    const rowSeats = [];
    for (let i = 1; i <= SEATS_PER_ROW; i++) {
      // Create an aisle in the middle
      if (i === 8) {
        rowSeats.push({ id: `${row}-aisle`, isAisle: true });
      }
      
      const seatId = `${row}${i}`;
      // Randomly assign statuses for demonstration
      let status = 'available';
      const rand = Math.random();
      
      if (rowIndex > 5 && rand > 0.8) status = 'booked';
      else if (rowIndex === 2 && i > 3 && i < 7) status = 'locked';
      else if (rand > 0.9) status = 'booked';

      const price = rowIndex < 3 ? 150 : rowIndex < 6 ? 200 : 250; // Dynamic pricing by row

      rowSeats.push({
        id: seatId,
        row,
        number: i,
        status,
        price,
        isAisle: false
      });
    }
    layout.push(rowSeats);
  });
  return layout;
};

const SeatMap = ({ selectedSeats, onSeatClick }) => {
  // Use useMemo in real app, but here we just generate once on mount
  const [layout] = React.useState(generateSeatLayout());

  return (
    <div className={styles.seatMapContainer}>
      <div className={styles.screen}>
        <div className={styles.screenCurve}></div>
        <span className={styles.screenText}>All eyes this way</span>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.seatSample} ${styles.available}`}></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seatSample} ${styles.selected}`}></div>
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seatSample} ${styles.locked}`}></div>
          <span>Locked</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seatSample} ${styles.booked}`}></div>
          <span>Booked</span>
        </div>
      </div>

      <div className={styles.seatsGrid}>
        {layout.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.row}>
            <span className={styles.rowLabel}>{SEAT_ROWS[rowIndex]}</span>
            <div className={styles.rowSeats}>
              {row.map(seat => {
                if (seat.isAisle) {
                  return <div key={seat.id} className={styles.aisle}></div>;
                }

                const isSelected = selectedSeats.some(s => s.id === seat.id);
                let seatClass = styles.available;
                
                if (seat.status === 'booked') seatClass = styles.booked;
                else if (seat.status === 'locked') seatClass = styles.locked;
                else if (isSelected) seatClass = styles.selected;

                return (
                  <button
                    key={seat.id}
                    className={`${styles.seat} ${seatClass}`}
                    onClick={() => onSeatClick(seat)}
                    disabled={seat.status === 'booked' || seat.status === 'locked'}
                    title={`${seat.id} - ₹${seat.price}`}
                  >
                    <span className={styles.seatNumber}>{seat.number}</span>
                  </button>
                );
              })}
            </div>
            <span className={styles.rowLabel}>{SEAT_ROWS[rowIndex]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
