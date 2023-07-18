import { useState } from "react";
import "./Blackjack.css";
import { GameState, Card, IGame } from "./types";

const Blackjack: React.FunctionComponent<{ game: IGame }> = ({ game }) => {
  const [gameState, setGameState] = useState<GameState>("NOT_STARTED");
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [dealerScore, setDealerScore] = useState<number | null>(null);

  const onStart = () => {
    setDealerScore(null);
    setPlayerCards([]);
    setDealerCards([]);

    const startingCards = game.startGame();

    setPlayerCards(startingCards.playerCards);
    setDealerCards(startingCards.dealerCards);

    const playerScore = game.calculateScore(startingCards.playerCards);
    setPlayerScore(playerScore);

    if (playerScore === 21) {
      setGameState("WON");
    } else {
      setGameState("IN_PROGRESS");
    }
  };

  const onHit = () => {
    /* requirements
     * Pressing the Hit button should:
     * Call the "hit" function on game
     * Show the new card to the player
     * Update the player's score
     * If the player goes bust, it should show the string "You went bust!"
     * If the player goes bust, it should hide the Hit and Stand buttons
     * If the player goes bust, it should show the Start button
     */

    // get a new card for the player
    const newCard = game.hit();
    const newHand = [...playerCards, newCard];
    setPlayerCards(newHand);

    // calculate the player's new score
    const newScore = game.calculateScore(newHand);
    setPlayerScore(newScore);

    if (newScore > 21) {
      setGameState("BUST");
    }
  };

  const onStand = () => {
    /* requirements
     * Pressing the Stand button should:
     * Call the "stand" function on game
     * Show the player the dealer's cards
     * Update and show the dealer's score
     * If the player's score > dealer's score, or the dealer goes bust, it should show "You Win!"
     * If the player's score < dealer's score, it should show "You Lose :("
     * If the player's score = dealer's score, it should show "Draw"
     * Hide the Hit and Stand buttons
     * Show the Start button
     */

    const finalDealerHand = game.stand(dealerCards, playerScore);
    const dealerScore = game.calculateScore(finalDealerHand);

    setDealerCards(finalDealerHand.map((card) => ({ ...card, faceUp: true })));
    setDealerScore(dealerScore);

    if (playerScore > dealerScore || dealerScore > 21) {
      setGameState("WON");
    } else if (playerScore < dealerScore) {
      setGameState("LOST");
    } else {
      setGameState("DRAW");
    }
  };

  return (
    <div className="game">
      {playerCards.length > 0 && (
        <>
        <h3>Player</h3>
          <div data-testid="player-cards">
            {playerCards.map((card, idx) => (
              <div key={idx} data-testid={`player-card-${idx}`}>
                {card.value} of {card.suit}
              </div>
            ))}
          </div>
          <div data-testid="player-score">Score: {playerScore}</div>
        </>
      )}
      {dealerCards.length > 0 && (
        <>
        <h3>Dealer</h3>
          <div data-testid="dealer-cards">
            {dealerCards.map((card, idx) => (
              <div key={idx} data-testid={`dealer-card-${idx}`}>
                {card.faceUp ? card.value : "??"} of{" "}
                {card.faceUp ? card.suit : "??"}
              </div>
            ))}
          </div>
          {dealerScore !== null && (
            <div data-testid="dealer-score">Dealer Score: {dealerScore}</div>
          )}
        </>
      )}
      {gameState === "WON" && <div data-testid="win-screen">You Win!</div>}
      {gameState === "LOST" && (
        <div data-testid="lose-screen">You lose :{"("}</div>
      )}
      {gameState === "DRAW" && <div data-testid="draw-screen">Draw</div>}
      {gameState === "BUST" && (
        <div data-testid="bust-screen">You went bust!</div>
      )}
      <div className="game-buttons">
        {gameState !== "IN_PROGRESS" && (
          <button data-testid="start-button" onClick={onStart}>
            Start Game
          </button>
        )}
        {gameState === "IN_PROGRESS" && (
          <>
            <button data-testid="hit-button" onClick={onHit}>
              Hit
            </button>
            <button data-testid="stand-button" onClick={onStand}>
              Stand
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Blackjack;
