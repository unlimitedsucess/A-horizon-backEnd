import mongoose, { Schema } from "mongoose";
import { CardStatus, CardType } from "./enum";
import { ICard } from "./interface";

const cardSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cardType: {
      type: String,
      required: true,
      enum: Object.values(CardType),
    },
    status: {
      type: String,
      default: CardStatus.ACTIVE,
      enum: Object.values(CardStatus),
    },
    pin: {
      type: String,
      required: true,
    },
    ccv: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Card = mongoose.model<ICard>("Card", cardSchema);

export default Card;
