import { ILoanInput } from "./interface";
import Loan from "./entity";
import { LoanStatus } from "./enum";
import { utils } from "../utils";
import Decimal from "decimal.js";

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
  // Parse loan to get monthPart
  const loan = await Loan.findById(id);
  if (!loan) return null;

  let activationDate: Date | null = null;
  let lastInterestAppliedDate: Date | null = null;

  if (status === LoanStatus.APPROVED) {
    activationDate = new Date();

    // Example: "1_month_5"
    const [monthPart] = loan.loanDuration.split("_");
    const months = parseInt(monthPart, 10);

    lastInterestAppliedDate = new Date(activationDate);
    lastInterestAppliedDate.setMonth(lastInterestAppliedDate.getMonth() + months);
  }

  const updatedLoan = await Loan.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status,
        activationDate,
        lastInterestAppliedDate,
      },
    },
    { new: true }
  );

  return updatedLoan;
}

}

export const loanService = new LoanService();
