import express from "express";
import {
  reserveSlot,
  confirmBooking,
  myBookings
} from "../controllers/booking.controller.js";


import { getSlots } from "../controllers/slot.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { bookingSchema, reserveSlotSchema } from "../validators/booking.validator.js";
import validate from "../middleware/validationHandler.js";

const router = express.Router();

router.get("/slots", getSlots);

router.post("/reserve-slot", auth, reserveSlot);

router.post("/confirm-booking", auth, confirmBooking);

router.get("/my-bookings", auth, myBookings);

export default router;