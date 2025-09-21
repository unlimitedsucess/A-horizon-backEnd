import { Document, Types } from "mongoose";
import { AccountStatus, AccountType } from "../user/enum";
import { TransactionDirection, TransactionStatus, TransactionType, TransferType } from "../transaction/enum";

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
  password: string;
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
  passportUrl: string;
  driversLicence: string;
}


export interface IAdminCreateWireTransferInput {
  userId: string;
  accountType: AccountType;
  transactionDirection: TransactionDirection;
  transactionType: TransactionType;
  recipientName: string;
  accountNumber: string;
  country: string;
  swiftCode: string;
  routingNumber: string;
  description?: string | null;
  amount: number; 
  transferType: TransferType;
  status: TransactionStatus;
  transactionDate: string;
}



export interface IAdminCreateDomesticTransferUserInput {
  userId: string;
  accountType: AccountType;
  bankName: string;
  recipientName: string;
  accountNumber: string;
  description?: string | null;
  amount: number; 
  transactionDate: string;
  transactionType: TransactionType;
  transactionDirection: TransactionDirection;
  transferType: TransferType;
  status: TransactionStatus;
}