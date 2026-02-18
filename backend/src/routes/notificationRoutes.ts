import { getAllByUser, updateNotification } from "../controllers";
import express from "express";
import { TokenAuth, RoleAuth, BlockCheck } from "../middlewares";

const router = express.Router();

router.get("/getAll/:id", TokenAuth, BlockCheck, RoleAuth("admin", "student"), getAllByUser);
router.put("/update/:id", TokenAuth, BlockCheck, RoleAuth("admin", "student"), updateNotification);
export default router;
