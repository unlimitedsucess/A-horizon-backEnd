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
const utils_1 = require("../utils");
class LoanService {
    applyLoan(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const loanPercentage = utils_1.utils.toNumber(utils_1.utils.getValueAfterUnderscore(input.loanDuration));
            let newLoan = new entity_1.default(Object.assign(Object.assign({}, input), { loanBalance: utils_1.utils.getPercentage(loanPercentage, input.loanAmount) }));
            yield newLoan.save();
            return;
        });
    }
    findLoanByIdAndUpdateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOneAndUpdate({ _id: id }, { $set: { status } }, { new: true });
            return user;
        });
    }
}
exports.loanService = new LoanService();
