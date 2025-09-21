import { Types, Document } from "mongoose";
import { LoanDuration, LoanStatus } from "./enum";

export interface ILoan extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  loanDuration: LoanDuration;
  status: LoanStatus;
  description: string;
  loanAmount: Types.Decimal128;
  interestAmount: Types.Decimal128;
  loanBalance: Types.Decimal128;
  lastInterestAppliedDate: Date | null;
  activationDate: Date | null;
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
