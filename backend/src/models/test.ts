import mongoose from "mongoose";

const TestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    numOfQuestions: { type: Number, required: true },
    language: {
      type: String,
      enum: ["Java", "C++", "JavaScript", "Python", "C"],
      required: true,
    },
    level: {
      type: String,
      enum: ["Basic", "Intermediate", "Advanced"],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const TestModel = mongoose.model("Test", TestSchema);

export default TestModel;
