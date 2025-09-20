import { Router } from "express";
import { utils } from "../utils";
import { adminValidator } from "./validator";
import { adminController } from "./controller";
import { isAuth } from "../middleware/isAuth";
import GeneralMiddleware from "../middleware/general";



export const AdminRouter = Router();

// Create an admin
AdminRouter.post(
    "/signup",
    // [
      // upload.none(),  // For FormData
      // adminValidator.signUp],
   utils.wrapAsync(adminController.adminSignUp)
  );


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

