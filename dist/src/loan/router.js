"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRouter = void 0;
const express_1 = require("express");
const validator_1 = require("./validator");
const utils_1 = require("../utils");
const isAuth_1 = require("../middleware/isAuth");
const general_1 = __importDefault(require("../middleware/general"));
const controller_1 = require("./controller");
exports.LoanRouter = (0, express_1.Router)();
//Apply Loan
exports.LoanRouter.post("/apply", [isAuth_1.isAuth, general_1.default.isUserActive, validator_1.loanValidator.applyLoan], utils_1.utils.wrapAsync(controller_1.loanController.applyLoan));
