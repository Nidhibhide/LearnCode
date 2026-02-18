import http from "http";
import { Server } from "socket.io";
import Notification from "../models/notification";
import User from "../models/user";
let io: Server;
export const socketService = (server: http.Server) => {
  try {
    // Create HTTP server and attach Socket.IO

    io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:5173",
          "http://localhost:5174",
          "https://learn-code-three.vercel.app",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected", socket?.id); //due to this user is online

      socket.on("register", async (payload: { userId: string }) => {
        const { userId } = payload;

        socket.join(userId); //Join a room

        console.log(`Socket ${socket.id} → joined personal room [${userId}]`);
        try {
          console.log("userID"+userId)
          // Get unread notifications
          const unreadNotifications = await Notification.find({
            userId,
            read: false
          }).lean();

          // Get read notifications
          const readNotifications = await Notification.find({
            userId,
            read: true
          }).lean();

          // Send unread notifications
          socket.emit("unreadNotifications", unreadNotifications);
          // Send read notifications
          socket.emit("readNotifications", readNotifications);
        } catch (e) {
          console.log(e);
        }
      });
      socket.on("disconnect", () => {
        console.log("Disconnected", socket.id);
      });
    });
  } catch (e) {
    console.log(e);
  }
};

export async function sendToUser(
  userId: string,
  payload: {
    title: string;
    message: string;
    type?: "info" | "success";
  }
) {
  try {
    const savedNotification = await Notification.create({
      userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || "info",
    });

    io.to(userId).emit("unreadNotifications", [savedNotification]);
  } catch (err) {
    console.error("sendToUser error:", err);
  }
}

export async function sendWelcomeMessage(userId: string, name: string) {
  await sendToUser(userId, {
    type: "success",
    title: "Welcome to LearnCode!",
    message: `Hi ${name}, we're excited to have you on board! Explore tutorials, take quizzes, and enhance your learning journey!`,
  });
}

export async function notifyAdminOfNewUser(name: string) {
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    await sendToUser(admin._id.toString(), {
      type: "info",
      title: "New User Registered",
      message: `A new user, ${name}, has successfully registered on LearnCode. You can view their profile and track their activity in the dashboard.`,
    });
  }
}
