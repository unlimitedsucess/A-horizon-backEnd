import mongoose, { Schema } from "mongoose";

import { AccountType } from "./enum";
import { IUser } from "./interface";

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    ssn: {
      type: String,
      required: true,
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
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: Object.values(AccountType),
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    passportUrl: {
      type: String,
      required: true,
    },
    driversLicence: {
      type: String,
      required: true,
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
