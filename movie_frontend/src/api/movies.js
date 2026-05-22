const API_KEY = "018b686a98ca04f7dd7f1dbcb6b63ae6";

export const fetchMovies = async () => {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data.results;
};

export const fetchGenres = async () => {
    const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data.genres;
};

export const fetchMovieById = async (id) => {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    );
    return res.json();
};

export const fetchMovieTrailer = async (id) => {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
    );
    const data = await res.json();

    const trailer = data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    return trailer ? trailer.key : null;
};