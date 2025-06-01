"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("../controllers/test");
const express_1 = __importDefault(require("express"));
const TokenAuth_1 = __importDefault(require("../middlewares/TokenAuth"));
const test_2 = require("../middlewares/validationMid/test");
const RoleAuth_1 = __importDefault(require("../middlewares/RoleAuth"));
const router = express_1.default.Router();
router.post("/create", TokenAuth_1.default, (0, RoleAuth_1.default)("admin"), test_2.TestValidMid, test_1.create);
router.get("/getAll", TokenAuth_1.default, (0, RoleAuth_1.default)("admin", "user"), test_1.getAll); // use for get all tests and non attempted tests for a user
router.get("/get-deleted-All", TokenAuth_1.default, (0, RoleAuth_1.default)("admin"), test_1.getDeletedAll);
router.put("/delete/:id", TokenAuth_1.default, (0, RoleAuth_1.default)("admin"), test_1.softDelete);
router.put("/edit/:id", TokenAuth_1.default, (0, RoleAuth_1.default)("admin"), test_2.TestValidMid, test_1.edit);
router.put("/restore/:id", TokenAuth_1.default, (0, RoleAuth_1.default)("admin"), test_1.restore);
router.get("/getOngoing/:user", TokenAuth_1.default, (0, RoleAuth_1.default)("user"), test_1.getOngoing);
exports.default = router;
//# sourceMappingURL=testRoutes.js.map