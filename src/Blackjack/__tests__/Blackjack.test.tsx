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
        // find a container for the player cards, and the cards themselves - test fails if this can't find the element
        const playerCards = screen.getByTestId("player-cards");
        const playerCard1 = screen.getByTestId("player-card-0"); //remember that javascript arrays are 0-indexed!
        const playerCard2 = screen.getByTestId("player-card-1");

        expect(playerCards).toBeInTheDocument();
        expect(playerCard1).toBeInTheDocument();
        expect(playerCard2).toBeInTheDocument();
        // we check the text content of each card
        expect(playerCard1.textContent).toBe("5 of hearts");
        expect(playerCard2.textContent).toBe("3 of spades");
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
        const dealerCard1 = screen.getByTestId("dealer-card-0");
        const dealerCard2 = screen.getByTestId("dealer-card-1");

        expect(dealerCards).toBeInTheDocument();
        expect(dealerCard1).toBeInTheDocument();
        expect(dealerCard2).toBeInTheDocument();
        // we check the text content of each child. First one is face up, so we expect the card value
        expect(dealerCard1.textContent).toBe("ace of diamonds");
        // second one is face down, so we expect the value and suit to be hidden
        expect(dealerCard2.textContent).toBe("?? of ??");
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
      it("shows 'You Win!'", () => {
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

      it("shows the Start button", () => {
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

      it("does not show the Hit or Stand buttons", () => {
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
    beforeEach(() => {
      // before every test here, we will want the game to have started
      // we can put that code here and make sure our component is in the same state before each test

      render(<Blackjack game={mockGame} />);

      mockStartGame.mockReturnValueOnce({
        playerCards: [
          { value: 5, suit: "hearts", faceUp: true },
          { value: 3, suit: "spades", faceUp: true },
        ],
        dealerCards: [],
      });

      const startButton = screen.getByTestId("start-button");

      // we still have to wrap the click in "act" since it changes the component state
      act(() => startButton.click());

      // reset mocks so that we don't have to worry about mock executions from setup
      jest.resetAllMocks();

      // set up mockHit implementation so we don't get errors
      mockHit.mockImplementation(() => ({
        value: "queen",
        suit: "hearts",
        faceUp: true,
      }));
    });

    describe("general play", () => {
      it("calls hit", () => {
        // arrange
        const hitButton = screen.getByTestId("hit-button");

        // act
        act(() => hitButton.click());

        // assert
        expect(mockHit).toHaveBeenCalledTimes(1);
      });

      it("displays the player's new card", () => {
        // arrange
        mockHit.mockImplementationOnce(() => ({
          value: "ace",
          suit: "diamonds",
          faceUp: true,
        }));

        const hitButton = screen.getByTestId("hit-button");

        // act
        act(() => hitButton.click());

        // assert
        // we know that there are already two cards on display, so our new card should be the third
        const newCard = screen.getByTestId("player-card-2"); // 0-indexed!

        expect(newCard.textContent).toBe("ace of diamonds");
      });

      it("calculates and displays the player's new score", () => {
        // arrange
        const scoreDisplay = screen.getByTestId("player-score");

        mockCalcScore.mockImplementationOnce(() => 17);

        const hitButton = screen.getByTestId("hit-button");

        // act
        act(() => hitButton.click());

        // assert
        expect(scoreDisplay.textContent).toBe("Score: 17");
      });
    });

    describe("player goes bust", () => {
      it("shows 'You went bust!'", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 22);

        const hitButton = screen.getByTestId("hit-button");

        // act
        act(() => hitButton.click());

        // assert
        const bustScreen = screen.getByTestId("bust-screen");

        expect(bustScreen.textContent).toBe("You went bust!");
      });

      it("hides the Hit and Stand buttons", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 22);

        const hitButton = screen.getByTestId("hit-button");
        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => hitButton.click());

        // assert
        expect(hitButton).not.toBeInTheDocument();
        expect(standButton).not.toBeInTheDocument();
      });

      it("shows the Start button", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 22);

        const hitButton = screen.getByTestId("hit-button");

        // act
        act(() => hitButton.click());

        // assert
        const startButton = screen.getByTestId("start-button");
        expect(startButton).toBeInTheDocument();
      });
    });
  });

  describe("stand", () => {
    beforeEach(() => {
      // before every test here, we will want the game to have started
      // we can put that code here and make sure our component is in the same state before each test

      render(<Blackjack game={mockGame} />);

      mockStartGame.mockReturnValueOnce({
        playerCards: [],
        dealerCards: [
          { value: 4, suit: "clubs", faceUp: true },
          { value: 6, suit: "diamonds", faceUp: false },
        ],
      });

      const startButton = screen.getByTestId("start-button");

      // mocking a player score so we can check win/draw/lose conditions
      mockCalcScore.mockImplementationOnce(() => 20);

      // we still have to wrap the click in "act" since it changes the component state
      act(() => startButton.click());

      // reset mocks so that we don't have to worry about mock executions from setup
      jest.resetAllMocks();

      // set up mockHit implementation so we don't get errors
      mockStand.mockImplementation(() => [
        { value: 4, suit: "clubs", faceUp: true },
        { value: 6, suit: "diamonds", faceUp: false },
        { value: "ace", suit: "hearts", faceUp: true },
      ]);
    });

    describe("general behaviour", () => {
      it("calls the stand function", () => {
        // arrange
        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        expect(mockStand).toHaveBeenCalledTimes(1);
      });

      it("shows all the dealer's cards", () => {
        // arrange
        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const dealerCard1 = screen.getByTestId("dealer-card-0");
        const dealerCard2 = screen.getByTestId("dealer-card-1");
        const dealerCard3 = screen.getByTestId("dealer-card-2");

        // we're using the mock implementation we set up in beforeEach for these cards
        expect(dealerCard1.textContent).toBe("4 of clubs");
        expect(dealerCard2.textContent).toBe("6 of diamonds");
        expect(dealerCard3.textContent).toBe("ace of hearts");
      });

      it("calls calculate score with the dealer's hand", () => {
        // arrange
        const finalHand = [
          { value: 4, suit: "clubs", faceUp: true },
          { value: 6, suit: "diamonds", faceUp: false },
          { value: "ace", suit: "hearts", faceUp: true },
        ];
        mockStand.mockImplementation(() => finalHand);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        expect(mockCalcScore).toHaveBeenCalledTimes(1);
        expect(mockCalcScore).toHaveBeenCalledWith(finalHand);
      });

      it("displays the dealer's score", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 19);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const dealerScore = screen.getByTestId("dealer-score");

        expect(dealerScore).toBeInTheDocument();
        expect(dealerScore.textContent).toBe("Dealer Score: 19");
      });
    });

    describe("if the player score is higher than the dealer score", () => {
      it("shows 'You Win!'", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 19);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const winScreen = screen.getByTestId("win-screen");

        expect(winScreen.textContent).toBe("You Win!");
      });

      it("hides the Hit and Stand buttons", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 19);

        const hitButton = screen.getByTestId("hit-button");
        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        expect(hitButton).not.toBeInTheDocument();
        expect(standButton).not.toBeInTheDocument();
      });

      it("shows the Start button", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 19);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const startButton = screen.getByTestId("start-button");
        expect(startButton).toBeInTheDocument();
      });
    });

    describe("dealer goes bust", () => {
      it("shows 'You Win!'", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 22);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const winScreen = screen.getByTestId("win-screen");

        expect(winScreen.textContent).toBe("You Win!");
      });

      it("hides the Hit and Stand buttons", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 22);

        const hitButton = screen.getByTestId("hit-button");
        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        expect(hitButton).not.toBeInTheDocument();
        expect(standButton).not.toBeInTheDocument();
      });

      it("shows the Start button", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 22);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const startButton = screen.getByTestId("start-button");
        expect(startButton).toBeInTheDocument();
      });
    });

    describe("if the player score is lower than the dealer score", () => {
      it("shows 'You lose :('", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 21);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const winScreen = screen.getByTestId("lose-screen");

        expect(winScreen.textContent).toBe("You lose :(");
      });

      it("hides the Hit and Stand buttons", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 21);

        const hitButton = screen.getByTestId("hit-button");
        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        expect(hitButton).not.toBeInTheDocument();
        expect(standButton).not.toBeInTheDocument();
      });

      it("shows the Start button", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 21);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const startButton = screen.getByTestId("start-button");
        expect(startButton).toBeInTheDocument();
      });
    });

    describe("if the player score equals the dealer score", () => {
      it("shows 'Draw'", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 20);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const winScreen = screen.getByTestId("draw-screen");

        expect(winScreen.textContent).toBe("Draw");
      });

      it("hides the Hit and Stand buttons", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 20);

        const hitButton = screen.getByTestId("hit-button");
        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        expect(hitButton).not.toBeInTheDocument();
        expect(standButton).not.toBeInTheDocument();
      });

      it("shows the Start button", () => {
        // arrange
        mockCalcScore.mockImplementationOnce(() => 20);

        const standButton = screen.getByTestId("stand-button");

        // act
        act(() => standButton.click());

        // assert
        const startButton = screen.getByTestId("start-button");
        expect(startButton).toBeInTheDocument();
      });
    });
  });
});
