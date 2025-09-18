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
exports.authValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const multer_1 = __importDefault(require("multer"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const enum_2 = require("../user/enum");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage }).fields([
    { name: "driversLicence", maxCount: 1 },
    { name: "passport", maxCount: 1 },
]);
class AuthValidator {
    handleFileUpload(req, res, next) {
        upload(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === "LIMIT_UNEXPECTED_FILE") {
                    return utils_1.utils.customResponse({
                        status: 400,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: `Unexpected field: ${err.field}`,
                        data: null,
                    });
                }
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: err.message,
                    data: null,
                });
            }
            else if (err) {
                return utils_1.utils.customResponse({
                    status: 500,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "File upload failed",
                    data: null,
                });
            }
            next();
        });
    }
    registerUser(req, res, next) {
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
                zipCode: joi_1.default.string()
                    .pattern(/^\d{5}(-\d{4})?$/)
                    .required()
                    .messages({
                    "string.pattern.base": "Please enter a valid Zip Code (e.g., 12345 or 12345-6789)",
                    "any.required": "Zip Code is required",
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
                userName: joi_1.default.string().required().messages({
                    "string.base": "Username must be text",
                    "any.required": "Username is required",
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
                confirmPassword: joi_1.default.string()
                    .valid(joi_1.default.ref("password"))
                    .required()
                    .messages({
                    "any.required": "Confirm Password is required.",
                    "any.only": "Passwords do not match",
                }),
                pin: joi_1.default.string()
                    .pattern(/^\d{4,6}$/)
                    .required()
                    .messages({
                    "string.pattern.base": "PIN must be a 4-6 digit number (no letters allowed)",
                    "any.required": "PIN is required",
                }),
                confirmPin: joi_1.default.string().valid(joi_1.default.ref("pin")).required().messages({
                    "any.required": "Confirm Pin is required.",
                    "any.only": "Pins do not match",
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
            // Validate image files
            if (!req.files || !("passport" in req.files)) {
                console.log(req.files);
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Passport is required",
                    data: null,
                });
            }
            if (!("driversLicence" in req.files)) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Driver's licence is required",
                    data: null,
                });
            }
            const passport = req.files["passport"][0];
            const driversLicence = req.files["driversLicence"][0];
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
            if (!["image/jpeg", "image/png"].includes(passport.mimetype)) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Passport must be a JPEG or PNG image",
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
            return next();
        });
    }
    emailVerifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                email: joi_1.default.string().email().required().messages({
                    "string.base": "Email must be text",
                    "strig.email": "Invalid email format",
                    "any.required": "Email is required.",
                }),
                otp: joi_1.default.string().required().messages({
                    "any.required": "OTP is required.",
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
    validateEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                email: joi_1.default.string().email().required().messages({
                    "string.base": "Email must be text",
                    "strig.email": "Invalid email format",
                    "any.required": "Email is required.",
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
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                email: joi_1.default.string().email().required().messages({
                    "string.email": "Please enter a valid email address",
                    "any.required": "Email address is required",
                }),
                password: joi_1.default.string().required().messages({
                    "any.required": "Password is required.",
                }),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
            return next();
        });
    }
}
exports.authValidator = new AuthValidator();
