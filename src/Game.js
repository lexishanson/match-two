import React, { Component } from "react";
import Card from "./Card";
import { shuffle, suitSymbol } from "./helpers";

const CARD_SUITS = ["hearts", "diamonds", "spades", "clubs"];
const CARD_VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];

class Game extends Component {
  constructor() {
    super();
    this.state = this.initialState();
  }

  /* Check for a match after a pair of cards is selected */
  checkForMatch = () => {
    this.setState(state => {
      console.log("checkForMatch", state);
      let {
        deck,
        gameType,
        matches,
        matchedCards,
        flippedCardsIndices,
        unmatchedFlippedCards,
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
        unmatchedFlippedCards: {
          ...unmatchedFlippedCards,
          [flippedCardsIndices[0]]: !isMatch,
          [flippedCardsIndices[1]]: !isMatch
        },
        matchedCards: isMatch
          ? {
              ...matchedCards,
              [this.key(cardOne)]: true,
              [this.key(cardTwo)]: true
            }
          : matchedCards,
        matches,
        statusMessage: isMatch ? "Congrats, that's a match!" : "Not a match",
        flippedCardsIndices: [],
        gameOver: matches.length === deck.length / 2,
        turn: gameType === "single" ? "p1" : turn === "p1" ? "p2" : "p1"
      };
      /* If game is 2-player computer plays after pair is selected by p1 */
      if (newState.gameType === "2-player" && newState.turn === "p2") {
        setTimeout(this.playComputerMove, 800);
      }
      return newState;
    });
  };

  getWinner = () => {
    let p1Matches = 0;
    let p2Matches = 0;
    this.state.matches.forEach(match => {
      match.owner === "p1" ? p1Matches++ : p2Matches++;
    });
    if (p1Matches === p2Matches) {
      return { winner: "Tie", count: p1Matches };
    } else if (p1Matches > p2Matches) {
      return { winner: "You", count: p1Matches };
    }
    return { winner: "Computer", count: p2Matches };
  };

  initialCards = () => {
    return Array(52)
      .fill(1)
      .map((card, index) => ({
        suit: CARD_SUITS[index % CARD_SUITS.length],
        value: CARD_VALUES[index % CARD_VALUES.length]
      }));
  };

  initialState = () => ({
    deck: shuffle(this.initialCards()),
    flippedCardsIndices: [],
    gameOver: false,
    gameType: null,
    matchedCards: {},
    unmatchedFlippedCards: {},
    matches: [],
    statusMessage: "Click two cards to start",
    turn: "p1"
  });

  key = card => card.value + card.suit;

  /* If game is 2-player, matchedCards determines the `div` where a given
  matched pair will be displayed in the matchesSection ("Your Matches",
  "Computer's Matches") */
  matchedCards = ownerToFindMatchesFor => {
    if (this.state.gameType === "2-player") {
      return this.state.matches
        .filter(({ owner }) => owner === ownerToFindMatchesFor)
        .map(({ cards, owner }, i) => (
          <li
            className="pairs"
            key={`owner-${cards[0].value}-${cards[0].suit}-${i}`}
          >
            {cards[0].value} {suitSymbol(cards[0].suit)}{" "}
            {suitSymbol(cards[1].suit)}
          </li>
        ));
    }
    return this.state.matches.map(({ cards }) => (
      <li className="pairs" key={`match-${cards[0].value}-${cards[0].suit}`}>
        {cards[0].value} {suitSymbol(cards[0].suit)} {suitSymbol(cards[1].suit)}
      </li>
    ));
  };

  matchesSection = () => {
    return this.state.gameType === "2-player" ? (
      <div className="player-wrapper">
        <div className="player-1">
          <h3>Your Matches</h3>
          <ul className="matches-list">{this.matchedCards("p1")}</ul>
        </div>
        <div className="player-2">
          <h3>Computer's Matches</h3>
          <ul className="matches-list">{this.matchedCards("p2")}</ul>
        </div>
        <p>{`Matches so far: ${this.state.matches.length}`}</p>
      </div>
    ) : (
      <div className="single-player-wrapper">
        <h3>Your Matches</h3>
        <ul className="matches-list">{this.matchedCards("p1")}</ul>
        <p>{`Matches so far: ${this.state.matches.length}`}</p>
      </div>
    );
  };

  onCardClick = index => e => {
    const { gameType, turn, flippedCardsIndices } = this.state;
    const isComputerMove = gameType === "2-player" && turn === "p2";
    if (flippedCardsIndices.length >= 2 || isComputerMove) {
      return;
    }
    this.setState(state => {
      let { flippedCardsIndices } = state;
      flippedCardsIndices.push(index);
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

  playComputerMove = () => {
    const { unmatchedFlippedCards, flippedCardsIndices, deck } = this.state;
    const perfectMove = previousGuesses => {
      const guessesGroupedByValue = Object.keys(
        previousGuesses
      ).reduce((acc, index) => {
        if (unmatchedFlippedCards[index]) {
          const card = deck[index];
          acc[card.value] = { ...acc[card.value], [index]: true };
        }
        return acc;
      }, CARD_VALUES.reduce((acc, value) => ({ ...acc, [value]: {} }), {}));
      let seenPair = undefined;
      CARD_VALUES.every(value => {
        const seenCardsForValue = guessesGroupedByValue[value];
        const matchIndexes = Object.keys(seenCardsForValue);
        const pairFound = matchIndexes.length > 1;
        if (pairFound) {
          seenPair = [matchIndexes[0], matchIndexes[1]];
        }
        return !pairFound;
      });
      return seenPair;
    };

    const executeComputerMove = move => {
      this.setState(state => ({
        ...state,
        statusMessage: `Computer plays: ${move}`,
        flippedCardsIndices: move
      }));
      setTimeout(this.checkForMatch, 2000);
    };

    /* Try to find solution from previously seen (flipped) cards */

    const perfectMoveFromPrevious = perfectMove(unmatchedFlippedCards);
    if (perfectMoveFromPrevious) {
      return executeComputerMove(perfectMoveFromPrevious);
    }

    const unmatchedUnseenIndexes = shuffle(
      deck
        .map((x, i) => i)
        .filter(i => !unmatchedFlippedCards[i] && !flippedCardsIndices[i])
    );
    const unmatchedFlippedCardsPlusOneGuess = {
      ...unmatchedFlippedCards,
      [unmatchedUnseenIndexes[0]]: true
    };
    const perfectMoveFromOneGuess = perfectMove(
      unmatchedFlippedCardsPlusOneGuess
    );
    if (perfectMoveFromOneGuess) {
      return executeComputerMove(perfectMoveFromOneGuess);
    }

    /* TRY A RANDOM MOVE */
    return executeComputerMove([
      unmatchedUnseenIndexes[0],
      unmatchedUnseenIndexes[1]
    ]);
  };

  renderBoard = () => {
    /* Board won't show cards if game is not in play */
    if (this.state.gameOver) {
      return (
        <div>
          <div className="game-over">Game Over!</div>
          {this.state.gameType === "2-player" && (
            <div className="winner">{`Winner: ${this.getWinner()
              .winner} with ${this.getWinner().count} matches`}</div>
          )}
          <button onClick={() => this.restartGame()}>Play Again</button>
          <div className="matches-wrapper">{this.matchesSection()}</div>
        </div>
      );
    } else {
      return (
        <div>
          <header className="App-header">
            <h1 className="App-title">{this.state.statusMessage}</h1>
          </header>
          <div className="matches-wrapper">{this.matchesSection()}</div>
          <div className="game-wrapper">
            <div className="game">{this.renderCards()}</div>
          </div>
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
            key={`${card.value}-${card.suit}-${index}`}
            value={card.value}
            suit={card.suit}
            flipped={this.state.flippedCardsIndices.indexOf(index) > -1}
            onClick={this.onCardClick(index)}
          />
        )
    );
  };

  restartGame = () =>
    this.setState(state => ({
      ...state,
      ...this.initialState()
    }));

  setGameType = type => () => {
    console.log("type selected", type);
    return this.setState(state => {
      return {
        ...state,
        gameType: type
      };
    });
  };

  showPlayOptions = () => {
    return (
      <div className="start-buttons">
        <h2>Welcome to Match Two! How would you like to play?</h2>
        <button onClick={this.setGameType("single")}>By Myself</button>
        <button onClick={this.setGameType("2-player")}>Against Computer</button>
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
