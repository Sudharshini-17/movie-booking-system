import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/popular?api_key=018b686a98ca04f7dd7f1dbcb6b63ae6")
      .then(res => res.json())
      .then(data => setMovies(data.results || []));
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", color: "white" }}>

      <h1 style={{ textAlign: "center" }}>🎬 Movies</h1>

      {/* SEARCH */}
      <input
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "none"
        }}
      />

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px"
        }}
      >
        {filteredMovies.map(movie => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{
              cursor: "pointer",
              transition: "0.3s"
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              style={{
                width: "100%",
                borderRadius: "10px"
              }}
            />
            <p style={{ textAlign: "center" }}>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;