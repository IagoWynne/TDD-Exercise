import { Card, IGame, IDeck } from "./types";

export class Game implements IGame {
  private deck: IDeck;

  constructor(deck: IDeck) {
    this.deck = deck;
  }

  startGame() {
    /* requirements:
     * Reset the deck
     * Draw two cards from the deck for the player and two for the dealer
     * The cards should be drawn in the following order:
      * draw one card for the player
      * draw one card for the dealer
      * draw one card for the player
      * draw one card for the dealer
     * All the player cards should be face up
     * The dealer's first card should be face up. The dealer's second card should be face down
     */

    return { playerCards: [], dealerCards: [] };
  }

  calculateScore(cards: Card[]): number {
    /* requirements
     * Take in an array of cards and calculate their value using the rules of blackjack
     * Aces should be treated in the following way:
      * if the total value of the rest of the cards is <= 10, Ace = 11
      * if the total value of the rest of the cards is > 10, Ace = 1
      * if there are multiple aces, treat all but the last ace as 1. Then calculate the value of the final ace by the rules above
     */
    return 0;
  }

  hit(): Card {
    /* requirements
     * Draw a card from the deck and return it
    */
    return { value: "Ace", suit: "Spades", faceUp: false };
  }

  stand(cards: Card[], playerScore: number): Card[] {
    /* requirements
     * Draw cards until the value of the hand is > 17, or is >= playerScore
    */
    return [];

    /* Bonus:
     * Casinos will often treat a hand with an ace as "softlocked"
     * (e.g. our calculateScore will do 7 + Ace = 18, which is greater than 17 so should stop there)
     * In this situation, they may keep going until it's certain that the hand is 21, or > 17 
     * (e.g. drawing a 3 with the above hand would give a value of 21, which is a win. 
     * Drawing a 5 would force the ace to be treated as 1 since 7 + 5 = 12, so the ace must be 1 or the hand is bust)
     * Write tests for this behaviour and try to implement the code
    */
  }
}
