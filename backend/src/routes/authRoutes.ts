import {
  verifyUser,

  //   getMe,
  //   logOut,
  changePassword,
  forgotPass,
  resendVerificationEmail,
  resetPass,
} from "../controllers/auth";
import express from "express";

import {
  LoginValidtorMid,
  EmailValidtorMid,
} from "../middlewares/validationMid/user";

const router = express.Router();

router.get("/verify/:token", verifyUser);

router.post("/reset-verify", EmailValidtorMid, resendVerificationEmail);
// router.get("/getMe", IsLoggeedIn, getMe);
// router.get("/logout", IsLoggeedIn, logOut);
router.put("/changePass", LoginValidtorMid, changePassword);
router.post("/forgotPass", EmailValidtorMid, forgotPass);
router.get("/resetPass/:token", resetPass);

export default router;
