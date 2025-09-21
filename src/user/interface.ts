import { Document, Types } from "mongoose";
import { AccountStatus, AccountType } from "./enum";

export interface IUser extends Document {
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  phoneNo?: string | null;
  dob?: string | null;
  ssn?: string | null;
  accountNumber?: string | null;
  initialDeposit: Types.Decimal128;
  loan?: Types.Decimal128;
  loanBalnce?: Types.Decimal128;
  expenses?: number;
  address?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  zipCode?: string | null;
  accountType?: AccountType;
  accountStatus: AccountStatus;
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

