import express from "express";
import { getUserStats, getLanguageStats, getDifficultyStats, getWeeklyActivity, getLeaderboard, getMyStats, getMyLanguages, getMyActivity } from "../controllers/dashboard";
import { TokenAuth, BlockCheck } from "../middlewares";
import { RoleAuth } from "../middlewares";

const router = express.Router();

// Get user stats for admin dashboard 
router.get("/user-stats", TokenAuth, BlockCheck, RoleAuth("admin"), getUserStats);

// Get most attempted languages for admin dashboard 
router.get("/language-stats", TokenAuth, BlockCheck, RoleAuth("admin"), getLanguageStats);

// Get difficulty/level distribution for admin dashboard 
router.get("/levels-stats", TokenAuth, BlockCheck, RoleAuth("admin"), getDifficultyStats);

// Get weekly activity for admin dashboard 
router.get("/weekly-activity", TokenAuth, BlockCheck, RoleAuth("admin"), getWeeklyActivity);

// Get leaderboard with time-based filters 
router.get("/leaderboard", TokenAuth, BlockCheck, getLeaderboard);

// Get current user's test stats for MyScores page 
router.get("/my-stats", TokenAuth, BlockCheck, getMyStats);

// Get current user's languages with solved counts for Tech Stack section
router.get("/my-languages", TokenAuth, BlockCheck, getMyLanguages);

// Get current user's activity for Activity Calendar section
router.get("/my-activity", TokenAuth, BlockCheck, getMyActivity);

export default router;
