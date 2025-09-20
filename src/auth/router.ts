import { Router } from "express";

import { authController } from "./controller";
import { authValidator } from "./validator";
import { utils } from "../utils";

export const AuthRouter = Router();

//Send Email Registration OTP
AuthRouter.post(
  "/send/email/otp",
  [authValidator.validateEmail],
  utils.wrapAsync(authController.createAccount)
);

//Create account
AuthRouter.patch(
  "/signup",
  [authValidator.handleFileUpload, authValidator.registerUser],
  utils.wrapAsync(authController.registerUser)
);

// Verify Email
AuthRouter.post(
  "/verify/email",
  [authValidator.emailVerifyOtp],
  utils.wrapAsync(authController.emailVerifyOtp)
);

//Resend email verification otp
AuthRouter.post(
  "/resend/email/verification/otp",
  [authValidator.validateEmail],
  utils.wrapAsync(authController.resendEmailVerificationOtp)
);

//Login account
AuthRouter.post(
  "/signin",
  [authValidator.signIn],
  utils.wrapAsync(authController.signIn)
);

//Genare otp for forgot password request
AuthRouter.post(
  "/forgot/password", // For FormData
  [authValidator.validateEmail],
  utils.wrapAsync(authController.generateOtpForForgotPassword)
);

//change password after forgot ppassword request
AuthRouter.post(
  "/forgot/password/change",
  [authValidator.forgotPasswordChange],
  utils.wrapAsync(authController.forgotPasswordChange)
);
