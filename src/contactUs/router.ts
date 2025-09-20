import { Router } from "express";

import { utils, } from "../utils";
import { contactUsValidator} from "./validator";
import { contactUsController } from "./controller";

export const ContactUsRouter = Router();

//ContactUs
ContactUsRouter.post(
  "/contact/us",
  [contactUsValidator.contactUs],
  utils.wrapAsync(contactUsController.contactUs)
);

