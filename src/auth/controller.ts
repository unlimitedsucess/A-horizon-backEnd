import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

import { utils } from "../utils";
import { ISignUp } from "./enum";
import { userService } from "../user/service";
import { MessageResponse } from "../utils/enum";
import { authService } from "./service";
import { MulterFiles } from "../utils/interface";
import cloudinary from "../../config/cloudnairy";
import { sendVerificationEmail } from "../utils/email";
import { ISignIn, IVerifyEmail } from "./interface";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "";

class AuthController {
  public async createAccount(req: Request, res: Response) {
    const email = req.body.email;

    const emailExists = await userService.findUserByEmail(email);

    if (emailExists) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Email already exist!",
        data: null,
      });
    }

    const otp = await authService.createUser(email);

    sendVerificationEmail({ email, otp });

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Verification OTP resent!",
      data: null,
    });
  }

  public async registerUser(req: Request, res: Response) {
    try {
      const body: ISignUp = req.body;
      const email = body.email;
      const userName = body.userName;
      const files = req.files as MulterFiles;

      const emailExists = await userService.findUserByEmail(email);

      if (!emailExists) {
        return utils.customResponse({
          status: 404,
          res,
          message: MessageResponse.Error,
          description: "User not found!",
          data: null,
        });
      }

      // check if username exists
      const userNameExists = await userService.findUserByUserName(userName);
      if (userNameExists) {
        return utils.customResponse({
          status: 400,
          res,
          message: MessageResponse.Error,
          description: "Username already exists!",
          data: null,
        });
      }

      // upload proof of address
      let passportUrl: string | null = null;
      if (files?.["passport"]?.[0]) {
        const buffer = files["passport"][0].buffer;
        const uploadRes = await utils.uploadFromBuffer(buffer, "passport");
        passportUrl = uploadRes.secure_url;
      }

      // upload profile picture
      let driversLicence: string | null = null;
      if (files?.["driversLicence"]?.[0]) {
        const buffer = files["driversLicence"][0].buffer;
        const uploadRes = await utils.uploadFromBuffer(
          buffer,
          "driversLicence"
        );
        driversLicence = uploadRes.secure_url;
      }

      // create user (with OTP, etc.)
      const user = await authService.registerUser({
        ...body,
        passportUrl: passportUrl!,
        driversLicence: driversLicence!,
      });

      if (!user) {
        return utils.customResponse({
          status: 404,
          res,
          message: MessageResponse.Error,
          description: "User not found!",
          data: null,
        });
      }

      return utils.customResponse({
        status: 201,
        res,
        message: MessageResponse.Success,
        description: "User creation completed, verify email!",
        data: null,
      });
    } catch (error: any) {
      console.error("RegisterUser Error:", error);
      return utils.customResponse({
        status: 500,
        res,
        message: MessageResponse.Error,
        description: error.message || "Server error",
        data: null,
      });
    }
  }

  public async emailVerifyOtp(req: Request, res: Response) {
    const body: IVerifyEmail = req.body;

    const email = body.email;
    const otp = body.otp;

    const userOtpValidity = await authService.validateOtp({ email, otp });

    if (!userOtpValidity) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Invalid otp",
        data: null,
      });
    }

    if (userOtpValidity.emailVerificationOtpExpiration !== undefined) {
      const currentDate = new Date();

      const expirationDate = new Date(
        userOtpValidity.emailVerificationOtpExpiration
      );

      if (expirationDate < currentDate) {
        return utils.customResponse({
          status: 400,
          res,
          message: MessageResponse.Error,
          description: "Email verification OTP has expired!",
          data: null,
        });
      }

      const userExists = await authService.verifyEmail(email);

      if (!userExists) {
        return utils.customResponse({
          status: 404,
          res,
          message: MessageResponse.Error,
          description: "User not found!",
          data: null,
        });
      }

      const token = jwt.sign({ userId: userExists._id }, jwtSecret, {
        expiresIn: "30d",
      });

      return utils.customResponse({
        status: 200,
        res,
        message: MessageResponse.Success,
        description: "Verification successful",
        data: {
          token,
        },
      });
    } else {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Email verification OTP expired",
        data: null,
      });
    }
  }

  public async resendEmailVerificationOtp(req: Request, res: Response) {
    const body: IVerifyEmail = req.body;

    const user = await userService.findUserByEmail(body.email);

    if (!user) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    const email = user.email;

    const otp = utils.generateOtp();

    await authService.saveOtp({ email: email!, otp });

    sendVerificationEmail({ email: email!, otp });

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Verification OTP resent!",
      data: null,
    });
  }

   public async signIn(req: Request, res: Response) {
    const body: ISignIn = req.body;

    const password = body.password;

    const userExist = await userService.findUserByEmail(body.email);

    if (!userExist) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    if (userExist.password !== password) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    // if (userExist.status != AccountStatus.Active) {
    //   return res.status(400).json({
    //     message: MessageResponse.Error,
    //     description: "Your account is not active!",
    //     data: null,
    //   });
    // }

    const token = jwt.sign({ userId: userExist._id }, jwtSecret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Logged in successfully",
      data: {
        token,
      },
    });
  }
}

export const authController = new AuthController();
