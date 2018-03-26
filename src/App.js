import React, { Component } from 'react';

import Game from './Game';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Match Two</h1>
        </header>
        <p className="App-intro">
          To get started, click <code>"Play Alone" </code>
          or <code>"Play Against Computer"</code>
        </p>
        <Game />
      </div>
    );
  }
}

export default App;
