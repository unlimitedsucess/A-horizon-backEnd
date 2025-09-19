"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionDirection = exports.TransactionType = exports.TransferType = exports.TransactionStatus = void 0;
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["COMPLETED"] = "complete";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransferType;
(function (TransferType) {
    TransferType["WIRE"] = "wire";
    TransferType["DOMESTIC"] = "domestic";
})(TransferType || (exports.TransferType = TransferType = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["TRANSFER"] = "transfer";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionDirection;
(function (TransactionDirection) {
    TransactionDirection["CREDIT"] = "credit";
    TransactionDirection["DEBIT"] = "debit";
})(TransactionDirection || (exports.TransactionDirection = TransactionDirection = {}));
