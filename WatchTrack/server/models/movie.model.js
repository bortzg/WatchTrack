import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is required",
  },
  director: {
    type: String,
    trim: true,
    required: "Director is required",
  },
  year: {
    type: Number,
    required: "Year is required",
  },
  genre: {
    type: String,
    trim: true,
    required: "Genre is required",
  },
  description: {
    type: String,
    trim: true,
  },
  posterUrl: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Movie", MovieSchema);