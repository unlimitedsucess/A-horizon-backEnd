"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReachOutRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
const controller_1 = require("./controller");
exports.ReachOutRouter = (0, express_1.Router)();
//contact us form inpput
exports.ReachOutRouter.post("/reach/out", [validator_1.reachOutValidator.reachOut], (0, utils_1.wrapAsync)(controller_1.reachOutController.sendReachOutMessage));
