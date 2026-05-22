import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HeroCarousel.module.css';

const heroMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    backdrop: "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec8Oobm9B5P.jpg",
    genres: ["Sci-Fi", "Adventure"],
    desc: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family."
  },
  {
    id: 6,
    title: "Oppenheimer",
    backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    genres: ["Drama", "History"],
    desc: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb."
  },
  {
    id: 8,
    title: "Furiosa: A Mad Max Saga",
    backdrop: "https://image.tmdb.org/t/p/original/t6HIqrNDIGGLt38DqOepqL98Hh.jpg",
    genres: ["Action", "Sci-Fi"],
    desc: "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde."
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);

  return (
    <div className={styles.carouselContainer}>
      {heroMovies.map((movie, index) => (
        <div 
          key={movie.id}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <div className={styles.imageWrapper}>
            <img 
              src={movie.backdrop} 
              alt={movie.title} 
              className={styles.backdrop}
            />
            <div className={styles.gradientOverlay}></div>
          </div>
          
          <div className={`container ${styles.content}`}>
            <div className={styles.chips}>
              {movie.genres.map(g => <span key={g} className={styles.chip}>{g}</span>)}
            </div>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.description}>{movie.desc}</p>
            <div className={styles.actions}>
              <button className={`btn-primary ${styles.playBtn}`}>
                <Play size={20} fill="currentColor" /> Book Now
              </button>
              <button className={styles.infoBtn}>
                <Info size={20} /> More Info
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <div className={styles.controls}>
        <button onClick={prevSlide} className={styles.controlBtn}><ChevronLeft size={24} /></button>
        <button onClick={nextSlide} className={styles.controlBtn}><ChevronRight size={24} /></button>
      </div>
      
      <div className={styles.indicators}>
        {heroMovies.map((_, i) => (
          <button 
            key={i} 
            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
