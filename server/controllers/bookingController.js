
import {
  createBookingService,
  getBookingsService,
  getBookingSummaryService,
} from "../services/bookingService.js";

export const createBooking = async (req, res) => {
  try {
    const savedBooking = await createBookingService(req.body);
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("Booking save error:", err);
    res.status(400).json({ error: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await getBookingsService();
    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getBookingSummary = async (req, res) => {
  try {
    const summary = await getBookingSummaryService();
    res.json(summary);
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: err.message });
  }
};
