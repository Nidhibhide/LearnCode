"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const validationMid_1 = require("../middlewares/validationMid");
const middlewares_2 = require("../middlewares");
const router = express_1.default.Router();
router.post("/register", validationMid_1.userRegisterMid, controllers_1.registerUser);
router.post("/google-login", controllers_1.googleLogin);
router.post("/login", validationMid_1.LoginValidtorMid, controllers_1.login);
router.put("/updateProfile/:id", middlewares_1.TokenAuth, (0, middlewares_2.RoleAuth)("admin", "user"), validationMid_1.userUpdateMid, controllers_1.updateProfile);
router.get("/getMe", middlewares_1.TokenAuth, (0, middlewares_2.RoleAuth)("admin", "user"), controllers_1.getMe);
router.get("/logout", middlewares_1.TokenAuth, (0, middlewares_2.RoleAuth)("admin", "user"), controllers_1.logOut);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map