# TDD - Building a Blackjack Game

Goal: To build a blackjack game react app using the principles of test-driven development.

You can ignore everything that isn't in `/src/Blackjack` - this is all just code for running the react app.

Within the blackjack folder is:
- `__tests__` - this folder contains all the test files

- `Deck.ts` - an example file that has already been written in a TDD manner. We will go through this file and its tests before we start the exercise.
- `Game.ts` - a file with just the basics added so the code compiles. We will do some of the tests and code for this as a worked example
- `Blackjack.tsx` - this is the react component for the game. The code to start the game has already been written and tested. We will go through this during the exercise, and do the tests and code for another function as a worked example.
  - Note: `Blackjack.css` contains all the css for this... it's not really got much in there. Once you have completed the tests and app, you can fiddle with the css if you want to make it look pretty.
- `types.ts` - this contains some types that have been set up to represent the data. You shouldn't need to edit this, but can if you want.

## Running the Code
- To run the tests, use `npm test`
  - This will run the tests in watch mode - whenever you make a change to the tests or the code, this will re-run all the tests. There are other ways to do this, and most SBG projects don't actually do it this way.
- You won't really be running the app much today unless you finish the exercise. If you want to, you can use `npm start`
- The original create-react-app readme is included if you want to refer to it.

## Aside: How to play Blackjack
- Goal: beat the dealer's hand without scoring more than 21
- You are dealt two cards at the start of the round and add up their values
- Cards 2-10 have face value; King, Queen, Jack are worth 10; Aces are 1 or 11 - your choice
- You can ask the dealer to deal you another card ("Hit")
- If you do not want any more cards at all, you "Stand"
- If you go over 21, you have gone "Bust"
- The dealer is also dealt two cards at the start of the round, one face up, and one face down. Once you have decided to "Stand", the dealer then reveals their face down card and can also choose to "hit" to try and reach 21 or "stand"
- The winner is whoever has the highest hand without going bust

## Aside: How to play Blackjack - some example hands

| Cards | Score |
| --- | ---|
| 5, 8 | 13 |
| Queen, King | 20 |
| Jack, 9 | 19 |
| Jack, Ace | 21 (Blackjack!) |
| 5, 8, Queen | 23 (Bust) |
| Queen, King, Ace | 21 |
| Jack, 9, Ace | 20 |