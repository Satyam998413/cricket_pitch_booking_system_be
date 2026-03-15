import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  pitch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pitch"
  },
  slot_time: String,
  booking_date: String,
  status: {
    type: String,
    default: "confirmed"
  }
},{timestamps:true});

bookingSchema.index(
  { pitch_id: 1, slot_time: 1, booking_date: 1 },
  { unique: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;