import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  pitchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pitch"
  },

  date: String,

  slot: String,

  status: {
    type: String,
    default: "confirmed"
  },
  totalPrice:{
    type:Number,default:0
  }

}, { timestamps: true });

bookingSchema.index(
  { pitchId: 1, date: 1, slot: 1 },
  { unique: true }
);

export default mongoose.model("Booking", bookingSchema);