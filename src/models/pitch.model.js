import mongoose from "mongoose";

const pitchSchema = new mongoose.Schema({
  name: String,
  location: String,
  price_per_hour: Number
},{timestamps:true});

const Pitch = mongoose.model("Pitch", pitchSchema);

export default Pitch;