import { Router } from "express";
import { utils } from "../utils";
import { adminValidator } from "./validator";
import { adminController } from "./controller";
import { isAuth } from "../middleware/isAuth";
import GeneralMiddleware from "../middleware/general";
import { authValidator } from "../auth/validator";



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

//Acc Status update
AdminRouter.patch(
  "/account/status",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.validateUserAccountStatus],
  utils.wrapAsync(adminController.updateUserAccountStatus)
);

//User update
AdminRouter.patch(
  "/update/user/:id",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.validateParams, adminValidator.userUpdate],
  utils.wrapAsync(adminController.updateUser)
);


//Delete user acc
AdminRouter.delete(
  "/delete/user/:id",
  [isAuth, GeneralMiddleware.isAdmin, adminValidator.validateParams],
  utils.wrapAsync(adminController.deleteUserAccount)
);


// //Approve user acc
// AdminRouter.patch(
//   "/admin/approve/user/:id",
//   [isAuth, adminValidator.validateParams],
//   wrapAsync(adminController.approveUserAccount)
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

