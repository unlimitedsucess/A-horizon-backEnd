import { Document, Types } from "mongoose";
import { AccountStatus, AccountType } from "../user/enum";

export interface IAdmin extends Document {
  userName: string;
  password: string;
  createdAt: string;
}

export interface IAdminUserInput {
  userName: string;
  password: string;
}

export interface IUpdateUserAccountStatus {
  userId: Types.ObjectId;
  status: AccountStatus;
}


export interface IUserUpdate {
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
  state: string;
  zipCode: string;
  accountType: AccountType;
  userName: string;
  pin: string;
}