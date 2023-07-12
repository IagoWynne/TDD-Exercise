export interface Card {
  value: number | string;
  faceUp: boolean;
}

export interface Deck {
  draw: (faceUp: boolean) => Card;
  reset: () => void;
}

export interface Game {
  startGame: () => { playerCards: Card[]; dealerCards: Card[] };
  calculateScore: (cards: Card[]) => number;
  hit: () => Card;
  stand: (cards: Card[], playerScore: number) => Card[];
}

export type GameState = "NOT_STARTED" | "IN_PROGRESS" | "WON" | "BUST" | "LOST" | "DRAW";