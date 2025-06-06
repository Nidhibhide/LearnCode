import { create, update, getAll } from "../controllers/testAttempt";
import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";
import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.post("/create", IsLoggeedIn, RoleAuth("user"), create);
router.put("/update/:id", IsLoggeedIn, RoleAuth("user"), update);
router.get("/getAll", IsLoggeedIn, RoleAuth("admin"), getAll);

export default router;
