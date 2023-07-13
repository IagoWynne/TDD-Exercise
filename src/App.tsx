import "./App.css";
import Blackjack from "./Blackjack/Blackjack";
import { Game } from "./Blackjack/Game";
import { Deck } from "./Blackjack/Deck";

function App() {
  const game = new Game(new Deck());
  return (
    <div className="app">
      <header className="app-header">Test-Driven-Development Workshop</header>
      <header className="app-header">Blackjack</header>
      <Blackjack game={game} />
    </div>
  );
}

export default App;
