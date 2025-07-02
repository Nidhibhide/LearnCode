import {
  verifyUser,
  checkToken,
  changePassword,
  forgotPass,
  resendVerificationEmail,
  resetPass,
  verifyCurrentPassword,
  refreshToken,
} from "../controllers/auth";
import express from "express";

import {
  LoginValidtorMid,
  EmailValidtorMid,
} from "../middlewares/validationMid/user";
import IsLoggeedIn from "../middlewares/TokenAuth";
import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.post("/reset-verify", EmailValidtorMid, resendVerificationEmail);

router.put("/changePassword", LoginValidtorMid, changePassword);
router.post(
  "/verifyCurrentPassword",
  IsLoggeedIn,
  RoleAuth("admin", "user"),
  LoginValidtorMid,
  verifyCurrentPassword
);

router.post("/forgotPassword", EmailValidtorMid, forgotPass);
router.get("/reset/:token", resetPass);
router.get("/checkToken", checkToken);
router.get("/refreshToken", refreshToken);
router.get("/verify/:token", verifyUser);

export default router;
