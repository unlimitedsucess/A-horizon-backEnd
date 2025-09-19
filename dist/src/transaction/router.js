"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouter = void 0;
const express_1 = require("express");
const isAuth_1 = require("../middleware/isAuth");
const utils_1 = require("../utils");
const general_1 = __importDefault(require("../middleware/general"));
const validator_1 = require("./validator");
const controller_1 = require("./controller");
exports.TransactionRouter = (0, express_1.Router)();
//Wire TF
exports.TransactionRouter.post("/transfer/wire", [
    isAuth_1.isAuth,
    general_1.default.isUserActive,
    validator_1.transactionValidator.validateWireTransfer,
], utils_1.utils.wrapAsync(controller_1.transactionController.createWireTransfer));
//Domestic TF
exports.TransactionRouter.post("/transfer/domestic", [
    isAuth_1.isAuth,
    general_1.default.isUserActive,
    validator_1.transactionValidator.validateDomesticTransfer,
], utils_1.utils.wrapAsync(controller_1.transactionController.createDomesticTransfer));
exports.TransactionRouter.get("/history", [isAuth_1.isAuth, general_1.default.isUserActive], utils_1.utils.wrapAsync(controller_1.transactionController.fetchTransactionHistory));
