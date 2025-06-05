"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = require("../controllers/notification");
const express_1 = __importDefault(require("express"));
const TokenAuth_1 = __importDefault(require("../middlewares/TokenAuth"));
const RoleAuth_1 = __importDefault(require("../middlewares/RoleAuth"));
const router = express_1.default.Router();
router.get("/getAll/:id", TokenAuth_1.default, (0, RoleAuth_1.default)("admin", "user"), notification_1.getAllByUser);
router.put("/update/:id", TokenAuth_1.default, (0, RoleAuth_1.default)("admin", "user"), notification_1.update);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map