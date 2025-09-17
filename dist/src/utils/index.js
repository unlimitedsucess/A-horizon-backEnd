"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = exports.generateOtp = exports.wrapAsync = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Middleware function to wrap controllers with try-catch
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.wrapAsync = wrapAsync;
const generateOtp = () => {
    return Array.from({ length: 4 }, () => crypto_1.default.randomInt(0, 10)).join('');
};
exports.generateOtp = generateOtp;
const generateOrderId = () => {
    const prefix = "KY";
    const suffix = "US";
    const randomPart = crypto_1.default.randomBytes(3).toString("hex").toUpperCase(); // 3 bytes -> 6 hex characters
    const timestamp = Date.now().toString();
    return `${prefix}${timestamp}${randomPart}${suffix}`;
};
exports.generateOrderId = generateOrderId;
