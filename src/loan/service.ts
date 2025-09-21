import { ILoanInput } from "./interface";
import Loan from "./entity";
import { LoanStatus } from "./enum";

class LoanService {
  public async applyLoan(input: ILoanInput) {
    let newLoan = new Loan({
      ...input,
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
