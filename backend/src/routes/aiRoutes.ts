import express from "express";
import { TokenAuth, RoleAuth, BlockCheck } from "../middlewares";

import { generateQuestions } from "../controllers";

const router = express.Router();

router.post("/generateQue", TokenAuth, BlockCheck, RoleAuth("user"), generateQuestions );

export default router;
