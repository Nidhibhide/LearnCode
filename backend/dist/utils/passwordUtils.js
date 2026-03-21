"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToPasswordHistory = exports.isOldPassword = exports.isPasswordUsedByOtherUser = void 0;
const models_1 = require("../models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Check if a password hash already exists in the database for any user with the same role
 * This prevents multiple users with the same role from using the same password
 * Also checks password history to catch previously used passwords
 */
const isPasswordUsedByOtherUser = (password, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find any user with the same role that has a password
        const usersWithPassword = yield models_1.User.find({
            role: role,
            password: { $exists: true, $ne: null },
        });
        for (const user of usersWithPassword) {
            if (user.password) {
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (isMatch) {
                    return true;
                }
            }
            // Also check password history
            if (user.passwordHistory && user.passwordHistory.length > 0) {
                for (const oldPasswordHash of user.passwordHistory) {
                    const isOldMatch = yield bcryptjs_1.default.compare(password, oldPasswordHash);
                    if (isOldMatch) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    catch (error) {
        console.error("Error checking password existence:", error);
        return false;
    }
});
exports.isPasswordUsedByOtherUser = isPasswordUsedByOtherUser;
/**
 * Check if a password has been used by the same user before (for change password)
 * Compares against current password and password history
 */
const isOldPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById(userId);
        if (!user || !user.password) {
            return false;
        }
        // Check against current password
        const isCurrentPassword = yield bcryptjs_1.default.compare(newPassword, user.password);
        if (isCurrentPassword) {
            return true;
        }
        // Check against password history
        if (user.passwordHistory && user.passwordHistory.length > 0) {
            for (const oldPasswordHash of user.passwordHistory) {
                const isOldMatch = yield bcryptjs_1.default.compare(newPassword, oldPasswordHash);
                if (isOldMatch) {
                    return true;
                }
            }
        }
        return false;
    }
    catch (error) {
        console.error("Error checking old password:", error);
        return false;
    }
});
exports.isOldPassword = isOldPassword;
/**
 * Add current password to password history before changing
 * Keeps track of last 5 passwords to prevent reuse
 */
const addToPasswordHistory = (userId, currentPasswordHash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById(userId);
        if (!user) {
            return;
        }
        // Initialize passwordHistory if it doesn't exist
        if (!user.passwordHistory) {
            user.passwordHistory = [];
        }
        // Add current password to history
        user.passwordHistory.push(currentPasswordHash);
        // Keep only last 5 passwords in history
        if (user.passwordHistory.length > 5) {
            user.passwordHistory = user.passwordHistory.slice(-5);
        }
        yield user.save();
    }
    catch (error) {
        console.error("Error adding to password history:", error);
    }
});
exports.addToPasswordHistory = addToPasswordHistory;
//# sourceMappingURL=passwordUtils.js.map