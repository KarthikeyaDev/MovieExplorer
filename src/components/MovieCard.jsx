
import React, { useState } from "react";
import { Star, Calendar } from "lucide-react";
import MovieModal from "./MovieModal";

const MovieCard = ({ movie, onBook }) => {
  const [open, setOpen] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
      >
        
        <div className="overflow-hidden relative">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-72 object-cover transition-transform duration-500 hover:scale-110"
          />

          
          <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md">
            {releaseDate}
          </span>
        </div>

        
        <div className="p-3 flex flex-col flex-grow">
          
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
            {movie.title}
          </h3>

          
          <div className="flex items-center justify-between mt-3 text-gray-600 dark:text-gray-300 text-sm">
           
            <div className="flex items-center">
              <Star className="text-yellow-500 w-4 h-4 mr-1" />
              <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
            </div>

            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{movie.release_date ? releaseDate : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      
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
