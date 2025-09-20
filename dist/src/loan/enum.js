"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanStatus = exports.LoanDuration = void 0;
var LoanDuration;
(function (LoanDuration) {
    LoanDuration["ONE_MONTH"] = "1month_5";
    LoanDuration["TWO_MONTH"] = "2month_8";
    LoanDuration["THREE_MONTH"] = "3month_10";
    LoanDuration["SIX_MONTH"] = "6month_15";
    LoanDuration["TWELEVE_MONTH"] = "12month_20";
})(LoanDuration || (exports.LoanDuration = LoanDuration = {}));
var LoanStatus;
(function (LoanStatus) {
    LoanStatus["PENDING"] = "pending";
    LoanStatus["OVERDUE"] = "overdue";
    LoanStatus["REJECTED"] = "rejected";
    LoanStatus["APPROVED"] = "approved";
})(LoanStatus || (exports.LoanStatus = LoanStatus = {}));
