import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "../config/config.js";

import userRoutes from "./routes/user.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

app.use(helmet());
const allowedOrigins = new Set(
  config.clientOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

if (config.env === "development") {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://127.0.0.1:5173");
}

app.use(
  cors({
    origin(origin, callback) {
      const isLocalDevelopmentOrigin =
        config.env === "development" && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
      if (!origin || allowedOrigins.has(origin) || isLocalDevelopmentOrigin) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.use("/", userRoutes);
app.use("/", movieRoutes);
app.use("/", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CineTrack API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "admin-favorites-v1",
    features: { roles: true, favorites: true },
  });
});

// express-jwt auth errors land here
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: `${err.name}: ${err.message}` });
  }
  console.error(err.stack);
  return res.status(500).json({ error: "Something went wrong on the server" });
});

export default app;
