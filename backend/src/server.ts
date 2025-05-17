import DBConnect from "./MongoDB/index";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

//routes
import userRoutes from "./routes/userRoutes";
import testRoutes from "./routes/testRoutes";
import authRoutes from "./routes/authRoutes";

const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allows cookies and headers like Authorization
};

dotenv.config();
const app = express();
DBConnect();

app.use(express.json());
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//userRoutes
app.use("/api/user", userRoutes);
//authRoutes
app.use("/api/auth", authRoutes);
//testRoutes
app.use("/api/test", testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT} `));
