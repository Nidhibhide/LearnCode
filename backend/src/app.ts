// app.ts

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import allroutes from "./routes/index";

const app = express();

// Needed so rate limiting uses the real client IP behind proxies
app.set("trust proxy", 1);

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://learn-code-three.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("combined"));

// Custom Logger
app.use((req, res, next) => {
  console.log(`API Hit → ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api", apiLimiter);
app.use("/api", allroutes);

export default app;