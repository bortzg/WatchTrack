import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: "Movie reference is required",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "User reference is required",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: "Rating is required",
  },
  comment: {
    type: String,
    trim: true,
    required: "Comment is required",
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

// One review per user per movie
ReviewSchema.index({ movie: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);