import { Document, Types } from "mongoose";
import { AccountStatus } from "../user/enum";

export interface IAdmin extends Document {
  userName: string;
  password: string;
  createdAt: string;
}

export interface IAdminUserInput {
  userName: string;
  password: string;
}

export interface IUpdateUserAccountStatus {
  userId: Types.ObjectId;
  status: AccountStatus;
}