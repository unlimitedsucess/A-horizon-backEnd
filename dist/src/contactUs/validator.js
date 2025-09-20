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
exports.contactUsValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
const enum_1 = require("../utils/enum");
class ContactUsValidator {
    contactUs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                fullName: joi_1.default.string().required().messages({
                    "string.base": "Full name must be text",
                    "any.required": "Full name is required",
                }),
                email: joi_1.default.string().email().required().messages({
                    "string.email": "Please enter a valid email address",
                    "any.required": "Email address is required",
                }),
                phoneNumber: joi_1.default.string()
                    .pattern(/^\+?[1-9]\d{6,14}$/)
                    .required()
                    .messages({
                    "string.pattern.base": "Please enter a valid international phone number",
                    "any.required": "Phone number is required",
                }),
                subject: joi_1.default.string().required().messages({
                    "string.base": "Subject must be text",
                    "any.required": "Subject is required",
                }),
                message: joi_1.default.string().required().messages({
                    "string.base": "Message must be text",
                    "any.required": "Message is required",
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
exports.contactUsValidator = new ContactUsValidator();
