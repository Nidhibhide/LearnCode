"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const validationMid_1 = require("../middlewares/validationMid");
const router = express_1.default.Router();
router.post("/create", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("admin"), validationMid_1.TestValidMid, controllers_1.createTest);
router.get("/getAll", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("admin", "user"), controllers_1.getAllTests); // use for get all tests and non attempted tests for a user
router.get("/get-deleted-All", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("admin"), controllers_1.getDeletedAll);
router.put("/delete/:id", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("admin"), controllers_1.softDelete);
router.put("/edit/:id", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("admin"), validationMid_1.TestValidMid, controllers_1.edit);
router.put("/restore/:id", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("admin"), controllers_1.restore);
router.get("/getOngoing/:user", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("user"), controllers_1.getOngoing);
exports.default = router;
//# sourceMappingURL=testRoutes.js.map