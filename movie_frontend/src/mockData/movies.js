export const mockMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjc9CW.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec8Oobm9B5P.jpg",
    rating: 8.8,
    genres: ["Sci-Fi", "Adventure", "Action"],
    languages: ["English", "Hindi"],
    runtime: "166m",
    releaseDate: "2024-02-28",
    popularity: 2500,
    trailerUrl: "https://www.youtube.com/embed/U2Qp5pL3ovA",
    synopsis: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", image: "https://image.tmdb.org/t/p/w138_and_h175_face/6hPFQ5R0Bf961mP5Qh00x12L1mZ.jpg" },
      { name: "Zendaya", role: "Chani", image: "https://image.tmdb.org/t/p/w138_and_h175_face/jG4rE2fS2pQkQ9t7zEwtA0q1aB3.jpg" },
      { name: "Rebecca Ferguson", role: "Lady Jessica", image: "https://image.tmdb.org/t/p/w138_and_h175_face/lJloTOheuQSirDPkxGakVWCE0yA.jpg" }
    ],
    showtimes: {
      "2024-05-20": ["10:30 AM", "01:15 PM", "04:45 PM", "08:30 PM", "11:00 PM"],
      "2024-05-21": ["11:00 AM", "02:30 PM", "06:00 PM", "09:45 PM"],
      "2024-05-22": ["09:15 AM", "12:45 PM", "05:30 PM", "08:15 PM"]
    }
  },
  {
    id: 2,
    title: "Godzilla x Kong: The New Empire",
    posterUrl: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLvLuPEIQfGALcd.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/qrGtVF7dXzJQvXLnCu1639wA8m.jpg",
    rating: 7.2,
    genres: ["Action", "Sci-Fi"],
    languages: ["English", "Tamil", "Telugu"],
    runtime: "115m",
    releaseDate: "2024-03-27",
    popularity: 1800,
    trailerUrl: "invalid-url",
    synopsis: "Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world, challenging their very existence – and our own.",
    cast: [
      { name: "Rebecca Hall", role: "Ilene Andrews", image: "https://image.tmdb.org/t/p/w138_and_h175_face/A8vVv4N3PjN52ZlSssZ3HntBIf.jpg" },
      { name: "Brian Tyree Henry", role: "Bernie Hayes", image: "https://image.tmdb.org/t/p/w138_and_h175_face/qV1aL46nB4lXjE0Vd4R4f2F7wA1.jpg" }
    ],
    showtimes: {
      "2024-05-20": ["10:00 AM", "02:00 PM", "07:30 PM"]
    }
  },
  {
    id: 3,
    title: "Kung Fu Panda 4",
    posterUrl: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    rating: 6.9,
    genres: ["Animation", "Family", "Comedy"],
    languages: ["English", "Hindi"],
    runtime: "94m",
    releaseDate: "2024-03-02",
    popularity: 1500
  },
  {
    id: 4,
    title: "Civil War",
    posterUrl: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    rating: 7.5,
    genres: ["Action", "Thriller"],
    languages: ["English"],
    runtime: "109m",
    releaseDate: "2024-04-10",
    popularity: 1200
  },
  {
    id: 5,
    title: "Ghostbusters: Frozen Empire",
    posterUrl: "https://image.tmdb.org/t/p/w500/rKjruYd9mO7I6iQ07u4ZlE9O5QZ.jpg",
    rating: 6.5,
    genres: ["Fantasy", "Comedy"],
    languages: ["English", "Hindi", "Tamil"],
    runtime: "115m",
    releaseDate: "2024-03-20",
    popularity: 900
  },
  {
    id: 6,
    title: "Oppenheimer",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: 8.9,
    genres: ["Drama", "History"],
    languages: ["English", "Hindi"],
    runtime: "180m",
    releaseDate: "2023-07-19",
    popularity: 2000
  },
  {
    id: 7,
    title: "The Fall Guy",
    posterUrl: "https://image.tmdb.org/t/p/w500/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    rating: 7.4,
    genres: ["Action", "Comedy"],
    languages: ["English"],
    runtime: "126m",
    releaseDate: "2024-04-24",
    popularity: 1100
  },
  {
    id: 8,
    title: "Furiosa: A Mad Max Saga",
    posterUrl: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    rating: 7.9,
    genres: ["Action", "Adventure", "Sci-Fi"],
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    runtime: "148m",
    releaseDate: "2024-05-22",
    popularity: 2800
  }
];

export const mockGenres = [
  { name: "Action", count: 42 },
  { name: "Adventure", count: 28 },
  { name: "Sci-Fi", count: 19 },
  { name: "Animation", count: 12 },
  { name: "Comedy", count: 35 },
  { name: "Drama", count: 45 },
  { name: "Thriller", count: 24 },
  { name: "Family", count: 15 },
  { name: "History", count: 8 },
  { name: "Fantasy", count: 14 }
];

export const mockLanguages = [
  { name: "English", count: 85 },
  { name: "Hindi", count: 40 },
  { name: "Tamil", count: 22 },
  { name: "Telugu", count: 18 },
  { name: "Malayalam", count: 15 },
  { name: "Kannada", count: 10 }
];
