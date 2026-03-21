import http from "http";
import { Server } from "socket.io";
import Notification from "../models/notification";
import User from "../models/user";

export let io: Server;

// Helper function to calculate days until next birthday
const getDaysUntilBirthday = (dob: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const birthDate = new Date(dob);
  const currentYear = today.getFullYear();
  
  // Create birthday for current year
  let nextBirthday = new Date(
    currentYear,
    birthDate.getMonth(),
    birthDate.getDate()
  );
  
  // If birthday has passed this year, use next year
  if (nextBirthday < today) {
    nextBirthday = new Date(
      currentYear + 1,
      birthDate.getMonth(),
      birthDate.getDate()
    );
  }
  
  // Calculate difference in days
  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

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
            read: true,
            title: { $ne: "Complete Your Profile" }
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
    type?: "info" | "success" | "warning";
  },
  pushViaSocket: boolean = true // default to push for backward compatibility
) {
  try {
    // Check if a notification with the same title already exists for this user to avoid duplicates
    const existingNotification = await Notification.findOne({
      userId,
      title: payload.title
    }).lean();

    if (existingNotification) {
      return null;
    }

    const savedNotification = await Notification.create({
      userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || "info",
    });

    // Push via socket only if requested (for real-time notifications)
    if (pushViaSocket && io) {
      io.to(userId).emit("unreadNotifications", [savedNotification]);
    }
    return savedNotification;
  } catch (err) {
    console.error("sendToUser error:", err);
    return null;
  }
}

export async function sendWelcomeMessage(userId: string, name: string) {
  // Save to DB only - user will see on next page visit
  // No socket push needed since user just registered
  await sendToUser(userId, {
    type: "success",
    title: "Welcome to LearnCode!",
    message: `Hi ${name}, we're excited to have you on board! Explore tutorials, take quizzes, and enhance your learning journey!`,
  }, false); // false = don't push via socket
}

export async function notifyAdminOfNewUser(name: string) {
  const admins = await User.find({ role: "admin" });
  for (const admin of admins) {
    await sendToUser(admin._id.toString(), {
      type: "info",
      title: "New User Registered",
      message: `A new user, ${name}, has successfully registered on LearnCode. You can view their profile and track their activity in the dashboard.`,
    });
  }
}

export async function notifyDobMissing(userId: string) {
  try {
    const user = await User.findById(userId).lean();
    
    if (!user) {
      console.error(`User not found: ${userId}`);
      return false;
    }

    // Check if DOB is not set (null, undefined, or not present)
    if (!user.dob) {
      // Save to DB only - user will see when they visit profile page
      // No socket push needed
      await sendToUser(userId, {
        type: "warning",
        title: "Complete Your Profile",
        message: `Hi ${user.name}, your date of birth is missing. Please update your profile to enjoy personalized features and a better experience!`,
      }, false); // false = don't push via socket
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking DOB:", error);
    return false;
  }
}

// Function to notify user of upcoming birthday (10, 9, 8, 7 days before)
export const notifyUpcomingBirthday = async (userId: string) => {
  try {
    const user = await User.findById(userId).lean();
    
    if (!user || !user.dob) {
      return false;
    }
    
    const daysUntil = getDaysUntilBirthday(user.dob);
    
    // Show notification if birthday is within 10 days (10, 9, 8, 7, 6, 5, 4, 3, 2, 1 days before or on birthday)
    if (daysUntil >= 0 && daysUntil <= 10) {
      // Use static title so sendToUser's duplicate check prevents multiple notifications
      const title = "Upcoming Birthday";
      const message = daysUntil === 0 
        ? `🎂 Today is ${user.name}'s birthday! Wishing them a very Happy Birthday!`
        : `🎂 ${user.name}'s birthday is in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}!`;

      // Check if notification already exists
      const existingNotification = await Notification.findOne({
        userId,
        title
      }).lean();

      if (existingNotification) {
        // Update the message with current days count and set read to false
        await Notification.findByIdAndUpdate(existingNotification._id, { message, read: false });
        return true;
      }

      // Create new notification if doesn't exist
      await sendToUser(userId, {
        type: "success",
        title: title,
        message: message,
      }, false); // false = don't push via socket
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking upcoming birthday:", error);
    return false;
  }
}
