"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const testRoutes_1 = __importDefault(require("./testRoutes"));
const aiRoutes_1 = __importDefault(require("./aiRoutes"));
const testAttempt_1 = __importDefault(require("./testAttempt"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
const router = express_1.default.Router();
// Health check route
router.get("/health", (_req, res) => {
    res.status(200).send("🚀 Backend is running!");
});
// Mount other routes
router.use("/user", userRoutes_1.default);
router.use("/auth", authRoutes_1.default);
router.use("/test", testRoutes_1.default);
router.use("/ai", aiRoutes_1.default);
router.use("/testAttempt", testAttempt_1.default);
router.use("/notification", notificationRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map