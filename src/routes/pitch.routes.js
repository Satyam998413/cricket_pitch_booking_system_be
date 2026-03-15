import express from "express";
import Pitch from "../models/pitch.model.js";

const router = express.Router();

router.get("/", async (req, res) => {

  const pitches = await Pitch.find();

  res.json(pitches);
});

export default router;