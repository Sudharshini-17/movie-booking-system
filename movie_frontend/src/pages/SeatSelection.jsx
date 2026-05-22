import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SeatSelection = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { movie, date, time } = state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [timer, setTimer] = useState(120);

  const rows = ["A","B","C","D","E","F","G","H"];
  const cols = Array.from({ length: 12 }, (_, i) => i + 1);

  // ✅ FETCH SEATS
  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("https://movie-booking-system-jzt2.onrender.com/api/bookings/available_seats/?show=1", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const allSeats = rows.flatMap(r => cols.map(c => `${r}${c}`));
        const available = data.available_seats || [];
        const booked = allSeats.filter(s => !available.includes(s));
        setBookedSeats(booked);
      })
      .catch(() => setBookedSeats([]));
  }, []);

  // ⏳ TIMER
  useEffect(() => {
    if (selectedSeats.length === 0) return;

    if (timer === 0) {
      alert("Time expired");
      setSelectedSeats([]);
      setTimer(120);
      return;
    }

    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, selectedSeats]);

  const formatTime = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getSeatType = (row) => {
    if (["A","B"].includes(row)) return "vip";
    if (["C","D","E"].includes(row)) return "premium";
    return "regular";
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seat)) return prev.filter(s => s !== seat);
      return [...prev, seat];
    });
  };

  const total = selectedSeats.length * 250;

  if (!movie) return <h2 style={{ color:"white" }}>No movie selected</h2>;

  return (
    <div style={{ padding: "20px", color: "white", textAlign: "center" }}>

      <h2>{movie.title}</h2>
      <p>{date} | {time}</p>

      {selectedSeats.length > 0 && (
        <p style={{ color: "yellow" }}>
          ⏱ {formatTime()}
        </p>
      )}

      <div style={{
        margin: "20px auto",
        background: "#333",
        padding: "10px",
        width: "80%",
        borderRadius: "8px"
      }}>
        SCREEN
      </div>

      {/* SEATS */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {rows.map(row => (
          <div key={row} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
            {cols.map(col => {
              const seat = `${row}${col}`;
              const type = getSeatType(row);

              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  style={{
                    width: "28px",
                    height: "28px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: bookedSeats.includes(seat) ? "not-allowed" : "pointer",
                    background: selectedSeats.includes(seat)
                      ? "#22c55e"
                      : bookedSeats.includes(seat)
                      ? "#555"
                      : type === "vip"
                      ? "#8b5cf6"
                      : type === "premium"
                      ? "#f59e0b"
                      : "#444",
                    color: "white"
                  }}
                >
                  {col}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "15px" }}>
        🟪 VIP | 🟧 Premium | ⬜ Regular | ⬛ Booked | 🟩 Selected
      </div>

      <h3>Seats: {selectedSeats.join(", ") || "None"}</h3>
      <h3>Total: ₹{total}</h3>

      {selectedSeats.length > 0 && (
        <button
          onClick={() =>
            navigate("/checkout", {
              state: { movie, seats: selectedSeats, total, date, time }
            })
          }
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "red",
            border: "none",
            borderRadius: "8px",
            color: "white"
          }}
        >
          Proceed to Payment
        </button>
      )}
    </div>
  );
};

export default SeatSelection;