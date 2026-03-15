import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.routes.js";
import pitchRoutes from "./src/routes/pitch.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import seedDatabase from "./src/seed/seed.js";
import { connectRedis } from "./src/config/redis.js";
import { connectDB } from "./src/config/db..js";
import { initSocket } from "./src/config/socket.js";


dotenv.config();

const app = express();
// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

initSocket(server);

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/about", (req, res) => {
  res.send({ data: `About route 2 ${process.env.MONGO_URI1}` });
});

app.use("/api/auth", authRoutes);
app.use("/api/pitch", pitchRoutes);
app.use("/api/booking", bookingRoutes);

const PORT = process.env.PORT || 8000;

// Connect DB & Start Server
const startServer = async () => {
  try {
     await connectRedis();
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => { 
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();