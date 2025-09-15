

import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

//  Popular movies with pagination
export const getPopularMovies = (page = 1) =>
  tmdb.get("/movie/popular", { params: { page } });

//  Search movies with pagination
export const searchMovies = (query, page = 1) =>
  tmdb.get("/search/movie", { params: { query, page } });

//  Genres
export const getGenres = () => tmdb.get("/genre/movie/list");

//  Languages
export const getLanguages = () => tmdb.get("/configuration/languages");

//  Filter movies with pagination
export const filterMovies = (filters, page = 1) =>
  tmdb.get("/discover/movie", {
    params: {
      page,
      with_genres: filters.genre || "",
      with_original_language: filters.language || "",
      "vote_average.gte": filters.rating || 0,
      sort_by: filters.sort || "popularity.desc",
    },
  });

//  Fetch trailers for a movie
export const getMovieTrailer = async (movieId) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/videos`);
    const trailers = res.data.results.filter(
      (vid) => vid.site === "YouTube" && vid.type === "Trailer"
    );
    return trailers.length > 0 ? trailers[0].key : null; // first trailer key
  } catch (error) {
    console.error("Error fetching trailer:", error);
    return null;
  }
};

//  Fetch cast for a movie
export const getMovieCast = async (movieId) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/credits`);
    return res.data.cast.slice(0, 5); // top 5 actors
  } catch (error) {
    console.error("Error fetching cast:", error);
    return [];
  }
};
