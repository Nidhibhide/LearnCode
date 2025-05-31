import { create, update } from "../controllers/testAttempt";
import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";
import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.post("/create", IsLoggeedIn, RoleAuth("user"), create);
router.put("/update/:id", IsLoggeedIn, RoleAuth("user"), update);

export default router;
