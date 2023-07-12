import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        Test-Driven-Development Workshop
      </header>
      <header className='app-header'>
        Blackjack
      </header>
      <div className="app-body">
        <div>Dealer Cards: ??</div>
        <div>User Cards: ??</div>
        <div>User Score: ??</div>
        <div className="app-buttons">
          <button>Start Game</button>
          <button>Hit</button>
          <button>Stand</button>
        </div>
      </div>
    </div>
  );
}

export default App;
