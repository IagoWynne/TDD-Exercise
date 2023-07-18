import { Game } from "../Game";
import { Card, IDeck } from "../types";

const mockDraw = jest.fn();
const mockReset = jest.fn();

const mockDeck: IDeck = {
  draw: mockDraw,
  reset: mockReset,
};

describe("BlackjackGame", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("startGame", () => {
    it("resets the deck", () => {
      // arrange
      const game = new Game(mockDeck);

      // act
      game.startGame();

      // assert
      expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it("returns two cards for the player and two for the dealer", () => {
      // arrange
      const game = new Game(mockDeck);

      // act
      const cards = game.startGame();

      // assert
      expect(cards.playerCards.length).toBe(2);
      expect(cards.dealerCards.length).toBe(2);
      expect(mockDraw).toHaveBeenCalledTimes(4);
    });

    it("draws cards in the correct order", () => {
      /* the correct order is:
       * draw one card for the player
       * draw one card for the dealer
       * draw one card for the player
       * draw one card for the dealer
       */

      // arrange
      const playerCard1 = { suit: "hearts", value: 3, faceUp: true };
      const playerCard2 = { suit: "spades", value: "ace", faceUp: true };
      const dealerCard1 = { suit: "diamond", value: "Queen", faceUp: true };
      const dealerCard2 = { suit: "clubs", value: 5, faceUp: true };

      mockDraw
        .mockImplementationOnce(() => playerCard1)
        .mockImplementationOnce(() => dealerCard1)
        .mockImplementationOnce(() => playerCard2)
        .mockImplementationOnce(() => dealerCard2);

      const game = new Game(mockDeck);

      // act
      const cards = game.startGame();

      // assert
      expect(cards.playerCards[0]).toBe(playerCard1);
      expect(cards.dealerCards[0]).toBe(dealerCard1);
      expect(cards.playerCards[1]).toBe(playerCard2);
      expect(cards.dealerCards[1]).toBe(dealerCard2);
    });

    it("should draw all player cards and the first dealer card face up and the last dealer card face down", () => {
      // arrange
      const game = new Game(mockDeck);

      // act
      game.startGame();

      // assert
      expect(mockDraw).toHaveBeenNthCalledWith(1, true);
      expect(mockDraw).toHaveBeenNthCalledWith(2, true);
      expect(mockDraw).toHaveBeenNthCalledWith(3, true);
      expect(mockDraw).toHaveBeenNthCalledWith(4, false);
    });
  });

  describe("calculateScore", () => {
    // my initial thoughts on what scenarios to test:
    // check that the score is correct without an ace
    // check that the score is correct with an ace when the sum of the other cards is <= 10
    // check that the score is correct with an ace when the sum of the other cards is > 10
    // check that the score is correct with multiple aces

    it("returns the correct score when there are no aces", () => {
      // arrange
      // thoughts: use multiple hands to do a couple of checks here
      // created a 'generateCard' function since I know I'm going to be making many cards for the next few tests!
      const hand1 = [generateCard(3), generateCard(2)];
      // hand2 has more cards in - just checking that we don't stop after the first card!
      const hand2 = [generateCard(7), generateCard("Queen"), generateCard(4)];
      // hand3 covers Jack/King as well
      const hand3 = [
        generateCard("Jack"),
        generateCard("King"),
        generateCard(7),
        generateCard(3),
      ];

      const expectedScore1 = 5;
      const expectedScore2 = 21;
      const expectedScore3 = 30;

      const game = new Game(mockDeck);

      // act
      // run 'calculateScore' for each hand, storing the result since we want to compare it
      const result1 = game.calculateScore(hand1);
      const result2 = game.calculateScore(hand2);
      const result3 = game.calculateScore(hand3);

      // assert
      // and finally, state what we expect the result should be
      expect(result1).toBe(expectedScore1);
      expect(result2).toBe(expectedScore2);
      expect(result3).toBe(expectedScore3);
    });

    it("treats an Ace as 11 when the sum of the other cards is <= 10", () => {
      // arrange
      // some thoughts on hands to test:
      // one with ace + face card
      // one with ace + cards that add up to 10
      // one with ace + cards that add up to < 10

      const hand1 = [generateCard("Ace"), generateCard("King")]; // score: 21
      const hand2 = [generateCard(7), generateCard(3), generateCard("Ace")]; // score: 21
      const hand3 = [generateCard(3), generateCard(2), generateCard("Ace")]; // score: 16

      const expectedScore1 = 21;
      const expectedScore2 = 21;
      const expectedScore3 = 16;

      const game = new Game(mockDeck);

      // act
      const result1 = game.calculateScore(hand1);
      const result2 = game.calculateScore(hand2);
      const result3 = game.calculateScore(hand3);

      // assert
      expect(result1).toBe(expectedScore1);
      expect(result2).toBe(expectedScore2);
      expect(result3).toBe(expectedScore3);
    });

    it("treats an Ace as 1 when the sum of the other cards is > 10", () => {
      // arrange
      // we probably want a hand with a score of 11 + Ace
      // and maybe another hand with a more mid-range score

      const hand1 = [generateCard(7), generateCard(4), generateCard("Ace")];
      const hand2 = [
        generateCard("Queen"),
        generateCard(5),
        generateCard("Ace"),
      ];

      const expectedScore1 = 12;
      const expectedScore2 = 16;

      const game = new Game(mockDeck);

      // act
      const result1 = game.calculateScore(hand1);
      const result2 = game.calculateScore(hand2);

      // assert
      expect(result1).toBe(expectedScore1);
      expect(result2).toBe(expectedScore2);
    });

    it("treats multiple aces correctly", () => {
      // arrange
      // we know that a deck can have up to four aces, so let's do a hand with 2 aces and a hand with 4 aces
      // we should also check that aces can be treated as both 11 and 1 within the same hand

      // first ace in this hand should be treated as 11, second one 1
      const hand1 = [generateCard("Ace"), generateCard("Ace"), generateCard(5)];
      // I don't know if this is the luckiest hand ever or not... in blackjack, probably not!
      const hand2 = [
        generateCard(2),
        generateCard("Ace"),
        generateCard("Ace"),
        generateCard("Ace"),
        generateCard("Ace"),
      ];

      const expectedScore1 = 17; // 11 + 1 + 5
      const expectedScore2 = 16; // 2 + 11 + 1 + 1 + 1

      const game = new Game(mockDeck);

      // act
      const result1 = game.calculateScore(hand1);
      const result2 = game.calculateScore(hand2);

      // assert
      expect(result1).toBe(expectedScore1);
      expect(result2).toBe(expectedScore2);
    });
  });

  describe("hit", () => {
    it("draws a card from the deck and returns it", () => {
      // arrange
      const expectedCard = { value: 5, suit: "hearts", faceUp: true };

      mockDraw.mockImplementationOnce(() => expectedCard);

      const game = new Game(mockDeck);

      // act
      const result = game.hit();

      // assert
      expect(mockDraw).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedCard);
    });
  });

  describe("stand", () => {
    /* thoughts on scenarios
     * 1. playerScore = 21, initial hand value is low. Draw cards until score is 18
     * 2. playerScore = 15, initial hand value is 16. Draw no cards
     * 3. playerScore = 15, initial hand value is 12. Draw cards until score > 15
     * 4. playerScore = 16, initial hand value is 12. Draw cards until score = 16
     */

    it("should draw cards until the score is > 17", () => {
      // arrange
      const playerScore = 21;
      const dealerHand = [generateCard(3), generateCard(5)]; // score is 8

      // creating the cards here so we can check they're in the returned hand
      const cardsToDraw = [generateCard(5), generateCard(5)];

      // we can use our mockDraw function to determine the exact order of cards that are drawn
      mockDraw
        .mockImplementationOnce(() => cardsToDraw[0]) // score will be 13 here
        .mockImplementationOnce(() => cardsToDraw[1]); // score will be 18 here

      const game = new Game(mockDeck);

      // act
      const finalHand = game.stand(dealerHand, playerScore);

      // assert
      // we expect the final hand to contain all the original cards, plus the cards we made the mock draw return
      expect(finalHand).toContain(dealerHand[0]);
      expect(finalHand).toContain(dealerHand[1]);
      expect(finalHand).toContain(cardsToDraw[0]);
      expect(finalHand).toContain(cardsToDraw[1]);
    });

    it("should draw no cards if the dealer's score initial score beats the player's score", () => {
      // arrange
      const playerScore = 15;
      const dealerHand = [generateCard(5), generateCard("Ace")];

      const game = new Game(mockDeck);

      // act
      // we're just going to check that no cards were drawn - we don't care about checking the cards here
      game.stand(dealerHand, playerScore);

      // assert
      expect(mockDraw).not.toHaveBeenCalled();
    });

    it("should draw cards until the dealer's score beats the player's score", () => {
      // arrange
      const playerScore = 15;
      const dealerHand = [generateCard(5), generateCard(7)];

      // the aces will be treated as 1 in both cases, add a 2 for a final score of 16
      const cardsToDraw = [
        generateCard("Ace"),
        generateCard("Ace"),
        generateCard(2),
      ];

      mockDraw
        .mockImplementationOnce(() => cardsToDraw[0])
        .mockImplementationOnce(() => cardsToDraw[1])
        .mockImplementationOnce(() => cardsToDraw[2]);

      const game = new Game(mockDeck);

      // act
      const finalHand = game.stand(dealerHand, playerScore);

      // assert
      // if you want to check each object in an array is in another array, you can use .forEach
      dealerHand.forEach((card) => expect(finalHand).toContain(card));
      cardsToDraw.forEach((card) => expect(finalHand).toContain(card));
    });

    it("should draw cards until the dealer's score equals the player's score", () => {
      // arrange
      const playerScore = 16;
      const dealerHand = [generateCard(5), generateCard(7)];

      // the aces will be treated as 1 in both cases, add a 2 for a final score of 16
      const cardsToDraw = [
        generateCard(2),
        generateCard(2),
      ];

      mockDraw
        .mockImplementationOnce(() => cardsToDraw[0])
        .mockImplementationOnce(() => cardsToDraw[1]);

      const game = new Game(mockDeck);

      // act
      const finalHand = game.stand(dealerHand, playerScore);

      // assert
      // if you want to check each object in an array is in another array, you can use .forEach
      dealerHand.forEach((card) => expect(finalHand).toContain(card));
      cardsToDraw.forEach((card) => expect(finalHand).toContain(card));
    });
  });
});

const generateCard = (value: number | string): Card => ({
  value,
  suit: "hearts",
  faceUp: true,
});
