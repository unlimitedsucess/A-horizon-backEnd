import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { AccountType } from "../user/enum";

class TransactionValidator {
  public async validateTransfer(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      accountType: Joi.string()
        .valid(...Object.values(AccountType))
        .required()
        .messages({
          "any.only": `Account type must be one of: ${Object.values(
            AccountType
          ).join(", ")}`,
          "any.required": "Account type is required",
        }),

      recipientName: Joi.string().required().messages({
        "string.base": "Recipient name must be text",
        "any.required": "Recipient name is required",
      }),

      accountName: Joi.string().required().messages({
        "string.base": "Account name must be text",
        "any.required": "Account name is required",
      }),

      country: Joi.string().required().messages({
        "string.base": "Country must be text",
        "any.required": "Country is required",
      }),

      swiftCode: Joi.string().required().messages({
        "string.base": "Swift code must be text",
        "any.required": "Swift code is required",
      }),

      pin: Joi.string().required().messages({
        "string.base": "Pin must be text",
        "any.required": "Pin is required",
      }),

      routingNumber: Joi.string().required().messages({
        "string.base": "Routing number must be text",
        "any.required": "Routing number is required",
      }),

      description: Joi.string().optional().messages({
        "string.base": "Description must be text",
      }),

      amount: Joi.number().min(0).required().messages({
        "number.base": "Amount must be a number",
        "number.min": "Amount cannot be less than 0",
        "any.required": "Amount is required",
      }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }

    return next();
  }

}

export const transactionValidator = new TransactionValidator();
