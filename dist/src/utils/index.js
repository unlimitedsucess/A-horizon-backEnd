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
exports.utils = void 0;
const crypto_1 = __importDefault(require("crypto"));
const streamifier_1 = __importDefault(require("streamifier"));
const cloudnairy_1 = __importDefault(require("../../config/cloudnairy"));
const uuid_1 = require("uuid");
const entity_1 = __importDefault(require("../loan/entity"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const enum_1 = require("../loan/enum");
const mongoose_1 = __importDefault(require("mongoose"));
const entity_2 = __importDefault(require("../user/entity"));
const enum_2 = require("../user/enum");
class Utils {
    constructor() {
        this.generateOtp = () => {
            return Array.from({ length: 6 }, () => crypto_1.default.randomInt(0, 10)).join("");
        };
        this.generateTransactionId = () => {
            const prefix = "SD";
            const timestamp = Date.now().toString(36);
            const randomPart = crypto_1.default.randomBytes(4).toString("hex");
            return `${prefix}-${timestamp}-${randomPart}`.toUpperCase();
        };
        this.uploadFromBuffer = (fileBuffer, folder) => {
            return new Promise((resolve, reject) => {
                const stream = cloudnairy_1.default.uploader.upload_stream({ folder, public_id: (0, uuid_1.v4)() }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                streamifier_1.default.createReadStream(fileBuffer).pipe(stream);
            });
        };
        this.generateAccNo = () => {
            return Array.from({ length: 10 }, () => crypto_1.default.randomInt(0, 10)).join('');
        };
        this.generateCardNumber = () => {
            return Array.from({ length: 16 }, () => crypto_1.default.randomInt(0, 10)).join('');
        };
        this.generateCVV = () => {
            return crypto_1.default.randomInt(100, 1000).toString(); // 100 to 999
        };
        this.generateExpiryDate = () => {
            const now = new Date();
            now.setFullYear(now.getFullYear() + 4);
            return now.toISOString(); // or .toDateString() / custom format
        };
        this.generateCardPin = () => {
            return Array.from({ length: 4 }, () => crypto_1.default.randomInt(0, 10)).join('');
        };
        // public async updateLoansAndBalances() {
        //     try {
        //       // Fetch all approved loans
        //       const approvedLoans = await Loan.find({ status: LoanStatus.APPROVED });
        //       for (const loan of approvedLoans) {
        //         // Parse loanDuration string (e.g., "3month_10")
        //         const [monthPart, percentagePart] = loan.loanDuration.split("_");
        //         const months = parseInt(monthPart.replace("month", ""), 10);
        //         const percentage = new Decimal(percentagePart);
        //         if (!loan.lastInterestAppliedDate) continue;
        //         // Calculate maturity date
        //         const activationDate = new Date(loan.lastInterestAppliedDate);
        //         const maturityDate = new Date(activationDate);
        //         maturityDate.setMonth(maturityDate.getMonth() + months);
        //         const now = new Date();
        //         // Only apply if loan matured
        //         if (now >= maturityDate) {
        //           const currentLoanBalance = new Decimal(loan.loanBalance?.toString() || "0");
        //           const loanAmount = new Decimal(loan.loanAmount?.toString() || "0");
        //           // % of loan amount
        //           const amountToAdd = loanAmount.mul(percentage).div(100);
        //           // New loan balance
        //           const newLoanBalance = currentLoanBalance.plus(amountToAdd);
        //           // ✅ Save loan balance as Decimal128
        //           loan.loanBalance = mongoose.Types.Decimal128.fromString(newLoanBalance.toString());
        //           await loan.save();
        //           // ✅ Update user's loanBalance
        //           const user = await User.findOne({_id:loan.userId, accountStatus: AccountStatus.ACTIVE});
        //           if (user) {
        //             const currentUserLoanBalance = new Decimal(user.loanBalance?.toString() || "0");
        //             const newUserLoanBalance = currentUserLoanBalance.plus(amountToAdd);
        //             user.loanBalance = mongoose.Types.Decimal128.fromString(newUserLoanBalance.toString());
        //             await user.save();
        //           }
        //         }
        //       }
        //       console.log("cron success");
        //     } catch (error) {
        //       console.error("CRON ERROR", error);
        //       // return res.status(500).json({
        //       //   message: "Error",
        //       //   description: "Failed to update loan balances",
        //       //   error,
        //       // });
        //     }
        //   }
    }
    wrapAsync(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }
    customResponse({ res, status, message, description, data, }) {
        return res.status(status).json({
            message,
            description,
            data,
        });
    }
    formatNumber(value) {
        if (value === null || value === undefined || value === "")
            return "0";
        const num = typeof value === "string" ? parseFloat(value) : value;
        if (isNaN(num))
            return "0";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    toSentenceCase(str) {
        if (!str)
            return "";
        const lower = str.toLowerCase().trim();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    isToday(dateInput) {
        const inputDate = new Date(dateInput);
        if (isNaN(inputDate.getTime())) {
            throw new Error("Invalid date format");
        }
        const today = new Date();
        return (inputDate.getFullYear() === today.getFullYear() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getDate() === today.getDate());
    }
    getValueAfterUnderscore(input) {
        const parts = input.split("_");
        return parts.length > 1 ? parts[1] : null;
    }
    getValueBeforeUnderscore(input) {
        const parts = input.split("_");
        return parts.length > 1 ? parts[0] : null;
    }
    toNumber(value) {
        const num = Number(value);
        return isNaN(num) ? null : num;
    }
    getIntrest(percentage, value) {
        return (percentage / 100) * value;
    }
    updateLoansAndBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // 1. Fetch all approved loans
                const approvedLoans = yield entity_1.default.find({ status: enum_1.LoanStatus.APPROVED });
                for (const loan of approvedLoans) {
                    if (!loan.activationDate)
                        continue;
                    // 2. Parse loanDuration (e.g. "1month_5", "6month_15")
                    const [monthPart, percentagePart] = loan.loanDuration.split("_");
                    const monthsPerPeriod = parseInt(monthPart.replace("month", ""), 10); // e.g. 1, 6
                    const percentagePerPeriod = new decimal_js_1.default(percentagePart); // e.g. 5, 15
                    const activationDate = new Date(loan.activationDate);
                    const now = new Date();
                    // 🟢 First interest maturity date = activationDate + monthsPerPeriod
                    const firstInterestDate = new Date(activationDate);
                    firstInterestDate.setMonth(firstInterestDate.getMonth() + monthsPerPeriod);
                    if (now < firstInterestDate)
                        continue; // not matured yet
                    // 🟢 Last time we applied interest
                    const lastApplied = loan.lastInterestAppliedDate
                        ? new Date(loan.lastInterestAppliedDate)
                        : activationDate;
                    if (now < lastApplied)
                        continue; // future date, skip
                    // 🟢 Calculate how many full periods have passed since lastApplied
                    const monthsPassed = (now.getFullYear() - lastApplied.getFullYear()) * 12 +
                        (now.getMonth() - lastApplied.getMonth());
                    const periodsPassed = Math.floor(monthsPassed / monthsPerPeriod);
                    if (periodsPassed <= 0)
                        continue; // still in the same period
                    // 🟢 Total interest percentage = periodsPassed * percentagePerPeriod
                    const totalInterestPercentage = percentagePerPeriod.mul(periodsPassed);
                    const currentLoanBalance = new decimal_js_1.default(((_a = loan.loanBalance) === null || _a === void 0 ? void 0 : _a.toString()) || "0");
                    const loanAmount = new decimal_js_1.default(((_b = loan.loanAmount) === null || _b === void 0 ? void 0 : _b.toString()) || "0");
                    // Interest = loanAmount * (totalInterestPercentage / 100)
                    const interestAmount = loanAmount.mul(totalInterestPercentage).div(100);
                    // 6. Update loan balance
                    const newLoanBalance = currentLoanBalance.plus(interestAmount);
                    loan.loanBalance = mongoose_1.default.Types.Decimal128.fromString(newLoanBalance.toString());
                    loan.lastInterestAppliedDate = now;
                    yield loan.save();
                    // 7. Update user's loan balance
                    const user = yield entity_2.default.findOne({
                        _id: loan.userId,
                        accountStatus: enum_2.AccountStatus.ACTIVE,
                    });
                    if (user) {
                        const currentUserLoanBalance = new decimal_js_1.default(((_c = user.loanBalance) === null || _c === void 0 ? void 0 : _c.toString()) || "0");
                        const newUserLoanBalance = currentUserLoanBalance.plus(interestAmount);
                        user.loanBalance = mongoose_1.default.Types.Decimal128.fromString(newUserLoanBalance.toString());
                        yield user.save();
                    }
                    console.log(`Applied ${totalInterestPercentage.toString()}% interest (${periodsPassed} period(s)) to loan ${loan._id}`);
                }
                console.log("Loan balances updated successfully ✅");
            }
            catch (error) {
                console.error("CRON ERROR", error);
            }
        });
    }
}
exports.utils = new Utils();
