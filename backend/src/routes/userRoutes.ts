import {
  registerUser,
  login,
  getMe,
  googleLogin,
  logOut,
  updateProfile,
} from "../controllers";
import express from "express";
import { TokenAuth } from "../middlewares";
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
  RoleAuth("admin", "user"),
  userUpdateMid,
  updateProfile
);

router.get("/getMe", TokenAuth, RoleAuth("admin", "user"), getMe);
router.get("/logout", TokenAuth, RoleAuth("admin", "user"), logOut);

export default router;
