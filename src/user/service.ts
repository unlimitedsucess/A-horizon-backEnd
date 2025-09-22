import mongoose, { Types } from "mongoose";

import User from "./entity";
import Decimal from "decimal.js";
import { utils } from "../utils";

class UserService {
  public async findUserByEmail(email: string) {
    const user = await User.findOne({
      email,
    });

    return user;
  }

  public async findUserByUserName(userName: string) {
    const user = await User.findOne({
      userName,
    });

    return user;
  }

  public async findUserByIdWithoutPassword(id: string) {
    const user = await User.findById(id).select(
      "-password -emailVerificationOtp -emailVerificationOtpExpiration"
    );

    return user;
  }

  public async findUserById(id: string) {
    const user = await User.findById(id);

    return user;
  }

  public async updateLoanAndLoanBalance(
    loanAmountWithIntrest: number,
    loanAmount: number,
    userId: string
  ) {
    const user = await User.findById(userId);

    if (user) {
      const currentLoan = new Decimal(user.loan?.toString() || "0");
      const currentLoanBalance = new Decimal(
        user.loanBalance?.toString() || "0"
      );
      const accBalance = new Decimal(user.initialDeposit?.toString() || "0");
      const amountToAddWithInrest = new Decimal(loanAmountWithIntrest);
      const loanAmountToAdd = new Decimal(loanAmount);
      const newLoan = currentLoan.plus(loanAmountToAdd);
      const newLoanBalance = currentLoanBalance.plus(amountToAddWithInrest);
      const newAccBalance = accBalance.plus(amountToAddWithInrest);

      user.loan = mongoose.Types.Decimal128.fromString(newLoan.toFixed(2));
      user.loanBalance = mongoose.Types.Decimal128.fromString(
        newLoanBalance.toFixed(2)
      );
      user.initialDeposit = mongoose.Types.Decimal128.fromString(
        newAccBalance.toFixed(2)
      );

      console.log("here")

      await user.save();

      return user;
    }

    return user;
  }

  public async redeemLoan(id: string, amount: number) {
    console.log(amount)
    const user = await User.findById(id);

    if (user) {
      user.loanBalance = mongoose.Types.Decimal128.fromString("0.00");
      const currentBalance = new Decimal(
        user.initialDeposit?.toString() || "0"
      );
      const amountToMinus = new Decimal(amount);
      const newBalance = currentBalance.minus(amountToMinus);

      user.initialDeposit = mongoose.Types.Decimal128.fromString(
        newBalance.toFixed(2)
      );

      await user.save();

      return user;
    }

    return user;
  }
}

export const userService = new UserService();
