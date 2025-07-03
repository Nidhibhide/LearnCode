import User from "../models/user";
import nodemailer from "nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { JsonOne } from "../utils/responseFun";
import expiretime from "../utils/expireTimeFun";
import {  Request, RequestHandler, Response } from "express";
import {
  mailOptionsForVResetPass,
  mailOptionsForVerify,
  transporterFun,
} from "../utils/sendEmailFun";
import expireTime from "../utils/expireTimeFun";
import { accessTokenOptions } from "../utils/cookieOptions";

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
    if (!user.password) {
      return JsonOne(res, 404, "User stored password not found", false);
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
const verifyUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      return JsonOne(res, 401, "Token not provided!!", false);
    }
    const user = await User.findOne({ verificationToken: token });

    if (user?.isVerified) {
      return JsonOne(res, 400, "User already verified!!", true);
    }

    if (!user?.expireTime || new Date() > user.expireTime) {
      return JsonOne(res, 400, "Verification link expired!!", false);
    }

    // Mark user as verified
    user.isVerified = true;
    // user.verificationToken = undefined;
    await user.save();

    return JsonOne(res, 200, "Verification Done!!", true);
  } catch (error) {
    return JsonOne(res, 500, "Verification Failed", false);
  }
};

const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return JsonOne(res, 404, "User not found", false);
    }

    const token = crypto.randomBytes(12).toString("hex");

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
  try {
    const { token } = req.params;

    if (!token) {
      return JsonOne(res, 401, "Token not provided!!", false);
    }

    const user = await User.findOne(
      { resetPasswordToken: token },
      { resetPasswordExpire: 1, email: 1 }
    );

    if (!user || !user.resetPasswordExpire) {
      return JsonOne(res, 404, "User not found!!", false);
    }
    const expireTime = user?.resetPasswordExpire;
    const currentTime = new Date();

    if (currentTime > expireTime) {
      return JsonOne(res, 400, "Verification link expired!!", false);
    }

    return JsonOne(res, 200, "success!!", true, user);
  } catch (error) {
    return JsonOne(res, 500, "reset password Failed", false);
  }
};

const checkToken = async (req: Request, res: Response) => {
  const token = req.cookies.access_token;

  if (!token) {
    return JsonOne(res, 404, "Token not found", false);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    return JsonOne(res, 200, "Token valid", true);
  } catch (err) {
    return JsonOne(res, 500, "Token expired or invalid", false);
  }
};
const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;

  if (!token) {
    return JsonOne(res, 404, "Token not found", false);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;

    const jwtToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN as string,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("access_token", jwtToken,accessTokenOptions);

    return JsonOne(res, 200, "Token refreshed successfully", true);
  } catch (err) {
    return JsonOne(res, 500, "Refresh Token expired or invalid", false);
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
  refreshToken
};
