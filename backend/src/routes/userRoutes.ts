import {
  registerUser,
//   verifyUser,
//   login,
//   getMe,
//   logOut,
//   changePassword,
//   forgotPass,
//   resetPass,
} from "../controllers/user";
import express from "express";
import IsLoggeedIn from "../middlewares/Auth";

import {
  userRegisterMid,
  LoginValidtorMid,
} from "../middlewares/validationMid/user";

const router = express.Router();

router.post("/register", userRegisterMid, registerUser);
// router.get("/verify/:token", verifyUser);

// router.post("/login", LoginValidtorMid, login);
// router.get("/getMe", IsLoggeedIn, getMe);
// router.get("/logout", IsLoggeedIn, logOut);
// router.post("/changePass", IsLoggeedIn, changePassword);
// router.post("/forgotPass", forgotPass);
// router.put("/reset/:id", resetPass);

export default router;
