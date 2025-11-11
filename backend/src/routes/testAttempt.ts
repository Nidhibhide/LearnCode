import { createTestAttempt, updateTestAttempt, getAllTestAttempts } from "../controllers";
import express from "express";
import { TokenAuth, RoleAuth } from "../middlewares";

const router = express.Router();

router.post("/create", TokenAuth, RoleAuth("user"), createTestAttempt);
router.put("/update/:id", TokenAuth, RoleAuth("user"), updateTestAttempt);
router.get("/getAll", TokenAuth, RoleAuth("admin"), getAllTestAttempts);

export default router;
