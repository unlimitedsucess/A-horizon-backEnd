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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const enum_1 = require("../utils/enum");
const service_1 = require("./service");
dotenv_1.default.config();
const tokenExpiry = process.env.TOKEN_EXPIRY || "";
const jwtSecret = process.env.JWT_SECRET || "";
class AdminController {
    adminSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            yield service_1.adminService.createAdmin(body);
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Admin created succussfully!",
                data: null,
            });
        });
    }
    adminSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userName = body.userName;
            const password = body.password;
            const userExist = yield service_1.adminService.findAdminByUserNameAndPassword({ userName, password });
            if (!userExist) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Wrong user credentials!",
                    data: null,
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: userExist._id }, jwtSecret, {
                expiresIn: tokenExpiry,
            });
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Logged in successfully",
                data: {
                    token,
                },
            });
        });
    }
}
exports.adminController = new AdminController();
