import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { MessageResponse } from "../utils/enum";
import mongoose from "mongoose";
import { AccountStatus, AccountType } from "../user/enum";
import { CardStatus } from "../card/enum";
import { utils } from "../utils";
import {
  TransactionDirection,
  TransactionStatus,
  TransactionType,
  TransferType,
} from "../transaction/enum";

class AdminValidator {
  public async adminLogin(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      userName: Joi.string().required().messages({
        "string.base": "User name must be text",
        "any.required": "User name is required.",
      }),
      password: Joi.string().required().messages({
        "string.base": "Password must be text",
        "any.required": "Password is required.",
      }),
    });
    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }
  }

  public async validateUserAccountStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      userId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message({
              custom: "User id must be a valid ObjectId",
            });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "User id must be a string",
          "any.required": "User id is required",
        }),
      status: Joi.string()
        .valid(...Object.values(AccountStatus))
        .required()
        .messages({
          "any.only": `Account status must be one of: ${Object.values(
            AccountStatus
          ).join(", ")}`,
          "any.required": "Account status is required",
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

  public validateParams(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      id: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message({
              custom: "ID must be a valid ObjectId",
            });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "ID must be a string",
          "any.required": "ID is required",
        }),
    });

    const { error } = schema.validate(req.params);

    if (!error) {
      return next();
    } else {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }
  }

  public async userUpdate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      firstName: Joi.string().required().messages({
        "string.base": "First name must be text",
        "any.required": "First name is required",
      }),
      lastName: Joi.string().required().messages({
        "string.base": "Last name must be text",
        "any.required": "Last name is required",
      }),
      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email address is required",
      }),
      phoneNo: Joi.string()
        .pattern(/^\+?[1-9]\d{6,14}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Please enter a valid international phone number",
          "any.required": "Phone number is required",
        }),
      dob: Joi.string().isoDate().required().messages({
        "string.isoDate": "Date of birth must be a valid ISO date (YYYY-MM-DD)",
        "any.required": "Date of birth is required",
      }),
      zipCode: Joi.string().required().messages({
        "string.base": "Zipcode must be text",
        "any.required": "Zipcode is required",
      }),
      ssn: Joi.string()
        .pattern(
          /^(?!000|666|9\d{2})([0-6]\d{2}|7([0-6]\d|7[012]))-?(?!00)\d{2}-?(?!0000)\d{4}$/
        )
        .required()
        .messages({
          "string.pattern.base":
            "SSN must be a valid 9-digit number (e.g., 123-45-6789)",
          "any.required": "SSN is required",
        }),
      initialDeposit: Joi.number().min(0).required().messages({
        "number.base": "Initial deposit must be a number",
        "number.min": "Initial deposit cannot be less than 0",
        "any.required": "Initial deposit is required",
      }),
      address: Joi.string().required().messages({
        "string.base": "Address must be text",
        "any.required": "Address is required",
      }),
      country: Joi.string().required().messages({
        "string.base": "Country must be text",
        "any.required": "Country is required",
      }),
      state: Joi.string().required().messages({
        "string.base": "State must be text",
        "any.required": "State is required",
      }),
      city: Joi.string().required().messages({
        "string.base": "City must be text",
        "any.required": "City is required",
      }),
      accountType: Joi.string()
        .valid(...Object.values(AccountType))
        .required()
        .messages({
          "any.only": `Account type must be one of: ${Object.values(
            AccountType
          ).join(", ")}`,
          "any.required": "Account type is required",
        }),
      pin: Joi.string()
        .pattern(/^\d{4,6}$/)
        .required()
        .messages({
          "string.pattern.base":
            "PIN must be a 4-6 digit number (no letters allowed)",
          "any.required": "PIN is required",
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

  public async createWireTransfer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      userId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message({
              custom: "User id must be a valid ObjectId",
            });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "User id must be text",
          "any.required": "User id is required",
        }),

      accountType: Joi.string()
        .valid(...Object.values(AccountType))
        .required()
        .messages({
          "any.only": `Account type must be one of: ${Object.values(
            AccountType
          ).join(", ")}`,
          "any.required": "Account type is required",
        }),

      transactionDirection: Joi.string()
        .valid(...Object.values(TransactionDirection))
        .required()
        .messages({
          "any.only": `Transaction direction must be one of: ${Object.values(
            TransactionDirection
          ).join(", ")}`,
          "any.required": "Transaction direction is required",
        }),

      transactionType: Joi.string()
        .valid(...Object.values(TransactionType))
        .required()
        .messages({
          "any.only": `Transaction type must be one of: ${Object.values(
            TransactionType
          ).join(", ")}`,
          "any.required": "Transaction type is required",
        }),

      recipientName: Joi.string().required().messages({
        "string.base": "Recipient name must be text",
        "any.required": "Recipient name is required",
      }),

      accountNumber: Joi.string().pattern(/^\d+$/).required().messages({
        "string.pattern.base": "Account number must contain only digits",
        "any.required": "Account number is required",
      }),

      country: Joi.string().required().messages({
        "string.base": "Country must be text",
        "any.required": "Country is required",
      }),

      swiftCode: Joi.string().required().messages({
        "string.base": "SWIFT code must be text",
        "any.required": "SWIFT code is required",
      }),

      routingNumber: Joi.string().pattern(/^\d+$/).required().messages({
        "string.pattern.base": "Routing number must contain only digits",
        "any.required": "Routing number is required",
      }),

      description: Joi.string().allow(null, "").optional(),

      amount: Joi.number().positive().required().messages({
        "number.base": "Amount must be a number",
        "number.positive": "Amount must be greater than 0",
        "any.required": "Amount is required",
      }),

      status: Joi.string()
        .valid(...Object.values(TransactionStatus))
        .required()
        .messages({
          "any.only": `Transaction status must be one of: ${Object.values(
            TransactionStatus
          ).join(", ")}`,
          "any.required": "Transaction status is required",
        }),

      transactionDate: Joi.date().required().messages({
        "date.base": "Transaction date must be a valid date",
        "any.required": "Transaction date is required",
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

  public async createDomesticTransfer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      userId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message({
              custom: "User id must be a valid ObjectId",
            });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "User id must be text",
          "any.required": "User id is required",
        }),

      accountType: Joi.string()
        .valid(...Object.values(AccountType))
        .required()
        .messages({
          "any.only": `Account type must be one of: ${Object.values(
            AccountType
          ).join(", ")}`,
          "any.required": "Account type is required",
        }),

      bankName: Joi.string().required().messages({
        "string.base": "Bank name must be text",
        "any.required": "Bank name is required",
      }),

      recipientName: Joi.string().required().messages({
        "string.base": "Recipient name must be text",
        "any.required": "Recipient name is required",
      }),

      accountNumber: Joi.string().pattern(/^\d+$/).required().messages({
        "string.pattern.base": "Account number must contain only digits",
        "any.required": "Account number is required",
      }),

      description: Joi.string().allow(null, "").optional(),

      amount: Joi.number().positive().required().messages({
        "number.base": "Amount must be a number",
        "number.positive": "Amount must be greater than 0",
        "any.required": "Amount is required",
      }),
       transactionType: Joi.string()
        .valid(...Object.values(TransactionType))
        .required()
        .messages({
          "any.only": `Transaction type must be one of: ${Object.values(
            TransactionType
          ).join(", ")}`,
          "any.required": "Transaction type is required",
        }),
      status: Joi.string()
        .valid(...Object.values(TransactionStatus))
        .required()
        .messages({
          "any.only": `Transaction status must be one of: ${Object.values(
            TransactionStatus
          ).join(", ")}`,
          "any.required": "Transaction status is required",
        }),

      transactionDirection: Joi.string()
        .valid(...Object.values(TransactionDirection))
        .required()
        .messages({
          "any.only": `Transaction direction must be one of: ${Object.values(
            TransactionDirection
          ).join(", ")}`,
          "any.required": "Transaction direction is required",
        }),

      transactionDate: Joi.date().required().messages({
        "date.base": "Transaction date must be a valid date",
        "any.required": "Transaction date is required",
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

export const adminValidator = new AdminValidator();
