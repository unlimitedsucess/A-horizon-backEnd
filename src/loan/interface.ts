import { Types, Document } from "mongoose";
import { LoanDuration, LoanStatus } from "./enum";

export interface ILoan extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  loanDuration: LoanDuration;
  status: LoanStatus;
  description: string;
  loanAmount: number;
  loanBalance: number;
  lastInterestUpateDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoanUserInput {
  loanDuration: LoanDuration;
  loanAmount: number;
  description: string;
  pin: string;
}

export interface ILoanInput {
  userId: string;
  description: string;
  loanDuration: LoanDuration;
  loanAmount: number;
}
