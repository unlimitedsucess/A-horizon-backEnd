import { Document } from "mongoose";
import { AccountType } from "./enum";

export interface IUser extends Document {
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  phoneNo?: string | null;
  dob?: string | null;
  ssn?: string | null;
  accountNumber?: string | null;
  initialDeposit?: number;
  loan?: number;
  loanBalnce?: number;
  expenses?: number;
  address?: string | null;
  country?: string | null;
  city?: string | null;
  zipCode?: string | null;
  accountType?: AccountType;
  userName?: string | null;
  password?: string | null;
  pin?: string | null;
  passportUrl?: string | null;
  driversLicence?: string | null;
  emailVerified?: boolean;
  emailVerificationOtp?: string;
  emailVerificationOtpExpiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

