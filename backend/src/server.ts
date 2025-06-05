import DBConnect from "./MongoDB/index";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import {socketService} from "./utils/notification"


//routes
import userRoutes from "./routes/userRoutes";
import testRoutes from "./routes/testRoutes";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import testAttemptRoutes from "./routes/testAttempt";
import notificationRoutes from "./routes/notificationRoutes";

const corsOptions = {
  origin: ["http://localhost:5173", "https://learn-code-three.vercel.app"], // Frontend origin
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
const server = http.createServer(app);
socketService(server);

//userRoutes
app.use("/api/user", userRoutes);
//authRoutes
app.use("/api/auth", authRoutes);
//testRoutes
app.use("/api/test", testRoutes);
//aiRoutes
app.use("/api/ai", aiRoutes);
//testAttemptRoutes
app.use("/api/testAttempt", testAttemptRoutes);
//notificationRoutes
app.use("/api/notification", notificationRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(` Server running on port ${PORT} `));
