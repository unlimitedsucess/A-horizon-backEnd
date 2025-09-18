import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { MessageResponse } from "./enum";

export interface CustomRequest extends Request {
  userId: string;
}

export interface DecodedToken extends JwtPayload {
  userId: string;
}

export interface CustomHttpResponse {
  res: Response;
  status: number;
  message: MessageResponse;
  description: string;
  data: any;
}

export interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

export interface ISendEmail {
  receiverEmail: string;
  subject: string;
  emailTemplate: string;
}

export interface IEmailVerification {
  otp: string;
  email: string;
}