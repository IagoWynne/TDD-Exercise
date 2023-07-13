import { act, render, screen } from "@testing-library/react";
import Blackjack from "../Blackjack";
import { IGame } from "../types";

/* Question: mockStartGame? mockGame? What's going on here?
 * Answer: We're only testing the behaviour of the Blackjack component here - we don't care what the Game does!
 * So we can create a pretend version - a mock. We can control the behaviour of the mock completely. This lets us
 * check when functions are called, supply specific values to be returned, and a whole bunch of other useful
 * test things.
 *
 * This is especially useful to avoid calls to databases or APIs.
 *
 * With typescript, our mock object needs to have the same shape (i.e. same methods and properties) as the
 * real object.
 *
 * In raw javascript, you don't necessarily need to put every function on the object. Jest also has some useful
 * functions to mock entire objects that I've not used here.
 */
const mockStartGame = jest.fn();
const mockCalcScore = jest.fn();
const mockHit = jest.fn();
const mockStand = jest.fn();

const mockGame: IGame = {
  startGame: mockStartGame,
  calculateScore: mockCalcScore,
  hit: mockHit,
  stand: mockStand,
};

describe("Blackjack", () => {
  beforeEach(() => {
    /* This function runs before every test in the suite
     * We want to reset all mock usage data here so that the order we run the tests in doesn't matter.
     * Unfortunately, this also clears any mock return values, so we have to redo that each time here
     */
    jest.resetAllMocks();

    mockStartGame.mockReturnValue({ playerCards: [], dealerCards: [] });
    mockCalcScore.mockReturnValue(0);
  });

  describe("start game", () => {
    describe("normal start", () => {
      it("calls startGame", () => {
        // arrange
        // we render our component
        render(<Blackjack game={mockGame} />);

        // act
        /* we find the start game button using the data-testid attribute
         * There are other ways to do this, but data-testid is good practice if possible
         * The data-testid attribute can also be used by automation testers to find elements
         */
        const startButton = screen.getByTestId("start-button");

        // because clicking the button will change the state of the component, we wrap it in 'act'
        act(() => {
          startButton.click();
        });

        // assert
        // we confirm that the mock function was called the correct number of times
        expect(mockGame.startGame).toHaveBeenCalledTimes(1);
      });

      it("shows the player their cards", () => {
        // arrange
        // we start by setting up our mock start with some mock cards so we can find them
        mockStartGame.mockReturnValueOnce({
          playerCards: [
            { value: 5, suit: "hearts", faceUp: true },
            { value: 3, suit: "spades", faceUp: true },
          ],
          dealerCards: [],
        });
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");
        act(() => {
          startButton.click();
        });

        // assert
        // find a container for the player cards - test fails if this can't find the element
        const playerCards = screen.getByTestId("player-cards");

        expect(playerCards).toBeInTheDocument();
        // we know we've got two cards at the start of the game... so there should be two child containers
        expect(playerCards.children.length).toBe(2);
        // we check the text content of each child to confirm that both our cards are there
        expect(playerCards.children[0].textContent).toBe("5 of hearts");
        expect(playerCards.children[1].textContent).toBe("3 of spades");
      });

      it("shows the player their score", () => {
        // arrange
        mockStartGame.mockReturnValueOnce({
          playerCards: [
            { value: 5, suit: "hearts", faceUp: true },
            { value: 3, suit: "spades", faceUp: true },
          ],
          dealerCards: [],
        });
        mockCalcScore.mockReturnValueOnce(17);
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");
        act(() => {
          startButton.click();
        });

        // assert
        const playerScore = screen.getByTestId("player-score");

        expect(playerScore).toBeInTheDocument();
        expect(playerScore.textContent).toBe("Score: 17");
      });

      it("shows the dealer's face up card value and hides the face down card value", () => {
        // arrange
        mockStartGame.mockReturnValueOnce({
          playerCards: [],
          dealerCards: [
            { value: "ace", suit: "diamonds", faceUp: true },
            { value: 7, suit: "spades", faceUp: false },
          ],
        });
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");
        act(() => {
          startButton.click();
        });

        // assert
        const dealerCards = screen.getByTestId("dealer-cards");

        expect(dealerCards).toBeInTheDocument();
        // the dealer has two cards at the start of the game
        expect(dealerCards.children.length).toBe(2);
        // we check the text content of each child. First one is face up, so we expect the card value
        expect(dealerCards.children[0].textContent).toBe("ace of diamonds");
        // second one is face down, so we expect the value and suit to be hidden
        expect(dealerCards.children[1].textContent).toBe("?? of ??");
      });

      it("shows the Hit button", () => {
        // arrange
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");

        act(() => {
          startButton.click();
        });

        // assert
        const hitButton = screen.getByTestId("hit-button");

        expect(hitButton).toBeInTheDocument();
        expect(hitButton.textContent).toBe("Hit");
      });

      it("shows the Stand button", () => {
        // arrange
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");

        act(() => {
          startButton.click();
        });

        // assert
        const standButton = screen.getByTestId("stand-button");

        expect(standButton).toBeInTheDocument();
        expect(standButton.textContent).toBe("Stand");
      });

      it("hides the Start button", () => {
        // arrange
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");

        act(() => {
          startButton.click();
        });

        // assert
        expect(startButton).not.toBeInTheDocument();
      });
    });

    // what happens if the player wins outright?
    describe("player gets a blackjack", () => {
      it("shows 'You Win!' if the player's score is 21", () => {
        // arrange
        mockCalcScore.mockReturnValueOnce(21);
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");
        act(() => {
          startButton.click();
        });

        // assert
        const winScreen = screen.getByTestId("win-screen");

        expect(winScreen.textContent).toBe("You Win!");
      });

      it("shows the Start button if the player's score is 21", () => {
        // arrange
        mockCalcScore.mockReturnValueOnce(21);
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");
        act(() => {
          startButton.click();
        });

        // assert
        expect(startButton).toBeInTheDocument();
      });

      it("does not show the Hit or Stand buttons of the player's score is 21", () => {
        // arrange
        mockCalcScore.mockReturnValueOnce(21);
        render(<Blackjack game={mockGame} />);

        // act
        const startButton = screen.getByTestId("start-button");
        act(() => {
          startButton.click();
        });

        // assert
        // we know that "getByTestId" will throw an error if can't find the element
        // queryByTestId will not throw an error, so we use that instead
        const hitButton = screen.queryAllByTestId("hit-button");
        const standButton = screen.queryAllByTestId("stand-button");

        expect(hitButton.length).toBe(0);
        expect(standButton.length).toBe(0);
      });
    });
  });

  describe("hit", () => {
    // worked example
  });

  describe("stand", () => {
    // write some tests here
  });
});
