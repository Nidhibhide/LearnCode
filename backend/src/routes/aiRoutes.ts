import express from "express";
import { TokenAuth, RoleAuth } from "../middlewares";

import { generateQuestions } from "../controllers";

const router = express.Router();

router.post("/generateQue", TokenAuth, RoleAuth("user"), generateQuestions );

export default router;
