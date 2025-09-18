import { Router } from "express";

import { isAuth } from "../middleware/isAuth";
import { utils } from "../utils";
import { userController } from "./controller";


export const UserRouter = Router();

//Get user information
UserRouter.get(
  "/user",
  [isAuth],
 utils.wrapAsync(userController.fetchUserDetails)
);



