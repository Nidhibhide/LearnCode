import { CookieOptions } from "express";

//set token in cookie
export const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
};

//set token in cookie
export const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 60 * 60 * 1000,//1 hr
};

export const clearCookies: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};