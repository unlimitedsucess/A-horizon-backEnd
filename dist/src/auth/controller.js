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
exports.authController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const service_1 = require("../user/service");
const enum_1 = require("../utils/enum");
const service_2 = require("./service");
const email_1 = require("../utils/email");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET || "";
class AuthController {
    createAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const emailExists = yield service_1.userService.findUserByEmail(email);
            if (emailExists) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Email already exist!",
                    data: null,
                });
            }
            const otp = yield service_2.authService.createUser(email);
            (0, email_1.sendVerificationEmail)({ email, otp });
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Verification OTP resent!",
                data: null,
            });
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const body = req.body;
                const email = body.email;
                const userName = body.userName;
                const files = req.files;
                // check if username exists
                const userNameExists = yield service_1.userService.findUserByUserName(userName);
                if (userNameExists) {
                    return utils_1.utils.customResponse({
                        status: 400,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "Username already exists!",
                        data: null,
                    });
                }
                // upload proof of address
                let passportUrl = null;
                if ((_a = files === null || files === void 0 ? void 0 : files["passport"]) === null || _a === void 0 ? void 0 : _a[0]) {
                    const buffer = files["passport"][0].buffer;
                    const uploadRes = yield utils_1.utils.uploadFromBuffer(buffer, "passport");
                    passportUrl = uploadRes.secure_url;
                }
                // upload profile picture
                let driversLicence = null;
                if ((_b = files === null || files === void 0 ? void 0 : files["driversLicence"]) === null || _b === void 0 ? void 0 : _b[0]) {
                    const buffer = files["driversLicence"][0].buffer;
                    const uploadRes = yield utils_1.utils.uploadFromBuffer(buffer, "driversLicence");
                    driversLicence = uploadRes.secure_url;
                }
                // create user (with OTP, etc.)
                const user = yield service_2.authService.registerUser(Object.assign(Object.assign({}, body), { passportUrl: passportUrl, driversLicence: driversLicence }));
                if (!user) {
                    return utils_1.utils.customResponse({
                        status: 404,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "User not found!",
                        data: null,
                    });
                }
                return utils_1.utils.customResponse({
                    status: 201,
                    res,
                    message: enum_1.MessageResponse.Success,
                    description: "User creation completed, verify email!",
                    data: null,
                });
            }
            catch (error) {
                console.error("RegisterUser Error:", error);
                return utils_1.utils.customResponse({
                    status: 500,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: error.message || "Server error",
                    data: null,
                });
            }
        });
    }
    emailVerifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const email = body.email;
            const otp = body.otp;
            const userOtpValidity = yield service_2.authService.validateOtp({ email, otp });
            if (!userOtpValidity) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Invalid otp",
                    data: null,
                });
            }
            if (userOtpValidity.emailVerificationOtpExpiration !== undefined) {
                const currentDate = new Date();
                const expirationDate = new Date(userOtpValidity.emailVerificationOtpExpiration);
                if (expirationDate < currentDate) {
                    return utils_1.utils.customResponse({
                        status: 400,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "Email verification OTP has expired!",
                        data: null,
                    });
                }
                const userExists = yield service_2.authService.verifyEmail(email);
                if (!userExists) {
                    return utils_1.utils.customResponse({
                        status: 404,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "User not found!",
                        data: null,
                    });
                }
                const token = jsonwebtoken_1.default.sign({ userId: userExists._id }, jwtSecret, {
                    expiresIn: "30d",
                });
                return utils_1.utils.customResponse({
                    status: 200,
                    res,
                    message: enum_1.MessageResponse.Success,
                    description: "Verification successful",
                    data: {
                        token,
                    },
                });
            }
            else {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Email verification OTP expired",
                    data: null,
                });
            }
        });
    }
    resendEmailVerificationOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const user = yield service_1.userService.findUserByEmail(body.email);
            if (!user) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User does not exist!",
                    data: null,
                });
            }
            const email = user.email;
            const otp = utils_1.utils.generateOtp();
            yield service_2.authService.saveOtp({ email: email, otp });
            (0, email_1.sendVerificationEmail)({ email: email, otp });
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Verification OTP resent!",
                data: null,
            });
        });
    }
}
exports.authController = new AuthController();
