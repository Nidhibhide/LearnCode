"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookies = exports.accessTokenOptions = exports.refreshTokenOptions = void 0;
//set token in cookie
exports.refreshTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
};
//set token in cookie
exports.accessTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000, //1 hr
};
exports.clearCookies = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
};
//# sourceMappingURL=cookieOptions.js.map