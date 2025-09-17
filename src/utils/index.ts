import { NextFunction, Request, Response } from "express";
import Crypto from "crypto";
import streamifier from "streamifier";

import { MessageResponse } from "./enum";
import { CustomHttpResponse } from "./interface";
import cloudinary from "../../config/cloudnairy";
import { v4 as uuidv4 } from "uuid";

class Utils {
  public wrapAsync(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }

  public customResponse({
    res,
    status,
    message,
    description,
    data,
  }: CustomHttpResponse) {
    return res.status(status).json({
      message,
      description,
      data,
    });
  }

  public generateOtp = (): string => {
    return Array.from({ length: 6 }, () => Crypto.randomInt(0, 10)).join("");
  };

  public generateTransactionId = (): string => {
    const prefix = "SD";
    const timestamp = Date.now().toString(36);
    const randomPart = Crypto.randomBytes(4).toString("hex");

    return `${prefix}-${timestamp}-${randomPart}`.toUpperCase();
  };

 public uploadFromBuffer = (fileBuffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: uuidv4() },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
}

export const utils = new Utils();
