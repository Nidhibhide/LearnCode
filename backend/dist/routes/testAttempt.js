"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/create", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("user"), controllers_1.createTestAttempt);
router.put("/update/:id", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("user"), controllers_1.updateTestAttempt);
router.get("/getAll", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("admin"), controllers_1.getAllTestAttempts);
exports.default = router;
//# sourceMappingURL=testAttempt.js.map