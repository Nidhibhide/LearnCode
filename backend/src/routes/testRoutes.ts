import { create, getAll } from "../controllers/test";
import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";

import { testCreateMid } from "../middlewares/validationMid/test";

const router = express.Router();

router.post("/create", IsLoggeedIn, testCreateMid, create);
router.get("/getAll", IsLoggeedIn, getAll);

export default router;
