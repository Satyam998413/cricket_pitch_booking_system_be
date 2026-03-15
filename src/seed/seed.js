import User from "../models/user.model.js";
import Pitch from "../models/pitch.model.js";
import { defaultAdmin, defaultPitches } from "../const/defaultData.js";


export default async function seedDatabase() {
  try {
    console.log("Seeding Database...");

    const dataExists = await Pitch.findOne({});

    if (dataExists) {
      console.log("Data already exists. Skipping seeding.");
      return;
    }

    //Create Default Admin User

    const admin = await User.create(defaultAdmin);

    console.log("Admin user created");

    // Create Default Pitches
    defaultPitches.map((item)=>{item.created_by=admin._id})

    await Pitch.insertMany(defaultPitches);

    console.log(" Default pitches created");

    console.log("Database Seeding Completed Successfully");

  } catch (error) {
    console.error("Error Seeding Data:", error);
    process.exit(1);
  }
}