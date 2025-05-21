import {
  registerUser,
  login,
  getMe,
  logOut,
  updateProfile,
} from "../controllers/user";
import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";
import {
  userRegisterMid,
  LoginValidtorMid,
  userUpdateMid,
} from "../middlewares/validationMid/user";
import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.post("/register", userRegisterMid, registerUser);

router.post("/login", LoginValidtorMid, login);
router.put(
  "/updateProfile",
  IsLoggeedIn,
  RoleAuth("admin", "user"),
  userUpdateMid,
  updateProfile
);

router.get("/getMe", IsLoggeedIn, RoleAuth("admin", "user"), getMe);
router.get("/logout", IsLoggeedIn, RoleAuth("admin", "user"), logOut);

export default router;
