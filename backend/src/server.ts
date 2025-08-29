// import DBConnect from "./MongoDB/index";
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import { socketService } from "./utils/notification";
// import allroutes from "./routes/index";

// //routes
// // import userRoutes from "./routes/userRoutes";
// // import testRoutes from "./routes/testRoutes";
// // import authRoutes from "./routes/authRoutes";
// // import aiRoutes from "./routes/aiRoutes";
// // import testAttemptRoutes from "./routes/testAttempt";
// // import notificationRoutes from "./routes/notificationRoutes";

// const corsOptions = {
//   origin: ["http://localhost:5173", "https://learn-code-three.vercel.app"],
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// dotenv.config();

// const app = express();

// DBConnect()
//   .then(() => console.log(" MongoDB connected"))
//   .catch((err) => {
//     console.error(" MongoDB connection failed", err);
//     process.exit(1);
//   });

// app.use(express.json());

// app.use(cors(corsOptions));

// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const server = http.createServer(app);

// try {
//   socketService(server);
//   console.log("Socket service initialized");
// } catch (err) {
//   console.error(" Socket service failed to initialize", err);
// }
// // Add Morgan logging
// app.use(morgan("combined"));
// app.use((req, res, next) => {
//   console.log(`API Hit → Method: ${req.method}, URL: ${req.originalUrl}`);
//   next();
// });

// // ✅ Mount router correctly
// app.use("/api", allroutes); // pass router object directly
// const PORT = process.env.PORT || 8080;

// // server.listen(PORT, () => {
// //   console.log(` Server running on port ${PORT}`);
// // });
// // Corrected fix:
// // Use an object with host and port to avoid the TypeScript error.
// server.listen({ port: PORT, host: "0.0.0.0" }, () => {
//   console.log(`Server running on port ${PORT} at host 0.0.0.0`);
// });

import DBConnect from "./MongoDB/index";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { socketService } from "./utils/notification";
import allroutes from "./routes/index";

//routes
// import userRoutes from "./routes/userRoutes";
// import testRoutes from "./routes/testRoutes";
// import authRoutes from "./routes/authRoutes";
// import aiRoutes from "./routes/aiRoutes";
// import testAttemptRoutes from "./routes/testAttempt";
// import notificationRoutes from "./routes/notificationRoutes";

const corsOptions = {
  origin: ["http://localhost:5173", "https://learn-code-three.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

dotenv.config();

const app = express();

// Await the database connection to ensure it's ready before starting the server.
const startServer = async () => {
  try {
    await DBConnect();
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" MongoDB connection failed", err);
    process.exit(1);
  }

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

  // ✅ Mount router correctly
  app.use("/api", allroutes); // pass router object directly
  const PORT = process.env.PORT || 8080;

  // Corrected fix:
  // Use an object with host and port to listen on all network interfaces
  server.listen({ port: PORT, host: "0.0.0.0" }, () => {
    console.log(`Server running on port ${PORT} at host 0.0.0.0`);
  });
};

startServer();
