import { getAllByUser, update } from "../controllers/notification";
import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";

import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.get("/getAll/:id", IsLoggeedIn, RoleAuth("admin", "user"), getAllByUser);
router.put("/update/:id", IsLoggeedIn, RoleAuth("admin", "user"), update);
export default router;
