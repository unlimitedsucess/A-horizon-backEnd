import { Types, Document } from "mongoose";
import { CardType } from "./enum";

export interface ICard extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  cardType: CardType;
  pin: string;
  ccv: string;
  cardNumber: string;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICardUserInput {
  cardType: CardType;
  pin: string;
}

export interface ICardInput {
  userId: Types.ObjectId;
  ccv: string;
  cardNumber: string;
  expiryDate: string;
}
