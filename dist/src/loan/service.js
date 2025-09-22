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
exports.loanService = void 0;
const entity_1 = __importDefault(require("./entity"));
const enum_1 = require("./enum");
const utils_1 = require("../utils");
const decimal_js_1 = __importDefault(require("decimal.js"));
const mongoose_1 = __importDefault(require("mongoose"));
class LoanService {
    applyLoan(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const loanPercentage = utils_1.utils.toNumber(utils_1.utils.getValueAfterUnderscore(input.loanDuration));
            const intrest = new decimal_js_1.default(utils_1.utils.getIntrest(loanPercentage, input.loanAmount));
            const amountToAdd = new decimal_js_1.default(input.loanAmount);
            const loanBalance = intrest.plus(amountToAdd);
            let newLoan = new entity_1.default(Object.assign(Object.assign({}, input), { loanBalance: loanBalance }));
            yield newLoan.save();
            return;
        });
    }
    findLoanByIdAndUpdateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const loan = yield entity_1.default.findById(id);
            if (!loan)
                return null;
            if (loan.status === enum_1.LoanStatus.APPROVED || loan.status === enum_1.LoanStatus.REDEEM) {
                return loan;
            }
            if (status === enum_1.LoanStatus.APPROVED) {
                const activationDate = new Date();
                // 🔹 Example loanDuration: "1month_5"
                const [monthPart, percentagePart] = loan.loanDuration.split("_");
                // Get months (remove "month" from the string, parse as int)
                const months = parseInt(monthPart.replace("month", ""), 10);
                // Set lastInterestAppliedDate = activationDate + months
                const lastInterestAppliedDate = new Date(activationDate);
                lastInterestAppliedDate.setMonth(lastInterestAppliedDate.getMonth() + months);
                // 🔹 Calculate interest
                const percentage = new decimal_js_1.default(percentagePart); // e.g. 5
                const loanAmount = new decimal_js_1.default(((_a = loan.loanAmount) === null || _a === void 0 ? void 0 : _a.toString()) || "0");
                const interestAmount = loanAmount.mul(percentage).div(100);
                // Update loan balance = loan amount + interest
                const newLoanBalance = loanAmount.plus(interestAmount);
                // 🔹 Save updates
                loan.status = status;
                loan.activationDate = activationDate;
                loan.lastInterestAppliedDate = lastInterestAppliedDate;
                loan.loanBalance = mongoose_1.default.Types.Decimal128.fromString(newLoanBalance.toString());
                yield loan.save();
                return loan;
            }
            // If not approved, reset relevant fields
            loan.status = status;
            loan.activationDate = null;
            loan.lastInterestAppliedDate = null;
            yield loan.save();
            return loan;
        });
    }
    // public async findLoanByIdAndUpdateStatus(id: string, status: LoanStatus) {
    //   // Parse loan to get monthPart
    //   const loan = await Loan.findById(id);
    //   if (!loan) return null;
    //   let activationDate: Date | null = null;
    //   let lastInterestAppliedDate: Date | null = null;
    //   if (status === LoanStatus.APPROVED) {
    //     activationDate = new Date();
    //     // Example: "1_month_5"
    //     const [monthPart, percentagePart] = loan.loanDuration.split("_");
    //     const months = parseInt(monthPart, 10);
    //     lastInterestAppliedDate = new Date(activationDate);
    //     lastInterestAppliedDate.setMonth(lastInterestAppliedDate.getMonth() + months);
    //   }
    //   const updatedLoan = await Loan.findOneAndUpdate(
    //     { _id: id },
    //     {
    //       $set: {
    //         status,
    //         activationDate,
    //         lastInterestAppliedDate,
    //       },
    //     },
    //     { new: true }
    //   );
    //   return updatedLoan;
    // }
    findLoanByIdAndRedeem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedLoan = yield entity_1.default.findOneAndUpdate({ _id: id, status: enum_1.LoanStatus.APPROVED }, {
                $set: {
                    status: enum_1.LoanStatus.REDEEM,
                },
            }, { new: true });
            return updatedLoan;
        });
    }
    findLoanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan = yield entity_1.default.findById(id);
            return loan;
        });
    }
}
exports.loanService = new LoanService();
