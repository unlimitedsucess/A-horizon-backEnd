import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { userService } from "./service";
import { CustomRequest } from "../utils/interface";
import { utils } from "../utils";

class UserController {
  public async fetchUserDetails(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const userExist = await userService.findUserByIdWithoutPassword(userId);

    if (!userExist) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "User details fetched successfully!",
      data: userExist,
    });
  }
}

export const userController = new UserController();
