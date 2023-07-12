import { useState } from "react";
import "./Blackjack.css";
import { GameState, Card, Game } from "./types";

const Blackjack: React.FunctionComponent<{ game: Game }> = ({ game }) => {
  /*
   * requirements
   * Pressing the Start button should:
    * Start the game
    * Show the player cards
    * Show the player score
    * Show the dealer's face up card
    * Show the Hit button
    * Show the Stand button
    * Hide the Start button
    
   * Pressing the Hit button should:
    * Call the "hit" function on game
    * Show the new card to the player
    * Update the player's score
    * If the player goes bust, it should show the string "You went bust!"
    * If the player goes bust, it should hide the Hit and Stand buttons
    * If the player goes bust, it should show the Start button
    
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
  const [gameState, setGameState] = useState<GameState>("NOT_STARTED");
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [dealerScore, setDealerScore] = useState<number | null>(null);

  const onStart = () => {
    setGameState("IN_PROGRESS");

    const startingCards = game.startGame();

    setPlayerCards(startingCards.playerCards);
    setDealerCards(startingCards.dealerCards);

    setPlayerScore(game.calculateScore(playerCards));
  };

  const onHit = () => {};

  const onStand = () => {};

  return (
    <div className="game">
      <div className="game-buttons">
        {gameState !== "IN_PROGRESS" && (
          <button onClick={onStart}>Start Game</button>
        )}
        {gameState === "IN_PROGRESS" && (
          <>
            <button onClick={onHit}>Hit</button>
            <button onClick={onStand}>Stand</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Blackjack;
