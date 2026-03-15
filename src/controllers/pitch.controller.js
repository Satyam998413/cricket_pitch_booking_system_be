import Pitch from "../models/pitch.model.js";
import Booking from "../models/booking.model.js";

// Get All Pitches
export const getPitches = async (req, res) => {
  try {
    const pitches = await Pitch.find();
    res.json(pitches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Pitch
export const createPitch = async (req, res) => {
  try {
    const { name, location, price_per_hour } = req.body;

    const pitch = await Pitch.create({
      name,
      location,
      price_per_hour,
    });

    res.json(pitch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Pitch
export const updatePitch = async (req, res) => {
  try {
    const { id, name, location, price_per_hour } = req.body;

    await Pitch.updateOne(
      { _id: id },
      { name, location, price_per_hour }
    );

    const pitches = await Pitch.find();

    res.json(pitches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Pitch
export const deletePitch = async (req, res) => {
  try {
    const { id } = req.body;

    await Booking.deleteMany({ pitchId: id });

    await Pitch.deleteOne({ _id: id });

    const pitches = await Pitch.find();

    res.json(pitches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};