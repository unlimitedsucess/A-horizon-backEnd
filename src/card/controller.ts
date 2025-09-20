import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { CustomRequest } from "../utils/interface";
import { ICardInput, ICardUserInput } from "./interface";
import { utils } from "../utils";
import { userService } from "../user/service";
import { cardService } from "./service";

class CardController {
  public async createCard(req: Request, res: Response) {
    const { userId } = req as CustomRequest;
    const body: ICardUserInput = req.body;

    const userExist = await userService.findUserById(userId);

    if (!userExist) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    const card: ICardInput = {
      ...body,
      cardNumber: utils.generateCardNumber(),
      ccv: utils.generateCVV(),
      expiryDate: utils.generateExpiryDate(),
      userId: userExist._id.toString(),
    };

    await cardService.createCard(card);

    return res.status(201).json({
      message: MessageResponse.Success,
      description: "Card Created successfully",
      data: null,
    });
  }
}

export const cardController = new CardController();
