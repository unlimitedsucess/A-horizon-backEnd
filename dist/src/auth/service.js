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
exports.authService = void 0;
const entity_1 = __importDefault(require("../user/entity"));
const utils_1 = require("../utils");
class AuthService {
    createUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = utils_1.utils.generateOtp();
            const user = new entity_1.default({
                email,
                emailVerificationOtp: otp,
                //3600000 is in milisecs and this is 1hr, so the token is valid for 1 hour
                emailVerificationOtpExpiration: new Date(Date.now() + 3600000),
            });
            yield user.save();
            return otp;
        });
    }
    registerUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, accountType, address, city, country, dob, driversLicence, firstName, initialDeposit, lastName, passportUrl, password, phoneNo, pin, ssn, userName, zipCode, state } = input;
            let user = yield entity_1.default.findOne({ email });
            if (user) {
                user.accountType = accountType;
                user.address = address;
                user.city = city;
                user.country = country;
                user.dob = dob;
                user.driversLicence = driversLicence;
                user.firstName = firstName;
                user.initialDeposit = initialDeposit;
                user.lastName = lastName;
                user.passportUrl = passportUrl;
                user.password = password;
                user.phoneNo = phoneNo;
                user.pin = pin;
                user.ssn = ssn;
                user.userName = userName;
                user.zipCode = zipCode;
                user.state = state;
                user.accountNumber = utils_1.utils.generateAccNo();
                user = yield user.save();
            }
            return user;
        });
    }
    validateOtp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, otp }) {
            const otpValidity = yield entity_1.default.findOne({
                email: email,
                emailVerificationOtp: otp,
            });
            return otpValidity;
        });
    }
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield entity_1.default.findOne({ email });
            if (user) {
                user.emailVerified = true;
                user.emailVerificationOtp = undefined;
                user.emailVerificationOtpExpiration = undefined;
                user = yield user.save();
            }
            return user;
        });
    }
    saveOtp(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = input;
            const user = yield entity_1.default.findOne({
                email: email,
            });
            user.emailVerificationOtp = otp;
            //3600000 is in milisecs and this is 1hr, so the token is valid for 1 hour
            user.emailVerificationOtpExpiration = new Date(Date.now() + 3600000);
            yield user.save();
            return user;
        });
    }
}
exports.authService = new AuthService();
