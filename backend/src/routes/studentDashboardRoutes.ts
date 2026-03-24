import express from "express";
import { getMyStats, getMyLanguages, getMyActivity, getMySolvedTests } from "../controllers/studentDashboard";
import { TokenAuth, BlockCheck, RoleAuth } from "../middlewares";

const router = express.Router();

// Get current user's test stats for MyScores page 
router.get("/my-stats", TokenAuth, BlockCheck, RoleAuth("student"), getMyStats);

// Get current user's languages with solved counts for Tech Stack section
router.get("/my-languages", TokenAuth, BlockCheck, RoleAuth("student"), getMyLanguages);

// Get current user's activity for Activity Calendar section
router.get("/my-activity", TokenAuth, BlockCheck, RoleAuth("student"), getMyActivity);

// Get current user's solved tests for Scoreboard table
router.get("/my-solved-tests", TokenAuth, BlockCheck, RoleAuth("student"), getMySolvedTests);

export default router;
