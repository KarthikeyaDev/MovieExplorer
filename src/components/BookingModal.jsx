
import React, { useState } from "react";
import { addBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, X } from "lucide-react";

const BookingModal = ({ open, onClose, movie }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const ticketPrice = 200;

  const handleBook = async () => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    if (!date || !time) {
      alert("Please select both date and time!");
      return;
    }

    const booking = {
      userId: user.uid,
      userName: user.displayName,
      userEmail: user.email,
      movieId: movie.id,
      movieTitle: movie.title,
      posterPath: movie.poster_path,
      numTickets: tickets,
      ticketPrice: ticketPrice,
      totalAmount: tickets * ticketPrice,
      showDate: date,
      showTime: time,
      bookingTime: new Date().toISOString(),
      status: "Confirmed",
    };

    await addBooking(booking);

    // ✅ Show styled success message instead of plain alert
    setSuccessMsg(
      `🎉 ${movie.title} booked successfully for ${time} on ${date}`
    );

    // Reset fields
    setTickets(1);
    setDate("");
    setTime("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Movie Title */}
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          {movie?.title}
        </h2>

        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-4 rounded-lg mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {!successMsg && (
          <>
            {/* Date Picker */}
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            {/* Time Picker */}
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Select Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            {/* Tickets Selector */}
            <div className="flex items-center justify-center mb-4 space-x-4">
              <button
                onClick={() => setTickets(Math.max(1, tickets - 1))}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                −
              </button>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {tickets}
              </span>
              <button
                onClick={() => setTickets(Math.min(5, tickets + 1))}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                +
              </button>
            </div>

            {/* Total Price */}
            <p className="text-center font-medium text-gray-800 dark:text-gray-200 mb-6">
              Total: ₹{tickets * ticketPrice}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-between space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

