import mongoose, { Schema } from "mongoose";

import { AccountType } from "./enum";
import { IUser } from "./interface";

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      requrired: true,
    },
    phoneNo: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
    ssn: {
      type: String,
      default: null,
    },
    initialDeposit: {
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
    loan: {
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
    loanBalance: {
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
    expenses: {
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
    accountNumber: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    accountType: {
      type: String,
      default: null,
      enum: Object.values(AccountType),
    },
    userName: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    pin: {
      type: String,
      default: null,
    },
    passportUrl: {
      type: String,
      default: null,
    },
    driversLicence: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOtp: {
      type: String,
      default: undefined,
    },
    emailVerificationOtpExpiration: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
