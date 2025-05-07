import {
  registerUser,
  verifyUser,
  login,
  //   getMe,
  //   logOut,
  changePassword,
  forgotPass,
  resendVerificationEmail,
  resetPass,
} from "../controllers/user";
import express from "express";
// import IsLoggeedIn from "../middlewares/Auth";

import {
  userRegisterMid,
  LoginValidtorMid,
  EmailValidtorMid,
  // ResetPassValidtorMid,
} from "../middlewares/validationMid/user";

const router = express.Router();

router.post("/register", userRegisterMid, registerUser);
router.get("/verify/:token", verifyUser);

router.post("/login", LoginValidtorMid, login);
router.post("/reset-verify", EmailValidtorMid, resendVerificationEmail);
// router.get("/getMe", IsLoggeedIn, getMe);
// router.get("/logout", IsLoggeedIn, logOut);
router.put("/changePass", LoginValidtorMid, changePassword);
router.post("/forgotPass", EmailValidtorMid, forgotPass);
router.get("/resetPass/:token", resetPass);

export default router;
