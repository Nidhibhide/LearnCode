import User from "../models/user";
import nodemailer from "nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { JsonOne } from "../utils/responseFun";
import expiretime from "../utils/expireTimeFun";
import { Request, Response } from "express";
import {
  mailOptionsForVResetPass,
  mailOptionsForVerify,
  transporterFun,
} from "../utils/sendEmailFun";
import expireTime from "../utils/expireTimeFun";

const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return JsonOne(res, 404, "User not found", false);
    }

    // Optional: Check if already verified
    if (user.isVerified === true) {
      return JsonOne(res, 400, "User already verified", false);
    }

    // Generate new verification token
    const token = crypto.randomBytes(32).toString("hex");
    const newExpireTime = expiretime();

    user.verificationToken = token;
    user.expireTime = newExpireTime;

    await user.save();

    await nodemailer.createTestAccount();
    const transporter = transporterFun();

    await transporter.sendMail(mailOptionsForVerify(email, token));

    return JsonOne(
      res,
      200,
      `Verification email has been resent to ${email}`,
      true
    );
  } catch (error) {
    return JsonOne(res, 500, "Error while resending verification email", false);
  }
};
const verifyCurrentPassword = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return JsonOne(res, 404, "User not found", false);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return JsonOne(res, 401, "Incorrect password", false);
    }

    return JsonOne(res, 200, "Password Match Found", true);
  } catch (error) {
    JsonOne(
      res,
      500,
      "unexpected error occurred while verify current password",
      false
    );
  }
};
const verifyUser = async (req: Request, res: Response) => {
  try {
 
    const successURL = process.env.VERIFY_SUCCESS_URL;
    const failURL = process.env.VERIFY_FAILURE_URL;
    const { token } = req.params;

    if (!token) {
      return res.redirect(
        `${failURL}?status=fail&message=Token not provided!!`
      );
    }

    const user = await User.findOne({ verificationToken: token });

    if (user?.isVerified) {
      return res.redirect(
        `${successURL}?status=success&message=User already verified!!`
      );
    }

    if (!user?.expireTime || new Date() > user.expireTime) {
      return res.redirect(
        `${failURL}?status=fail&message=Verification link expired!!`
      );
    }

    // Mark user as verified
    user.isVerified = true;
    // user.verificationToken = undefined;
    await user.save();

    return res.redirect(
      `${successURL}?status=success&message=Verification Done!!`
    );
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// const changePassword = async (req, res) => {
//   try {
//     const { oldPass, newPass } = req.body;
//     const id = req.user?.id;

//     if (!newPass || !oldPass) {
//       return JsonOne(res, 400, "All fields are required");
//     }

//     const user = await UserModel.findById(id);
//     if (!user) {
//       return JsonOne(res, 200, "User not found", false);
//     }

//     const isMatch = await bcrypt.compare(oldPass, user.password);

//     if (!isMatch) {
//       return JsonOne(res, 400, "Old password incorrect", false);
//     }

//     const hashedPass = await bcrypt.hash(newPass, 10);
//     user.password = hashedPass;

//     return JsonOne(res, 200, "Password changed successfully", true);
//   } catch (error) {}
// };

const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return JsonOne(res, 400, "User not found", false);
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpire = expireTime();
    await user.save();

    await nodemailer.createTestAccount();

    const transporter = transporterFun();

    const mailOptions = mailOptionsForVResetPass(email, token);

    await transporter.sendMail(mailOptions);

    return JsonOne(
      res,
      200,
      `Verification link sent to ${email}  Click it to reset your password.`,
      true
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return JsonOne(
      res,
      500,
      "Something went wrong. Please try again later.",
      false
    );
  }
};

const resetPass = async (req: Request, res: Response) => {
  const { token } = req.params;
  const RESET_URL = process.env.RESET_URL;

  // const { newPass } = req.body;

  if (!token) {
    return res.redirect(
      `${RESET_URL}?status=fail&message=Token not provided!!`
    );
  }
  const user = await User.findOne({
    resetPasswordToken: token,
  });
  if (!user || !user.resetPasswordExpire) {
    return res.redirect(`${RESET_URL}?status=fail&message=User not found!!`);
  }
  const expireTime = user?.resetPasswordExpire;
  const currentTime = new Date();

  if (currentTime > expireTime) {
    return res.redirect(
      `${RESET_URL}?status=fail&message=Reset link expired!!`
    );
  }

  return res.redirect(`${RESET_URL}?status=success&email=${user?.email}`);
};

const checkToken = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return JsonOne(res, 401, "Token not found", false);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    return JsonOne(res, 200, "Token valid", true);
  } catch (err) {
    return JsonOne(res, 500, "Token expired or invalid", false);
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return JsonOne(res, 404, "User not found", false);
    }

    const hashedPass = await bcrypt.hash(password, 10);
    user.password = hashedPass;

    await user.save();

    return JsonOne(res, 200, "Password reset successfully", true);
  } catch (error) {
    console.error("Error resetting password:", error);
    return JsonOne(res, 500, "Server error", false);
  }
};
export {
  verifyUser,
  resendVerificationEmail,
  changePassword,
  forgotPass,
  resetPass,
  checkToken,
  verifyCurrentPassword,
};
