import { createClient } from "redis";

import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  username: "default",
  password: "ph0qvLe5rzJVWtu3OzQD4kheVimfVHM1",
  socket: {
    host: "redis-16632.crce214.us-east-1-3.ec2.cloud.redislabs.com",
    port: 16632
  }
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;