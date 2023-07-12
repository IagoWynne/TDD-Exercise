import { Deck, Card } from "./types";


export class FullDeck implements Deck {
  private cardConfig = {
    suits: ["Spades", "Hearts", "Clubs", "Diamonds"],
    values: ["Ace", "King", "Queen", "Jack", 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };

  private deck: Card[] = [];

  constructor() {

  }

  draw(faceUp: boolean): Card {
    /* requirements
     * Draws the top card from the deck and returns it, face up or down depending on the given boolean
     * Cannot draw the same card again until the deck is reset
    */
    return {value: "Ace", faceUp: false};
  }

  reset() {
    /* requirements
     * Clears the current deck
     * Recreates the deck with all the cards in it
     * Shuffles the cards
    */
  }
}
