import {
  verifyUser,
  checkToken,
  changePassword,
  forgotPass,
  resendVerificationEmail,
  resetPass,
  verifyCurrentPassword,
} from "../controllers/auth";
import express from "express";

import {
  LoginValidtorMid,
  EmailValidtorMid,
} from "../middlewares/validationMid/user";
import IsLoggeedIn from "../middlewares/TokenAuth";
import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.get("/verify/:token", verifyUser);

router.post("/reset-verify", EmailValidtorMid, resendVerificationEmail);

router.put("/changePassword", LoginValidtorMid, changePassword); //will be use
router.post(
  "/verifyCurrentPassword",
  IsLoggeedIn,
  RoleAuth("admin", "user"),
  LoginValidtorMid,
  verifyCurrentPassword
);

router.post("/forgotPassword", EmailValidtorMid, forgotPass);
router.get("/resetPass/:token", resetPass); //not used
router.get("/checkToken", checkToken);

export default router;
