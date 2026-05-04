// app.ts

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import allroutes from "./routes/index";

const app = express();

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
app.use("/api", allroutes);

export default app;