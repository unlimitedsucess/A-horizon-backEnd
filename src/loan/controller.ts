import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import { ILoanInput, ILoanUserInput } from "./interface";
import { utils } from "../utils";
import { userService } from "../user/service";
import { loanService } from "./service";

class LoanController {
  public async applyLoan(req: Request, res: Response) {
    const { userId } = req as CustomRequest;
    const body: ILoanUserInput = req.body;

    const userExist = await userService.findUserById(userId);

    if (!userExist) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    const loan: ILoanInput = {
      ...body,
      userId: userExist._id.toString(),
    };

    await loanService.applyLoan(loan);

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Loan Application successful",
      data: null,
    });
  }
}

export const loanController = new LoanController();
