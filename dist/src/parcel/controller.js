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
exports.createParcelController = void 0;
const enum_1 = require("../utils/enum");
const service_1 = require("./service");
const email_1 = require("../utils/email");
class CreateParcelController {
    createParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const parcel = yield service_1.parcelService.createParcel(body);
            const commonType = {
                parcelsDesignation: parcel.parcelsDesignation,
                receiverName: parcel.receiverName,
                phoneNumber: parcel.phoneNumber,
                trackingId: parcel.orderId,
                senderLocation: parcel.senderLocation,
                receiverEmail: parcel.receiverEmail,
                senderEmail: parcel.email,
            };
            const parcelReceiver = Object.assign(Object.assign({}, commonType), { isSender: false });
            const parcelSender = Object.assign(Object.assign({}, commonType), { isSender: true });
            (0, email_1.sendMessageToParcelReceiverOrSender)(parcelReceiver);
            (0, email_1.sendMessageToParcelReceiverOrSender)(parcelSender);
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Parcel created successfully!",
                data: parcel,
            });
        });
    }
    fetchParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcels = yield service_1.parcelService.fetchParcel();
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Parcel fetched successfully!",
                data: parcels,
            });
        });
    }
    deleteParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const parcel = yield service_1.parcelService.deleteParcel(id);
            if (!parcel) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Could not find parcel!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Parcel deleted successfully!",
                data: null,
            });
        });
    }
    updateParcelStaus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const body = req.body;
            const status = body.status;
            const parcel = yield service_1.parcelService.updateParcelStatus(id, status);
            if (!parcel) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Could not find parcel!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Parcel status updated successfully!",
                data: parcel,
            });
        });
    }
    updateParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const body = req.body;
            const parcel = yield service_1.parcelService.updateParcel(body, id);
            if (!parcel) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Could not find parcel!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Parcel updated successfully!",
                data: parcel,
            });
        });
    }
    fetchParcelByParcelId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { trackingId } = req.params;
            const parcel = yield service_1.parcelService.fetchParcelByParcleId(trackingId);
            if (!parcel) {
                return res.status(404).json({
                    message: enum_1.MessageResponse.Error,
                    description: "Could not find parcel!",
                    data: null,
                });
            }
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Parcel fetched successfully!",
                data: parcel,
            });
        });
    }
}
exports.createParcelController = new CreateParcelController();
