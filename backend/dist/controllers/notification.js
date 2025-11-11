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
exports.update = exports.getAllByUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const getAllByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ObjectId = new mongoose_1.default.Types.ObjectId(id);
        const { search = "", type = "All", } = req.query;
        const { skip, sort, page, limit } = (0, utils_1.getPaginationParams)(req);
        const matchStage = {
            userId: ObjectId, // match notifications for a specific user
            $or: [
                { message: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
            ],
        };
        if (type && type !== "All") {
            matchStage["type"] = type;
        }
        const aggregation = (0, utils_1.buildAggregationPipeline)(matchStage, sort, skip, limit, {
            message: 1,
            type: 1,
            title: 1,
            read: 1,
            createdAt: 1,
        });
        const data = yield models_1.Notification.aggregate(aggregation);
        const total = yield models_1.Notification.countDocuments(matchStage);
        (0, utils_1.JsonAll)(res, 200, "Notifications fetched successfully", data, total, page, limit);
    }
    catch (error) {
        console.error(error);
        return (0, utils_1.handleError)(res, "Unexpected error occurred while fetching notifications");
    }
});
exports.getAllByUser = getAllByUser;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updated = yield models_1.Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!updated) {
            return (0, utils_1.JsonOne)(res, 404, "Notification not found", false);
        }
        return (0, utils_1.JsonOne)(res, 200, "Notification marked as read", true, updated);
    }
    catch (error) {
        console.error(error);
        return (0, utils_1.handleError)(res, "Error updating notification");
    }
});
exports.update = update;
//# sourceMappingURL=notification.js.map