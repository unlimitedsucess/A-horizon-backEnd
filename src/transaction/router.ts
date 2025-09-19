import { Router } from "express";

import { isAuth } from "../middleware/isAuth";
import { utils } from "../utils";
import GeneralMiddleware from "../middleware/general";
import { transactionValidator } from "./validator";
import { transactionController } from "./controller";

export const TransactionRouter = Router();

//Wire TF
TransactionRouter.post(
  "/transfer/wire",
  [
    isAuth,
    GeneralMiddleware.isUserActive,
    transactionValidator.validateWireTransfer,
  ],
  utils.wrapAsync(transactionController.createWireTransfer)
);

//Domestic TF
TransactionRouter.post(
  "/transfer/domestic",
  [
    isAuth,
    GeneralMiddleware.isUserActive,
    transactionValidator.validateDomesticTransfer,
  ],
  utils.wrapAsync(transactionController.createDomesticTransfer)
);

TransactionRouter.get(
  "/history",
  [isAuth, GeneralMiddleware.isUserActive],
  utils.wrapAsync(transactionController.fetchTransactionHistory)
);
