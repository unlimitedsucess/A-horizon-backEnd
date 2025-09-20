import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../utils/interface";
import { userService } from "../user/service";
import { MessageResponse } from "../utils/enum";
import { AccountStatus } from "../user/enum";
import { adminService } from "../admin/service";

export default class GeneralMiddleware {
  static async isUserActive(req: Request, res: Response, next: NextFunction) {
    const { userId } = req as CustomRequest;

    const userExist = await userService.findUserById(userId);

    if (!userExist) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "User not found",
        data: null,
      });
    }

    if (!userExist.accountType) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Please complete your account sign registration",
        data: null,
      });
    }

    if (userExist.accountStatus !== AccountStatus.ACTIVE) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description:
          `Your account is ${userExist.accountStatus} please contact customer support!`,
        data: {
          accountStatus: userExist.accountStatus,
        },
      });
    }

    next();
  }

   static async isAdmin(req: Request, res: Response, next: NextFunction) {
    const { userId } = req as CustomRequest;

    const adminExist = await adminService.findAdminById(userId);

    if (!adminExist) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: "Admin not found",
        data: null,
      });
    }

    next();
  }
}
