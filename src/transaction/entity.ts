import mongoose, { Schema } from "mongoose";

import { AccountType } from "../user/enum";
import { ITransfer } from "./interface";
import { TransactionStatus } from "./enum";

const transferSchema: Schema = new Schema(
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
    status: {
      type: String,
      default: TransactionStatus.PENDING,
      enum: Object.values(TransactionStatus),
    },
    recipientName: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    swiftCode: {
      type: String,
      required: true,
    },
    routingNumber: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null
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
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Transfer = mongoose.model<ITransfer>("Transfer", transferSchema);

export default Transfer;
