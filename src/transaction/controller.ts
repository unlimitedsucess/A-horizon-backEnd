import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import {
  CustomRequest,
  IDomesticTransferEmail,
  IWireTransferEmail,
} from "../utils/interface";
import { userService } from "../user/service";
import { transactionService } from "./service";
import { AccountStatus } from "../user/enum";
import {
  IDomesticTransferInput,
  IDomesticTransferUserInput,
  IWireTransferInput,
  IWireTransferUserInput,
} from "./interface";
import { utils } from "../utils";
import {
  sendDomesticTransferDebitAlert,
  sendWireTransferDebitAlert,
} from "../utils/email";
import { TransactionDirection, TransactionStatus, TransactionType, TransferType } from "./enum";

class TransactionController {
  public async createWireTransfer(req: Request, res: Response) {
    const { userId } = req as CustomRequest;
    const body: IWireTransferUserInput = req.body;

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

    if (body.pin !== userExist.pin) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Incorrect pin!",
        data: null,
      });
    }

    const transferAmount = Number(body.amount);
    const userBalance = parseFloat(userExist.initialDeposit!.toString());

    if (isNaN(transferAmount)) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Invalid amount or balance!",
        data: null,
      });
    }

    if (transferAmount > userBalance) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Insufficient balance!",
        data: null,
      });
    }
    const transfer: IWireTransferInput = {
      ...body,
      transactionType: TransactionType.TRANSFER,
      transactionDirection: TransactionDirection.DEBIT,
      status: TransactionStatus.COMPLETED,
      transferType: TransferType.WIRE,
      userId: userExist._id.toString(),
    };

    await transactionService.createWireTransfer(transfer);

    await transactionService.debitUser(transferAmount, userExist._id.toString());

    // 📩 Send debit alert
    const debitAlert: IWireTransferEmail = {
      recipientName: body.recipientName,
      accountName: `${userExist.firstName} ${userExist.lastName}`!,
      country: body.country,
      swiftCode: body.swiftCode!,
      routingNumber: body.routingNumber!,
      amount: body.amount!,
      senderEmail: userExist.email!,
      transferType: TransferType.WIRE,
    };

    sendWireTransferDebitAlert(debitAlert);

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Transfer successful",
      data: null,
    });
  }

  public async createDomesticTransfer(req: Request, res: Response) {
    const { userId } = req as CustomRequest;
    const body: IDomesticTransferUserInput = req.body;

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

    if (body.pin !== userExist.pin) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Incorrect transfer pin!",
        data: null,
      });
    }

    const transferAmount = Number(body.amount);
    const userBalance = parseFloat(userExist.initialDeposit!.toString());

    if (isNaN(transferAmount)) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Invalid amount or balance!",
        data: null,
      });
    }

    if (transferAmount > userBalance) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Insufficient balance!",
        data: null,
      });
    }
    const transfer: IDomesticTransferInput = {
      ...body,
      status: TransactionStatus.COMPLETED,
      transactionType: TransactionType.TRANSFER,
      transactionDirection: TransactionDirection.DEBIT,
      transferType: TransferType.DOMESTIC,
      userId: userExist._id.toString(),
    };

    await transactionService.createDomesticTransfer(transfer);

    await transactionService.debitUser(transferAmount, userExist._id.toString());

    // 📩 Send debit alert
    const debitAlert: IDomesticTransferEmail = {
      recipientName: body.recipientName,
      userName: userExist.userName!,
      accountNumber: body.accountNumber,
      amount: body.amount!,
      senderEmail: userExist.email!,
      transferType: TransferType.WIRE,
    };

    sendDomesticTransferDebitAlert(debitAlert);

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Transfer successful",
      data: null,
    });
  }

    public async fetchTransactionHistory(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    console.log(userId);

    const txHistory = await transactionService.findTransactionByUserId(userId);

     return res.status(200).json({
      message: MessageResponse.Success,
      description: "Transaction History fetched successful",
      data: txHistory,
    });
    }
}

export const transactionController = new TransactionController();
