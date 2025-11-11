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
import { TokenAuth, RoleAuth } from "../middlewares";

import { TestValidMid } from "../middlewares/validationMid";

const router = express.Router();

router.post("/create", TokenAuth, RoleAuth("admin"), TestValidMid, createTest);
router.get("/getAll", TokenAuth, RoleAuth("admin", "user"), getAllTests); // use for get all tests and non attempted tests for a user
router.get("/get-deleted-All", TokenAuth, RoleAuth("admin"), getDeletedAll);
router.put("/delete/:id", TokenAuth, RoleAuth("admin"), softDelete);
router.put("/edit/:id", TokenAuth, RoleAuth("admin"), TestValidMid, edit);
router.put("/restore/:id", TokenAuth, RoleAuth("admin"), restore);
router.get("/getOngoing/:user", TokenAuth, RoleAuth("user"), getOngoing);

export default router;
