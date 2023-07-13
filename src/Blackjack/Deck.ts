import { IDeck, Card } from "./types";

export class Deck implements IDeck {
  private cardConfig = {
    suits: ["Spades", "Hearts", "Clubs", "Diamonds"],
    values: ["Ace", "King", "Queen", "Jack", 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };

  private allCards: Card[] = [];

  private deck: Card[] = [];

  constructor() {
    this.cardConfig.suits.forEach((suit) =>
      this.cardConfig.values.forEach((value) =>
        this.allCards.push({ suit, value, faceUp: false })
      )
    );

    this.deck.push(...this.allCards);
    /* Question: what's this ... thing!?
     * Answer: It's known as spread syntax. Here, it's expanded the allCards array into its separate elements
     * Read more here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
     */

    this.shuffle();
  }

  draw(faceUp: boolean = true): Card | null {
    const card = this.deck.pop();

    if (card) {
      card.faceUp = faceUp;
      return card;
    }

    return null;
  }

  reset() {
    this.deck = [];
    this.deck.push(...this.allCards);
    this.shuffle();
  }

  private shuffle() {
    let currentIndex = this.deck.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [this.deck[currentIndex], this.deck[randomIndex]] = [
        this.deck[randomIndex],
        this.deck[currentIndex],
      ];
    }

    // solution here stolen from stackoverflow:
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  }
}
