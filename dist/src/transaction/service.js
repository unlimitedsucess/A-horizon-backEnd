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
exports.transactionService = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const entity_1 = __importDefault(require("../user/entity"));
const mongoose_1 = __importDefault(require("mongoose"));
const entity_2 = __importDefault(require("./entity"));
class TransactionService {
    createWireTransfer(input, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            let newTransaction = new entity_2.default(Object.assign({}, input));
            yield newTransaction.save();
            return;
        });
    }
    createDomesticTransfer(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let newTransaction = new entity_2.default(Object.assign({}, input));
            yield newTransaction.save();
            return;
        });
    }
    debitUser(amount, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield entity_1.default.findById(userId);
            if (user) {
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
    fetchUserTransferByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transfer = entity_2.default.find({ userId: id });
            return transfer;
        });
    }
    findTransferById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_2.default.findById(id);
            return user;
        });
    }
    deleteTransfer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_2.default.findOneAndDelete({ _id: id });
            return user;
        });
    }
    findTransactionByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_2.default.find({ userId: id });
            return user;
        });
    }
}
exports.transactionService = new TransactionService();
