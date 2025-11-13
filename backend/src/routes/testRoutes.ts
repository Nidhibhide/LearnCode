import {
  createTest,
  getAllTests,
  softDelete,
  restore,
  edit,
  getDeletedAll,
  getOngoing,
} from "../controllers";
import express from "express";
import { TokenAuth, RoleAuth, BlockCheck } from "../middlewares";

import { TestValidMid } from "../middlewares/validationMid";

const router = express.Router();

router.post("/create", TokenAuth, BlockCheck, RoleAuth("admin"), TestValidMid, createTest);
router.get("/getAll", TokenAuth, BlockCheck, RoleAuth("admin", "user"), getAllTests); // use for get all tests and non attempted tests for a user
router.get("/get-deleted-All", TokenAuth, BlockCheck, RoleAuth("admin"), getDeletedAll);
router.put("/delete/:id", TokenAuth, BlockCheck, RoleAuth("admin"), softDelete);
router.put("/edit/:id", TokenAuth, BlockCheck, RoleAuth("admin"), TestValidMid, edit);
router.put("/restore/:id", TokenAuth, BlockCheck, RoleAuth("admin"), restore);
router.get("/getOngoing/:user", TokenAuth, BlockCheck, RoleAuth("user"), getOngoing);

export default router;
