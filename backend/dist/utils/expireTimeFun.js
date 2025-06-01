"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expireTime = () => {
    let time = new Date();
    time.setMinutes(time.getMinutes() + 5); //expired in 5 mins
    return time;
};
exports.default = expireTime;
//# sourceMappingURL=expireTimeFun.js.map