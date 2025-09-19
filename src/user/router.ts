import { Router } from "express";

import { isAuth } from "../middleware/isAuth";
import { utils } from "../utils";
import { userController } from "./controller";
import GeneralMiddleware from "../middleware/general";

export const UserRouter = Router();

//Get user information
UserRouter.get(
  "/user",
  [isAuth, GeneralMiddleware.isUserActive],
  utils.wrapAsync(userController.fetchUserDetails)
);
