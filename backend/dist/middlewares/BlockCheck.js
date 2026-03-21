"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseFun_1 = require("../utils/responseFun");
const BlockCheck = (req, res, next) => {
    var _a;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.isBlocked) {
        return (0, responseFun_1.JsonOne)(res, 403, "Account is blocked due to multiple failed login attempts. Please reset your password.", false);
    }
    next();
};
exports.default = BlockCheck;
//# sourceMappingURL=BlockCheck.js.map