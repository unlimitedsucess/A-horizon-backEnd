"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const enum_1 = require("./enum");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        default: null,
    },
    lastName: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        requrired: true,
    },
    phoneNo: {
        type: String,
        default: null,
    },
    dob: {
        type: String,
        default: null,
    },
    zipCode: {
        type: String,
        default: null,
    },
    ssn: {
        type: String,
        default: null,
    },
    initialDeposit: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        min: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        // When retrieving from DB, convert Decimal128 to number
        get: (v) => v ? parseFloat(v.toString()) : 0,
        // When saving to DB, convert number or string to Decimal128
        set: (v) => mongoose_1.default.Types.Decimal128.fromString(v.toString()),
    },
    loan: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        min: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        // When retrieving from DB, convert Decimal128 to number
        get: (v) => v ? parseFloat(v.toString()) : 0,
        // When saving to DB, convert number or string to Decimal128
        set: (v) => mongoose_1.default.Types.Decimal128.fromString(v.toString()),
    },
    loanBalance: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        min: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        // When retrieving from DB, convert Decimal128 to number
        get: (v) => v ? parseFloat(v.toString()) : 0,
        // When saving to DB, convert number or string to Decimal128
        set: (v) => mongoose_1.default.Types.Decimal128.fromString(v.toString()),
    },
    expenses: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        min: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        // When retrieving from DB, convert Decimal128 to number
        get: (v) => v ? parseFloat(v.toString()) : 0,
        // When saving to DB, convert number or string to Decimal128
        set: (v) => mongoose_1.default.Types.Decimal128.fromString(v.toString()),
    },
    accountNumber: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    country: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        default: null,
    },
    accountType: {
        type: String,
        default: null,
        enum: Object.values(enum_1.AccountType),
    },
    userName: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    pin: {
        type: String,
        default: null,
    },
    passportUrl: {
        type: String,
        default: null,
    },
    driversLicence: {
        type: String,
        default: null,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationOtp: {
        type: String,
        default: undefined,
    },
    emailVerificationOtpExpiration: {
        type: Date,
        default: undefined,
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
