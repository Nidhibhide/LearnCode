
import responseFun from "../utils/responseFun";
import jwt from "jsonwebtoken";

const IsLoggeedIn = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log(token ? "Token found" : "Token not found");

    if (!token) {
      return responseFun(res, 400, "Token not found", false);
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decode);
    req.user = decode;
    next();
  } catch (error) {
    return responseFun(res, 400, "Invalid or expired Token", false);
  }
};

export default IsLoggeedIn;
