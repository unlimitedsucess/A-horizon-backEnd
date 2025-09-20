"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const validator_1 = require("./validator");
const utils_1 = require("../utils");
exports.AuthRouter = (0, express_1.Router)();
//Send Email Registration OTP
exports.AuthRouter.post("/send/email/otp", [validator_1.authValidator.validateEmail], utils_1.utils.wrapAsync(controller_1.authController.createAccount));
//Create account
exports.AuthRouter.patch("/signup", [validator_1.authValidator.handleFileUpload, validator_1.authValidator.registerUser], utils_1.utils.wrapAsync(controller_1.authController.registerUser));
// Verify Email
exports.AuthRouter.post("/verify/email", [validator_1.authValidator.emailVerifyOtp], utils_1.utils.wrapAsync(controller_1.authController.emailVerifyOtp));
//Resend email verification otp
exports.AuthRouter.post("/resend/email/verification/otp", [validator_1.authValidator.validateEmail], utils_1.utils.wrapAsync(controller_1.authController.resendEmailVerificationOtp));
//Login account
exports.AuthRouter.post("/signin", [validator_1.authValidator.signIn], utils_1.utils.wrapAsync(controller_1.authController.signIn));
//Genare otp for forgot password request
exports.AuthRouter.post("/forgot/password", // For FormData
[validator_1.authValidator.validateEmail], utils_1.utils.wrapAsync(controller_1.authController.generateOtpForForgotPassword));
//change password after forgot ppassword request
exports.AuthRouter.post("/forgot/password/change", [validator_1.authValidator.forgotPasswordChange], utils_1.utils.wrapAsync(controller_1.authController.forgotPasswordChange));
