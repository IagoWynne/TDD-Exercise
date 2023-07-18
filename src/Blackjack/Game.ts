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

    this.deck.reset();

    const playerCard1 = this.deck.draw(true) as Card;
    const dealerCard1 = this.deck.draw(true) as Card;
    const playerCard2 = this.deck.draw(true) as Card;
    const dealerCard2 = this.deck.draw(false) as Card;

    return {
      playerCards: [playerCard1, playerCard2],
      dealerCards: [dealerCard1, dealerCard2],
    };
  }

  calculateScore(cards: Card[]): number {
    /* requirements
     * Take in an array of cards and calculate their value using the rules of blackjack
     * cards 2-10 = face value
     * Jack, Queen, King = 10 points
     * Aces should be treated in the following way:
     * if the total value of the rest of the cards is <= 10, Ace = 11
     * if the total value of the rest of the cards is > 10, Ace = 1
     * if there are multiple aces, treat all but the last ace as 1,
     * then calculate the value of the final ace by the rules above
     */

    // check if there are any aces
    const handHasAces = cards.some((card) => card.value === "Ace");

    // if there are aces...
    const cardsWithoutAces = handHasAces
      ? // filter them out and leave them until last
        cards.filter((card) => card.value !== "Ace")
      : // otherwise just use all the cards
        cards;

    // we need to get the points values of the cards as number
    const pointsValues = cardsWithoutAces.map((card) =>
      // check if it's a string - if so, the value is 10. If not, the value is a number and we can just use that
      typeof card.value === "string" ? 10 : card.value
    );

    // add all the values together
    let score = 0;

    for (let val of pointsValues) {
      // this += is effectively doing: sum = sum + val;
      score += val;
    }

    // bonus: read about the reduce function and re-write the above with reduce (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
    // you'll know you got it right if all the unit tests still pass!

    // if the hand has aces...
    if (handHasAces) {
      // we need to know how many aces...
      // subtracting the total cards in the hand from the cards without aces gives us that value
      let remainingAces = cards.length - cardsWithoutAces.length;

      while (remainingAces > 0) {
        // assign the ace a value based on the current score
        const aceValue = score <= 10 ? 11 : 1;
        score += aceValue;

        // once we've processed the ace, we make sure to subtract it from how many aces remain
        remainingAces--;
      }
    }

    return score;
  }

  hit(): Card {
    /* requirements
     * Draw a card from the deck and return it
     */

    return this.deck.draw(true) as Card;
  }

  stand(cards: Card[], playerScore: number): Card[] {
    /* requirements
     * Draw cards until the value of the hand is > 17, or is >= playerScore
     */
    const finalHand = [];
    finalHand.push(...cards);

    // calculate the score of the dealer's current cards
    let dealerScore = this.calculateScore(finalHand);

    // keep drawing cards until either:
    // score > 17
    // score >= player score
    while(dealerScore <= 17 && dealerScore < playerScore) {
      finalHand.push(this.deck.draw(true) as Card);
      dealerScore = this.calculateScore(finalHand);
    }

    return finalHand;

    /* I have not implemented the bonus here.
     * You might find it interesting to try it yourself, but be warned that it will need some careful thought
     */

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
