import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieById, fetchMovieTrailer } from "../api/movies";

const dates = ["Today", "Tomorrow", "Fri", "Sat"];
const times = ["10:00 AM", "01:30 PM", "04:45 PM", "07:30 PM"];

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    fetchMovieById(id).then(setMovie);
    fetchMovieTrailer(id).then(setTrailerKey);
  }, [id]);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Select date & time first");
      return;
    }

    navigate(`/movie/${id}/book`, {
      state: {
        movie,
        date: selectedDate,
        time: selectedTime,
      },
    });
  };

  if (!movie) return <h2 style={{ color: "white" }}>Loading...</h2>;

  return (
    <div style={{ background:"#0a0a0a", color:"white", padding:"30px" }}>

      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>

      {/* 🎬 TRAILER */}
      {trailerKey && (
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title="Trailer"
          allowFullScreen
          style={{ marginTop:"20px" }}
        />
      )}

      {/* 📅 DATES */}
      <h2 style={{ marginTop:"30px" }}>Select Date</h2>
      <div style={{ display:"flex", gap:"10px" }}>
        {dates.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            style={{
              padding:"10px",
              background: selectedDate === d ? "red" : "#222",
              color:"white"
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* ⏰ TIMES */}
      {selectedDate && (
        <>
          <h2 style={{ marginTop:"20px" }}>Select Time</h2>
          <div style={{ display:"flex", gap:"10px" }}>
            {times.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                style={{
                  padding:"10px",
                  background: selectedTime === t ? "green" : "#333",
                  color:"white"
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 🎟 BUTTON */}
      {selectedTime && (
        <button
          onClick={handleBooking}
          style={{
            marginTop:"20px",
            padding:"12px",
            background:"red",
            color:"white"
          }}
        >
          Select Seats
        </button>
      )}
    </div>
  );
};

export default MovieDetail;