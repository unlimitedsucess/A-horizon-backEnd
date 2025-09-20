"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const enum_1 = require("../utils/enum");
const service_1 = require("../user/service");
const service_2 = require("./service");
const utils_1 = require("../utils");
const email_1 = require("../utils/email");
const enum_2 = require("./enum");
class TransactionController {
    createWireTransfer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const body = req.body;
            const userExist = yield service_1.userService.findUserById(userId);
            if (!userExist) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            if (body.pin !== userExist.pin) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Incorrect pin!",
                    data: null,
                });
            }
            const transferAmount = Number(body.amount);
            const userBalance = parseFloat(userExist.initialDeposit.toString());
            if (isNaN(transferAmount)) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Invalid amount or balance!",
                    data: null,
                });
            }
            if (transferAmount > userBalance) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Insufficient balance!",
                    data: null,
                });
            }
            const transfer = Object.assign(Object.assign({}, body), { transactionType: enum_2.TransactionType.TRANSFER, transactionDirection: enum_2.TransactionDirection.DEBIT, status: enum_2.TransactionStatus.COMPLETED, transferType: enum_2.TransferType.WIRE, userId: userExist._id.toString() });
            yield service_2.transactionService.createWireTransfer(transfer);
            yield service_2.transactionService.debitUser(transferAmount, userExist._id.toString());
            // 📩 Send debit alert
            const debitAlert = {
                recipientName: body.recipientName,
                accountName: `${userExist.firstName} ${userExist.lastName}`,
                country: body.country,
                swiftCode: body.swiftCode,
                routingNumber: body.routingNumber,
                amount: body.amount,
                senderEmail: userExist.email,
                transferType: enum_2.TransferType.WIRE,
            };
            (0, email_1.sendWireTransferDebitAlert)(debitAlert);
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Transfer successful",
                data: null,
            });
        });
    }
    createDomesticTransfer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const body = req.body;
            const userExist = yield service_1.userService.findUserById(userId);
            if (!userExist) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            if (body.pin !== userExist.pin) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Incorrect transfer pin!",
                    data: null,
                });
            }
            const transferAmount = Number(body.amount);
            const userBalance = parseFloat(userExist.initialDeposit.toString());
            if (isNaN(transferAmount)) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Invalid amount or balance!",
                    data: null,
                });
            }
            if (transferAmount > userBalance) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Insufficient balance!",
                    data: null,
                });
            }
            const transfer = Object.assign(Object.assign({}, body), { status: enum_2.TransactionStatus.COMPLETED, transactionType: enum_2.TransactionType.TRANSFER, transactionDirection: enum_2.TransactionDirection.DEBIT, transferType: enum_2.TransferType.DOMESTIC, userId: userExist._id.toString() });
            yield service_2.transactionService.createDomesticTransfer(transfer);
            yield service_2.transactionService.debitUser(transferAmount, userExist._id.toString());
            // 📩 Send debit alert
            const debitAlert = {
                recipientName: body.recipientName,
                userName: userExist.userName,
                accountNumber: body.accountNumber,
                amount: body.amount,
                senderEmail: userExist.email,
                transferType: enum_2.TransferType.WIRE,
            };
            (0, email_1.sendDomesticTransferDebitAlert)(debitAlert);
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Transfer successful",
                data: null,
            });
        });
    }
    fetchTransactionHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            console.log(userId);
            const txHistory = yield service_2.transactionService.findTransactionByUserId(userId);
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Transaction History fetched successful",
                data: txHistory,
            });
        });
    }
}
exports.transactionController = new TransactionController();
