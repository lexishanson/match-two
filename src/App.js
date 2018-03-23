import React, { Component } from 'react';

import Card from './Card';
import Game from './Game';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Match Two</h1>
        </header>
        <p className="App-intro">
          To get started, <code>click Start</code>
        </p>
        <Game />
      </div>
    );
  }
}

export default App;
