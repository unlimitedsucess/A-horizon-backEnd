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

 public generateAccNo= (): string => {
  return Array.from({ length: 10 }, () => Crypto.randomInt(0, 10)).join('');
};

public formatNumber(value: number | string): string {
  if (value === null || value === undefined || value === "") return "0";

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "0";

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

public toSentenceCase(str: string): string {
  if (!str) return "";
  const lower = str.toLowerCase().trim();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

}

export const utils = new Utils();
