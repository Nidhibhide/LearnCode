import mongoose from "mongoose";

const TestAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    correctQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      },
    ],
    wrongQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      },
    ],
    remainingQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const TestAttemptModel = mongoose.model("TestAttempt", TestAttemptSchema);
export default TestAttemptModel;
TestAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days
