import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";

import {generateQuestions  } from "../controllers/ai";

import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.post("/generateQue", IsLoggeedIn, RoleAuth("user"), generateQuestions );

export default router;
