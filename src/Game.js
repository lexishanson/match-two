import React, { Component } from 'react';
import Card from './Card';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      deck: this.initialCards(),
      matches: 0,
      flippedCardsIndices: []
      // value, location
      // {value: }
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
        flipped: false,
        matched: false,
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
          matches = card.value;
        }
        setTimeout(() => {
          // consider matches as [{card.value: [card.suit, card.suit]}]
          this.unflipCards(card, deck, flippedCardsIndices);
          if (!isMatch) {
            alert('not a match');
          }
        }, 500);
      }
      return {
        ...prevState,
        deck,
        matches,
        flippedCardsIndices
      };
    });
  };

  renderCards = (cards, matchedCards) => {
    return cards.map((card, index) => {
      if (card)
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
    console.log(this.state.deck);
    return (
      <div className="Game">
        {this.renderCards(this.state.deck, this.state.matches)}
      </div>
    );
  }
}

export default Game;
