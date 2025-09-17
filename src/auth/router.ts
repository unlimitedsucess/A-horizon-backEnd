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

//Create account
AuthRouter.post(
  "/signup",
  [upload, authValidator.registerUser ],
 utils.wrapAsync(authController.registerUser)
);
