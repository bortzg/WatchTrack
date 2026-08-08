import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(configDirectory, "../.env"), quiet: true });

const env = process.env.NODE_ENV || "development";

const config = {
  env,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || (env === "development" ? "development-only-secret-change-me" : undefined),
  mongoUri:
    process.env.MONGODB_URI ||
    `mongodb://${process.env.MONGO_HOST || process.env.IP || "localhost"}:${
      process.env.MONGO_PORT || "27017"
    }/watchtrack`,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is required outside development");
}

export default config;
