"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("./enum");
const Schema = mongoose_1.default.Schema;
const parcelSchema = new Schema({
    senderName: {
        type: String,
        required: true,
    },
    receiverName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    receiverEmail: {
        type: String,
        required: true,
    },
    freightDate: {
        type: String,
        required: true,
    },
    arrivalDate: {
        type: String,
        required: true,
    },
    parcelWeight: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    currentLocation: {
        type: String,
        default: "",
    },
    lastLocation: {
        type: String,
        default: "",
    },
    senderLocation: {
        type: String,
        required: true,
    },
    couriersMessage: {
        type: String,
        default: "",
    },
    freightType: {
        type: String,
        default: "",
    },
    remainingDistanceInMiles: {
        type: String,
        default: "",
    },
    parcelsDesignation: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: [enum_1.ParcelStatus.Delivered, enum_1.ParcelStatus.Ongoing, enum_1.ParcelStatus.Pending],
    },
    createdAt: { type: Date, default: Date.now },
});
const Parcel = mongoose_1.default.model("Parcel", parcelSchema);
exports.default = Parcel;
