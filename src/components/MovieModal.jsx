import React, { useEffect, useState } from "react";
import { X, Ticket } from "lucide-react";
import { getMovieCast, getMovieTrailer } from "../api/tmdb";
import BookingModal from "./BookingModal";

const MovieModal = ({ movie, onClose }) => {
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      const c = await getMovieCast(movie.id);
      const t = await getMovieTrailer(movie.id);
      setCast(c);
      setTrailerKey(t);
    };
    load();
  }, [movie.id]);

   const handleBookingSuccess = () => {
    
    setOpenBooking(false);

    
    setTimeout(() => {
      onClose();
    }, 500); 
  };


  return (
    <>
      
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full overflow-y-auto max-h-[90vh] p-6 relative">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <X className="w-6 h-6" />
          </button>

          
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {movie.title}
          </h2>

          
          {trailerKey && (
            <div className="aspect-video mb-4 rounded-lg overflow-hidden shadow-md">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {movie.overview || "No description available."}
          </p>

          
          <h3 className="font-semibold mb-2">Cast</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            {cast.length > 0 ? (
              cast.map((actor) => (
                <li
                  key={actor.id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1"
                >
                  {actor.name}
                </li>
              ))
            ) : (
              <li>No cast info</li>
            )}
          </ul>

          
          <button
            onClick={() => setOpenBooking(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold transition"
          >
            <Ticket className="w-5 h-5" />
            Book Now
          </button>
        </div>
      </div>

      
      <BookingModal
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        movie={movie}
         onBookingSuccess={handleBookingSuccess} 
      />
    </>
  );
};

export default MovieModal;
