import Booking from "../models/booking.model.js"
import redisClient from "../config/redis.js"
import { getIO } from "../config/socket.js"

export const reserveSlot = async (req, res) => {

  const { pitchId, date, slot } = req.body;

  const key = `slot:${pitchId}:${date}:${slot}`;

  const exists = await redisClient.get(key);

  if (exists) {
    return res.status(400).json({
      message: "Slot already reserved"
    });
  }

  await redisClient.set(key, req.user.id, {
    EX: 120
  });

  res.json({
    message: "Slot reserved for 2 minutes"
  });

};


export const confirmBooking = async (req, res) => {

  const { pitchId, date, slot } = req.body

  const key = `slot:${pitchId}:${date}:${slot}`

  const reservedUser = await redis.get(key)

  if (!reservedUser) {
    return res.status(400).json({
      message: "Reservation expired"
    })
  }

  if (reservedUser !== req.user.id) {
    return res.status(403).json({
      message: "This slot is reserved by another user"
    })
  }

  try {

    const booking = await Booking.create({
      user_id: req.user.id,
      pitch_id: pitchId,
      slot_time: slot,
      booking_date: date
    })


    const reservedUser = await redisClient.get(key);

if (!reservedUser) {
  return res.status(400).json({
    message: "Reservation expired"
  });
}
    await redisClient.del(key)

    const io = getIO()

    io.emit("slotBooked", {
      pitchId,
      date,
      slot
    })

    res.json(booking)

  } catch (error) {

    res.status(400).json({
      message: "Slot already booked"
    })

  }

}


export const myBookings = async (req, res) => {

  const bookings = await Booking.find({
    user_id: req.user.id
  });

  res.json(bookings);
};