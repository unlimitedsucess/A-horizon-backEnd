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
exports.loanValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const multer_1 = __importDefault(require("multer"));
const enum_1 = require("../utils/enum");
const enum_2 = require("./enum");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage }).fields([
    { name: "driversLicence", maxCount: 1 },
    { name: "passport", maxCount: 1 },
]);
class LoanValidator {
    applyLoan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                loanAmount: joi_1.default.number().min(0).required().messages({
                    "number.base": "Loan Amount must be a number",
                    "number.min": "Loan Amount cannot be less than 0",
                    "any.required": "Loan Amount is required",
                }),
                description: joi_1.default.string().required().messages({
                    "string.base": "Description must be text",
                    "any.required": "Description is required",
                }),
                pin: joi_1.default.string().required().messages({
                    "string.base": "Pin must be text",
                    "any.required": "Pin is required",
                }),
                loanDuration: joi_1.default.string()
                    .valid(...Object.values(enum_2.LoanDuration))
                    .required()
                    .messages({
                    "any.only": `Loan duraion must be one of: ${Object.values(enum_2.LoanDuration).join(", ")}`,
                    "any.required": "Loan duraion is required",
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
exports.loanValidator = new LoanValidator();
