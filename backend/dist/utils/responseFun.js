"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonAll = exports.JsonOne = void 0;
const JsonOne = (res, statusCode, message, success, data) => {
    const response = {
        message,
        success,
        statusCode,
        data,
    };
    res.status(statusCode).json(response);
};
exports.JsonOne = JsonOne;
const JsonAll = (res, statusCode, message, data, total, page, limit) => {
    const response = {
        success: true,
        statusCode,
        message,
        data,
        total,
        page,
        limit,
    };
    res.status(statusCode).json(response);
};
exports.JsonAll = JsonAll;
//# sourceMappingURL=responseFun.js.map