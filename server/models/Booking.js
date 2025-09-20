

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  movieId: { type: String, required: true }, 
  movieTitle: { type: String, required: true },
  posterPath: { type: String, default: "" },
  numTickets: { type: Number, required: true, min: 1 },
  ticketPrice: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  showDate: { type: String, required: true },
  showTime: { type: String, required: true },
  bookingTime: { type: Date, default: Date.now },
  status: { type: String, default: "Confirmed" },
});

export default mongoose.model("Booking", bookingSchema, "bookings");
