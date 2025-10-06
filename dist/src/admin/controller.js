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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const enum_1 = require("../utils/enum");
const service_1 = require("./service");
const utils_1 = require("../utils");
const dotenv_1 = __importDefault(require("dotenv"));
const global_1 = require("../utils/global");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const service_2 = require("../user/service");
const enum_2 = require("../transaction/enum");
const email_1 = require("../utils/email");
const service_3 = require("../loan/service");
const enum_3 = require("../loan/enum");
const enum_4 = require("../user/enum");
const service_4 = require("../transaction/service");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET || "";
class AdminController {
    adminSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            yield service_1.adminService.createAdmin(body);
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Admin created successfully!",
                data: null,
            });
        });
    }
    adminSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userName = body.userName;
            const password = body.password;
            const userExist = yield service_1.adminService.findAdminByUserNameAndPassword({
                userName,
                password,
            });
            if (!userExist) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Wrong user credentials!",
                    data: null,
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: userExist._id }, jwtSecret, {
                expiresIn: global_1.tokenExpiry,
            });
            // await adminService.createAdmin(body);
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Admin logged in successfully!",
                data: {
                    token,
                },
            });
        });
    }
    fetchAdminDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield service_1.adminService.fetchAllUsers();
            const transactions = yield service_1.adminService.fetchTransactions();
            const loans = yield service_1.adminService.fetchLoans();
            const cards = yield service_1.adminService.fetchCards();
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Details fetched successfully!",
                data: {
                    users,
                    transactions,
                    loans,
                    cards,
                },
            });
        });
    }
    updateUserAccountStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userExist = yield service_1.adminService.updateUserStatus(body);
            if (!userExist) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User does not exist!",
                    data: null,
                });
            }
            if (body.status === enum_4.AccountStatus.SUSPENDED) {
                (0, email_1.sendAccountSuspendedEmail)({
                    receiverEmail: userExist.email,
                    userName: userExist.userName,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: `User is now ${body.status}`,
                data: null,
            });
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { id } = req.params;
            const body = req.body;
            const files = req.files;
            const userExist = yield service_2.userService.findUserById(id);
            if (!userExist) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "User does not exist!",
                    data: null,
                });
            }
            if (userExist.email !== body.email) {
                const emailExists = yield service_2.userService.findUserByEmail(body.email);
                if (emailExists) {
                    return utils_1.utils.customResponse({
                        status: 400,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "Email already exist!",
                        data: null,
                    });
                }
            }
            if (userExist.userName !== body.userName) {
                const userNameExists = yield service_2.userService.findUserByUserName(body.userName);
                if (userNameExists) {
                    return utils_1.utils.customResponse({
                        status: 400,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "Username already exists!",
                        data: null,
                    });
                }
            }
            // upload proof of address
            let passportUrl = userExist.passportUrl;
            if ((_a = files === null || files === void 0 ? void 0 : files["passport"]) === null || _a === void 0 ? void 0 : _a[0]) {
                const buffer = files["passport"][0].buffer;
                const uploadRes = yield utils_1.utils.uploadFromBuffer(buffer, "passport");
                passportUrl = uploadRes.secure_url;
            }
            // upload profile picture
            let driversLicence = userExist.driversLicence;
            if ((_b = files === null || files === void 0 ? void 0 : files["driversLicence"]) === null || _b === void 0 ? void 0 : _b[0]) {
                const buffer = files["driversLicence"][0].buffer;
                const uploadRes = yield utils_1.utils.uploadFromBuffer(buffer, "driversLicence");
                driversLicence = uploadRes.secure_url;
            }
            yield service_1.adminService.updateUser(Object.assign(Object.assign({}, body), { passportUrl: passportUrl, driversLicence: driversLicence }), id);
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "User details updated successfully!",
                data: null,
            });
        });
    }
    deleteUserAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield service_1.adminService.deleteUser(id);
            if (!user) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Success,
                    description: "User not found!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "User has been deleted!",
                data: null,
            });
        });
    }
    deleteATransferHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const transaction = yield service_1.adminService.deleteTransaction(id);
            if (!transaction) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Success,
                    description: "Transaction not found!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Transaction has been deleted!",
                data: null,
            });
        });
    }
    adminCreateWireTransferHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userExist = yield service_2.userService.findUserById(body.userId);
            if (!userExist) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Success,
                    description: "User not found!",
                    data: null,
                });
            }
            const txHis = Object.assign(Object.assign({}, body), { transferType: enum_2.TransferType.WIRE });
            console.log("transaction ==>", "isToday", utils_1.utils.isToday(body.transactionDate), "data:", txHis);
            yield service_1.adminService.adminCreateWireTransfer(txHis);
            if (utils_1.utils.isToday(body.transactionDate)) {
                const transferAmount = Number(body.amount);
                const userBalance = parseFloat(userExist.initialDeposit.toString());
                if (isNaN(transferAmount)) {
                    return res.status(400).json({
                        message: enum_1.MessageResponse.Error,
                        description: "Invalid amount or balance!",
                        data: null,
                    });
                }
                if (body.transactionDirection === enum_2.TransactionDirection.DEBIT) {
                    if (transferAmount > userBalance) {
                        return res.status(400).json({
                            message: enum_1.MessageResponse.Error,
                            description: "Insufficient balance!",
                            data: null,
                        });
                    }
                    yield service_4.transactionService.debitUser(transferAmount, userExist._id.toString());
                }
                {
                    yield service_4.transactionService.creditUser(transferAmount, userExist._id.toString());
                }
                const alertEmail = {
                    userName: userExist.userName,
                    recipientName: body.recipientName,
                    accountName: `${userExist.firstName} ${userExist.lastName}`,
                    country: body.country,
                    swiftCode: body.swiftCode,
                    routingNumber: body.routingNumber,
                    amount: body.amount,
                    senderEmail: userExist.email,
                    transferType: enum_2.TransferType.WIRE,
                };
                if (body.transactionDirection === enum_2.TransactionDirection.CREDIT) {
                    (0, email_1.sendWireTransferCreditAlert)(alertEmail);
                }
                else {
                    (0, email_1.sendWireTransferDebitAlert)(alertEmail);
                }
            }
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Transaction created successfully!",
                data: null,
            });
        });
    }
    adminCreateDomesticTransferHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userExist = yield service_2.userService.findUserById(body.userId);
            if (!userExist) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            const txHis = Object.assign(Object.assign({}, body), { transferType: enum_2.TransferType.DOMESTIC });
            console.log("transaction ==>", "isToday", utils_1.utils.isToday(body.transactionDate), "data:", txHis);
            yield service_1.adminService.adminCreateDomesticTransfer(txHis);
            if (utils_1.utils.isToday(body.transactionDate)) {
                const transferAmount = Number(body.amount);
                const userBalance = parseFloat(userExist.initialDeposit.toString());
                if (isNaN(transferAmount)) {
                    return res.status(400).json({
                        message: enum_1.MessageResponse.Error,
                        description: "Invalid amount or balance!",
                        data: null,
                    });
                }
                if (body.transactionDirection === enum_2.TransactionDirection.DEBIT) {
                    if (transferAmount > userBalance) {
                        return res.status(400).json({
                            message: enum_1.MessageResponse.Error,
                            description: "Insufficient balance!",
                            data: null,
                        });
                    }
                    yield service_4.transactionService.debitUser(transferAmount, userExist._id.toString());
                }
                {
                    yield service_4.transactionService.creditUser(transferAmount, userExist._id.toString());
                }
                // 📩 Send debit alert
                const alertEmail = {
                    recipientName: body.recipientName,
                    userName: userExist.userName,
                    accountNumber: body.accountNumber,
                    amount: body.amount,
                    senderEmail: userExist.email,
                    transferType: enum_2.TransferType.WIRE,
                };
                if (body.transactionDirection === enum_2.TransactionDirection.CREDIT) {
                    (0, email_1.sendDomesticTransferCreditAlert)(alertEmail);
                }
                else {
                    (0, email_1.sendDomesticTransferDebitAlert)(alertEmail);
                }
            }
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Transaction created successfully!",
                data: null,
            });
        });
    }
    adminUpdateLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let loan = yield service_3.loanService.findLoanById(body.loanId);
            if (!loan) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Loan not found!",
                    data: null,
                });
            }
            console.log(loan);
            if (loan.status === enum_3.LoanStatus.APPROVED ||
                loan.status === enum_3.LoanStatus.REDEEM) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: `Loan is ${loan.status}!`,
                    data: null,
                });
            }
            loan = yield service_3.loanService.findLoanByIdAndUpdateStatus(body.loanId, body.status);
            if (!loan) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Loan not found!",
                    data: null,
                });
            }
            const userExist = yield service_2.userService.findUserById(loan.userId.toString());
            if (!userExist) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            if (body.status === enum_3.LoanStatus.APPROVED) {
                yield service_2.userService.updateLoanAndLoanBalance(Number(loan.loanBalance.toString()), Number(loan.loanAmount.toString()), loan.userId.toString());
                (0, email_1.sendLoanApprovalEmail)({
                    accountNumber: userExist.accountNumber,
                    amount: Number(loan.loanBalance.toString()),
                    description: loan.description,
                    interestRate: utils_1.utils.getValueAfterUnderscore(loan.loanDuration),
                    loanTenure: utils_1.utils.getValueBeforeUnderscore(loan.loanDuration),
                    receiverEmail: userExist.email,
                    userName: userExist.userName,
                });
            }
            if (body.status === enum_3.LoanStatus.REJECTED) {
                (0, email_1.sendLoanDeclinedEmail)({
                    receiverEmail: userExist.email,
                    userName: userExist.userName,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: `Loan updated successfully!`,
                data: null,
            });
        });
    }
    redeemLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const loanStatus = yield service_3.loanService.findLoanById(id);
            if (!loanStatus) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Loan not found!",
                    data: null,
                });
            }
            if (loanStatus.status !== enum_3.LoanStatus.APPROVED) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: `Loan is ${loanStatus.status}!`,
                    data: null,
                });
            }
            const loan = yield service_3.loanService.findLoanByIdAndRedeem(id);
            if (!loan) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Loan not found or has already been red!",
                    data: null,
                });
            }
            const userExist = yield service_2.userService.findUserById(loan.userId.toString());
            if (!userExist) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            const userBalance = parseFloat(userExist.initialDeposit.toString());
            const loanBalance = parseFloat(userExist.loanBalance.toString());
            if (loanBalance > userBalance) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Insufficient balance!",
                    data: null,
                });
            }
            const user = yield service_2.userService.redeemLoan(userExist.id, Number(loan.loanBalance));
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: `Loan redeemed successfully!`,
                data: null,
            });
        });
    }
}
exports.adminController = new AdminController();
