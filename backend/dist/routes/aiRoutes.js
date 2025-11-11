"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.post("/generateQue", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("user"), controllers_1.generateQuestions);
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map