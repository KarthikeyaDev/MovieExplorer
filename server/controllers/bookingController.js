import Booking from "../models/Booking.js";


export const createBooking = async (req, res) => {
  try {
    console.log(" Incoming booking:", req.body);

    const { numTickets, ticketPrice, ...rest } = req.body;

   
    const totalAmount = numTickets * ticketPrice;

    const booking = new Booking({
      ...rest,
      numTickets,
      ticketPrice,
      totalAmount,
    });

    const savedBooking = await booking.save();
    console.log(" Saved booking:", savedBooking);

    res.status(201).json(savedBooking);
  } catch (err) {
    console.error(" Booking save error:", err);
    res.status(400).json({ error: err.message });
  }
};


export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingTime: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getBookingSummary = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: null, 
          totalRevenue: { $sum: "$totalAmount" },
          totalTickets: { $sum: "$numTickets" },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    const summary = result[0] || {
      totalRevenue: 0,
      totalTickets: 0,
      totalBookings: 0,
    };

    res.json(summary);
  } catch (err) {
    console.error(" Summary error:", err);
    res.status(500).json({ error: err.message });
  }
};

