import { createTestAttempt, updateTestAttempt, getAllTestAttempts } from "../controllers";
import express from "express";
import { TokenAuth, RoleAuth, BlockCheck } from "../middlewares";

const router = express.Router();

router.post("/create", TokenAuth, BlockCheck, RoleAuth("student"), createTestAttempt);
router.put("/update/:id", TokenAuth, BlockCheck, RoleAuth("student"), updateTestAttempt);
router.get("/getAll", TokenAuth, BlockCheck, RoleAuth("admin"), getAllTestAttempts);

export default router;
