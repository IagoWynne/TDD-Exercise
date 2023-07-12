import "./App.css";
import Blackjack from "./Blackjack/Blackjack";
import { BlackjackGame } from "./Blackjack/BlackjackGame";
import { FullDeck } from "./Blackjack/Deck";

function App() {
  const game = new BlackjackGame(new FullDeck());
  return (
    <div className="app">
      <header className="app-header">Test-Driven-Development Workshop</header>
      <header className="app-header">Blackjack</header>
      <Blackjack game={game} />
    </div>
  );
}

export default App;
