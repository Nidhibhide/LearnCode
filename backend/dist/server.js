"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./MongoDB/index"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notification_1 = require("./utils/notification");
//routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const testAttempt_1 = __importDefault(require("./routes/testAttempt"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const corsOptions = {
    origin: ["http://localhost:5173", "https://learn-code-three.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, index_1.default)()
    .then(() => console.log(" MongoDB connected"))
    .catch((err) => {
    console.error(" MongoDB connection failed", err);
    process.exit(1);
});
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const server = http_1.default.createServer(app);
try {
    (0, notification_1.socketService)(server);
    console.log("Socket service initialized");
}
catch (err) {
    console.error(" Socket service failed to initialize", err);
}
app.use("/api/user", userRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/test", testRoutes_1.default);
app.use("/api/ai", aiRoutes_1.default);
app.use("/api/testAttempt", testAttempt_1.default);
app.use("/api/notification", notificationRoutes_1.default);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map