import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ color: "white", padding: "40px" }}>
        <h2>No booking data</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const { movie, seats, total, date, time } = state;

  const handlePayment = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Login required");
      navigate("/login");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay not loaded. Refresh page.");
      return;
    }

    try {
      const seatCheckRes = await fetch(
        "http://127.0.0.1:8000/api/bookings/available_seats/?show=1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const seatData = await seatCheckRes.json();

      const allAvailable = seats.every((s) =>
        seatData.available_seats.includes(s)
      );

      if (!allAvailable) {
        alert("Seats already booked");
        navigate(-1);
        return;
      }

      const rzp = new window.Razorpay({
        key: "rzp_test_Ss2Y1FJK96tl1H",
        amount: total * 100,
        currency: "INR",
        name: "ShowTime",
        description: movie.title,

        handler: async function (response) {
          const res = await fetch("http://127.0.0.1:8000/api/bookings/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              show: 1,
              seats: seats.join(","),
              payment_id: response.razorpay_payment_id,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.error || "Booking failed");
            return;
          }

          navigate(`/booking/${data.id}`, {
            state: {
              movie,
              seats,
              total,
              date,
              time,
              bookingId: data.id,
            },
          });
        },
      });

      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Error occurred");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h2>Checkout</h2>

      <h3>{movie.title}</h3>
      <p>{date} | {time}</p>

      <p>Seats: {seats.join(", ")}</p>
      <h2>₹ {total}</h2>

      <button
        onClick={handlePayment}
        style={{
          marginTop: "20px",
          padding: "14px",
          width: "100%",
          background: "green",
          border: "none",
          borderRadius: "8px",
          color: "white",
          fontSize: "18px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;