import express from "express";
import { getUserStats, getLanguageStats, getDifficultyStats, getWeeklyActivity, getLeaderboard } from "../controllers/adminDashboard";
import { TokenAuth, BlockCheck, RoleAuth } from "../middlewares";

const router = express.Router();

// Get user stats for admin dashboard 
router.get("/user-stats", TokenAuth, BlockCheck, RoleAuth("admin"), getUserStats);

// Get most attempted languages for admin dashboard 
router.get("/language-stats", TokenAuth, BlockCheck, RoleAuth("admin"), getLanguageStats);

// Get difficulty/level distribution for admin dashboard 
router.get("/levels-stats", TokenAuth, BlockCheck, RoleAuth("admin"), getDifficultyStats);

// Get weekly activity for admin dashboard 
router.get("/weekly-activity", TokenAuth, BlockCheck, RoleAuth("admin"), getWeeklyActivity);

// Get leaderboard
router.get("/leaderboard", TokenAuth, BlockCheck, RoleAuth("admin"), getLeaderboard);

export default router;
