import express from "express";
const router = express.Router();

import movieCtrl from "../controllers/movie.controller.js";
import reviewCtrl from "../controllers/review.controller.js";
import authCtrl from "../controllers/auth.controller.js";

router
  .route("/api/movies")
  .get(movieCtrl.list) // anyone can browse
  .post(authCtrl.requireSignin, movieCtrl.create);

router
  .route("/api/movies/:movieId")
  .get(movieCtrl.read)
  .put(authCtrl.requireSignin, movieCtrl.isOwner, movieCtrl.update)
  .delete(authCtrl.requireSignin, movieCtrl.isOwner, movieCtrl.remove);

router
  .route("/api/movies/:movieId/reviews")
  .get(reviewCtrl.listByMovie)
  .post(authCtrl.requireSignin, reviewCtrl.create);

router.param("movieId", movieCtrl.movieByID);

export default router;
