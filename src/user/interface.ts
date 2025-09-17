import { Document } from "mongoose";
import { AccountType } from "./enum";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dob: string;
  ssn: string;
  initialDeposit: number;
  address: string;
  country: string;
  city: string;
  zipCode: string;
  accountType: AccountType;
  userName: string;
  password: string;
  pin: string;
  passportUrl: string;
  driversLicence: string;
  emailVerified: boolean;
  emailVerificationOtp?: string;
  emailVerificationOtpExpiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

