import mongoose, { Schema } from "mongoose";

import { AccountStatus, AccountType } from "./enum";
import { IUser } from "./interface";

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      requrired: true,
    },
    phoneNo: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    zipCode: {
      type: String,
      default: "",
    },
    ssn: {
      type: String,
      default: "",
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
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    accountStatus: {
      type: String,
      default: AccountStatus.PENDING,
      enum: Object.values(AccountStatus),
    },
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    accountType: {
      type: String,
      default: null,
      enum: Object.values(AccountType),
    },
    userName: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    pin: {
      type: String,
      default: "",
    },
    passportUrl: {
      type: String,
      default: "",
    },
    driversLicence: {
      type: String,
      default: "",
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
