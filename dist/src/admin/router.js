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
const validator_2 = require("../auth/validator");
exports.AdminRouter = (0, express_1.Router)();
// Create an admin
// AdminRouter.post(
//     "/signup",
//     // [
//       // upload.none(),  // For FormData
//       // adminValidator.signUp],
//    utils.wrapAsync(adminController.adminSignUp)
//   );
//Sign in as admin
exports.AdminRouter.post("/signin", [validator_1.adminValidator.adminLogin], utils_1.utils.wrapAsync(controller_1.adminController.adminSignIn));
//Fetch Users
exports.AdminRouter.get("/info", [isAuth_1.isAuth, general_1.default.isAdmin], utils_1.utils.wrapAsync(controller_1.adminController.fetchAdminDetails));
//Acc Status update
exports.AdminRouter.patch("/account/status", [isAuth_1.isAuth, general_1.default.isAdmin, validator_1.adminValidator.validateUserAccountStatus], utils_1.utils.wrapAsync(controller_1.adminController.updateUserAccountStatus));
//User update
exports.AdminRouter.patch("/update/user/:id", [isAuth_1.isAuth, general_1.default.isAdmin, validator_1.adminValidator.validateParams, validator_2.authValidator.handleFileUpload, validator_1.adminValidator.userUpdate], utils_1.utils.wrapAsync(controller_1.adminController.updateUser));
//Delete user acc
exports.AdminRouter.delete("/user/:id", [isAuth_1.isAuth, general_1.default.isAdmin, validator_1.adminValidator.validateParams], utils_1.utils.wrapAsync(controller_1.adminController.deleteUserAccount));
//Delete transfer history
exports.AdminRouter.delete("/transaction/:id", [isAuth_1.isAuth, general_1.default.isAdmin, validator_1.adminValidator.validateParams], utils_1.utils.wrapAsync(controller_1.adminController.deleteATransferHistory));
//Create Wire TF
exports.AdminRouter.post("/transaction/wire", [isAuth_1.isAuth, general_1.default.isAdmin, validator_1.adminValidator.createWireTransfer], utils_1.utils.wrapAsync(controller_1.adminController.adminCreateWireTransferHistory));
//Create Domestic TF
exports.AdminRouter.post("/transaction/domestic", [isAuth_1.isAuth, general_1.default.isAdmin, validator_1.adminValidator.createDomesticTransfer], utils_1.utils.wrapAsync(controller_1.adminController.adminCreateWireTransferHistory));
//Update Loan Status
exports.AdminRouter.patch("/loan/status", [isAuth_1.isAuth, general_1.default.isAdmin, validator_1.adminValidator.updateLoanStatus], utils_1.utils.wrapAsync(controller_1.adminController.adminUpdateLoan));
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
// //Update transfer details
// AdminRouter.patch(
//   "/admin/update/transfer/:id",
//   [isAuth, adminValidator.validateParams, adminValidator.createTransferWithAdmin],
//   wrapAsync(adminController.updateUserTransfer)
// );
