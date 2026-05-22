import React, { useEffect, useState } from "react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/bookings/my_bookings/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []));
  }, []);

  return (
    <div style={{ color:"white", padding:"20px" }}>
      <h2>My Bookings</h2>

      {bookings.map((b, i) => (
        <div key={i} style={{
          background:"#222",
          padding:"15px",
          marginBottom:"10px",
          borderRadius:"10px"
        }}>
          <h3>{b.movie}</h3>
          <p>Seats: {b.seats}</p>
          <p>Time: {b.time}</p>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;