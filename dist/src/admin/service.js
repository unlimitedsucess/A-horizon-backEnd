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
exports.adminService = void 0;
const entity_1 = __importDefault(require("../card/entity"));
const entity_2 = __importDefault(require("../loan/entity"));
const entity_3 = __importDefault(require("../transaction/entity"));
const entity_4 = __importDefault(require("../user/entity"));
const entity_5 = __importDefault(require("./entity"));
class AdminService {
    createAdmin(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, userName } = input;
            const admin = new entity_5.default({
                password,
                userName,
            });
            const adminData = yield admin.save();
            return adminData;
        });
    }
    findAdminByUserNameAndPassword(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, userName } = input;
            const admin = yield entity_5.default.findOne({ userName, password }).select("-password");
            return admin;
        });
    }
    fetchAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = entity_4.default.find().select("-emailVerificationOtp -emailVerificationOtpExpiration");
            return users;
        });
    }
    fetchLoans() {
        return __awaiter(this, void 0, void 0, function* () {
            const loans = yield entity_2.default.find().populate("userId", "-emailVerificationOtp -emailVerificationOtpExpiration");
            return loans;
        });
    }
    fetchTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const loans = yield entity_3.default.find().populate("userId", "-emailVerificationOtp -emailVerificationOtpExpiration");
            return loans;
        });
    }
    fetchCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const loans = yield entity_1.default.find().populate("userId", "-emailVerificationOtp -emailVerificationOtpExpiration");
            return loans;
        });
    }
    findAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield entity_5.default.findById(id);
            return admin;
        });
    }
    updateUserStatus(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, status } = input;
            const user = yield entity_4.default.findOneAndUpdate({ _id: userId }, { $set: { accountStatus: status } }, { new: true });
            return user;
        });
    }
}
exports.adminService = new AdminService();
