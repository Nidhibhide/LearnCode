"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestValidMid = void 0;
const responseFun_1 = require("../../utils/responseFun");
const test_1 = require("../../validation/test");
const TestValidMid = (req, res, next) => {
    const { error } = test_1.TestValidation.validate(req.body);
    if (error) {
        const message = error.details[0].message;
        return (0, responseFun_1.JsonOne)(res, 400, message, false);
    }
    next();
};
exports.TestValidMid = TestValidMid;
//# sourceMappingURL=test.js.map