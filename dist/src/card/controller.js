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
exports.cardController = void 0;
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const service_1 = require("../user/service");
const service_2 = require("./service");
class CardController {
    createCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const body = req.body;
            const userExist = yield service_1.userService.findUserById(userId);
            if (!userExist) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            const card = Object.assign(Object.assign({}, body), { cardNumber: utils_1.utils.generateCardNumber(), ccv: utils_1.utils.generateCVV(), expiryDate: utils_1.utils.generateExpiryDate(), userId: userExist._id.toString() });
            yield service_2.cardService.createCard(card);
            return res.status(201).json({
                message: enum_1.MessageResponse.Success,
                description: "Card Created successfully",
                data: null,
            });
        });
    }
    fetchUserCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            console.log(userId);
            const cards = yield service_2.cardService.fetchCardsByUserId(userId);
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: "Cards fetched successful",
                data: cards,
            });
        });
    }
    updateCardStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const card = yield service_2.cardService.updateCardStatus(body);
            return res.status(200).json({
                message: enum_1.MessageResponse.Success,
                description: `Card is now ${body.status}`,
                data: null,
            });
        });
    }
}
exports.cardController = new CardController();
