import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";


class ContactUsValidator {
public async contactUs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    fullName: Joi.string().required().messages({
      "string.base": "Full name must be text",
      "any.required": "Full name is required",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email address is required",
    }),

    phoneNumber: Joi.string()
      .pattern(/^\+?[1-9]\d{6,14}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Please enter a valid international phone number",
        "any.required": "Phone number is required",
      }),

    subject: Joi.string().required().messages({
      "string.base": "Subject must be text",
      "any.required": "Subject is required",
    }),

    message: Joi.string().required().messages({
      "string.base": "Message must be text",
      "any.required": "Message is required",
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

export const contactUsValidator = new ContactUsValidator();
