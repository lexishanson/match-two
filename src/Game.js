import React, { Component } from 'react';
import Card from './Card';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      deck: this.initialCards(),
      matches: {},
      flippedCardsIndices: [],
      statusMessage: 'Click two cards to start'
      // value, location
      // {value: [suit: 'hearts', location: 4]}
      // going to want a list of matches: value, suit
      // going to want to know location and not render it
      // if card in matches...
    };
  }
  // this.state.deck[flippedCardsIndices].value === card.value
  checkMatch = card => {
    const { deck, flippedCardsIndices } = this.state;
    const sameCardClicked = flippedCardsIndices[0] === card.location;
    const bothCardsMatchValue =
      deck[flippedCardsIndices[0]].value === card.value;
    if (sameCardClicked || !bothCardsMatchValue) {
      return false;
    }
    return true;
  };

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
        // flipped: false,
        // matched: false,
        location: index
      }));
  };

  onCardClick = card => e => {
    if (this.state.flippedCardsIndices.length > 1) {
      return;
    }
    this.setState(prevState => {
      let { deck, flippedCardsIndices, matches } = prevState;
      flippedCardsIndices.push(card.location);
      const isSecondFlip = flippedCardsIndices.length === 2;
      if (isSecondFlip) {
        const isMatch = this.checkMatch(card);
        if (isMatch) {
          let matchPair = flippedCardsIndices.map((i, j) => {
            return deck[flippedCardsIndices[j]];
          });
          const newMatch = matches[card.value]
            ? matches[card.value].concat(matchPair)
            : matchPair;
          matches = { ...matches, [card.value]: newMatch };
        }
        setTimeout(() => {
          this.unflipCards(card, deck, flippedCardsIndices);
          this.renderCards();
          isMatch
            ? this.setState({ statusMessage: "Congrats, that's a match!" })
            : this.setState({ statusMessage: 'Not a match' });
        }, 500);
      }
      return {
        ...prevState,
        deck,
        matches,
        statusMessage: '...',
        flippedCardsIndices
      };
    });
  };

  renderCards = () => {
    const { deck, matches } = this.state;
    return deck.map((card, index) => {
      const cardNotMatched = () => {
        if (matches[card.value]) {
          return matches[card.value].every(matchedValue => {
            return matchedValue.suit !== card.suit;
          });
        }
        return true;
      };
      if (card && cardNotMatched())
      // need to build way to check for wins. when no cards are rendered.
        return (
          <Card
            id={`${card.value}-${card.suit}`}
            key={index}
            value={card.value}
            suit={card.suit}
            flipped={this.state.flippedCardsIndices.indexOf(index) > -1}
            onClick={this.onCardClick(card)}
          />
        );
    });
  };

  unflipCards = (card, deck, flippedCardsIndices) => {
    console.log(`indexes inside unflip ${flippedCardsIndices}`);
    this.setState(prevState => ({ ...prevState, flippedCardsIndices: [] }));
  };

  render() {
    return (
      <div>
        <div className="match-status">{`${this.state.statusMessage}`}</div>
        <div className="game">{this.renderCards()}</div>
      </div>
    );
  }
}

export default Game;
