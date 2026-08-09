import mongoose from "mongoose";
import Movie from "../models/movie.model.js";
import User from "../models/user.model.js";
import errorHandler from "./error.controller.js";

const list = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).populate({
      path: "favorites",
      options: { sort: { created: -1 } },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user.favorites);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const add = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    await User.findByIdAndUpdate(req.auth._id, {
      $addToSet: { favorites: movie._id },
      $set: { updated: Date.now() },
    });
    return res.status(200).json({ message: "Movie added to favorites" });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }
    await User.findByIdAndUpdate(req.auth._id, {
      $pull: { favorites: req.params.movieId },
      $set: { updated: Date.now() },
    });
    return res.status(200).json({ message: "Movie removed from favorites" });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { list, add, remove };
