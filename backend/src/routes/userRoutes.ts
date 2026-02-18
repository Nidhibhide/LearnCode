import {
  registerUser,
  login,
  getMe,
  googleLogin,
  logOut,
  updateProfile,
} from "../controllers";
import express from "express";
import { TokenAuth, BlockCheck } from "../middlewares";
import {
  userRegisterMid,
  LoginValidtorMid,
  userUpdateMid,
} from "../middlewares/validationMid";
import { RoleAuth } from "../middlewares";

const router = express.Router();

router.post("/register", userRegisterMid, registerUser);
router.post("/google-login", googleLogin);
router.post("/login", LoginValidtorMid, login);
router.put(
  "/updateProfile/:id",
  TokenAuth,
  BlockCheck,
  RoleAuth("admin", "student"),
  userUpdateMid,
  updateProfile
);

router.get("/getMe", TokenAuth, BlockCheck, RoleAuth("admin", "student"), getMe);
router.get("/logout", TokenAuth, BlockCheck, RoleAuth("admin", "student"), logOut);

export default router;
