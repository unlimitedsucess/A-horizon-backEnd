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
}

export const cardService = new CardService();
