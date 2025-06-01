"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
const express_1 = __importDefault(require("express"));
const user_1 = require("../middlewares/validationMid/user");
const TokenAuth_1 = __importDefault(require("../middlewares/TokenAuth"));
const RoleAuth_1 = __importDefault(require("../middlewares/RoleAuth"));
const router = express_1.default.Router();
// router.get("/verify/:token", verifyUser);
router.post("/reset-verify", user_1.EmailValidtorMid, auth_1.resendVerificationEmail);
router.put("/changePassword", user_1.LoginValidtorMid, auth_1.changePassword); //will be use
router.post("/verifyCurrentPassword", TokenAuth_1.default, (0, RoleAuth_1.default)("admin", "user"), user_1.LoginValidtorMid, auth_1.verifyCurrentPassword);
router.post("/forgotPassword", user_1.EmailValidtorMid, auth_1.forgotPass);
router.get("/resetPass/:token", auth_1.resetPass); //not used
router.get("/checkToken", auth_1.checkToken);
router.get("/verify/:token", auth_1.verifyUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map