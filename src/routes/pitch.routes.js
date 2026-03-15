import express from "express";
import {
  getPitches,
  createPitch,
  updatePitch,
  deletePitch,
} from "../controllers/pitch.controller.js";

const router = express.Router();

router.get("/", getPitches);

router.post("/create", createPitch);

router.post("/update", updatePitch);

router.delete("/delete", deletePitch);

export default router;