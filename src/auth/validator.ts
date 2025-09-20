import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import multer from "multer";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { AccountType } from "../user/enum";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).fields([
  { name: "driversLicence", maxCount: 1 },
  { name: "passport", maxCount: 1 },
]);

class AuthValidator {
  public handleFileUpload(req: any, res: any, next: any) {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return utils.customResponse({
            status: 400,
            res,
            message: MessageResponse.Error,
            description: `Unexpected field: ${err.field}`,
            data: null,
          });
        }
        return utils.customResponse({
          status: 400,
          res,
          message: MessageResponse.Error,
          description: err.message,
          data: null,
        });
      } else if (err) {
        return utils.customResponse({
          status: 500,
          res,
          message: MessageResponse.Error,
          description: "File upload failed",
          data: null,
        });
      }
      next();
    });
  }

  public async registerUser(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      firstName: Joi.string().required().messages({
        "string.base": "First name must be text",
        "any.required": "First name is required",
      }),
      lastName: Joi.string().required().messages({
        "string.base": "Last name must be text",
        "any.required": "Last name is required",
      }),
      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email address is required",
      }),
      phoneNo: Joi.string()
        .pattern(/^\+?[1-9]\d{6,14}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Please enter a valid international phone number",
          "any.required": "Phone number is required",
        }),
      dob: Joi.string().isoDate().required().messages({
        "string.isoDate": "Date of birth must be a valid ISO date (YYYY-MM-DD)",
        "any.required": "Date of birth is required",
      }),
      zipCode: Joi.string().required().messages({
        "string.base": "Zipcode must be text",
        "any.required": "Zipcode is required",
      }),
      ssn: Joi.string()
        .pattern(
          /^(?!000|666|9\d{2})([0-6]\d{2}|7([0-6]\d|7[012]))-?(?!00)\d{2}-?(?!0000)\d{4}$/
        )
        .required()
        .messages({
          "string.pattern.base":
            "SSN must be a valid 9-digit number (e.g., 123-45-6789)",
          "any.required": "SSN is required",
        }),
      initialDeposit: Joi.number().min(0).required().messages({
        "number.base": "Initial deposit must be a number",
        "number.min": "Initial deposit cannot be less than 0",
        "any.required": "Initial deposit is required",
      }),
      address: Joi.string().required().messages({
        "string.base": "Address must be text",
        "any.required": "Address is required",
      }),
      country: Joi.string().required().messages({
        "string.base": "Country must be text",
        "any.required": "Country is required",
      }),
      state: Joi.string().required().messages({
        "string.base": "State must be text",
        "any.required": "State is required",
      }),
      city: Joi.string().required().messages({
        "string.base": "City must be text",
        "any.required": "City is required",
      }),
      accountType: Joi.string()
        .valid(...Object.values(AccountType))
        .required()
        .messages({
          "any.only": `Account type must be one of: ${Object.values(
            AccountType
          ).join(", ")}`,
          "any.required": "Account type is required",
        }),
      userName: Joi.string().required().messages({
        "string.base": "Username must be text",
        "any.required": "Username is required",
      }),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
          "any.required": "Password is required",
          "string.min": "Password must be at least 8 characters long",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.required": "Confirm Password is required.",
          "any.only": "Passwords do not match",
        }),
      pin: Joi.string()
        .pattern(/^\d{4,6}$/)
        .required()
        .messages({
          "string.pattern.base":
            "PIN must be a 4-6 digit number (no letters allowed)",
          "any.required": "PIN is required",
        }),
      confirmPin: Joi.string().valid(Joi.ref("pin")).required().messages({
        "any.required": "Confirm Pin is required.",
        "any.only": "Pins do not match",
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

    // Validate image files
    if (!req.files || !("passport" in req.files)) {
      console.log(req.files);
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Passport is required",
        data: null,
      });
    }

    if (!("driversLicence" in req.files)) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Driver's licence is required",
        data: null,
      });
    }

    const passport = req.files["passport"][0];
    const driversLicence = req.files["driversLicence"][0];

    if (
      !passport ||
      typeof passport !== "object" ||
      !("mimetype" in passport) ||
      !("buffer" in passport)
    ) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Please upload a valid passport file image",
        data: null,
      });
    }

    if (
      !driversLicence ||
      typeof driversLicence !== "object" ||
      !("mimetype" in driversLicence) ||
      !("buffer" in driversLicence)
    ) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Please upload a valid driver's licence file image",
        data: null,
      });
    }

    if (!["image/jpeg", "image/png"].includes(passport.mimetype)) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Passport must be a JPEG or PNG image",
        data: null,
      });
    }

    if (!["image/jpeg", "image/png"].includes(driversLicence.mimetype)) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Driver licence be a JPEG or PNG image",
        data: null,
      });
    }

    return next();
  }

  public async emailVerifyOtp(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
      otp: Joi.string().required().messages({
        "any.required": "OTP is required.",
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
  public async validateEmail(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
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

  public async signIn(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email address is required",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required.",
      }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }

    return next();
  }

    public async forgotPasswordChange(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
      otp: Joi.string().required().messages({
        "any.required": "OTP is required.",
      }),
      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
          "any.required": "Password is required.",
          "string.min": "Password must be at least 8 characters long",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.required": "Confirm Password is required.",
          "any.only": "Passwords do not match",
        }),
    });
    const { error } = schema.validate(req.body);
    if (!error) {
      return next();
    } else {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }

    
  }
}

export const authValidator = new AuthValidator();
