import React, { Component } from 'react';
import Card from './Card';
import GameOver from './GameOver';
import { shuffle, suitSymbol } from './helpers';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      deck: shuffle(this.initialCards()),
      flippedCardsIndices: [],
      gameOver: false,
      gameType: null,
      matchedCards: {},
      matches: [],
      statusMessage: 'Click two cards to start',
      turn: 'p1'
    };
  }

  initialCards = () => {
    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    const values = [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K'
    ];

    return Array(52)
      .fill(1)
      .map((card, index) => ({
        suit: suits[index % suits.length],
        value: values[index % values.length],
        location: index
      }));
  };

  key = card => card.value + card.suit;

  playComputerMove = () => {
    const randomIndex = () => Math.floor(Math.random() * 52);
    const indexes = [randomIndex(), randomIndex()];
    this.setState(state => ({
      ...state,
      statusMessage: `Computer flips: ${indexes}`,
      flippedCardsIndices: indexes
    }));
    setTimeout(this.checkForMatch, 500);
  };

  checkForMatch = () => {
    this.setState(state => {
      console.log('checkForMatch', state);
      let {
        deck,
        gameType,
        matches,
        matchedCards,
        flippedCardsIndices,
        turn
      } = state;
      const cardOne = deck[flippedCardsIndices[0]];
      const cardTwo = deck[flippedCardsIndices[1]];
      const cards = [cardOne, cardTwo];
      const match = { cards, owner: turn };
      const isMatch =
        cardOne.value === cardTwo.value && cardOne.suit !== cardTwo.suit;
      matches = isMatch ? [...matches, match] : matches;
      const newState = {
        ...state,
        matchedCards: isMatch
          ? {
              ...matchedCards,
              [this.key(cardOne)]: true,
              [this.key(cardTwo)]: true
            }
          : matchedCards,
        matches,
        statusMessage: isMatch ? "Congrats, that's a match!" : 'Not a match',
        flippedCardsIndices: [],
        gameOver: matches.length === deck.length / 2,
        turn: gameType === 'single' ? 'p1' : turn === 'p1' ? 'p2' : 'p1'
      };
      if (newState.gameType === '2-player' && newState.turn === 'p2') {
        setTimeout(this.playComputerMove, 1000);
      }
      return newState;
    });
  };

  gameOver = () => {};

  getWinner = () => {
    let p1Matches = 0;
    let p2Matches = 0;
    this.state.matches.map(match => {
      match.owner === 'p1' ? p1Matches++ : p2Matches++;
    });
    if (p1Matches === p2Matches) {
      return { winner: 'Tie', count: p1Matches };
    } else if (p1Matches > p2Matches) {
      return { winner: 'You', count: p1Matches };
    }
    return { winner: 'Computer', count: p2Matches };
  };

  matchedCards = ownerToFindMatchesFor => {
    if (this.state.gameType === '2-player') {
      return this.state.matches
        .filter(({ owner }) => owner === ownerToFindMatchesFor)
        .map(({ cards, owner }) => (
          <li className="pairs">
            {cards[0].value} {suitSymbol(cards[0].suit)}{' '}
            {suitSymbol(cards[1].suit)}
          </li>
        ));
    }
    return this.state.matches.map(({ cards }) => (
      <li className="pairs">
        {cards[0].value} {suitSymbol(cards[0].suit)} {suitSymbol(cards[1].suit)}
      </li>
    ));
  };

  matchesSection = () => {
    return this.state.gameType === '2-player' ? (
      <div className="player-wrapper">
        <div className="player-1">
          <p>Your Matches</p>
          <ul className="matches-list">{this.matchedCards('p1')}</ul>
        </div>
        <div className="player-2">
          <p>Computer's Matches</p>
          <ul className="matches-list">{this.matchedCards('p2')}</ul>
        </div>
        <p>{`Matches so far ${this.state.matches.length}`}</p>
      </div>
    ) : (
      <div className="single-player-wrapper">
        <p>Your Matches</p>
        <ul className="matches-list">{this.matchedCards('p1')}</ul>
        <p>{`Matches so far: ${this.state.matches.length}`}</p>
      </div>
    );
  };

  onCardClick = card => e => {
    const { gameType, turn, flippedCardsIndices } = this.state;
    const isComputerMove = gameType === '2-player' && turn === 'p2';
    if (flippedCardsIndices.length >= 2 || isComputerMove) {
      return;
    }
    this.setState(state => {
      let { flippedCardsIndices } = state;
      flippedCardsIndices.push(card.location);
      if (flippedCardsIndices.length === 2) {
        setTimeout(this.checkForMatch, 500);
      }
      return {
        ...state,
        statusMessage: `${flippedCardsIndices.length} flipped`,
        flippedCardsIndices
      };
    });
  };

  renderBoard = () => {
    if (this.state.gameOver) {
      return (
        <div>
          <div className="game-over">Game Over!</div>
          {this.state.gameType === '2-player' && (
            <div className="winner">{`Winner: ${this.getWinner().winner} with ${
              this.getWinner().count
            } matches`}</div>
          )}
          <button onClick={() => this.restartGame()}>Play Again</button>
          <div className="matches-wrapper">{this.matchesSection()}</div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="match-status">{`${this.state.statusMessage}`}</div>
          <div className="matches-wrapper">{this.matchesSection()}</div>
          <div className="game">{this.renderCards()}</div>
        </div>
      );
    }
  };

  renderCards = () => {
    return this.state.deck.map(
      (card, index) =>
        this.state.matchedCards[card.value + card.suit] ? (
          <div key={`${card.value}-${card.suit}`} className="matched">
            ✓
          </div>
        ) : (
          <Card
            id={`${card.value}-${card.suit}`}
            key={`${card.value}-${card.suit}`}
            value={card.value}
            suit={card.suit}
            flipped={this.state.flippedCardsIndices.indexOf(index) > -1}
            onClick={this.onCardClick(card)}
          />
        )
    );
  };

  restartGame = () =>
    this.setState(state => ({
      ...state,
      deck: shuffle(this.initialCards()),
      flippedCardsIndices: [],
      gameOver: false,
      gameType: null,
      matchedCards: {},
      matches: [],
      statusMessage: 'Click two cards to start',
      turn: 'p1'
    }));

  setGameType = type => () => {
    console.log('type selected', type);
    return this.setState(state => {
      return {
        ...state,
        gameType: type
      };
    });
  };

  showPlayOptions = () => {
    return (
      <div>
        <button onClick={this.setGameType('single')}>By Myself</button>
        <button onClick={this.setGameType('2-player')}>Against Computer</button>
      </div>
    );
  };

  render() {
    return this.state.gameType === null
      ? this.showPlayOptions()
      : this.renderBoard();
  }
}

export default Game;
