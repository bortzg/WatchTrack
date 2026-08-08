import express from "express";
const router = express.Router();

import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";

router
  .route("/api/users")
  .get(authCtrl.requireSignin, userCtrl.list)
  .post(userCtrl.create); // register

router.route("/api/auth/signin").post(authCtrl.signin);
router.route("/api/auth/signout").get(authCtrl.signout);

router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
