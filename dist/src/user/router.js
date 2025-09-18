"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const isAuth_1 = require("../middleware/isAuth");
const utils_1 = require("../utils");
const controller_1 = require("./controller");
exports.UserRouter = (0, express_1.Router)();
//Get user information
exports.UserRouter.get("/user", [isAuth_1.isAuth], utils_1.utils.wrapAsync(controller_1.userController.fetchUserDetails));
