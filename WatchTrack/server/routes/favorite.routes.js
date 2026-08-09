import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import favoriteCtrl from "../controllers/favorite.controller.js";

const router = express.Router();

router.route("/api/favorites").get(authCtrl.requireSignin, favoriteCtrl.list);
router
  .route("/api/favorites/:movieId")
  .post(authCtrl.requireSignin, favoriteCtrl.add)
  .delete(authCtrl.requireSignin, favoriteCtrl.remove);

export default router;
