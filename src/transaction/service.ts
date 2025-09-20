import Decimal from "decimal.js";
import User from "../user/entity";
import mongoose from "mongoose";
import { IDomesticTransferInput, IWireTransferInput, IWireTransferUserInput } from "./interface";
import Transaction from "./entity";

class TransactionService {
  public async createWireTransfer(input: IWireTransferInput, createdAt?: Date) {
    let newTransaction = new Transaction({
      ...input,
    });

    await newTransaction.save();

    return;
  }


    public async createDomesticTransfer(input: IDomesticTransferInput) {
    let newTransaction = new Transaction({
      ...input,
    });

    await newTransaction.save();

    return;
  }

  public async debitUser(amount: number, userId: string) {
    const user = await User.findById(userId);

    if (user) {
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

  // public async fetchUserTransactionHistoryByUserId(id: string) {
  //   const transfer = Transaction.find({ userId: id });

  //   return transfer;
  // }

  public async findTransferById(id: string) {
    const user = await Transaction.findById(id);

    return user;
  }

  public async deleteTransfer(id: string) {
    const user = await Transaction.findOneAndDelete({ _id: id });

    return user;
  }

   public async findTransactionByUserId(id: string) {
    const user = await Transaction.find({userId: id});

    return user;
  }

}

export const transactionService = new TransactionService();
