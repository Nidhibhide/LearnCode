import User from "../models/user";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { JsonOne } from "../utils/responseFun";
import expiretime from "../utils/expireTimeFun";
import { Request, Response } from "express";
import {
  sendWelcomeMessage,
  notifyAdminOfNewUser,
} from "../utils/notification";
import { mailOptionsForVerify, transporterFun } from "../utils/sendEmailFun";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return JsonOne(res, 409, "User already exists ", false);
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (!user) {
      return JsonOne(res, 500, "Failed to create user", false);
    }

    const hashedPass = await bcrypt.hash(password, 10);
    user.password = hashedPass;

    const time = expiretime();
    user.expireTime = time;

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;

    await user.save();

    await sendWelcomeMessage(user._id.toString(), name);
    await notifyAdminOfNewUser(name);

    await nodemailer.createTestAccount();

    const transporter = transporterFun();

    await transporter.sendMail(mailOptionsForVerify(email, token));

    JsonOne(
      res,
      201,
      `User registered successfully. Verification email has been sent to ${email}  `,
      true
    );
  } catch (error) {
    JsonOne(res, 500, "unexpected error occurred while sign up", false);
  }
};

const googleLogin = async (req: Request, res: Response) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;

  try {
    if (!token) {
      return JsonOne(res, 400, "Google token is required", false);
    }
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return JsonOne(res, 404, "Invalid Google token", false);

    const { email, name, sub } = payload;
    if (!email || !name || !sub) {
      return JsonOne(res, 400, "Incomplete Google user data", false);
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: sub,
        isVerified: true,
        role: "user",
        authProvider: "google",
      });

      if (!user) {
        return JsonOne(res, 500, "Failed to create user", false);
      }
      const hashedPass = await bcrypt.hash(sub, 10);
      user.password = hashedPass;

      await user.save();

      await sendWelcomeMessage(user._id.toString(), name);
      await notifyAdminOfNewUser(name);
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1h",
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    };

    res.cookie("token", jwtToken, cookieOptions);

    return JsonOne(res, 200, "Login successful", true);
  } catch (err) {
    JsonOne(res, 500, "Google login failed", false);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return JsonOne(res, 404, "User or password not found not found", false);
    }
    if (!user.isVerified) {
      return JsonOne(res, 403, "User is not verified", false);
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return JsonOne(res, 401, "Incorrect password", false);
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
    //     const cookieOptions = {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "None",
    //   maxAge: 60 * 60 * 1000,
    // }; this i can use for mobile & laptop both in secure way
    res.cookie("token", token, cookieOptions);

    return JsonOne(res, 200, "Login successful", true);
  } catch (error) {
    JsonOne(res, 500, "unexpected error occurred while sign in", false);
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return JsonOne(res, 400, "Profile not found", false);
    }
    return JsonOne(res, 200, "User Found", true, user);
  } catch (error) {
    JsonOne(res, 500, "unexpected error occurred while fetching user", false);
  }
};

const logOut = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {});
    const token = req.cookies?.token;

    return JsonOne(res, 200, "Logout successfully", true);
  } catch (error) {
    JsonOne(res, 500, "unexpected error occurred while logging out ", false);
  }
};
const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;
    const user = await User.findById(id);
    if (user?.authProvider === "google" && email !== user?.email) {
      return JsonOne(
        res,
        400,
        "Cannot update email for Google-authenticated users",
        false
      );
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).select("createdAt email isVerified name role _id");

    if (!updatedUser) {
      return JsonOne(res, 404, "User not found", false);
    }
    JsonOne(res, 201, "Profile updated successfully", true, updatedUser);
  } catch (err) {
    JsonOne(res, 500, "unexpected error occurred while updating user", false);
  }
};

export { registerUser, login, getMe, logOut, updateProfile, googleLogin };
