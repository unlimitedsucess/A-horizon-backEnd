"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const reachOutSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    departmentToEmail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});
const ReachOut = mongoose_1.default.model("ReachOut", reachOutSchema);
exports.default = ReachOut;
