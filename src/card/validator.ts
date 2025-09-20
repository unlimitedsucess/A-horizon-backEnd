import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { CardStatus, CardType } from "./enum"; // adjust path if needed
import mongoose from "mongoose";

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
          "any.only": `Card type must be one of: ${Object.values(CardType).join(
            ", "
          )}`,
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

  public async validateCardStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      cardId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
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
      status: Joi.string()
        .valid(...Object.values(CardStatus))
        .required()
        .messages({
          "any.only": `Card status must be one of: ${Object.values(
            CardStatus
          ).join(", ")}`,
          "any.required": "Card status is required",
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
