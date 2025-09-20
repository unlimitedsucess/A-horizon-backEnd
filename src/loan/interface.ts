import { Types, Document } from "mongoose";
import { LoanDuration, LoanStatus } from "./enum";

export interface ILoan extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  loanDuration: LoanDuration;
  status: LoanStatus;
  loanAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoanUserInput {
  loanDuration: LoanDuration;
  loanAmount: number;
  pin: string;
}

export interface ILoanInput {
  userId: string;
  loanDuration: LoanDuration;
  loanAmount: number;
}
