"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUsRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
exports.ContactUsRouter = (0, express_1.Router)();
//contact us form inpput
exports.ContactUsRouter.post("/contact/us", [validator_1.contactUsValidator.contactUs], (0, utils_1.wrapAsync)(controller_1.contactUsController.sendContactUsMessage));
