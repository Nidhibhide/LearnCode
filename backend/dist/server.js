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
const index_1 = __importDefault(require("./MongoDB/index"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notification_1 = require("./utils/notification");
const index_2 = __importDefault(require("./routes/index"));
const corsOptions = {
    origin: ["http://localhost:5173", "https://learn-code-three.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
dotenv_1.default.config();
const app = (0, express_1.default)();
// Await the database connection to ensure it's ready before starting the server.
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, index_1.default)();
        console.log(" MongoDB connected");
    }
    catch (err) {
        console.error(" MongoDB connection failed", err);
        process.exit(1);
    }
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
    // Add Morgan logging
    app.use((0, morgan_1.default)("combined"));
    app.use((req, res, next) => {
        console.log(`API Hit → Method: ${req.method}, URL: ${req.originalUrl}`);
        next();
    });
    // ✅ Mount router correctly
    app.use("/api", index_2.default); // pass router object directly
    const PORT = process.env.PORT || 8080;
    // Corrected fix:
    // Use an object with host and port to listen on all network interfaces
    server.listen({ port: PORT, host: "0.0.0.0" }, () => {
        console.log(`Server running on port ${PORT} at host 0.0.0.0`);
    });
});
startServer();
//# sourceMappingURL=server.js.map