
import React, { useState } from "react";
import { Star } from "lucide-react";
import MovieModal from "./MovieModal";

const MovieCard = ({ movie, onBook }) => {
  const [open, setOpen] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
      >
        {/* Poster */}
        <div className="overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-72 object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
            <Star className="text-yellow-500 w-4 h-4 mr-1" />
            <span className="text-sm">{movie.vote_average}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <MovieModal
          movie={movie}
          onClose={() => setOpen(false)}
          onBook={onBook}
        />
      )}
    </>
  );
};

export default MovieCard;