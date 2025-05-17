import User from "../models/user";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { responseFun } from "../utils/responseFun";
import expiretime from "../utils/expireTimeFun";
import { Request, Response } from "express";
import { mailOptionsForVerify, transporterFun } from "../utils/sendEmailFun";

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
      { id: user._id },
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

    return responseFun(res, 200, "Login successful", true);
  } catch (error) {
    responseFun(res, 500, "unexpected error occurred while sign in", false);
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return responseFun(res, 400, "Profile not found", false);
    }
    return responseFun(res, 200, "User Found", true, user);
  } catch (error) {
    responseFun(
      res,
      500,
      "unexpected error occurred while fetching user",
      false
    );
  }
};

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

export {
  registerUser,
  login,
  getMe,
  // logOut,
};
