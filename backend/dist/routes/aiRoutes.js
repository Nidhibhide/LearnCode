"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TokenAuth_1 = __importDefault(require("../middlewares/TokenAuth"));
const ai_1 = require("../controllers/ai");
const RoleAuth_1 = __importDefault(require("../middlewares/RoleAuth"));
const router = express_1.default.Router();
router.post("/generateQue", TokenAuth_1.default, (0, RoleAuth_1.default)("user"), ai_1.generateQuestions);
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map