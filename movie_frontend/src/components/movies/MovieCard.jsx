import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className={styles.cardLink}>
      <div className={styles.card}>

        <div className={styles.posterContainer}>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450"
            }
            alt={movie.title}
          />

          {/* ⭐ FIXED RATING */}
          <div className={styles.ratingBadge}>
            <Star size={14} fill="currentColor" />
            <span>
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>

          <div className={styles.hoverOverlay}>
            <button className="btn-primary">Book Tickets</button>

            {/* ⏱ runtime not available → dummy */}
            <span className={styles.hoverRuntime}>
              <Clock size={14} /> 2h
            </span>
          </div>
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.title} title={movie.title}>
            {movie.title}
          </h3>

          {/* 🎬 GENRE placeholder (we fix later) */}
          <div className={styles.chipsContainer}>
            <span className={styles.chip}>Movie</span>
          </div>

          {/* 🌐 LANGUAGE FIX */}
          <div className={styles.languageContainer}>
            <span className={styles.language}>
              {movie.original_language?.toUpperCase() || "EN"}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default MovieCard;