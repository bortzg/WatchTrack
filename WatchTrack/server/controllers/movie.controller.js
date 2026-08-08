import Movie from "../models/movie.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import Review from "../models/review.model.js";

const create = async (req, res) => {
  const movie = new Movie(req.body);
  movie.createdBy = req.auth._id;
  try {
    await movie.save();
    return res.status(200).json(movie);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    const filter = req.query.genre
      ? { genre: new RegExp(req.query.genre, "i") }
      : {};
    let movies = await Movie.find(filter).sort({ created: -1 });
    res.json(movies);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const movieByID = async (req, res, next, id) => {
  try {
    let movie = await Movie.findById(id);
    if (!movie)
      return res.status(400).json({
        error: "Movie not found",
      });
    req.movie = movie;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve movie",
    });
  }
};

const read = (req, res) => {
  return res.json(req.movie);
};

const update = async (req, res) => {
  try {
    let movie = req.movie;
    const allowedFields = ["title", "director", "year", "genre", "description", "posterUrl"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );
    movie = extend(movie, updates);
    movie.updated = Date.now();
    await movie.save();
    res.json(movie);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let movie = req.movie;
    await Review.deleteMany({ movie: movie._id });
    let deletedMovie = await movie.deleteOne();
    res.json(deletedMovie);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Only the movie's creator (or an admin, if you add roles later) can edit/delete
const isOwner = (req, res, next) => {
  const authorized =
    req.movie?.createdBy && req.auth && req.movie.createdBy.toString() === req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

export default { create, list, movieByID, read, update, remove, isOwner };
