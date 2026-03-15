import Booking from "../models/booking.model.js";
import generateSlots from "../utils/generateSlots.js";
import redis from "../config/redis.js";

export const getSlots = async (req, res) => {
  const { pitchId, date } = req.query;

  const slots = generateSlots();

  const bookings = await Booking.find({
    pitchId: pitchId,
    date: date,
  });

  const bookedSlots = bookings.map((b) => b.slot);

  const result = [];

  for (const slot of slots) {
    const key = `slot:${pitchId}:${date}:${slot}`;

    const reserved = await redis.get(key);

    if (bookedSlots.includes(slot)) {
      result.push({
        time: slot,
        status: "booked",
      });
    } else if (reserved) {
      result.push({
        time: slot,
        status: "reserved",
      });
    } else {
      result.push({
        time: slot,
        status: "available",
      });
    }
  }
  res.json(result);
};
