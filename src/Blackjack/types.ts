export interface Card {
  value: number | string;
  suit: string;
  faceUp: boolean;
}

export interface IDeck {
  draw: (faceUp: boolean) => Card | null;
  reset: () => void;
}

export interface IGame {
  startGame: () => { playerCards: Card[]; dealerCards: Card[] };
  calculateScore: (cards: Card[]) => number;
  hit: () => Card;
  stand: (cards: Card[], playerScore: number) => Card[];
}

export type GameState = "NOT_STARTED" | "IN_PROGRESS" | "WON" | "BUST" | "LOST" | "DRAW";