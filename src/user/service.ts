import mongoose, { Types } from "mongoose";

import User from "./entity";
import Decimal from "decimal.js";

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

  public async updateLoanAndLoanBalance(amount: number, userId: string) {
    const user = await User.findById(userId);

    if (user) {
      const currentLoan = new Decimal(user.loan?.toString() || "0");
      const currentLoanBalance = new Decimal(
        user.loanBalnce?.toString() || "0"
      );
      const amountToAdd = new Decimal(amount);
      const newLoan = currentLoan.minus(amountToAdd);
      const newLoanBalance = currentLoanBalance.minus(amountToAdd);

      user.loan = mongoose.Types.Decimal128.fromString(newLoan.toFixed(2));
      user.loanBalnce = mongoose.Types.Decimal128.fromString(
        newLoanBalance.toFixed(2)
      );

      await user.save();

      return user;
    }

    return user;
  }
}

export const userService = new UserService();
