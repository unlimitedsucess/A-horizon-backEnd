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

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "";

class AuthController {
 public async registerUser(req: Request, res: Response) {
    try {
      const body: ISignUp = req.body;
      const email = body.email;
      const userName = body.userName;
      const files = req.files as MulterFiles;

      // check if email exists
      const emailExists = await userService.findUserByEmail(email);
      if (emailExists) {
        return utils.customResponse({
          status: 400,
          res,
          message: MessageResponse.Error,
          description: "Email already exists!",
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
console.log("1")
      // upload proof of address
      let passportUrl: string | null = null;
      if (files?.["passport"]?.[0]) {
        const buffer = files["passport"][0].buffer;
        const uploadRes = await utils.uploadFromBuffer(buffer, "passport");
        passportUrl = uploadRes.secure_url;
      }
console.log("2")
      // upload profile picture
      let driversLicence: string | null = null;
      if (files?.["driversLicence"]?.[0]) {
        const buffer = files["driversLicence"][0].buffer;
        const uploadRes = await utils.uploadFromBuffer(buffer, "driversLicence");
        driversLicence = uploadRes.secure_url;
      }
console.log("3")
      // create user (with OTP, etc.)
      const otp = await authService.createUser({
        ...body,
        passportUrl: passportUrl!,
        driversLicence: driversLicence!
      });

      // sendVerificationEmail({ email, otp, firstName: body.firstName });

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
}

export const authController = new AuthController();
