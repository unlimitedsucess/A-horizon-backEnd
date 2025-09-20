import { ICardInput } from "./interface";
import Card from "./entity";

class CardService {
  public async createCard(input: ICardInput) {
    let newCard = new Card({
      ...input,
    });

    await newCard.save();

    return;
  }

   public async fetchCardsByUserId(id: string) {
    const transfer = Card.find({ userId: id });

    return transfer;
  }
}

export const cardService = new CardService();
