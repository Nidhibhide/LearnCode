"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseFun_1 = require("../utils/responseFun");
const RoleAuth = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 401, "Unauthorized: User not found", false);
        }
        if (!allowedRoles.includes(user === null || user === void 0 ? void 0 : user.role)) {
            return (0, responseFun_1.JsonOne)(res, 403, "Forbidden: Access denied", false);
        }
        next();
    };
};
exports.default = RoleAuth;
//# sourceMappingURL=RoleAuth.js.map