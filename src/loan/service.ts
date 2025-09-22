import { ILoanInput } from "./interface";
import Loan from "./entity";
import { LoanStatus } from "./enum";
import { utils } from "../utils";
import Decimal from "decimal.js";
import mongoose from "mongoose";

class LoanService {
  public async applyLoan(input: ILoanInput) {
    const loanPercentage = utils.toNumber(
      utils.getValueAfterUnderscore(input.loanDuration!)!
    )!;

    const intrest = new Decimal(
      utils.getIntrest(loanPercentage, input.loanAmount)
    );

    const amountToAdd = new Decimal(input.loanAmount);
    const loanBalance = intrest.plus(amountToAdd);

    let newLoan = new Loan({
      ...input,
      loanBalance: loanBalance,
    });

    await newLoan.save();

    return;
  }

  public async findLoanByIdAndUpdateStatus(id: string, status: LoanStatus) {
    const loan = await Loan.findById(id);
    if (!loan) return null;

    if (loan.status === LoanStatus.APPROVED || loan.status === LoanStatus.REDEEM) {
      return loan;
    }

    if (status === LoanStatus.APPROVED) {
      const activationDate = new Date();

      // 🔹 Example loanDuration: "1month_5"
      const [monthPart, percentagePart] = loan.loanDuration.split("_");

      // Get months (remove "month" from the string, parse as int)
      const months = parseInt(monthPart.replace("month", ""), 10);

      // Set lastInterestAppliedDate = activationDate + months
      const lastInterestAppliedDate = new Date(activationDate);
      lastInterestAppliedDate.setMonth(
        lastInterestAppliedDate.getMonth() + months
      );

      // 🔹 Calculate interest
      const percentage = new Decimal(percentagePart); // e.g. 5
      const loanAmount = new Decimal(loan.loanAmount?.toString() || "0");
      const interestAmount = loanAmount.mul(percentage).div(100);

      // Update loan balance = loan amount + interest
      const newLoanBalance = loanAmount.plus(interestAmount);

      // 🔹 Save updates
      loan.status = status;
      loan.activationDate = activationDate;
      loan.lastInterestAppliedDate = lastInterestAppliedDate;
      loan.loanBalance = mongoose.Types.Decimal128.fromString(
        newLoanBalance.toString()
      );

      await loan.save();
      return loan;
    }

    // If not approved, reset relevant fields
    loan.status = status;
    loan.activationDate = null;
    loan.lastInterestAppliedDate = null;
    await loan.save();

    return loan;
  }

  // public async findLoanByIdAndUpdateStatus(id: string, status: LoanStatus) {
  //   // Parse loan to get monthPart
  //   const loan = await Loan.findById(id);
  //   if (!loan) return null;

  //   let activationDate: Date | null = null;
  //   let lastInterestAppliedDate: Date | null = null;

  //   if (status === LoanStatus.APPROVED) {
  //     activationDate = new Date();

  //     // Example: "1_month_5"
  //     const [monthPart, percentagePart] = loan.loanDuration.split("_");
  //     const months = parseInt(monthPart, 10);

  //     lastInterestAppliedDate = new Date(activationDate);
  //     lastInterestAppliedDate.setMonth(lastInterestAppliedDate.getMonth() + months);
  //   }

  //   const updatedLoan = await Loan.findOneAndUpdate(
  //     { _id: id },
  //     {
  //       $set: {
  //         status,
  //         activationDate,
  //         lastInterestAppliedDate,
  //       },
  //     },
  //     { new: true }
  //   );

  //   return updatedLoan;
  // }

  public async findLoanByIdAndRedeem(id: string) {
    const updatedLoan = await Loan.findOneAndUpdate(
      { _id: id, status: LoanStatus.APPROVED },
      {
        $set: {
          status: LoanStatus.REDEEM,
        },
      },
      { new: true }
    );

    return updatedLoan;
  }

  public async findLoanById(id: string) {
    const loan = await Loan.findById(id);

    return loan;
  }
}

export const loanService = new LoanService();
