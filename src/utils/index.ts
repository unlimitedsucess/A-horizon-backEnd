import { NextFunction, Request, Response } from "express";
import Crypto from "crypto";
import streamifier from "streamifier";

import { MessageResponse } from "./enum";
import { CustomHttpResponse } from "./interface";
import cloudinary from "../../config/cloudnairy";
import { v4 as uuidv4 } from "uuid";
import Loan from "../loan/entity";
import Decimal from "decimal.js";
import { LoanStatus } from "../loan/enum";
import mongoose from "mongoose";
import User from "../user/entity";
import { AccountStatus } from "../user/enum";

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
public generateCardNumber = (): string => {
  return Array.from({ length: 16 }, () => Crypto.randomInt(0, 10)).join('');
};

public generateCVV = (): string => {
  return Crypto.randomInt(100, 1000).toString(); // 100 to 999
};

public generateExpiryDate = (): string => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 4);
  return now.toISOString(); // or .toDateString() / custom format
};


public generateCardPin = (): string => {
  return Array.from({ length: 4 }, () => Crypto.randomInt(0, 10)).join('');
};

public isToday(dateInput: string) {
  const inputDate = new Date(dateInput);
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const today = new Date();

  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
}

public getValueAfterUnderscore(input: string): string | null {
  const parts = input.split("_");
  return parts.length > 1 ? parts[1] : null;
}

public getValueBeforeUnderscore(input: string): string | null {
  const parts = input.split("_");
  return parts.length > 1 ? parts[0] : null;
}

public toNumber(value: string): number | null {
  const num = Number(value);
  return isNaN(num) ? null : num;
}

public getIntrest(percentage: number, value: number): number {
  return (percentage / 100) * value;
}



 public async updateLoansAndBalances() {
    try {
      // 1. Fetch all approved loans
      const approvedLoans = await Loan.find({ status: LoanStatus.APPROVED });

      for (const loan of approvedLoans) {
        if (!loan.activationDate) continue;

        // 2. Parse loanDuration (e.g. "1month_5", "6month_15")
        const [monthPart, percentagePart] = loan.loanDuration.split("_");
        const monthsPerPeriod = parseInt(monthPart.replace("month", ""), 10); // e.g. 1, 6
        const percentagePerPeriod = new Decimal(percentagePart); // e.g. 5, 15

        const activationDate = new Date(loan.activationDate);
        const now = new Date();

        // 🟢 First interest maturity date = activationDate + monthsPerPeriod
        const firstInterestDate = new Date(activationDate);
        firstInterestDate.setMonth(firstInterestDate.getMonth() + monthsPerPeriod);

        if (now < firstInterestDate) continue; // not matured yet

        // 🟢 Last time we applied interest
        const lastApplied = loan.lastInterestAppliedDate
          ? new Date(loan.lastInterestAppliedDate)
          : activationDate;

        if (now < lastApplied) continue; // future date, skip

        // 🟢 Calculate how many full periods have passed since lastApplied
        const monthsPassed =
          (now.getFullYear() - lastApplied.getFullYear()) * 12 +
          (now.getMonth() - lastApplied.getMonth());

        const periodsPassed = Math.floor(monthsPassed / monthsPerPeriod);

        if (periodsPassed <= 0) continue; // still in the same period

        // 🟢 Total interest percentage = periodsPassed * percentagePerPeriod
        const totalInterestPercentage = percentagePerPeriod.mul(periodsPassed);

        const currentLoanBalance = new Decimal(loan.loanBalance?.toString() || "0");
        const loanAmount = new Decimal(loan.loanAmount?.toString() || "0");

        // Interest = loanAmount * (totalInterestPercentage / 100)
        const interestAmount = loanAmount.mul(totalInterestPercentage).div(100);

        // 6. Update loan balance
        const newLoanBalance = currentLoanBalance.plus(interestAmount);
        loan.loanBalance = mongoose.Types.Decimal128.fromString(newLoanBalance.toString());
        loan.lastInterestAppliedDate = now;
        loan.interestAmount = mongoose.Types.Decimal128.fromString(interestAmount.toString());
        await loan.save();

        // 7. Update user's loan balance
        const user = await User.findOne({
          _id: loan.userId,
          accountStatus: AccountStatus.ACTIVE,
        });

        if (user) {
          const currentUserLoanBalance = new Decimal(user.loanBalance?.toString() || "0");
          const newUserLoanBalance = currentUserLoanBalance.plus(interestAmount);

          user.loanBalance = mongoose.Types.Decimal128.fromString(newUserLoanBalance.toString());
          await user.save();
        }

        console.log(
          `Applied ${totalInterestPercentage.toString()}% interest (${periodsPassed} period(s)) to loan ${loan._id}`
        );
      }

      console.log("Loan balances updated successfully ✅");
    } catch (error) {
      console.error("CRON ERROR", error);
    }
  }


// public async updateLoansAndBalances() {
//     try {
//       // Fetch all approved loans
//       const approvedLoans = await Loan.find({ status: LoanStatus.APPROVED });

//       for (const loan of approvedLoans) {
//         // Parse loanDuration string (e.g., "3month_10")
//         const [monthPart, percentagePart] = loan.loanDuration.split("_");
//         const months = parseInt(monthPart.replace("month", ""), 10);
//         const percentage = new Decimal(percentagePart);

//         if (!loan.lastInterestAppliedDate) continue;

//         // Calculate maturity date
//         const activationDate = new Date(loan.lastInterestAppliedDate);
//         const maturityDate = new Date(activationDate);
//         maturityDate.setMonth(maturityDate.getMonth() + months);

//         const now = new Date();

//         // Only apply if loan matured
//         if (now >= maturityDate) {
//           const currentLoanBalance = new Decimal(loan.loanBalance?.toString() || "0");
//           const loanAmount = new Decimal(loan.loanAmount?.toString() || "0");

//           // % of loan amount
//           const amountToAdd = loanAmount.mul(percentage).div(100);

//           // New loan balance
//           const newLoanBalance = currentLoanBalance.plus(amountToAdd);

//           // ✅ Save loan balance as Decimal128
//           loan.loanBalance = mongoose.Types.Decimal128.fromString(newLoanBalance.toString());
//           await loan.save();

//           // ✅ Update user's loanBalance
//           const user = await User.findOne({_id:loan.userId, accountStatus: AccountStatus.ACTIVE});
//           if (user) {
//             const currentUserLoanBalance = new Decimal(user.loanBalance?.toString() || "0");
//             const newUserLoanBalance = currentUserLoanBalance.plus(amountToAdd);

//             user.loanBalance = mongoose.Types.Decimal128.fromString(newUserLoanBalance.toString());
//             await user.save();
//           }
//         }
//       }

//       console.log("cron success");
//     } catch (error) {
//       console.error("CRON ERROR", error);
//       // return res.status(500).json({
//       //   message: "Error",
//       //   description: "Failed to update loan balances",
//       //   error,
//       // });
//     }
//   }

}

export const utils = new Utils();
