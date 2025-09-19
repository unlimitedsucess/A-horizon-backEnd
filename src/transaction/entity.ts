import mongoose, { Schema } from "mongoose";

import { AccountType } from "../user/enum";
import { TransferType , TransactionStatus } from "./enum";
import { ITransaction } from "./interface";

const transactionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    accountType: {
      type: String,
      required: true,
      enum: Object.values(AccountType),
    },
     recipientName: {
      type: String,
      required: true,
    },
     accountNumber: {
      type: String,
      required: true,
    },
     country: {
      type: String,
      default: undefined,
    },
    bankName: {
      type: String,
      default: undefined,
    },
    swiftCode: {
      type: String,
      default: undefined,
    },
    routingNumber: {
      type: String,
      default: undefined,
    },
     description: {
      type: String,
      default: null,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      default: mongoose.Types.Decimal128.fromString("0.00"),
      min: mongoose.Types.Decimal128.fromString("0.00"),
      // When retrieving from DB, convert Decimal128 to number
      get: (v: mongoose.Types.Decimal128 | undefined): number =>
        v ? parseFloat(v.toString()) : 0,
      // When saving to DB, convert number or string to Decimal128
      set: (v: string | number): mongoose.Types.Decimal128 =>
        mongoose.Types.Decimal128.fromString(v.toString()),
    },
    transferType: {
      type: String,
      required: true,
      enum: Object.values(TransferType ),
    },
    status: {
      type: String,
      default: TransactionStatus.PENDING,
      enum: Object.values(TransactionStatus),
    },
   
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
