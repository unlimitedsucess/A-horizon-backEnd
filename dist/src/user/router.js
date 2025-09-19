"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const isAuth_1 = require("../middleware/isAuth");
const utils_1 = require("../utils");
const controller_1 = require("./controller");
const general_1 = __importDefault(require("../middleware/general"));
exports.UserRouter = (0, express_1.Router)();
//Get user information
exports.UserRouter.get("/user", [isAuth_1.isAuth, general_1.default.isUserActive], utils_1.utils.wrapAsync(controller_1.userController.fetchUserDetails));
