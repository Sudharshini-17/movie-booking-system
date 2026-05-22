import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <h2>No booking</h2>;

  const { movie, seats, total, date, time, bookingId } = state;

  return (
    <div style={{ background:"#111", color:"white", padding:"40px", textAlign:"center" }}>
      <h1>🎟 Booking Confirmed</h1>

      <div style={{ marginTop:"20px", padding:"20px", border:"2px dashed gray" }}>
        <h2>{movie.title}</h2>
        <p>{date} | {time}</p>

        <h3>Seats: {seats.join(", ")}</h3>
        <h3>₹{total}</h3>

        <p>Booking ID: {bookingId}</p>
      </div>

      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
};

export default BookingConfirmation;