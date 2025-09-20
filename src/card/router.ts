import { Router } from "express";

import { utils } from "../utils";
import { isAuth } from "../middleware/isAuth";
import GeneralMiddleware from "../middleware/general";
import { cardValidator } from "./validator";
import { cardController } from "./controller";

export const CardRouter = Router();

//Create Card
CardRouter.post(
  "/create",
  [isAuth, GeneralMiddleware.isUserActive, cardValidator.validateCardApplication],
  utils.wrapAsync(cardController.createCard)
);


//Fetch User cars
CardRouter.get(
  "/all",
  [isAuth, GeneralMiddleware.isUserActive],
  utils.wrapAsync(cardController.fetchUserCard)
);