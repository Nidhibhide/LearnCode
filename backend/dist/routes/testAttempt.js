"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testAttempt_1 = require("../controllers/testAttempt");
const express_1 = __importDefault(require("express"));
const TokenAuth_1 = __importDefault(require("../middlewares/TokenAuth"));
const RoleAuth_1 = __importDefault(require("../middlewares/RoleAuth"));
const router = express_1.default.Router();
router.post("/create", TokenAuth_1.default, (0, RoleAuth_1.default)("user"), testAttempt_1.create);
router.put("/update/:id", TokenAuth_1.default, (0, RoleAuth_1.default)("user"), testAttempt_1.update);
exports.default = router;
//# sourceMappingURL=testAttempt.js.map