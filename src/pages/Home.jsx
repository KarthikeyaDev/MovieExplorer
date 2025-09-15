
import React, { useEffect, useState } from "react";
import { getPopularMovies, filterMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import BookingModal from "../components/BookingModal";
import { useThemeContext } from "../context/ThemeContext";

const Home = ({ filters }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { mode } = useThemeContext();

  const darkMode = mode === "dark";

  useEffect(() => {
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
  }, [filters, page]);

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
