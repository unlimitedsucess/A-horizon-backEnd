import { ICardInput, IUpdateCardStatusUserInput } from "./interface";
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

  public async updateCardStatus(input: IUpdateCardStatusUserInput) {
    const { cardId, status } = input;

    const card = await Card.findOneAndUpdate(
      { _id: cardId },
      { $set: { cardStatus: status } },
      { new: true }
    );

    return card;
  }
}

export const cardService = new CardService();
