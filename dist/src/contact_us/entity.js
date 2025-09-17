"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const contactUsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    issueType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});
const ContactUs = mongoose_1.default.model("ContactUs", contactUsSchema);
exports.default = ContactUs;
