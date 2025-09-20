import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { CardType } from "./enum"; // adjust path if needed

class CardValidator {
  public async validateCardApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      cardType: Joi.string()
        .valid(...Object.values(CardType))
        .required()
        .messages({
          "any.only": `Card type must be one of: ${Object.values(
            CardType
          ).join(", ")}`,
          "any.required": "Card type is required",
        }),

      pin: Joi.string()
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

export const cardValidator = new CardValidator();
