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
exports.transactionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const enum_2 = require("../user/enum");
class TransactionValidator {
    validateTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                accountType: joi_1.default.string()
                    .valid(...Object.values(enum_2.AccountType))
                    .required()
                    .messages({
                    "any.only": `Account type must be one of: ${Object.values(enum_2.AccountType).join(", ")}`,
                    "any.required": "Account type is required",
                }),
                recipientName: joi_1.default.string().required().messages({
                    "string.base": "Recipient name must be text",
                    "any.required": "Recipient name is required",
                }),
                accountName: joi_1.default.string().required().messages({
                    "string.base": "Account name must be text",
                    "any.required": "Account name is required",
                }),
                country: joi_1.default.string().required().messages({
                    "string.base": "Country must be text",
                    "any.required": "Country is required",
                }),
                swiftCode: joi_1.default.string().required().messages({
                    "string.base": "Swift code must be text",
                    "any.required": "Swift code is required",
                }),
                pin: joi_1.default.string().required().messages({
                    "string.base": "Pin must be text",
                    "any.required": "Pin is required",
                }),
                routingNumber: joi_1.default.string().required().messages({
                    "string.base": "Routing number must be text",
                    "any.required": "Routing number is required",
                }),
                description: joi_1.default.string().optional().messages({
                    "string.base": "Description must be text",
                }),
                amount: joi_1.default.number().min(0).required().messages({
                    "number.base": "Amount must be a number",
                    "number.min": "Amount cannot be less than 0",
                    "any.required": "Amount is required",
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
exports.transactionValidator = new TransactionValidator();
