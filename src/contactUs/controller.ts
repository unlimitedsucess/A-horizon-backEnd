import { Request, Response } from "express";

import { MessageResponse } from "../utils/enum";
import { IContactUs } from "./inteface";

class ContactUsController {
  public async contactUs(req: Request, res: Response) {
    const body: IContactUs = req.body;

  //  sendContactUsEmail(body);

    return res.status(200).json({
      message: MessageResponse.Success,
      description: "Email sent successfully!",
      data: null,
    });
  }
}

export const contactUsController = new ContactUsController();
