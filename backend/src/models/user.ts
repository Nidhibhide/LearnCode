import mongoose from "mongoose";

const UserSchmea = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  } // auto adds createdAt and updatedAt
);

const UserModel = mongoose.model("User", UserSchmea);

export default UserModel;

