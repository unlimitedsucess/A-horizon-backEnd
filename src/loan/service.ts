import { ILoanInput } from "./interface";
import Loan from "./entity";

class LoanService {
  public async applyLoan(input: ILoanInput) {
    let newLoan = new Loan({
      ...input,
    });

    await newLoan.save();

    return;
  }
}

export const loanService = new LoanService();
