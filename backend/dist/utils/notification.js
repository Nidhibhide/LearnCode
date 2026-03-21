"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUpcomingBirthday = exports.socketService = exports.io = void 0;
exports.sendToUser = sendToUser;
exports.sendWelcomeMessage = sendWelcomeMessage;
exports.notifyAdminOfNewUser = notifyAdminOfNewUser;
exports.notifyDobMissing = notifyDobMissing;
const socket_io_1 = require("socket.io");
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
// Helper function to calculate days until next birthday
const getDaysUntilBirthday = (dob) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birthDate = new Date(dob);
    const currentYear = today.getFullYear();
    // Create birthday for current year
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    // If birthday has passed this year, use next year
    if (nextBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    // Calculate difference in days
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
const socketService = (server) => {
    try {
        // Create HTTP server and attach Socket.IO
        exports.io = new socket_io_1.Server(server, {
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
        exports.io.on("connection", (socket) => {
            console.log("User connected", socket === null || socket === void 0 ? void 0 : socket.id); //due to this user is online
            socket.on("register", (payload) => __awaiter(void 0, void 0, void 0, function* () {
                const { userId } = payload;
                socket.join(userId); //Join a room
                console.log(`Socket ${socket.id} → joined personal room [${userId}]`);
                try {
                    console.log("userID" + userId);
                    // Get unread notifications
                    const unreadNotifications = yield notification_1.default.find({
                        userId,
                        read: false
                    }).lean();
                    // Get read notifications
                    const readNotifications = yield notification_1.default.find({
                        userId,
                        read: true,
                        title: { $ne: "Complete Your Profile" }
                    }).lean();
                    // Send unread notifications
                    socket.emit("unreadNotifications", unreadNotifications);
                    // Send read notifications
                    socket.emit("readNotifications", readNotifications);
                }
                catch (e) {
                    console.log(e);
                }
            }));
            socket.on("disconnect", () => {
                console.log("Disconnected", socket.id);
            });
        });
    }
    catch (e) {
        console.log(e);
    }
};
exports.socketService = socketService;
function sendToUser(userId_1, payload_1) {
    return __awaiter(this, arguments, void 0, function* (userId, payload, pushViaSocket = true // default to push for backward compatibility
    ) {
        try {
            // Check if a notification with the same title already exists for this user to avoid duplicates
            const existingNotification = yield notification_1.default.findOne({
                userId,
                title: payload.title
            }).lean();
            if (existingNotification) {
                return null;
            }
            const savedNotification = yield notification_1.default.create({
                userId,
                title: payload.title,
                message: payload.message,
                type: payload.type || "info",
            });
            // Push via socket only if requested (for real-time notifications)
            if (pushViaSocket && exports.io) {
                exports.io.to(userId).emit("unreadNotifications", [savedNotification]);
            }
            return savedNotification;
        }
        catch (err) {
            console.error("sendToUser error:", err);
            return null;
        }
    });
}
function sendWelcomeMessage(userId, name) {
    return __awaiter(this, void 0, void 0, function* () {
        // Save to DB only - user will see on next page visit
        // No socket push needed since user just registered
        yield sendToUser(userId, {
            type: "success",
            title: "Welcome to LearnCode!",
            message: `Hi ${name}, we're excited to have you on board! Explore tutorials, take quizzes, and enhance your learning journey!`,
        }, false); // false = don't push via socket
    });
}
function notifyAdminOfNewUser(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const admins = yield user_1.default.find({ role: "admin" });
        for (const admin of admins) {
            yield sendToUser(admin._id.toString(), {
                type: "info",
                title: "New User Registered",
                message: `A new user, ${name}, has successfully registered on LearnCode. You can view their profile and track their activity in the dashboard.`,
            });
        }
    });
}
function notifyDobMissing(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findById(userId).lean();
            if (!user) {
                console.error(`User not found: ${userId}`);
                return false;
            }
            // Check if DOB is not set (null, undefined, or not present)
            if (!user.dob) {
                // Save to DB only - user will see when they visit profile page
                // No socket push needed
                yield sendToUser(userId, {
                    type: "warning",
                    title: "Complete Your Profile",
                    message: `Hi ${user.name}, your date of birth is missing. Please update your profile to enjoy personalized features and a better experience!`,
                }, false); // false = don't push via socket
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Error checking DOB:", error);
            return false;
        }
    });
}
// Function to notify user of upcoming birthday (10, 9, 8, 7 days before)
const notifyUpcomingBirthday = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(userId).lean();
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
            const existingNotification = yield notification_1.default.findOne({
                userId,
                title
            }).lean();
            if (existingNotification) {
                // Update the message with current days count and set read to false
                yield notification_1.default.findByIdAndUpdate(existingNotification._id, { message, read: false });
                return true;
            }
            // Create new notification if doesn't exist
            yield sendToUser(userId, {
                type: "success",
                title: title,
                message: message,
            }, false); // false = don't push via socket
            return true;
        }
        return false;
    }
    catch (error) {
        console.error("Error checking upcoming birthday:", error);
        return false;
    }
});
exports.notifyUpcomingBirthday = notifyUpcomingBirthday;
//# sourceMappingURL=notification.js.map