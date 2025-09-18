"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const controller_1 = require("./controller");
const validator_1 = require("./validator");
const utils_1 = require("../utils");
exports.AuthRouter = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage }).fields([
    { name: "driversLicence", maxCount: 1 },
    { name: "passport", maxCount: 1 },
]);
//Send Email Registration OTP
exports.AuthRouter.post("/send/email/otp", [upload, validator_1.authValidator.validateEmail], utils_1.utils.wrapAsync(controller_1.authController.createAccount));
//Create account
exports.AuthRouter.patch("/signup", [upload, validator_1.authValidator.registerUser], utils_1.utils.wrapAsync(controller_1.authController.registerUser));
// Verify Email
exports.AuthRouter.post("/verify/email", [validator_1.authValidator.emailVerifyOtp], utils_1.utils.wrapAsync(controller_1.authController.emailVerifyOtp));
//Resend email verification otp
exports.AuthRouter.post("/resend/email/verification/otp", [validator_1.authValidator.validateEmail], utils_1.utils.wrapAsync(controller_1.authController.resendEmailVerificationOtp));
