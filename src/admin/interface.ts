import { Document } from "mongoose";

export interface IAdmin extends Document {
  userName: string;
  password: string;
  createdAt: string;
}

export interface IAdminUserInput {
  userName: string;
  password: string;
}
