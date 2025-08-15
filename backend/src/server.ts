import DBConnect from "./MongoDB/index";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { socketService } from "./utils/notification";

//routes
import userRoutes from "./routes/userRoutes";
import testRoutes from "./routes/testRoutes";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import testAttemptRoutes from "./routes/testAttempt";
import notificationRoutes from "./routes/notificationRoutes";

const corsOptions = {
  origin: ["http://localhost:5173", "https://learn-code-three.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

dotenv.config();

const app = express();

DBConnect()
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => {
    console.error(" MongoDB connection failed", err);
    process.exit(1);
  });

app.use(express.json());

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);

try {
  socketService(server);
  console.log("Socket service initialized");
} catch (err) {
  console.error(" Socket service failed to initialize", err);
}
// Add Morgan logging
app.use(morgan("combined"));
app.use((req, res, next) => {
  console.log(`API Hit → Method: ${req.method}, URL: ${req.originalUrl}`);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/testAttempt", testAttemptRoutes);
app.use("/api/notification", notificationRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
