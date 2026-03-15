import Booking from "../models/booking.model.js"
import redisClient from "../config/redis.js"
import { getIO } from "../config/socket.js";
import redlock from "../config/redlock,js";
import Pitch from "../models/pitch.model.js";


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

  const { pitchId, date, slot } = req.body;
  const userId = req.user._id.toString();

  try {

    const redisKey = `slot:${pitchId}:${date}:${slot}`;

    const reservedUser = await redisClient.get(redisKey);

    if (!reservedUser || reservedUser !== userId) {
      return res.status(400).json({
        message: "Reservation expired"
      });
    }

    const pitch=await Pitch.findOne({_id:pitchId})

    const booking = await Booking.create({
      userId,
      pitchId,
      date,
      slot,
      totalPrice:pitch.price_per_hour
    });

    await redisClient.del(redisKey);

    return res.json({
      success: true,
      booking
    });

  } catch (error) {

    // Mongo duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Slot already booked"
      });
    }

    return res.status(500).json({
      message: error.message
    });

  }

};

export const myBookings = async (req, res) => {


  const bookings = await Booking.aggregate([
  {
    '$match': {
     ...req?.user?.role!=='admin'&& {userId:req.user._id},
     status: "confirmed"
    }
  }, {
    '$lookup': {
      'from': 'pitches', 
      'localField': 'pitchId', 
      'foreignField': '_id', 
      'as': 'pitch'
    }
  }, {
    '$lookup': {
      'from': 'users', 
      'localField': 'userId', 
      'foreignField': '_id', 
      'as': 'user'
    }
  }, {
    '$addFields': {
      'pitch': {
        '$arrayElemAt': [
          '$pitch', 0
        ]
      },
       'user': {
        '$arrayElemAt': [
          '$user', 0
        ]
      },
    }
  }, {
    '$project': {
      '_id': 1, 
      'slot': 1, 
      'createdAt': 1, 
      'status': 1, 
      'date': 1, 
      'pitchName': '$pitch.name', 
      'location': '$pitch.location',
      'username':'$user.username',
      createdAt:1,
      booking_date:'$date',
      totalPrice:1,
    }
  }, {
    '$addFields': {
      'createdAt': -1
    }
  }
]);

  res.json(bookings);
};