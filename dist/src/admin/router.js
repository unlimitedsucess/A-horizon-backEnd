"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
const controller_1 = require("./controller");
const isAuth_1 = require("../middleware/isAuth");
const general_1 = __importDefault(require("../middleware/general"));
exports.AdminRouter = (0, express_1.Router)();
// Create an admin
exports.AdminRouter.post("/signup", 
// [
// upload.none(),  // For FormData
// adminValidator.signUp],
utils_1.utils.wrapAsync(controller_1.adminController.adminSignUp));
//Sign in as admin
exports.AdminRouter.post("/signin", [validator_1.adminValidator.adminLogin], utils_1.utils.wrapAsync(controller_1.adminController.adminSignIn));
//Fetch Users
exports.AdminRouter.get("/info", [isAuth_1.isAuth, general_1.default.isAdmin], utils_1.utils.wrapAsync(controller_1.adminController.fetchAdminDetails));
exports.AdminRouter.patch("/account/status", [isAuth_1.isAuth, general_1.default.isAdmin, validator_1.adminValidator.validateUserAccountStatus], utils_1.utils.wrapAsync(controller_1.adminController.updateUserAccountStatus));
// //Approve user acc
// AdminRouter.patch(
//   "/admin/approve/user/:id",
//   [isAuth, adminValidator.validateParams],
//   wrapAsync(adminController.approveUserAccount)
// );
// //Delete user acc
// AdminRouter.delete(
//   "/admin/delete/user/:id",
//   [isAuth, adminValidator.validateParams],
//   wrapAsync(adminController.deleteUserAccount)
// );
// AdminRouter.patch(
//   "/admin/update/user/:id",
//   [isAuth, adminValidator.validateParams, adminValidator.userUpdate],
//   wrapAsync(adminController.updateUser)
// );
// //create transfer with admin
// AdminRouter.post(
//   "/admin/create/transfer",
//   [adminValidator.createTransferWithAdmin],
//   wrapAsync(adminController.createTransferWithAdmin)
// );
// //Fetch Transfer history
// AdminRouter.get(
//   "/admin/transfers",
//   [isAuth],
//   wrapAsync(adminController.fetchAllTransferHistory)
// );
// //Fetch Transfer for transction id
// AdminRouter.get(
//   "/admin/transfer/:id",
//   [isAuth, adminValidator.validateParams],
//   wrapAsync(adminController.fetchTransferById)
// );
// //Fetch Transfer for transction userid
// AdminRouter.get(
//   "/admin/transfer/user/:id",
//   [isAuth, adminValidator.validateParams],
//   wrapAsync(adminController.fetchTransferByUserId)
// );
// //Delete transfer history
// AdminRouter.delete(
//   "/admin/delete/transfer/:id",
//   [isAuth, adminValidator.validateParams],
//   wrapAsync(adminController.deleteATransferHistory)
// );
// //Update transfer details
// AdminRouter.patch(
//   "/admin/update/transfer/:id",
//   [isAuth, adminValidator.validateParams, adminValidator.createTransferWithAdmin],
//   wrapAsync(adminController.updateUserTransfer)
// );
