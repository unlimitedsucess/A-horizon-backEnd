import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { MessageResponse } from "../utils/enum";
import mongoose from "mongoose";
import { AccountStatus } from "../user/enum";
import { CardStatus } from "../card/enum";
import { utils } from "../utils";

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
            CardStatus
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

  //   public validateParams(req: Request, res: Response, next: NextFunction) {
  //     const schema = Joi.object({
  //       id: Joi.string()
  //         .custom((value, helpers) => {
  //           if (!mongoose.Types.ObjectId.isValid(value)) {
  //             return helpers.message({
  //               custom: "ID must be a valid ObjectId",
  //             });
  //           }
  //           return value;
  //         })
  //         .required()
  //         .messages({
  //           "string.base": "ID must be a string",
  //           "any.required": "ID is required",
  //         }),
  //     });

  //     const { error } = schema.validate(req.params);

  //     if (!error) {
  //       return next();
  //     } else {
  //       return res.status(400).json({
  //         message: MessageResponse.Error,
  //         description: error.details[0].message,
  //         data: null,
  //       });
  //     }
  //   }

  //   public async userUpdate(req: Request, res: Response, next: NextFunction) {
  //     const schema = Joi.object({
  //       firstName: Joi.string().required().messages({
  //         "string.base": "First name must be text",
  //         "any.required": "First name is required.",
  //       }),
  //       middleName: Joi.string().required().messages({
  //         "string.base": "Middle name must be text",
  //         "any.required": "Middle name is required.",
  //       }),
  //       lastName: Joi.string().required().messages({
  //         "string.base": "Last name must be text",
  //         "any.required": "Last name is required.",
  //       }),
  //       email: Joi.string().email().required().messages({
  //         "string.email": "Please enter a valid email address",
  //         "any.required": "Email address is required",
  //       }),
  //       countryOfResidence: Joi.string().required().messages({
  //         "string.base": "Country of residence must be text",
  //         "any.required": "Country of residence is required.",
  //       }),
  //       state: Joi.string().required().messages({
  //         "string.base": "State must be text",
  //         "any.required": "State is required.",
  //       }),
  //       phoneNumber: Joi.string()
  //         .pattern(/^\+?[1-9]\d{1,14}$/)
  //         .required()
  //         .messages({
  //           "string.pattern.base":
  //             "Please enter a valid international phone number.",
  //           "any.required": "Phone number is required.",
  //         }),
  //       address: Joi.string().required().messages({
  //         "string.base": "Address must be text",
  //         "any.required": "Address is required.",
  //       }),
  //       dateOfBirth: Joi.string().required().messages({
  //         "string.base": "Date of birth must be text",
  //         "any.required": "Date of birth is required.",
  //       }),
  //       initialDeposit: Joi.string()
  //         .pattern(/^\d+(\.\d+)?$/)
  //         .required()
  //         .messages({
  //           "string.pattern.base": "Initial deposit must be a valid number.",
  //           "any.required": "Initial deposit is required.",
  //         }),
  //       accountType: Joi.string()
  //         .valid(AccountType.Current, AccountType.Savings)
  //         .required()
  //         .messages({
  //           "string.base": `Account type must be either "${AccountType.Current}" or "${AccountType.Savings}"`,
  //           "any.required": "Account type is required.",
  //           "any.only": `Account type must be either "${AccountType.Current}" or "${AccountType.Savings}"`,
  //         }),
  //       ssn: Joi.string()
  //         .pattern(/^\d{9}$/) // Ensures exactly 9 digits
  //         .required()
  //         .messages({
  //           "string.pattern.base": "SSN must be a 9-digit number.",
  //           "any.required": "SSN is required.",
  //         }),
  //       occupation: Joi.string().required().messages({
  //         "string.base": "Occupation must be text",
  //         "any.required": "Occupation is required.",
  //       }),
  //       gender: Joi.string()
  //         .valid(GenderStatus.Male, GenderStatus.Female)
  //         .required()
  //         .messages({
  //           "string.base": `Gender must be either: "${GenderStatus.Male}" or "${GenderStatus.Female}".`,
  //           "any.required": "Gender is required.",
  //           "any.only": `Gender must be either: "${GenderStatus.Male}" or "${GenderStatus.Female}".`,
  //         }),
  //       status: Joi.string()
  //         .valid(AccountStatus.Active, AccountStatus.Hold)
  //         .required()
  //         .messages({
  //           "string.base": `Status must be either: "${AccountStatus.Active}" or "${AccountStatus.Hold}".`,
  //           "any.required": "Status is required.",
  //           "any.only": `Status must be either: "${AccountStatus.Active}" or "${AccountStatus.Hold}".`,
  //         }),
  //       maritalStatus: Joi.string()
  //         .valid(
  //           MaritialStatus.Divorce,
  //           MaritialStatus.Married,
  //           MaritialStatus.Single
  //         )
  //         .required()
  //         .messages({
  //           "string.base": `Marital Status must be one of: "${MaritialStatus.Divorce}", "${MaritialStatus.Married}" or "${MaritialStatus.Single}".`,
  //           "any.required": "Marital Status is required.",
  //           "any.only": `Marital Status must be one of: "${MaritialStatus.Divorce}", "${MaritialStatus.Married}" or "${MaritialStatus.Single}".`,
  //         }),
  //     });

  //     const { error } = schema.validate(req.body);
  //     if (error) {
  //       return res.status(400).json({
  //         message: MessageResponse.Error,
  //         description: error.details[0].message,
  //         data: null,
  //       });
  //     }

  //     return next();
  //   }

  //   public async createTransferWithAdmin(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ) {
  //     const schema = Joi.object({
  //       bankName: Joi.string().required().messages({
  //         "string.base": "Bank name must be text",
  //         "any.required": "Bank name is required.",
  //       }),
  //       beneficiaryName: Joi.string().required().messages({
  //         "string.base": "Beneficiary name must be text",
  //         "any.required": "Beneficiary name is required.",
  //       }),
  //       beneficiaryAccountNumber: Joi.string().required().messages({
  //         "string.base": "Beneficiary account number must be text",
  //         "any.required": "Beneficiary account number is required.",
  //       }),
  //       amount: Joi.alternatives()
  //         .try(Joi.number().positive(), Joi.string().pattern(/^\d+(\.\d+)?$/))
  //         .required()
  //         .messages({
  //           "alternatives.match": "Amount must be a valid number.",
  //           "any.required": "Amount is required.",
  //         }),
  //       serviceFee: Joi.alternatives()
  //         .try(Joi.number().positive(), Joi.string().pattern(/^\d+(\.\d+)?$/))
  //         .required()
  //         .messages({
  //           "alternatives.match": "Service fee must be a valid number.",
  //           "any.required": "Service fee is required.",
  //         }),
  //       narration: Joi.string().required().messages({
  //         "string.base": "Narration must be text",
  //         "any.required": "Narration is required.",
  //       }),

  //       accountType: Joi.string()
  //         .valid(
  //           AccountType.Current,
  //           AccountType.Savings,
  //           AccountType.Checking,
  //           AccountType.Domiciliary,
  //           AccountType.Fixed,
  //           AccountType.Joint,
  //           AccountType.NonResident,
  //           AccountType.Checking,
  //           AccountType.OnlineBanking
  //         )
  //         .required()
  //         .messages({
  //           "string.base": `Account type must be either "${AccountType.Current}", "${AccountType.OnlineBanking}", "${AccountType.Savings}", "${AccountType.Checking}, "${AccountType.Domiciliary}" "${AccountType.Fixed}, "${AccountType.Joint}", "${AccountType.NonResident}" or "${AccountType.Checking}"`,
  //           "any.required": "Account type is required.",
  //           "any.only": `Account type must be either "${AccountType.Current}", "${AccountType.OnlineBanking}", "${AccountType.Savings}", "${AccountType.Checking}, "${AccountType.Domiciliary}", "${AccountType.Fixed}, "${AccountType.Joint}", "${AccountType.NonResident}" or "${AccountType.Checking}"`,
  //         }),
  //       transferType: Joi.string()
  //         .valid(TransferType.Domestic, TransferType.Wire)
  //         .required()
  //         .messages({
  //           "string.base": `Transfer type must be either "${TransferType.Domestic}" or "${TransferType.Wire}"`,
  //           "any.required": "Transfer type is required.",
  //           "any.only": `Transfer type must be either "${TransferType.Domestic}" or "${TransferType.Wire}"`,
  //         }),

  //       routingNumber: Joi.when("transferType", {
  //         is: TransferType.Wire,
  //         then: Joi.string()
  //           .pattern(/^\d{9}$/)
  //           .required()
  //           .messages({
  //             "string.pattern.base":
  //               "Routing number must be a 9 digit numeric value.",
  //             "any.required": "Routing number is required for wire transfers.",
  //           }),
  //         otherwise: Joi.forbidden(),
  //       }),
  //       swiftcode: Joi.when("transferType", {
  //         is: TransferType.Wire,
  //         then: Joi.string()
  //           .pattern(/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
  //           .required()
  //           .messages({
  //             "string.pattern.base":
  //               "Swift code must be 8 or 11 characters (letters and numbers).",
  //             "any.required": "Swift code is required.",
  //           }),
  //         otherwise: Joi.forbidden(),
  //       }),

  //       beneficiaryCountry: Joi.when("transferType", {
  //         is: TransferType.Wire,
  //         then: Joi.string().required().messages({
  //           "string.base": "Country must be text",
  //           "any.required": "Country is required for wire transfers.",
  //         }),
  //         otherwise: Joi.forbidden(),
  //       }),
  //       userId: Joi.string()
  //         .custom((value, helpers) => {
  //           if (!mongoose.Types.ObjectId.isValid(value)) {
  //             return helpers.message({
  //               custom: "Usuer ID must be a valid ObjectId",
  //             });
  //           }
  //           return value;
  //         })
  //         .required()
  //         .messages({
  //           "string.base": "Usuer ID must be a string",
  //           "any.required": "Usuer ID is required",
  //         }),
  //       transactionType: Joi.string()
  //         .valid(TransactionType.Debit, TransactionType.Credit)
  //         .required()
  //         .messages({
  //           "string.base": `Transaction type must be either "${TransactionType.Debit}" or "${TransactionType.Credit}"`,
  //           "any.required": "Transaction type is required.",
  //           "any.only": `Transaction type must be either "${TransactionType.Debit}" or "${TransactionType.Credit}"`,
  //         }),
  //       transferDate: Joi.date().iso().messages({
  //         "date.base": "Transfer date must be a valid date.",
  //         "date.format":
  //           "Transfer date must be in ISO 8601 format (e.g., YYYY-MM-DDTHH:mm:ss.sssZ).",
  //       }),
  //     });

  //     const { error } = schema.validate(req.body);
  //     if (error) {
  //       return res.status(400).json({
  //         message: MessageResponse.Error,
  //         description: error.details[0].message,
  //         data: null,
  //       });
  //     }

  //     return next();
  //   }
}

export const adminValidator = new AdminValidator();
