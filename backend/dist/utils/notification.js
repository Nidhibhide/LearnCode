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
exports.socketService = void 0;
exports.sendToUser = sendToUser;
exports.sendWelcomeMessage = sendWelcomeMessage;
exports.notifyAdminOfNewUser = notifyAdminOfNewUser;
const socket_io_1 = require("socket.io");
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
let io;
const socketService = (server) => {
    try {
        // Create HTTP server and attach Socket.IO
        io = new socket_io_1.Server(server, {
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
            console.log("User connected", socket === null || socket === void 0 ? void 0 : socket.id); //due to this user is online
            socket.on("register", (payload) => __awaiter(void 0, void 0, void 0, function* () {
                const { userId } = payload;
                socket.join(userId); //Join a room
                console.log(`Socket ${socket.id} → joined personal room [${userId}]`);
                try {
                    const unread = yield notification_1.default.find({
                        userId,
                        read: false,
                    }).lean();
                    socket.emit("demo", unread);
                    socket.emit("notificationCount", { count: unread === null || unread === void 0 ? void 0 : unread.length });
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
function sendToUser(userId, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const savedNotification = yield notification_1.default.create({
                userId,
                title: payload.title,
                message: payload.message,
                type: payload.type || "info",
            });
            io.to(userId).emit("demo", [savedNotification]);
            const unread = yield notification_1.default.find({ userId, read: false }).lean();
            io.to(userId).emit("notificationCount", { count: unread === null || unread === void 0 ? void 0 : unread.length });
        }
        catch (err) {
            console.error("sendToUser error:", err);
        }
    });
}
function sendWelcomeMessage(userId, name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sendToUser(userId, {
            type: "success",
            title: "Welcome to LearnCode!",
            message: `Hi ${name}, we're excited to have you on board! Explore tutorials, take quizzes, and enhance your learning journey!`,
        });
    });
}
function notifyAdminOfNewUser(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield user_1.default.findOne({ role: "admin" });
        if (admin) {
            yield sendToUser(admin._id.toString(), {
                type: "info",
                title: "New User Registered",
                message: `A new user, ${name}, has successfully registered on LearnCode. You can view their profile and track their activity in the dashboard.`,
            });
        }
    });
}
//# sourceMappingURL=notification.js.map