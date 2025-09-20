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
            yield service_1.adminService.createAdmin(body);
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
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: `User is now ${body.status}`,
                data: null,
            });
        });
    }
}
exports.adminController = new AdminController();
