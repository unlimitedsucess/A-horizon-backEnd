export type IVerifyEmail = {
  email: string;
  otp: string;
};

export interface ISignIn {
  email: string;
  password: string;
}
import { AccountType } from "../user/enum";

export interface ISignUp {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dob: string;
  ssn: string;
 // initialDeposit: number;
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  accountType: AccountType;
  userName: string;
  password: string;
  pin: string;
  passportUrl: string;
  driversLicence: string;
  accountNumber: string;
}
