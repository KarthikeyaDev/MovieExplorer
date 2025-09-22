

import React, { useEffect, useState } from "react";
import { getPopularMovies, filterMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import BookingModal from "../components/BookingModal";
import { useThemeContext } from "../context/ThemeContext";
import { Search } from "lucide-react";
import { useSearchToggle } from "../context/SearchToggleContext";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Home = ({ filters }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { mode } = useThemeContext();
  const darkMode = mode === "dark";
  const { showSearch } = useSearchToggle(); // 🔹 read context

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 0) {
        searchMovies(query);
      } else {
        setSearchResults([]);
        setError("");
      }
    }, 500);

    return () => clearTimeout(delay);
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
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Load popular or filtered movies
  useEffect(() => {
    if (query.trim().length > 0) return;
    const loadMovies = async () => {
      try {
        let res;
        if (Object.keys(filters).length > 0) {
          res = await filterMovies(filters, page);
        } else {
          res = await getPopularMovies(page);
        }
        setMovies(res?.data?.results || []);
      } catch (err) {
        console.error("TMDb error:", err);
      }
    };
    loadMovies();
  }, [filters, page, query]);

  const handleBook = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900"
      }`}
    >
      {/* Slide-down Search Bar */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out mb-6 ${
          showSearch ? "max-h-40" : "max-h-0"
        }`}
      >
        <div className="flex justify-center w-full">
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
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Movie Results */}
      {query.trim().length > 0 ? (
        loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Searching...</p>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No movies found for "{query}"
          </p>
        )
      ) : (
        <>
          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onBook={handleBook} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              ⬅ Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Next ➡
            </button>
          </div>
        </>
      )}

      {/* Booking Modal */}
      {selectedMovie && (
        <BookingModal
          open={open}
          onClose={() => setOpen(false)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
};

export default Home;
