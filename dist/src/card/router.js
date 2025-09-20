"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const isAuth_1 = require("../middleware/isAuth");
const general_1 = __importDefault(require("../middleware/general"));
const validator_1 = require("./validator");
const controller_1 = require("./controller");
exports.CardRouter = (0, express_1.Router)();
//Create Card
exports.CardRouter.post("/create", [isAuth_1.isAuth, general_1.default.isUserActive, validator_1.cardValidator.validateCardApplication], utils_1.utils.wrapAsync(controller_1.cardController.createCard));
//Fetch User cars
exports.CardRouter.get("/all", [isAuth_1.isAuth, general_1.default.isUserActive], utils_1.utils.wrapAsync(controller_1.cardController.fetchUserCard));
//Update card
exports.CardRouter.patch("/update", [isAuth_1.isAuth, general_1.default.isUserActive, validator_1.cardValidator.validateCardStatus], utils_1.utils.wrapAsync(controller_1.cardController.updateCardStatus));
