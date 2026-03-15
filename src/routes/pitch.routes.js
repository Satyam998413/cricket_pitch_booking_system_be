import express from "express";
import Pitch from "../models/pitch.model.js";
import Booking from "../models/booking.model.js";

const router = express.Router();

router.get("/", async (req, res) => {

  const pitches = await Pitch.find();

  res.json(pitches);
});

router.post("/create", async (req, res) => {
const {name,location,price_per_hour}=req.body;
  const pitches = await Pitch.create({name,location,price_per_hour});

  res.json(pitches);
});

router.post("/update", async (req, res) => {
const {id,name,location,price_per_hour}=req.body;
await Pitch.updateOne({_id:id},{name,location,price_per_hour});
  const pitches = await Pitch.find();

  res.json(pitches);
});

router.delete("/delete", async (req, res) => {
const {id}=req.body;
await Booking.deleteMany({pitchId:id})
await Pitch.deleteOne({_id:id});
  const pitches = await Pitch.find();

  res.json(pitches);
});

export default router;