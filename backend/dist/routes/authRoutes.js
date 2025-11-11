"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const express_1 = __importDefault(require("express"));
const validationMid_1 = require("../middlewares/validationMid");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/reset-verify", validationMid_1.EmailValidtorMid, controllers_1.resendVerificationEmail);
router.put("/changePassword", validationMid_1.LoginValidtorMid, controllers_1.changePassword);
router.post("/verifyCurrentPassword", middlewares_1.TokenAuth, (0, middlewares_1.RoleAuth)("admin", "user"), validationMid_1.LoginValidtorMid, controllers_1.verifyCurrentPassword);
router.post("/forgotPassword", validationMid_1.EmailValidtorMid, controllers_1.forgotPass);
router.get("/reset/:token", controllers_1.resetPass);
router.get("/checkToken", controllers_1.checkToken);
router.get("/refreshToken", controllers_1.refreshToken);
router.get("/verify/:token", controllers_1.verifyUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map