
import Booking from "../models/Booking.js";


export const createBookingService = async (data) => {
  const { numTickets, ticketPrice, ...rest } = data;
  const totalAmount = numTickets * ticketPrice;

  const booking = new Booking({
    ...rest,
    numTickets,
    ticketPrice,
    totalAmount,
  });

  return await booking.save();
};


export const getBookingsService = async () => {
  return await Booking.find().sort({ bookingTime: -1 });
};


export const getBookingSummaryService = async () => {
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

  return result[0] || { totalRevenue: 0, totalTickets: 0, totalBookings: 0 };
};
