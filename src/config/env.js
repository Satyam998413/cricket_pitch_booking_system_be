import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";

dotenv.config({
  path: `.env.${env}`
});

dotenv.config();

const config = {
  NODE_ENV: env,

  PORT: process.env.PORT || 5000,

  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/cricket_booking",

    isReplicaDB:  process.env.IS_REPLICA_DB==='true'?true:false,

  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",

  JWT_SECRET: process.env.JWT_SECRET || "defaultSecret",

  SLOT_RESERVE_TIME: process.env.SLOT_RESERVE_TIME || 120,
};

export default config;