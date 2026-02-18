import mongoose from "mongoose";

const UserSchmea = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    expireTime: { type: Date, required: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    authProvider: {
      type: String,
      enum: ["google", "local"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    failedAttempts: { type: Number, default: 0 },
    lastLogin: { type: Date },
    isBlocked: { type: Boolean, default: false },
    passwordHistory: { type: [String], default: [] },
  },
  {
    timestamps: true,
  } // auto adds createdAt and updatedAt
);

const UserModel = mongoose.model("User", UserSchmea);

export default UserModel;
