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
    const startingCards = game.startGame();

    setPlayerCards(startingCards.playerCards);
    setDealerCards(startingCards.dealerCards);

    const playerScore = game.calculateScore(playerCards);
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
  };

  const onStand = () => {
    /* requirements
     * Pressing the Stand button should:
      * Call the "stand" function on game
      * Show the player the dealer's cards
      * Update and show the dealer's score
      * If the player's score > dealer's score, it should show "You Win!"
      * If the player's score < dealer's score, it should show "You Lose :("
      * If the player's score = dealer's score, it should show "Draw"
      * Hide the Hit and Stand buttons
      * Show the Start button
    */
  };

  return (
    <div className="game">
      {playerCards.length > 0 && (
        <>
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
        <div data-testid="dealer-cards">
          {dealerCards.map((card, idx) => (
            <div key={idx} data-testid={`dealer-card-${idx}`}>
              {card.faceUp ? card.value : "??"} of{" "}
              {card.faceUp ? card.suit : "??"}
            </div>
          ))}
        </div>
      )}
      {gameState === "WON" && <div data-testid="win-screen">You Win!</div>}
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
