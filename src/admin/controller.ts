import { Request, Response } from "express";
import { MessageResponse } from "../utils/enum";
import { IAdminUserInput } from "./interface";
import { adminService } from "./service";
import { utils } from "../utils";
import dotenv from "dotenv";
import { tokenExpiry } from "../utils/global";
import jwt from "jsonwebtoken";

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
      description: "Detials fetched successfully!",
      data: {
        users,
        transactions,
        loans,
        cards,
      },
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

  //   public async deleteUserAccount(req: Request, res: Response) {
  //     const { id } = req.params;

  //     const user = await userService.findUserById(id);

  //     if (!user) {
  //       return res.status(404).json({
  //         message: MessageResponse.Success,
  //         description: "User not found!",
  //         data: null,
  //       });
  //     }

  //     await adminService.deleteUser(id);

  //     return res.status(200).json({
  //       message: MessageResponse.Success,
  //       description: "User has been deleted!",
  //       data: null,
  //     });
  //   }

  //   public async deleteATransferHistory(req: Request, res: Response) {
  //     const { id } = req.params;

  //     const transfer = await transferService.findTransferById(id);

  //     if (!transfer) {
  //       return res.status(404).json({
  //         message: MessageResponse.Success,
  //         description: "Transfer not found!",
  //         data: null,
  //       });
  //     }

  //     await transferService.deleteTransfer(id);

  //     return res.status(200).json({
  //       message: MessageResponse.Success,
  //       description: "Transfer has been deleted!",
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

  //   public async updateUser(req: Request, res: Response) {
  //     const { id } = req.params;

  //     const body: IUserUpdate = req.body;

  //     const userExist = await userService.findUserById(id);

  //     if (!userExist) {
  //       return res.status(404).json({
  //         message: MessageResponse.Error,
  //         description: "User does not exist!",
  //         data: null,
  //       });
  //     }

  //     const user = await userService.updateUser(body, id);

  //     if (userExist.status != user?.status) {
  //       const approvalStatus: AccountApproved = {
  //         receiverEmail: userExist.email,
  //         fullName: `${userExist.firstName} ${userExist.lastName}`,
  //       };
  //       if (user?.status == AccountStatus.Active) {
  //         sendAccountActivatedEmailToUser(approvalStatus);
  //       } else {
  //         sendAccountSuspendedmailToUser(approvalStatus);
  //       }
  //     }

  //     return res.status(200).json({
  //       message: MessageResponse.Success,
  //       description: "User details updated successfully!",
  //       data: null,
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
