import { ILoanInput } from "./interface";
import Loan from "./entity";
import { LoanStatus } from "./enum";
import { utils } from "../utils";

class LoanService {
  public async applyLoan(input: ILoanInput) {
  const loanPercentage =  utils.toNumber(utils.getValueAfterUnderscore(input.loanDuration!)!)!
    let newLoan = new Loan({
      ...input,
      loanBalance: utils.getPercentage(loanPercentage, input.loanAmount)
    });

    await newLoan.save();

    return;
  }

   public async findLoanByIdAndUpdateStatus(id: string, status: LoanStatus) {
     const user = await Loan.findOneAndUpdate(
      { _id: id },
      { $set: { status } },
      { new: true }
    );

    return user;
  }
}

export const loanService = new LoanService();
