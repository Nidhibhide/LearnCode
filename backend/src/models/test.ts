import mongoose from "mongoose";
const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  sampleInput: { type: String }, // optional
});

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
    questions: [QuestionSchema], // embedded on creation
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const TestModel = mongoose.model("Test", TestSchema);
export default TestModel;

export interface IQuestion {
  questionText: string;
  sampleInput?: string;
  expectedOutput: string;
}