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
            // Parse loan to get monthPart
            const loan = yield entity_1.default.findById(id);
            if (!loan)
                return null;
            let activationDate = null;
            let lastInterestAppliedDate = null;
            if (status === enum_1.LoanStatus.APPROVED) {
                activationDate = new Date();
                // Example: "1_month_5"
                const [monthPart] = loan.loanDuration.split("_");
                const months = parseInt(monthPart, 10);
                lastInterestAppliedDate = new Date(activationDate);
                lastInterestAppliedDate.setMonth(lastInterestAppliedDate.getMonth() + months);
            }
            const updatedLoan = yield entity_1.default.findOneAndUpdate({ _id: id }, {
                $set: {
                    status,
                    activationDate,
                    lastInterestAppliedDate,
                },
            }, { new: true });
            return updatedLoan;
        });
    }
}
exports.loanService = new LoanService();
