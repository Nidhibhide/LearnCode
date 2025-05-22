import {
  create,
  getAll,
  softDelete,
  restore,
  edit,
  getDeletedAll,
} from "../controllers/test";
import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";

import { TestValidMid } from "../middlewares/validationMid/test";
import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();

router.post("/create", IsLoggeedIn, RoleAuth("admin"), TestValidMid, create);
router.get("/getAll", IsLoggeedIn, RoleAuth("admin"), getAll);
router.get("/get-deleted-All", IsLoggeedIn, RoleAuth("admin"), getDeletedAll);
router.put("/delete/:id", IsLoggeedIn, RoleAuth("admin"), softDelete);
router.put("/edit/:id", IsLoggeedIn, RoleAuth("admin"), TestValidMid, edit);
router.put("/restore/:id", IsLoggeedIn, RoleAuth("admin"), restore);

export default router;
