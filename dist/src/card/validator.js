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
exports.cardValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const enum_2 = require("./enum"); // adjust path if needed
const mongoose_1 = __importDefault(require("mongoose"));
class CardValidator {
    validateCardApplication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                cardType: joi_1.default.string()
                    .valid(...Object.values(enum_2.CardType))
                    .required()
                    .messages({
                    "any.only": `Card type must be one of: ${Object.values(enum_2.CardType).join(", ")}`,
                    "any.required": "Card type is required",
                }),
                pin: joi_1.default.string()
                    .pattern(/^\d{4}$/)
                    .required()
                    .messages({
                    "string.base": "Pin must be text",
                    "string.pattern.base": "Pin must be a 4-digit number",
                    "any.required": "Pin is required",
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
    validateCardStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                cardId: joi_1.default.string()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.message({
                            custom: "Card id must be a valid ObjectId",
                        });
                    }
                    return value;
                })
                    .required()
                    .messages({
                    "string.base": "Card id must be a string",
                    "any.required": "Card id is required",
                }),
                status: joi_1.default.string()
                    .valid(...Object.values(enum_2.CardStatus))
                    .required()
                    .messages({
                    "any.only": `Card status must be one of: ${Object.values(enum_2.CardStatus).join(", ")}`,
                    "any.required": "Card status is required",
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
exports.cardValidator = new CardValidator();
