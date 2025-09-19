import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../utils/interface";
import { userService } from "../user/service";
import { MessageResponse } from "../utils/enum";
import { AccountStatus } from "../user/enum";

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

    if (userExist.accountStatus === AccountStatus.SUSPENDED) {
      return res.status(400).json({
        message: MessageResponse.Error,
        description:
          "Your account has beeen suspended please contact customer support!",
        data: null,
      });
    }

    next();
  }
}
