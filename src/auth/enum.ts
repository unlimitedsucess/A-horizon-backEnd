import { AccountType } from "../user/enum";

export interface ISignUp {
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
}