import { Request, Response } from "express";
import { MessageResponse } from "../utils/enum";
import {
  IAdminCreateDomesticTransferUserInput,
  IAdminCreateWireTransferInput,
  IAdminUpadateLoan,
  IAdminUserInput,
  IUpdateUserAccountStatus,
  IUserUpdate,
} from "./interface";
import { adminService } from "./service";
import { utils } from "../utils";
import dotenv from "dotenv";
import { tokenExpiry } from "../utils/global";
import jwt from "jsonwebtoken";
import { ISignUp } from "../auth/interface";
import { userService } from "../user/service";
import {
  TransactionDirection,
  TransactionType,
  TransferType,
} from "../transaction/enum";
import {
  IDomesticTransferEmail,
  IWireTransferEmail,
  MulterFiles,
} from "../utils/interface";
import {
  sendAccountSuspendedEmail,
  sendDomesticTransferCreditAlert,
  sendDomesticTransferDebitAlert,
  sendLoanApprovalEmail,
  sendLoanDeclinedEmail,
  sendWireTransferCreditAlert,
  sendWireTransferDebitAlert,
} from "../utils/email";
import { loanService } from "../loan/service";
import { LoanStatus } from "../loan/enum";
import { AccountStatus } from "../user/enum";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "";

class AdminController {
  public async adminSignUp(req: Request, res: Response) {
    const body: IAdminUserInput = req.body;

    await adminService.createAdmin(body);

    return utils.customResponse({
      status: 201,
      res,
      message: MessageResponse.Success,
      description: "Admin created successfully!",
      data: null,
    });
  }

  public async adminSignIn(req: Request, res: Response) {
    const body: IAdminUserInput = req.body;

    const userName = body.userName;
    const password = body.password;

    const userExist = await adminService.findAdminByUserNameAndPassword({
      userName,
      password,
    });

    if (!userExist) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    const token = jwt.sign({ userId: userExist._id }, jwtSecret, {
      expiresIn: tokenExpiry,
    });

    await adminService.createAdmin(body);

    return utils.customResponse({
      status: 201,
      res,
      message: MessageResponse.Success,
      description: "Admin logged in successfully!",
      data: {
        token,
      },
    });
  }

  public async fetchAdminDetails(req: Request, res: Response) {
    const users = await adminService.fetchAllUsers();
    const transactions = await adminService.fetchTransactions();
    const loans = await adminService.fetchLoans();
    const cards = await adminService.fetchCards();

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Details fetched successfully!",
      data: {
        users,
        transactions,
        loans,
        cards,
      },
    });
  }

  public async updateUserAccountStatus(req: Request, res: Response) {
    const body: IUpdateUserAccountStatus = req.body;

    const userExist = await adminService.updateUserStatus(body);

    if (!userExist) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    if (body.status === AccountStatus.SUSPENDED) {
      sendAccountSuspendedEmail({
        receiverEmail: userExist.email!,
        userName: userExist.userName!,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: `User is now ${body.status}`,
      data: null,
    });
  }

  public async updateUser(req: Request, res: Response) {
    const { id } = req.params;

    const body: IUserUpdate = req.body;
    const files = req.files as MulterFiles;

    const userExist = await userService.findUserById(id);

    if (!userExist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    if (userExist.email !== body.email) {
      const emailExists = await userService.findUserByEmail(body.email);

      if (emailExists) {
        return utils.customResponse({
          status: 400,
          res,
          message: MessageResponse.Error,
          description: "Email already exist!",
          data: null,
        });
      }
    }

    if (userExist.userName !== body.userName) {
      const userNameExists = await userService.findUserByUserName(
        body.userName
      );
      if (userNameExists) {
        return utils.customResponse({
          status: 400,
          res,
          message: MessageResponse.Error,
          description: "Username already exists!",
          data: null,
        });
      }
    }

    // upload proof of address
    let passportUrl = userExist.passportUrl;
    if (files?.["passport"]?.[0]) {
      const buffer = files["passport"][0].buffer;
      const uploadRes = await utils.uploadFromBuffer(buffer, "passport");
      passportUrl = uploadRes.secure_url;
    }

    // upload profile picture
    let driversLicence = userExist.driversLicence;
    if (files?.["driversLicence"]?.[0]) {
      const buffer = files["driversLicence"][0].buffer;
      const uploadRes = await utils.uploadFromBuffer(buffer, "driversLicence");
      driversLicence = uploadRes.secure_url;
    }

    await adminService.updateUser(
      {
        ...body,
        passportUrl: passportUrl!,
        driversLicence: driversLicence!,
      },
      id
    );

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "User details updated successfully!",
      data: null,
    });
  }

  public async deleteUserAccount(req: Request, res: Response) {
    const { id } = req.params;

    const user = await adminService.deleteUser(id);

    if (!user) {
      return res.status(404).json({
        message: MessageResponse.Success,
        description: "User not found!",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "User has been deleted!",
      data: null,
    });
  }

  public async deleteATransferHistory(req: Request, res: Response) {
    const { id } = req.params;

    const transaction = await adminService.deleteTransaction(id);

    if (!transaction) {
      return res.status(404).json({
        message: MessageResponse.Success,
        description: "Transaction not found!",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Transaction has been deleted!",
      data: null,
    });
  }

  public async adminCreateWireTransferHistory(req: Request, res: Response) {
    const body: IAdminCreateWireTransferInput = req.body;

    const userExist = await userService.findUserById(body.userId);

    if (!userExist) {
      return res.status(404).json({
        message: MessageResponse.Success,
        description: "User not found!",
        data: null,
      });
    }

    const txHis: IAdminCreateWireTransferInput = {
      ...body,
      transferType: TransferType.WIRE,
    };

    await adminService.adminCreateWireTransfer(txHis);

    if (utils.isToday(body.transactionDate)) {
      const alertEmail: IWireTransferEmail = {
        recipientName: body.recipientName,
        accountName: `${userExist.firstName} ${userExist.lastName}`!,
        country: body.country,
        swiftCode: body.swiftCode!,
        routingNumber: body.routingNumber!,
        amount: body.amount!,
        senderEmail: userExist.email!,
        transferType: TransferType.WIRE,
      };

      if (body.transactionDirection === TransactionDirection.CREDIT) {
        sendWireTransferCreditAlert(alertEmail);
      } else {
        sendWireTransferDebitAlert(alertEmail);
      }
    }

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Transaction created successfully!",
      data: null,
    });
  }

  public async adminCreateDomesticTransferHistory(req: Request, res: Response) {
    const body: IAdminCreateDomesticTransferUserInput = req.body;

    const userExist = await userService.findUserById(body.userId);

    if (!userExist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    const txHis: IAdminCreateDomesticTransferUserInput = {
      ...body,
      transferType: TransferType.DOMESTIC,
    };

    await adminService.adminCreateDomesticTransfer(txHis);

    if (utils.isToday(body.transactionDate)) {
      // 📩 Send debit alert
      const alertEmail: IDomesticTransferEmail = {
        recipientName: body.recipientName,
        userName: userExist.userName!,
        accountNumber: body.accountNumber,
        amount: body.amount!,
        senderEmail: userExist.email!,
        transferType: TransferType.WIRE,
      };

      if (body.transactionDirection === TransactionDirection.CREDIT) {
        sendDomesticTransferCreditAlert(alertEmail);
      } else {
        sendDomesticTransferDebitAlert(alertEmail);
      }
    }

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Transaction created successfully!",
      data: null,
    });
  }

  public async adminUpdateLoan(req: Request, res: Response) {
    const body: IAdminUpadateLoan = req.body;

    const loan = await loanService.findLoanByIdAndUpdateStatus(
      body.loanId,
      body.status
    );

    if (!loan) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "Loan not found!",
        data: null,
      });
    }

    const userExist = await userService.findUserById(loan.userId.toString());

    if (!userExist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    if (body.status === LoanStatus.APPROVED) {
      await userService.updateLoanAndLoanBalance(
        loan.loanBalance,
        loan.userId.toString(),
       // utils.toNumber(utils.getValueAfterUnderscore(loan.loanDuration!)!)!
      );

      sendLoanApprovalEmail({
        accountNumber: userExist.accountNumber!,
        amount: loan.loanBalance,
        description: loan.description,
        interestRate: utils.getValueAfterUnderscore(loan.loanDuration!)!,
        loanTenure: utils.getValueBeforeUnderscore(loan.loanDuration)!,
        receiverEmail: userExist.email!,
        userName: userExist.userName!,
      });
    }

    if (body.status === LoanStatus.REJECTED) {
      sendLoanDeclinedEmail({
        receiverEmail: userExist.email!,
        userName: userExist.userName!,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: `Loan updated successfully!`,
      data: null,
    });
  }
  //   public async approveUserAccount(req: Request, res: Response) {
  //     const { id } = req.params;

  //     const user = await userService.findUserById(id);

  //     if (!user) {
  //       return res.status(404).json({
  //         message: MessageResponse.Success,
  //         description: "User not found!",
  //         data: null,
  //       });
  //     }

  //     await adminService.approveUser(id);

  //     const acctApproved: AccountApproved = {
  //       receiverEmail: user.email,
  //       fullName: `${user.firstName} ${user.lastName}`,
  //     };

  //     sendAccountApprovedEmailToUser(acctApproved);

  //     return res.status(200).json({
  //       message: MessageResponse.Success,
  //       description: "User has been approved!",
  //       data: null,
  //     });
  //   }

  //   public async fetchTransferById(req: Request, res: Response) {
  //     const { id } = req.params;

  //     const transfer = await transferService.findTransferById(id);

  //     if (!transfer) {
  //       return res.status(404).json({
  //         message: MessageResponse.Success,
  //         description: "Transfer not found!",
  //         data: null,
  //       });
  //     }

  //     return res.status(200).json({
  //       message: MessageResponse.Success,
  //       description: "Transfer fetched duccessfully!",
  //       data: transfer,
  //     });
  //   }

  //   public async fetchTransferByUserId(req: Request, res: Response) {
  //     const { id } = req.params;

  //     const transfer = await transferService.fetchUserTransferByUserId(id);

  //     if (!transfer) {
  //       return res.status(404).json({
  //         message: MessageResponse.Success,
  //         description: "Transfer not found!",
  //         data: null,
  //       });
  //     }

  //     return res.status(200).json({
  //       message: MessageResponse.Success,
  //       description: "User transfer fetched duccessfully!",
  //       data: transfer,
  //     });
  //   }

  //   public async updateUserTransfer(req: Request, res: Response) {
  //     const { id } = req.params;

  //     const body: ITransferInput = req.body;

  //     const transfer = await transferService.findTransferById(id);

  //     if (!transfer) {
  //       return res.status(404).json({
  //         message: MessageResponse.Success,
  //         description: "Transfer not found!",
  //         data: null,
  //       });
  //     }

  //     await transferService.updateTransfer(body, id);

  //     return res.status(200).json({
  //       message: MessageResponse.Success,
  //       description: "Transfer details updated successfully!",
  //       data: null,
  //     });
  //   }

  //   public async createTransferWithAdmin(req: Request, res: Response) {
  //     const { userId } = req as CustomRequest;
  //     const body: ITransferInput = req.body;

  //     const userExist = await userService.findUserByIdWithoutPassword(
  //       body.userId
  //     );

  //     if (!userExist) {
  //       return res.status(404).json({
  //         message: MessageResponse.Error,
  //         description: "This user does not exist!",
  //         data: null,
  //       });
  //     }

  //     if (userExist.status != AccountStatus.Active) {
  //       return res.status(400).json({
  //         message: MessageResponse.Error,
  //         description: "This user is not active!",
  //         data: null,
  //       });
  //     }

  //     const isTodayTransfer = (dateString: string): boolean => {
  //       const transferDate = DateTime.fromISO(dateString, {
  //         zone: "utc",
  //       }).toUTC();
  //       const today = DateTime.now().toUTC();

  //       return (
  //         transferDate.year === today.year &&
  //         transferDate.month === today.month &&
  //         transferDate.day === today.day
  //       );
  //     };

  //     console.log(
  //       `isTodayTransfer(body.transferDate.toString()) ==> ${isTodayTransfer(
  //         body.transferDate.toString()
  //       )}`
  //     );

  //     if (
  //       isTodayTransfer(body.transferDate.toString()) &&
  //       body.transactionType == TransactionType.Debit
  //     ) {
  //       const userBalance = parseFloat(userExist.initialDeposit);

  //       const transferAmount = parseFloat(body.amount);

  //       if (transferAmount > userBalance) {
  //         return res.status(400).json({
  //           message: MessageResponse.Error,
  //           description: "Insufficient balance!",
  //           data: null,
  //         });
  //       }
  //     }

  //     const createdTransfer = await transferService.createTransfer(body, body.transferDate);

  //     const transferAmount = parseFloat(body.amount);

  //     const txAlert: TransactionAlert = {
  //       accountNumber: userExist.accountNo,
  //       amount: transferAmount,
  //       date: createdTransfer.createdAt,
  //       senderEmail: userExist.email,
  //       receiverFullName: body.beneficiaryName,
  //       senderFullName: `${userExist.firstName} ${userExist.lastName}`,
  //       transactionNumber: createdTransfer.transactionId,
  //       transactionDate: createdTransfer.createdAt.toString(),
  //       paymentMethod: createdTransfer.transferType
  //     };

  //     console.log(
  //       `transferDate ${body.transferDate.toString()} created At date ${createdTransfer.createdAt.toString()}`
  //     );

  //     if (isTodayTransfer(body.transferDate.toString())) {

  //       if (body.transactionType == TransactionType.Debit) {
  //         await userService.debitUser(transferAmount, userExist._id);

  //         sendDebitAlert(txAlert);
  //       }

  //       if (body.transactionType == TransactionType.Credit) {
  //         await userService.creditUser(transferAmount, userExist._id);

  //         sendCreditAlert(txAlert);
  //       }
  //     }

  //     return res.status(201).json({
  //       message: MessageResponse.Success,
  //       description: "Transfer created successfully",
  //       data: null,
  //     });
  //   }
}

export const adminController = new AdminController();
