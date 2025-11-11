"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TestAttemptSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    testId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Test",
        required: true,
    },
    correctQuestionIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: false,
        },
    ],
    wrongQuestionIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: false,
        },
    ],
    remainingQuestionIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: false,
        },
    ],
    score: {
        type: Number,
        default: 0,
    },
    completedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
const TestAttemptModel = mongoose_1.default.model("TestAttempt", TestAttemptSchema);
exports.default = TestAttemptModel;
TestAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days
//# sourceMappingURL=testAttempt.js.map