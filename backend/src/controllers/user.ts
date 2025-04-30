import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import responseFun from "../utils/responseFun";
import { Request, Response } from "express";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseFun(res, 409, "User already exists ", false);
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (!user) {
      return responseFun(res, 500, "Failed to create user", false);
    }

    const hashedPass = await bcrypt.hash(password, 10);
    user.password = hashedPass;

    await user.save();

    responseFun(res, 201, "New user created ", true);
  } catch (error) {
    responseFun(res, 500, "unexpected error occurred while sign up", false);
  }
};

// const verifyUser = async (req, res) => {
//   try {
//     const { token } = req.params;

//     if (!token) {
//       return responseFun(res, 400, "Token not found", false);
//     }

//     const user = await User.findOne({ verificationToken: token });
//     if (!user) {
//       return responseFun(res, 400, "User not found", false);
//     }
//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     responseFun(res, 200, "User verified successfully", true);
//   } catch (error) {
//     responseFun(res, 400, "User not verified", false);
//   }
// };

const login = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return responseFun(res, 404, "User not found", false);
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

// const forgotPass = async (req, res) => {
//   try {
//     console.log("entered in api");
//     const { email } = req.body;

//     if (!email) {
//       return responseFun(res, 400, "Email is required", false);
//     }
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return responseFun(res, 400, "User not found", false);
//     }

//     const token = crypto.randomBytes(32).toString("hex");
//     console.log(token);
//     user.resetPasswordToken = token;
//     const time = expireTime();
//     user.resetPasswordExpire = time;
//     await user.save();

//     await nodemailer.createTestAccount();

//     const transporter = transporterFun();

//     await transporter.sendMail(mailOptionsForreset(email, token));

//     return responseFun(
//       res,
//       200,
//       "Verification link send to ur email-ID click to reset Password",
//       true
//     );
//   } catch (error) {}
// };

// const resetPass = async (req, res) => {
//   const token = req.params.id;
//   const { password } = req.body;

//   if (!token) {
//     return responseFun(res, 400, "Token not found", false);
//   }
//   const user = await UserModel.findOne({
//     resetPasswordToken: token,
//   });
//   if (!user) {
//     return responseFun(res, 400, "User not found", false);
//   }
//   const expireTime = user.resetPasswordExpire;
//   const currentTime = new Date();

//   if (currentTime > expireTime) {
//     return responseFun(res, 400, "reset token is expired", false);
//   }

//   user.resetPasswordToken = undefined;
//   await user.save();

//   const hashedPass = await bcrypt.hash(password, 10);
//   user.password = hashedPass;
//   await user.save();
//   responseFun(res, 201, "Password reset sucessfully", true);
// };
export {
  registerUser,
  // verifyUser,
  login,
  // getMe,
  // logOut,
  // changePassword,
  // forgotPass,
  // resetPass,
};
