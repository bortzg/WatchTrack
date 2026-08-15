import express from "express";
const router = express.Router();

import reviewCtrl from "../controllers/review.controller.js";
import authCtrl from "../controllers/auth.controller.js";

router
  .route("/api/reviews/:reviewId")
  .get(reviewCtrl.read)
  .put(authCtrl.requireSignin, reviewCtrl.isOwner, reviewCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, reviewCtrl.remove);

router.param("reviewId", reviewCtrl.reviewByID);

export default router;
