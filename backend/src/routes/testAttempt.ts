import { createTestAttempt, updateTestAttempt, getAllTestAttempts } from "../controllers";
import express from "express";
import { TokenAuth, RoleAuth, BlockCheck } from "../middlewares";

const router = express.Router();

router.post("/create", TokenAuth, BlockCheck, RoleAuth("user"), createTestAttempt);
router.put("/update/:id", TokenAuth, BlockCheck, RoleAuth("user"), updateTestAttempt);
router.get("/getAll", TokenAuth, BlockCheck, RoleAuth("admin"), getAllTestAttempts);

export default router;
