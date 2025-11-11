import { getAllByUser, updateNotification } from "../controllers";
import express from "express";
import { TokenAuth, RoleAuth } from "../middlewares";

const router = express.Router();

router.get("/getAll/:id", TokenAuth, RoleAuth("admin", "user"), getAllByUser);
router.put("/update/:id", TokenAuth, RoleAuth("admin", "user"), updateNotification);
export default router;
