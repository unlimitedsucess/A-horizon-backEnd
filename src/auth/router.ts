import { Router } from "express";
import multer from "multer";

import { authController } from "./controller";
import { authValidator } from "./validator";
import { utils } from "../utils";

export const AuthRouter = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).fields([
  { name: "driversLicence", maxCount: 1 },
  { name: "passport", maxCount: 1 },
]);

//Send Email Registration OTP
AuthRouter.post(
  "/send/email/otp",
  [upload, authValidator.validateEmail ],
 utils.wrapAsync(authController.createAccount)
);

//Create account
AuthRouter.patch(
  "/signup",
  [upload, authValidator.registerUser ],
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