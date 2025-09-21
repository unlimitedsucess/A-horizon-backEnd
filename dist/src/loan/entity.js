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
const loanSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    loanDuration: {
        type: String,
        required: true,
        enum: Object.values(enum_1.LoanDuration),
    },
    status: {
        type: String,
        default: enum_1.LoanStatus.PENDING,
        enum: Object.values(enum_1.LoanStatus),
    },
    lastInterestAppliedDate: {
        type: Date,
        default: null
    },
    activationDate: {
        type: Date,
        default: null
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
    loanAmount: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        min: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        // When retrieving from DB, convert Decimal128 to number
        get: (v) => v ? parseFloat(v.toString()) : 0,
        // When saving to DB, convert number or string to Decimal128
        set: (v) => mongoose_1.default.Types.Decimal128.fromString(v.toString()),
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const Loan = mongoose_1.default.model("Loan", loanSchema);
exports.default = Loan;
