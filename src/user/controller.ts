import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { userService } from "./service";
import { CustomRequest } from "../utils/interface";

class UserController {
  public async fetchUserDetails(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const userExist = await userService.findUserByIdWithoutPassword(userId);

    if (!userExist) {
      return res.status(404).json({
        message: MessageResponse.Error,
        description: "User does not exist!",
        data: null,
      });
    }

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "User details fetched successfully!",
      data: userExist,
    });
  }
}

export const userController = new UserController();
