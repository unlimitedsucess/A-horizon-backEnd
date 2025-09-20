import { Router } from "express";

import { loanValidator } from "./validator";
import { utils } from "../utils";
import { isAuth } from "../middleware/isAuth";
import GeneralMiddleware from "../middleware/general";
import { loanController } from "./controller";

export const LoanRouter = Router();

//Apply Loan
LoanRouter.post(
  "/apply",
  [isAuth, GeneralMiddleware.isUserActive, loanValidator.applyLoan],
  utils.wrapAsync(loanController.applyLoan)
);
