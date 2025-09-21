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
    updateLoanAndLoanBalance(amount, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield entity_1.default.findById(userId);
            if (user) {
                // const currentLoan = new Decimal(user.loan?.toString() || "0");
                const currentLoanBalance = new decimal_js_1.default(((_a = user.loanBalnce) === null || _a === void 0 ? void 0 : _a.toString()) || "0");
                const amountToAdd = new decimal_js_1.default(amount);
                //   const newLoan = currentLoan.minus(amountToAdd);
                const newLoanBalance = currentLoanBalance.plus(amountToAdd);
                //   user.loan = mongoose.Types.Decimal128.fromString(newLoan.toFixed(2));
                user.loanBalnce = mongoose_1.default.Types.Decimal128.fromString(newLoanBalance.toFixed(2));
                yield user.save();
                return user;
            }
            return user;
        });
    }
}
exports.userService = new UserService();
