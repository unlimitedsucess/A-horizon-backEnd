import { Document, Types } from "mongoose";
import { AccountType } from "../user/enum";
import { TransferType, TransactionStatus } from "./enum";


export interface ITransaction extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  accountType: AccountType;
  recipientName: string;
  bankName?: string;
  accountNumber: string;
  country?: string;
  swiftCode?: string;
  routingNumber?: string;
  description?: string | null;
  amount: number; 
  transferType: TransferType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWireTransferUserInput {
  accountType: AccountType;
  recipientName: string;
  accountNumber: string;
  country: string;
  swiftCode: string;
  routingNumber: string;
  description?: string | null;
  amount: number; 
  pin: string;
}


export interface IWireTransferInput {
  userId: string;
  accountType: AccountType;
  recipientName: string;
  accountNumber: string;
  country: string;
  swiftCode: string;
  routingNumber: string;
  description?: string | null;
  amount: number; 
  transferType: TransferType;
  status: TransactionStatus;
}



export interface IDomesticTransferUserInput {
  accountType: AccountType;
  bankName: string;
  recipientName: string;
  accountNumber: string;
  description?: string | null;
  amount: number; 
  pin: string;
}


export interface IDomesticTransferInput {
  userId: string;
  accountType: AccountType;
  bankName: string;
  recipientName: string;
  accountNumber: string;
  description?: string | null;
  amount: number; 
  pin: string;
  transferType: TransferType;
  status: TransactionStatus;
}