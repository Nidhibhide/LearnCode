import { User } from "../models";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import {
  JsonOne,
  expireTime,
  sendWelcomeMessage,
  notifyAdminOfNewUser,
  notifyDobMissing,
  mailOptionsForVerify,
  transporterFun,
  refreshTokenOptions,
  accessTokenOptions,
  clearCookies,
  findUserByEmail,
  handleError,
  isPasswordUsedByOtherUser,
} from "../utils";
import { Request, Response } from "express";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return JsonOne(res, 409, "User already exists ", false);
    }

    // Check if password is already used by someone else with the same role
    const passwordInUse = await isPasswordUsedByOtherUser(password, role);
    if (passwordInUse) {
      return JsonOne(res, 400, "This password is already in use by another user. Please choose a different password.", false);
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const time = expireTime();
    const token = crypto.randomBytes(12).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      expireTime: time,
      verificationToken: token,
      role: role || "student",
    });

    if (!user) {
      return JsonOne(res, 500, "Failed to create user", false);
    }

    await sendWelcomeMessage(user._id.toString(), name);
    // Only notify admin if the new user is NOT an admin
    if (role !== "admin") {
      await notifyAdminOfNewUser(name);
    }

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
    return handleError(res, "unexpected error occurred while sign up");
  }
};

const googleLogin = async (req: Request, res: Response) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;

  try {
    if (!token) {
      return JsonOne(res, 404, "Google token not found", false);
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return JsonOne(res, 401, "Invalid Google token", false);

    const { email, name, sub } = payload;
    if (!email || !name || !sub) {
      return JsonOne(res, 400, "Incomplete Google user data", false);
    }

     let user = await findUserByEmail(email);

    // If user exists but with different auth provider, return error
    if (user && user.authProvider && user.authProvider !== "google") {
      const providerName = user.authProvider === "local" ? "Credential login" : "sign in with Google";
      return JsonOne(res, 400, `This email is already registered with ${providerName}. Please use your that method.`, false);
    }

    // If user doesn't exist, create a new one
    if (!user) {
      const hashedPass = await bcrypt.hash(sub, 10);
      user = await User.create({
        name,
        email,
        password: hashedPass,
        isVerified: true,
        role: "student",
        authProvider: "google",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return JsonOne(res, 400, "User is not verified", false);
    }

    // Check if user is blocked (same as login)
    if (user.isBlocked) {
      return JsonOne(
        res,
        403,
        "Account is blocked due to multiple failed login attempts. Please reset your password.",
        false
      );
    }

   
    // Reset failed attempts and update last login (same as login)
    user.failedAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    // Check and notify if DOB is missing
    await notifyDobMissing(user._id.toString());

    const access_token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN as string,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", access_token, accessTokenOptions);

    const refresh_token = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN as string,
      { expiresIn: "7d" }
    );
    res.cookie("refresh_token", refresh_token, refreshTokenOptions);

    return JsonOne(res, 200, "Login successful", true);
  } catch (err: any) {
    console.error("Google login failed:", err.message || err);
    return JsonOne(res, 500, "Google login failed", false);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { password, email, role } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      return JsonOne(res, 404, "User or password not found", false);
    }
    if (!user.isVerified) {
      return JsonOne(res, 400, "User is not verified", false);
    }
    if (user.isBlocked) {
      return JsonOne(
        res,
        403,
        "Account is blocked due to multiple failed login attempts. Please reset your password.",
        false
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedAttempts += 1;
      if (
        user.failedAttempts >= parseInt(process.env.MAX_FAILED_ATTEMPTS || "3")
      ) {
        user.isBlocked = true;
      }
      await user.save();
      return JsonOne(res, 401, "Incorrect password", false);
    }

    // Successful login
    user.failedAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    // Check and notify if DOB is missing
    await notifyDobMissing(user._id.toString());

    const access_token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN as string,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", access_token, accessTokenOptions);

    const refresh_token = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN as string,
      { expiresIn: "7d" }
    );
    res.cookie("refresh_token", refresh_token, refreshTokenOptions);

    return JsonOne(res, 200, "Login successful", true);
  } catch (error) {
    return handleError(res, "unexpected error occurred while sign in");
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return JsonOne(res, 404, "Profile not found", false);
    }
    return JsonOne(res, 200, "User Found", true, user);
  } catch (error) {
    return handleError(res, "unexpected error occurred while fetching user");
  }
};

const logOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token", clearCookies);
    res.clearCookie("refresh_token", clearCookies);
    return JsonOne(res, 200, "Logout successfully", true);
  } catch (error) {
    return handleError(res, "unexpected error occurred while logging out");
  }
};
const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, dob } = req.body;
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return JsonOne(res, 404, "User not found", false);
    }
    
    if (user?.authProvider === "google" && email !== user?.email) {
      return JsonOne(
        res,
        400,
        "Cannot update email for Google-authenticated users",
        false
      );
    }

    // If email is being changed, send verification email
    if (email && email !== user.email) {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return JsonOne(res, 400, "Email already in use", false);
      }

      // Create token with user ID and new email
      const token = jwt.sign({ id: user._id, newEmail: email }, process.env.ACCESS_TOKEN as string, { expiresIn: "10m" });
      
      await nodemailer.createTestAccount();
      const transporter = transporterFun();
      await transporter.sendMail(mailOptionsForVerify(email, token));

      return JsonOne(res, 200, `Verification email sent to ${email}. Verify to complete email change.`, true);
    }

    // Update name only
    if (name) {
      user.name = name;
    }

    // Update dob - convert to ISO format
    if (dob) {
      user.dob = new Date(dob);
    }

    await user.save();

    const updatedUser = await User.findById(id).select("createdAt email isVerified name role _id lastLogin dob");
    
    if (!updatedUser) {
      return JsonOne(res, 404, "User not found", false);
    }
    
    JsonOne(res, 200, "Profile updated successfully", true, updatedUser);
  } catch (err) {
    return handleError(res, "unexpected error occurred while updating user");
  }
};

const verifyEmailChange = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return JsonOne(res, 401, "Token not provided", false);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string) as { id: string; newEmail: string };
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return JsonOne(res, 404, "User not found", false);
    }

    // Update email
    user.email = decoded.newEmail;
    await user.save();

    JsonOne(res, 200, "Email changed successfully", true);
  } catch (err) {
    return JsonOne(res, 400, "Invalid or expired token", false);
  }
};

export { registerUser, login, getMe, logOut, updateProfile, googleLogin, verifyEmailChange };
