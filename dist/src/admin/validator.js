"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const mongoose_1 = __importDefault(require("mongoose"));
const enum_2 = require("../user/enum");
const utils_1 = require("../utils");
const enum_3 = require("../transaction/enum");
class AdminValidator {
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                userName: joi_1.default.string().required().messages({
                    "string.base": "User name must be text",
                    "any.required": "User name is required.",
                }),
                password: joi_1.default.string().required().messages({
                    "string.base": "Password must be text",
                    "any.required": "Password is required.",
                }),
            });
            const { error } = schema.validate(req.body);
            if (!error) {
                return next();
            }
            else {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
        });
    }
    validateUserAccountStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                userId: joi_1.default.string()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
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
                status: joi_1.default.string()
                    .valid(...Object.values(enum_2.AccountStatus))
                    .required()
                    .messages({
                    "any.only": `Account status must be one of: ${Object.values(enum_2.AccountStatus).join(", ")}`,
                    "any.required": "Account status is required",
                }),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
            return next();
        });
    }
    validateParams(req, res, next) {
        const schema = joi_1.default.object({
            id: joi_1.default.string()
                .custom((value, helpers) => {
                if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
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
        }
        else {
            return res.status(400).json({
                message: enum_1.MessageResponse.Error,
                description: error.details[0].message,
                data: null,
            });
        }
    }
    userUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().required().messages({
                    "string.base": "First name must be text",
                    "any.required": "First name is required",
                }),
                lastName: joi_1.default.string().required().messages({
                    "string.base": "Last name must be text",
                    "any.required": "Last name is required",
                }),
                userName: joi_1.default.string().required().messages({
                    "string.base": "User name must be text",
                    "any.required": "User name is required",
                }),
                password: joi_1.default.string()
                    .min(8)
                    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
                    .required()
                    .messages({
                    "any.required": "Password is required",
                    "string.min": "Password must be at least 8 characters long",
                    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                }),
                email: joi_1.default.string().email().required().messages({
                    "string.email": "Please enter a valid email address",
                    "any.required": "Email address is required",
                }),
                phoneNo: joi_1.default.string()
                    .pattern(/^\+?[1-9]\d{6,14}$/)
                    .required()
                    .messages({
                    "string.pattern.base": "Please enter a valid international phone number",
                    "any.required": "Phone number is required",
                }),
                dob: joi_1.default.string().isoDate().required().messages({
                    "string.isoDate": "Date of birth must be a valid ISO date (YYYY-MM-DD)",
                    "any.required": "Date of birth is required",
                }),
                zipCode: joi_1.default.string().required().messages({
                    "string.base": "Zipcode must be text",
                    "any.required": "Zipcode is required",
                }),
                ssn: joi_1.default.string()
                    .pattern(/^(?!000|666|9\d{2})([0-6]\d{2}|7([0-6]\d|7[012]))-?(?!00)\d{2}-?(?!0000)\d{4}$/)
                    .required()
                    .messages({
                    "string.pattern.base": "SSN must be a valid 9-digit number (e.g., 123-45-6789)",
                    "any.required": "SSN is required",
                }),
                initialDeposit: joi_1.default.number().min(0).required().messages({
                    "number.base": "Initial deposit must be a number",
                    "number.min": "Initial deposit cannot be less than 0",
                    "any.required": "Initial deposit is required",
                }),
                address: joi_1.default.string().required().messages({
                    "string.base": "Address must be text",
                    "any.required": "Address is required",
                }),
                country: joi_1.default.string().required().messages({
                    "string.base": "Country must be text",
                    "any.required": "Country is required",
                }),
                state: joi_1.default.string().required().messages({
                    "string.base": "State must be text",
                    "any.required": "State is required",
                }),
                city: joi_1.default.string().required().messages({
                    "string.base": "City must be text",
                    "any.required": "City is required",
                }),
                accountType: joi_1.default.string()
                    .valid(...Object.values(enum_2.AccountType))
                    .required()
                    .messages({
                    "any.only": `Account type must be one of: ${Object.values(enum_2.AccountType).join(", ")}`,
                    "any.required": "Account type is required",
                }),
                pin: joi_1.default.string()
                    .pattern(/^\d{4,6}$/)
                    .required()
                    .messages({
                    "string.pattern.base": "PIN must be a 4-6 digit number (no letters allowed)",
                    "any.required": "PIN is required",
                }),
                passport: joi_1.default.string()
                    .uri({ scheme: ["http", "https"] })
                    .pattern(/\.(jpeg|jpg|png|gif|webp)$/i)
                    .optional()
                    .messages({
                    "string.base": "Passport URL must be text",
                    "string.uri": "Passport must be a valid URI (http or https)",
                    "string.pattern.base": "Passport must end with .jpeg, .jpg, .png, .gif, or .webp",
                }),
                driversLicence: joi_1.default.string()
                    .uri({ scheme: ["http", "https"] })
                    .pattern(/\.(jpeg|jpg|png|gif|webp)$/i)
                    .optional()
                    .messages({
                    "string.base": "Driver’s licence URL must be text",
                    "string.uri": "Driver’s licence must be a valid URI (http or https)",
                    "string.pattern.base": "Driver’s licence must end with .jpeg, .jpg, .png, .gif, or .webp",
                }),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
            if (req.files) {
                // Validate image files
                // if (!req.files || !("passport" in req.files)) {
                //   console.log(req.files);
                //   return res.status(400).json({
                //     message: MessageResponse.Error,
                //     description: "Passport is required",
                //     data: null,
                //   });
                // }
                // if (!("driversLicence" in req.files)) {
                //   return res.status(400).json({
                //     message: MessageResponse.Error,
                //     description: "Driver's licence is required",
                //     data: null,
                //   });
                // }
                if ("passport" in req.files) {
                    const passport = req.files["passport"][0];
                    if (!passport ||
                        typeof passport !== "object" ||
                        !("mimetype" in passport) ||
                        !("buffer" in passport)) {
                        return res.status(400).json({
                            message: enum_1.MessageResponse.Error,
                            description: "Please upload a valid passport file image",
                            data: null,
                        });
                    }
                    if (!["image/jpeg", "image/png"].includes(passport.mimetype)) {
                        return res.status(400).json({
                            message: enum_1.MessageResponse.Error,
                            description: "Passport must be a JPEG or PNG image",
                            data: null,
                        });
                    }
                }
                if ("driversLicence" in req.files) {
                    const driversLicence = req.files["driversLicence"][0];
                    if (!driversLicence ||
                        typeof driversLicence !== "object" ||
                        !("mimetype" in driversLicence) ||
                        !("buffer" in driversLicence)) {
                        return res.status(400).json({
                            message: enum_1.MessageResponse.Error,
                            description: "Please upload a valid driver's licence file image",
                            data: null,
                        });
                    }
                    if (!["image/jpeg", "image/png"].includes(driversLicence.mimetype)) {
                        return res.status(400).json({
                            message: enum_1.MessageResponse.Error,
                            description: "Driver licence be a JPEG or PNG image",
                            data: null,
                        });
                    }
                }
            }
            return next();
        });
    }
    createWireTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                userId: joi_1.default.string()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
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
                accountType: joi_1.default.string()
                    .valid(...Object.values(enum_2.AccountType))
                    .required()
                    .messages({
                    "any.only": `Account type must be one of: ${Object.values(enum_2.AccountType).join(", ")}`,
                    "any.required": "Account type is required",
                }),
                transactionDirection: joi_1.default.string()
                    .valid(...Object.values(enum_3.TransactionDirection))
                    .required()
                    .messages({
                    "any.only": `Transaction direction must be one of: ${Object.values(enum_3.TransactionDirection).join(", ")}`,
                    "any.required": "Transaction direction is required",
                }),
                transactionType: joi_1.default.string()
                    .valid(...Object.values(enum_3.TransactionType))
                    .required()
                    .messages({
                    "any.only": `Transaction type must be one of: ${Object.values(enum_3.TransactionType).join(", ")}`,
                    "any.required": "Transaction type is required",
                }),
                recipientName: joi_1.default.string().required().messages({
                    "string.base": "Recipient name must be text",
                    "any.required": "Recipient name is required",
                }),
                accountNumber: joi_1.default.string().pattern(/^\d+$/).required().messages({
                    "string.pattern.base": "Account number must contain only digits",
                    "any.required": "Account number is required",
                }),
                country: joi_1.default.string().required().messages({
                    "string.base": "Country must be text",
                    "any.required": "Country is required",
                }),
                swiftCode: joi_1.default.string().required().messages({
                    "string.base": "SWIFT code must be text",
                    "any.required": "SWIFT code is required",
                }),
                routingNumber: joi_1.default.string().pattern(/^\d+$/).required().messages({
                    "string.pattern.base": "Routing number must contain only digits",
                    "any.required": "Routing number is required",
                }),
                description: joi_1.default.string().allow(null, "").optional(),
                amount: joi_1.default.number().positive().required().messages({
                    "number.base": "Amount must be a number",
                    "number.positive": "Amount must be greater than 0",
                    "any.required": "Amount is required",
                }),
                status: joi_1.default.string()
                    .valid(...Object.values(enum_3.TransactionStatus))
                    .required()
                    .messages({
                    "any.only": `Transaction status must be one of: ${Object.values(enum_3.TransactionStatus).join(", ")}`,
                    "any.required": "Transaction status is required",
                }),
                transactionDate: joi_1.default.date().required().messages({
                    "date.base": "Transaction date must be a valid date",
                    "any.required": "Transaction date is required",
                }),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
            return next();
        });
    }
    createDomesticTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                userId: joi_1.default.string()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
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
                accountType: joi_1.default.string()
                    .valid(...Object.values(enum_2.AccountType))
                    .required()
                    .messages({
                    "any.only": `Account type must be one of: ${Object.values(enum_2.AccountType).join(", ")}`,
                    "any.required": "Account type is required",
                }),
                bankName: joi_1.default.string().required().messages({
                    "string.base": "Bank name must be text",
                    "any.required": "Bank name is required",
                }),
                recipientName: joi_1.default.string().required().messages({
                    "string.base": "Recipient name must be text",
                    "any.required": "Recipient name is required",
                }),
                accountNumber: joi_1.default.string().pattern(/^\d+$/).required().messages({
                    "string.pattern.base": "Account number must contain only digits",
                    "any.required": "Account number is required",
                }),
                description: joi_1.default.string().allow(null, "").optional(),
                amount: joi_1.default.number().positive().required().messages({
                    "number.base": "Amount must be a number",
                    "number.positive": "Amount must be greater than 0",
                    "any.required": "Amount is required",
                }),
                transactionType: joi_1.default.string()
                    .valid(...Object.values(enum_3.TransactionType))
                    .required()
                    .messages({
                    "any.only": `Transaction type must be one of: ${Object.values(enum_3.TransactionType).join(", ")}`,
                    "any.required": "Transaction type is required",
                }),
                status: joi_1.default.string()
                    .valid(...Object.values(enum_3.TransactionStatus))
                    .required()
                    .messages({
                    "any.only": `Transaction status must be one of: ${Object.values(enum_3.TransactionStatus).join(", ")}`,
                    "any.required": "Transaction status is required",
                }),
                transactionDirection: joi_1.default.string()
                    .valid(...Object.values(enum_3.TransactionDirection))
                    .required()
                    .messages({
                    "any.only": `Transaction direction must be one of: ${Object.values(enum_3.TransactionDirection).join(", ")}`,
                    "any.required": "Transaction direction is required",
                }),
                transactionDate: joi_1.default.date().required().messages({
                    "date.base": "Transaction date must be a valid date",
                    "any.required": "Transaction date is required",
                }),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
            return next();
        });
    }
}
exports.adminValidator = new AdminValidator();
