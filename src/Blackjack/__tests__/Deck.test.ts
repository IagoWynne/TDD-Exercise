import { Deck } from "../Deck";
import { Card } from "../types";

describe("Deck", () => {
  describe("draw", () => {
    it("returns a face up card by default", () => {
      // arrange - set up the test and data
      const deck = new Deck();

      // act - perform actions that will execute the test
      const result = deck.draw();

      // assert - check that the result is what we expect
      expect(result).not.toBeNull();

      // the ? here says "check if the object is null before continuing". If the object is null, the expression will return null
      expect(result?.value).not.toBeNull(); // value can be string or number, so we just check it's not null
      expect(result?.faceUp).toBeTruthy(); // we have asked for a face up card, so this should be true
    });

    it("returns a face down card if specified", () => {
      // arrange
      const deck = new Deck();

      // act
      const result = deck.draw(false);

      // assert
      expect(result?.faceUp).toBe(false); // we have asked for a face down card, so this should be false
      // we are not using "toBeFalsy" here - null is a falsy value, so if result is null, this expect will pass when it shouldn't
      // we don't need to check that the value is populated again since this is done by another test
    });

    it("does not return the same card twice if the deck has not been reset", () => {
      // arrange
      const deck = new Deck();

      // act
      // we want to draw all the cards from the deck
      // this is done quite a bit in this file, so it has been extracted to its own function
      const results = drawAllCards(deck);

      // assert
      // a Set can only contain unique values. For objects, such as our cards, this is done by object reference
      const resultSet = new Set(results);

      // so as long as draw() has not returned the same card object twice, the set size should be the total number of cards, i.e. 52
      expect(resultSet.size).toBe(52);
    });

    it("returns null if there are no more cards in the deck", () => {
      // arrange
      const deck = new Deck();

      // act
      // we want to draw all the cards from the deck, but we don't actually care about those, so we don't assign them to a variable
      drawAllCards(deck);

      const result = deck.draw();

      // assert
      expect(result).toBeNull();
    });
  });

  describe("reset", () => {
    it("should return all the cards to the deck", () => {
      // this is a bit tricky to test. We can't access the current card stack directly, so we need to think outside the box a bit

      // arrange
      const deck = new Deck();

      // act
      // let's start by drawing all the cards once... we know this removes all the cards from the deck
      const round1Cards = drawAllCards(deck);

      // now we can reset the deck, and it should add all the cards back in
      deck.reset();

      // let's draw all the cards again - perhaps we can compare the two arrays?
      const round2Cards = drawAllCards(deck);

      // assert
      // we can now check that each card from the first draw is present in the second draw
      round1Cards.forEach((card) =>
        expect(round2Cards.includes(card)).toBeTruthy()
      );
    });

    it("should shuffle the cards", () => {
      // once again, a bit tricky to test, but we can be clever about it by drawing all the cards twice and comparing the order

      // arrange
      const deck = new Deck();

      // act
      const round1Cards = drawAllCards(deck);
      deck.reset();
      const round2Cards = drawAllCards(deck);

      // assert
      /* we know that the order of both of these should be random. Sometimes, the same card may end up in the same place within the deck,
       * but it shouldn't be like this for every card
       * .some returns true as long as at it is true for at least 1 item in the array
      */

      const result = round1Cards.some((card, idx) => round2Cards[idx] !== card);

      expect(result).toBeTruthy();
    });
  });
});

/* Question: Is it ok to refactor out common code in tests?
 * Answer: Yes, especially if it makes the test more readable! 

 * You want your tests to be as easy to maintain as possible, so if you find yourself doing the same thing over and over,
 * turn it into its own function within the test file. That way, if something changes (e.g. maybe we add jokers to the deck
 * and it's now 54 cards rather than 52), we only have to change it in one place, and all the tests will work.
 
 * If your function might be used across multiple test files, you can even extract it to a separate file that you import 
 * from later

*/
const drawAllCards = (deck: Deck): Card[] => {
  const cards: Card[] = [];

  for (let i = 0; i < 52; i++) {
    const card = deck.draw();

    if (card) {
      cards.push(card);
    }
  }

  return cards;
};
