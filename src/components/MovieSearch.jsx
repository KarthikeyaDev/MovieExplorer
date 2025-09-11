
// import React, { useState } from "react";
// import MovieCard from "./MovieCard";
// import BookingModal from "./BookingModal";
// import { useThemeContext } from "../context/ThemeContext"; 

// const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// function MovieSearch() {
//   const [query, setQuery] = useState("");
//   const [movies, setMovies] = useState([]);
//   const [error, setError] = useState("");
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { mode } = useThemeContext();
// const darkMode = mode === "dark";


//   const searchMovies = async (e) => {
//     e.preventDefault();
//     if (!query) return;

//     if (!API_KEY) {
//       setError("TMDb API key is missing!");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
//       );

//       if (!res.ok) throw new Error("Failed to fetch movies");

//       const data = await res.json();
//       setMovies(data.results || []);
//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//       setMovies([]);
//     }
//   };

//   const handleBook = (movie) => {
//     setSelectedMovie(movie);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
//       <h1 className="text-2xl font-bold text-center mb-6">🔎 Search Movies</h1>

//       {/* Search Bar */}
//       <form onSubmit={searchMovies} className="flex justify-center mb-6">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search for a movie..."
//           className="w-2/3 md:w-1/3 px-4 py-2 border rounded-l-lg focus:outline-none dark:bg-gray-800 dark:border-gray-700"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition"
//         >
//           Search
//         </button>
//       </form>

//       {/* Error Message */}
//       {error && <p className="text-center text-red-500 mb-4">{error}</p>}

//       {/* Movie Results */}
//       {movies.length > 0 ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//           {movies.map((movie) => (
//             <MovieCard key={movie.id} movie={movie} onBook={handleBook} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500 dark:text-gray-400">No movies found. Try searching!</p>
//       )}

//       {/* Booking Modal */}
//       {selectedMovie && (
//         <BookingModal
//           open={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           movie={selectedMovie}
//         />
//       )}
//     </div>
//   );
// }

// export default MovieSearch;

import React, { useState } from "react";
import MovieCard from "./MovieCard";
import BookingModal from "./BookingModal";
import { useThemeContext } from "../context/ThemeContext";
import { Search } from "lucide-react"; // search icon

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!query) return;

    if (!API_KEY) {
      setError("TMDb API key is missing!");
      return;
    }

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );

      if (!res.ok) throw new Error("Failed to fetch movies");

      const data = await res.json();
      setMovies(data.results || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setMovies([]);
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
      <form
        onSubmit={searchMovies}
        className="flex justify-center mb-8 w-full"
      >
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
        <button
          type="submit"
          className="ml-3 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl 
                     shadow-md hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Movie Results */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onBook={handleBook} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No movies found. Try searching!
        </p>
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
