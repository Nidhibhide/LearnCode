"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ["info", "success"],
        default: "info",
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const NotificationModel = mongoose_1.default.model("Notification", NotificationSchema);
exports.default = NotificationModel;
//# sourceMappingURL=notification.js.map