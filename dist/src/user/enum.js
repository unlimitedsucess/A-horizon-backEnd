"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.AccountType = void 0;
var AccountType;
(function (AccountType) {
    AccountType["SAVINGS"] = "savings";
    AccountType["CURRENT"] = "current";
    AccountType["CHECKING"] = "checking";
    AccountType["FIXED"] = "fixed";
    AccountType["NON_RESIDENT"] = "non-resident";
    AccountType["ONLINE"] = "online";
    AccountType["DOMICILIARY"] = "domicilary";
    AccountType["JOINT"] = "joint";
})(AccountType || (exports.AccountType = AccountType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["PENDING"] = "pending";
    AccountStatus["SUSPENDED"] = "suspended";
    AccountStatus["ACTIVE"] = "active";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
