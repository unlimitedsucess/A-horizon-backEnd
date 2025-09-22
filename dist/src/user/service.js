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
exports.userService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const entity_1 = __importDefault(require("./entity"));
const decimal_js_1 = __importDefault(require("decimal.js"));
class UserService {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({
                email,
            });
            return user;
        });
    }
    findUserByUserName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({
                userName,
            });
            return user;
        });
    }
    findUserByIdWithoutPassword(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findById(id).select("-password -emailVerificationOtp -emailVerificationOtpExpiration");
            return user;
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findById(id);
            return user;
        });
    }
    updateLoanAndLoanBalance(loanAmountWithIntrest, loanAmount, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const user = yield entity_1.default.findById(userId);
            if (user) {
                const currentLoan = new decimal_js_1.default(((_a = user.loan) === null || _a === void 0 ? void 0 : _a.toString()) || "0");
                const currentLoanBalance = new decimal_js_1.default(((_b = user.loanBalance) === null || _b === void 0 ? void 0 : _b.toString()) || "0");
                const accBalance = new decimal_js_1.default(((_c = user.initialDeposit) === null || _c === void 0 ? void 0 : _c.toString()) || "0");
                const amountToAddWithInrest = new decimal_js_1.default(loanAmountWithIntrest);
                const loanAmountToAdd = new decimal_js_1.default(loanAmount);
                const newLoan = currentLoan.plus(loanAmountToAdd);
                const newLoanBalance = currentLoanBalance.plus(amountToAddWithInrest);
                const newAccBalance = accBalance.plus(amountToAddWithInrest);
                user.loan = mongoose_1.default.Types.Decimal128.fromString(newLoan.toFixed(2));
                user.loanBalance = mongoose_1.default.Types.Decimal128.fromString(newLoanBalance.toFixed(2));
                user.initialDeposit = mongoose_1.default.Types.Decimal128.fromString(newAccBalance.toFixed(2));
                console.log("here");
                yield user.save();
                return user;
            }
            return user;
        });
    }
    redeemLoan(id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log(amount);
            const user = yield entity_1.default.findById(id);
            if (user) {
                user.loanBalance = mongoose_1.default.Types.Decimal128.fromString("0.00");
                const currentBalance = new decimal_js_1.default(((_a = user.initialDeposit) === null || _a === void 0 ? void 0 : _a.toString()) || "0");
                const amountToMinus = new decimal_js_1.default(amount);
                const newBalance = currentBalance.minus(amountToMinus);
                user.initialDeposit = mongoose_1.default.Types.Decimal128.fromString(newBalance.toFixed(2));
                yield user.save();
                return user;
            }
            return user;
        });
    }
}
exports.userService = new UserService();
