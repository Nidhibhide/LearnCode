import User from "../models/user";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import responseFun from "../utils/responseFun";
import expiretime from "../utils/expireTimeFun";
import { Request, Response } from "express";
import {
  mailOptionsForVResetPass,
  mailOptionsForVerify,
  transporterFun,
} from "../utils/sendEmailFun";
import expireTime from "../utils/expireTimeFun";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseFun(res, 409, "User already exists ", false);
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    if (!user) {
      return responseFun(res, 500, "Failed to create user", false);
    }

    const hashedPass = await bcrypt.hash(password, 10);
    user.password = hashedPass;

    const time = expiretime();
    user.expireTime = time;

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;

    await user.save();

    await nodemailer.createTestAccount();

    const transporter = transporterFun();

    await transporter.sendMail(mailOptionsForVerify(email, token));

    responseFun(
      res,
      201,
      `User registered successfully. Verification email has been sent to ${email}  `,
      true
    );
  } catch (error) {
    responseFun(res, 500, "unexpected error occurred while sign up", false);
  }
};

const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return responseFun(res, 404, "User not found", false);
    }

    // Optional: Check if already verified
    if (user.isVerified === true) {
      return responseFun(res, 400, "User already verified", false);
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

    return responseFun(
      res,
      200,
      `Verification email has been resent to ${email}`,
      true
    );
  } catch (error) {
    return responseFun(
      res,
      500,
      "Error while resending verification email",
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
      `${successURL}?status=success&message=User verification Done!!`
    );
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return responseFun(res, 404, "User not found", false);
    }
    if (!user.isVerified) {
      return responseFun(res, 403, "User is not verified", false);
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return responseFun(res, 401, "Incorrect password", false);
    }
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1h",
      }
    );

    //set token in cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    return responseFun(
      res,
      200,
      "Login successful",
      true,
      user.isVerified,
      token
    );
  } catch (error) {
    responseFun(res, 500, "unexpected error occurred while sign in", false);
  }
};

// const getMe = async (req, res) => {
//   try {
//     const user = req.user.id;
//     console.log("user = " + user);

//     if (!user) {
//       return responseFun(res, 400, "Profile not found", false);
//     }
//     return responseFun(res, 200, "Profile found", true);
//   } catch (error) {}
// };

// const logOut = async (req, res) => {
//   try {
//     res.cookie("token", "", {});
//     const token = req.cookies?.token;

//     return responseFun(res, 200, "Logout successfully", true);
//   } catch (error) {}
// };

// const changePassword = async (req, res) => {
//   try {
//     const { oldPass, newPass } = req.body;
//     const id = req.user?.id;

//     if (!newPass || !oldPass) {
//       return responseFun(res, 400, "All fields are required");
//     }

//     const user = await UserModel.findById(id);
//     if (!user) {
//       return responseFun(res, 200, "User not found", false);
//     }

//     const isMatch = await bcrypt.compare(oldPass, user.password);

//     if (!isMatch) {
//       return responseFun(res, 400, "Old password incorrect", false);
//     }

//     const hashedPass = await bcrypt.hash(newPass, 10);
//     user.password = hashedPass;

//     return responseFun(res, 200, "Password changed successfully", true);
//   } catch (error) {}
// };

const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return responseFun(res, 400, "User not found", false);
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpire = expireTime();
    await user.save();

    await nodemailer.createTestAccount();

    const transporter = transporterFun();

    const mailOptions = mailOptionsForVResetPass(email, token);

    await transporter.sendMail(mailOptions);

    return responseFun(
      res,
      200,
      `Verification link sent to ${email}  Click it to reset your password.`,
      true
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return responseFun(
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

const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return responseFun(res, 404, "User not found", false);
    }

    const hashedPass = await bcrypt.hash(password, 10);
    user.password = hashedPass;

    await user.save();

    return responseFun(res, 200, "Password reset successfully", true);
  } catch (error) {
    console.error("Error resetting password:", error);
    return responseFun(res, 500, "Server error", false);
  }
};
export {
  registerUser,
  verifyUser,
  resendVerificationEmail,
  login,
  // getMe,
  // logOut,
  changePassword,
  forgotPass,
  resetPass,
};
