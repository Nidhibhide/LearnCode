import express from "express";
import { TokenAuth, RoleAuth, BlockCheck } from "../middlewares";

import { generateQuestions } from "../controllers";

const router = express.Router();

router.post("/generateQue", TokenAuth, BlockCheck, RoleAuth("student"), generateQuestions );

export default router;
