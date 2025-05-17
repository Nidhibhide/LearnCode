import {
  registerUser,
  login,
  getMe,
  //   logOut,
} from "../controllers/user";
import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";
import {
  userRegisterMid,
  LoginValidtorMid,
} from "../middlewares/validationMid/user";
import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.post("/register", userRegisterMid, registerUser);

router.post("/login", LoginValidtorMid, login);

router.get("/getMe", IsLoggeedIn, RoleAuth("admin"), getMe);
// router.get("/logout", IsLoggeedIn, logOut);

export default router;
