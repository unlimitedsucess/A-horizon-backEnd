import { Document, Types } from "mongoose";
import { AccountType } from "../user/enum";

export enum TransferType {
  Domestic = "domestic",
  Wire = "wire",
}


export interface ITransfer extends Document {
  userId: Types.ObjectId; 
  accountType: AccountType; 
  recipientName: string;
  accountName: string;
  country: string;
  swiftCode: string;
  routingNumber: string;
  description?: string | null;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface ITransferUserInput extends Document {
  userId: Types.ObjectId; 
  accountType: AccountType; 
  recipientName: string;
  accountName: string;
  country: string;
  swiftCode: string;
  routingNumber: string;
  description?: string | null;
  amount: number;
  pin: string;
  createdAt: Date;
  updatedAt: Date;
}