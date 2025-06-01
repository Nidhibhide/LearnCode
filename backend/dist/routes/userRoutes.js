"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../controllers/user");
const express_1 = __importDefault(require("express"));
const TokenAuth_1 = __importDefault(require("../middlewares/TokenAuth"));
const user_2 = require("../middlewares/validationMid/user");
const RoleAuth_1 = __importDefault(require("../middlewares/RoleAuth"));
const router = express_1.default.Router();
router.post("/register", user_2.userRegisterMid, user_1.registerUser);
router.post("/login", user_2.LoginValidtorMid, user_1.login);
router.put("/updateProfile", TokenAuth_1.default, (0, RoleAuth_1.default)("admin", "user"), user_2.userUpdateMid, user_1.updateProfile);
router.get("/getMe", TokenAuth_1.default, (0, RoleAuth_1.default)("admin", "user"), user_1.getMe);
router.get("/logout", TokenAuth_1.default, (0, RoleAuth_1.default)("admin", "user"), user_1.logOut);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map