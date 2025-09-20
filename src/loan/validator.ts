import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import multer from "multer";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { AccountType } from "../user/enum";
import { LoanDuration } from "./enum";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).fields([
  { name: "driversLicence", maxCount: 1 },
  { name: "passport", maxCount: 1 },
]);

class LoanValidator {
  public async applyLoan(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      loanAmount: Joi.number().min(0).required().messages({
        "number.base": "Loan Amount must be a number",
        "number.min": "Loan Amount cannot be less than 0",
        "any.required": "Loan Amount is required",
      }),
      loanDuraion: Joi.string()
        .valid(...Object.values(LoanDuration))
        .required()
        .messages({
          "any.only": `Loan duraion must be one of: ${Object.values(
            LoanDuration
          ).join(", ")}`,
          "any.required": "Loan duraion is required",
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }

    return next();
  }
}

export const loanValidator = new LoanValidator();
