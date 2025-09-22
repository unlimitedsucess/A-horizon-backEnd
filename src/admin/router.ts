import { Router } from "express";
import { utils } from "../utils";
import { adminValidator } from "./validator";
import { adminController } from "./controller";
import { isAuth } from "../middleware/isAuth";
import GeneralMiddleware from "../middleware/general";
import { authValidator } from "../auth/validator";



export const AdminRouter = Router();

// Create an admin
// AdminRouter.post(
//     "/signup",
//     // [
//       // upload.none(),  // For FormData
//       // adminValidator.signUp],
//    utils.wrapAsync(adminController.adminSignUp)
//   );


//Sign in as admin
AdminRouter.post(
  "/signin",
  [adminValidator.adminLogin],
 utils.wrapAsync(adminController.adminSignIn)
);

//Fetch Users
AdminRouter.get(
  "/info",
  [isAuth, GeneralMiddleware.isAdmin],
  utils.wrapAsync(adminController.fetchAdminDetails)
);

//Acc Status update
AdminRouter.patch(
  "/account/status",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.validateUserAccountStatus],
  utils.wrapAsync(adminController.updateUserAccountStatus)
);

//User update
AdminRouter.patch(
  "/update/user/:id",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.validateParams, authValidator.handleFileUpload, adminValidator.userUpdate],
  utils.wrapAsync(adminController.updateUser)
);


//Delete user acc
AdminRouter.delete(
  "/user/:id",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.validateParams],
  utils.wrapAsync(adminController.deleteUserAccount)
);

//Delete transfer history
AdminRouter.delete(
  "/transaction/:id",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.validateParams],
  utils.wrapAsync(adminController.deleteATransferHistory)
);

//Create Wire TF
AdminRouter.post(
  "/transaction/wire",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.createWireTransfer],
  utils.wrapAsync(adminController.adminCreateWireTransferHistory)
);

//Create Domestic TF
AdminRouter.post(
  "/transaction/domestic",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.createDomesticTransfer],
  utils.wrapAsync(adminController.adminCreateWireTransferHistory)
);

//Update Loan Status
AdminRouter.patch(
  "/loan/status",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.updateLoanStatus],
  utils.wrapAsync(adminController.adminUpdateLoan)
);

AdminRouter.patch(
  "/redeem/loan/:id",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.validateParams],
  utils.wrapAsync(adminController.redeemLoan)
);

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

