
import React, { useEffect, useState } from "react";
import { getPopularMovies, filterMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import BookingModal from "../components/BookingModal";
import FilterBar from "../components/FilterBar";
import { useThemeContext } from "../context/ThemeContext";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  useEffect(() => {
    const load = async () => {
      try {
        if (Object.keys(filters).length > 0) {
          const res = await filterMovies(filters, page);
          setMovies(res.data.results || []);
        } else {
          const res = await getPopularMovies(page);
          setMovies(res.data.results || []);
        }
      } catch (err) {
        console.error("TMDb error:", err);
      }
    };
    load();
  }, [page, filters]);

  const handleBook = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleFilterChange = (filter) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [filter.type]: filter.value }));
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900"
      } p-4`}
    >
      <h1 className="text-3xl font-bold text-center mb-6">🎬 Movie Explorer</h1>

      {/* Filters */}
      <div className="flex justify-center mb-6">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} onBook={handleBook} />
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
        <BookingModal open={open} onClose={() => setOpen(false)} movie={selectedMovie} />
      )}
    </div>
  );
};

export default Home;

