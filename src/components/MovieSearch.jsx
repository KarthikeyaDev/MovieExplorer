import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import BookingModal from "./BookingModal";
import { useThemeContext } from "../context/ThemeContext";
import { Search } from "lucide-react";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  //  Debounced Search Effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 0) {
        searchMovies(query);
      } else {
        setMovies([]); // Clear results if query empty
      }
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchMovies = async (searchTerm) => {
    if (!API_KEY) {
      setError("TMDb API key is missing!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          searchTerm
        )}`
      );

      if (!res.ok) throw new Error("Failed to fetch movies");

      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-extrabold text-center mb-8 tracking-wide">
        🎬 Find Your Favorite Movies
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8 w-full">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 
                       focus:ring-indigo-500 text-gray-900 dark:text-white 
                       bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Movie Results */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Searching...</p>
      ) : query.trim() === "" ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Start typing to search movies 🎥</p>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onBook={handleBook} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No movies found for "{query}"</p>
      )}

      {/* Booking Modal */}
      {selectedMovie && (
        <BookingModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}

export default MovieSearch;

