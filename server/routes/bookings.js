
import express from "express";
import { createBooking, getBookings, getBookingSummary } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/summary", getBookingSummary);

export default router;

