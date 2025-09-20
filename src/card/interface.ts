import { Types, Document } from "mongoose";
import { CardStatus, CardType } from "./enum";

export interface ICard extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  cardType: CardType;
  pin: string;
  ccv: string;
  cardNumber: string;
  status: CardStatus;
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


export interface IUpdateCardStatusUserInput {
  cardId: Types.ObjectId;
  status: CardStatus;
}

// export interface IUpdateCardStatusInput {
//   staus: CardStatus;
//   userId: Types.ObjectId;
// }
