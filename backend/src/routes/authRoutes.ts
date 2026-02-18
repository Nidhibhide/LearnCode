import {
  verifyUser,
  checkToken,
  changePassword,
  forgotPass,
  resendVerificationEmail,
  resetPass,
  verifyCurrentPassword,
  refreshToken,
} from "../controllers";
import express from "express";

import {
  LoginValidtorMid,
  EmailValidtorMid,
} from "../middlewares/validationMid";
import { TokenAuth, RoleAuth, BlockCheck } from "../middlewares";

const router = express.Router();

router.post("/reset-verify", EmailValidtorMid, resendVerificationEmail);

router.put("/changePassword", LoginValidtorMid, changePassword);
router.post(
  "/verifyCurrentPassword",
  TokenAuth,
  BlockCheck,
  RoleAuth("admin", "student"),
  LoginValidtorMid,
  verifyCurrentPassword
);

router.post("/forgotPassword", EmailValidtorMid, forgotPass);
router.get("/reset/:token", resetPass);
router.get("/checkToken", checkToken);
router.get("/refreshToken", refreshToken);
router.get("/verify/:token", verifyUser);

export default router;
