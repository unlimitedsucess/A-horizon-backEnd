"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUsRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
const controller_1 = require("./controller");
exports.ContactUsRouter = (0, express_1.Router)();
//ContactUs
exports.ContactUsRouter.post("/contact/us", [validator_1.contactUsValidator.contactUs], utils_1.utils.wrapAsync(controller_1.contactUsController.contactUs));
