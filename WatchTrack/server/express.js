import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", movieRoutes);
app.use("/", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CineTrack API is running" });
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