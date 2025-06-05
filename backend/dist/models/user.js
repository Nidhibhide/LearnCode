"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchmea = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    expireTime: { type: Date, required: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    // testAttempts: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "TestAttempt",
    //   },
    // ],//may be no use of it 
}, {
    timestamps: true,
} // auto adds createdAt and updatedAt
);
const UserModel = mongoose_1.default.model("User", UserSchmea);
exports.default = UserModel;
//# sourceMappingURL=user.js.map