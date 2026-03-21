"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_1 = require("../controllers/dashboard");
const middlewares_1 = require("../middlewares");
const middlewares_2 = require("../middlewares");
const router = express_1.default.Router();
// Get user stats for admin dashboard 
router.get("/user-stats", middlewares_1.TokenAuth, middlewares_1.BlockCheck, (0, middlewares_2.RoleAuth)("admin"), dashboard_1.getUserStats);
// Get most attempted languages for admin dashboard 
router.get("/language-stats", middlewares_1.TokenAuth, middlewares_1.BlockCheck, (0, middlewares_2.RoleAuth)("admin"), dashboard_1.getLanguageStats);
// Get difficulty/level distribution for admin dashboard 
router.get("/levels-stats", middlewares_1.TokenAuth, middlewares_1.BlockCheck, (0, middlewares_2.RoleAuth)("admin"), dashboard_1.getDifficultyStats);
// Get weekly activity for admin dashboard 
router.get("/weekly-activity", middlewares_1.TokenAuth, middlewares_1.BlockCheck, (0, middlewares_2.RoleAuth)("admin"), dashboard_1.getWeeklyActivity);
// Get leaderboard with time-based filters 
router.get("/leaderboard", middlewares_1.TokenAuth, middlewares_1.BlockCheck, dashboard_1.getLeaderboard);
// Get current user's test stats for MyScores page 
router.get("/my-stats", middlewares_1.TokenAuth, middlewares_1.BlockCheck, dashboard_1.getMyStats);
// Get current user's languages with solved counts for Tech Stack section
router.get("/my-languages", middlewares_1.TokenAuth, middlewares_1.BlockCheck, dashboard_1.getMyLanguages);
// Get current user's activity for Activity Calendar section
router.get("/my-activity", middlewares_1.TokenAuth, middlewares_1.BlockCheck, dashboard_1.getMyActivity);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map