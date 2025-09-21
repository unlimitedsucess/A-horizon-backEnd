import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { MessageResponse } from "./enum";
import { TransferType } from "../transaction/enum";

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

export interface IWireTransferEmail {
  recipientName: string;
  accountName: string;
  country: string;
  swiftCode: string;
  routingNumber: string;
  amount: number;
  senderEmail: string;
  transferType: TransferType
}

export interface IDomesticTransferEmail {
  userName: string;
  recipientName: string;
  accountNumber: string;
  amount: number;
  senderEmail: string;
  transferType: TransferType
  decription?: string;
}

export interface ILoanAppproveEmail {
  amount: number;
  accountNumber: string;
  interestRate: string;
  description: string;
  receiverEmail: string;
  userName: string;
  loanTenure: string;
}

export interface ILoanDeclinedEmail {
  receiverEmail: string;
  userName: string;
}

export interface IAccountSuspendedEmail {
  receiverEmail: string;
  userName: string;
}


export interface IForgotPasswordEmail {
  receiverEmail: string;
  userName: string;
  otp: string;
}