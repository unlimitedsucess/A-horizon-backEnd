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
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../user/service");
const enum_1 = require("../utils/enum");
const enum_2 = require("../user/enum");
const service_2 = require("../admin/service");
class GeneralMiddleware {
    static isUserActive(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const userExist = yield service_1.userService.findUserById(userId);
            if (!userExist) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "User not found",
                    data: null,
                });
            }
            if (!userExist.accountType) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Please complete your account sign registration",
                    data: null,
                });
            }
            if (userExist.accountStatus !== enum_2.AccountStatus.ACTIVE) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: `Your account is ${userExist.accountStatus} please contact customer support!`,
                    data: {
                        accountStatus: userExist.accountStatus,
                    },
                });
            }
            next();
        });
    }
    static isAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const adminExist = yield service_2.adminService.findAdminById(userId);
            if (!adminExist) {
                return res.status(400).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Admin not found",
                    data: null,
                });
            }
            next();
        });
    }
}
exports.default = GeneralMiddleware;
