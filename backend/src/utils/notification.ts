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
          "https://learn-code-three.vercel.app",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected", socket?.id);

      socket.on("register", async (payload: { userId: string }) => {
        const { userId } = payload;

        socket.join(userId); //Join a room

        console.log(`Socket ${socket.id} → joined personal room [${userId}]`);
        try {
          const unread = await Notification.find({
            userId,
            read: false,
          }).lean();

          socket.emit("demo", unread);
          socket.emit("notificationCount", { count: unread?.length });
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
    // 1) Save to DB
    await Notification.create({
      userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || "info",
    });
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
