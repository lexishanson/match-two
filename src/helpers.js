import React from 'react';

export const shuffle = deck => {
  let shuffledDeck = deck;
  for (let i = 0; i < 1000; i++) {
    let i1 = Math.floor(Math.random() * deck.length);
    let i2 = Math.floor(Math.random() * deck.length);
    [shuffledDeck[i1], shuffledDeck[i2]] = [shuffledDeck[i2], shuffledDeck[i1]];
    [shuffledDeck[i1].location, shuffledDeck[i2].location] = [
      shuffledDeck[i2].location,
      shuffledDeck[i1].location
    ];
  }
  return shuffledDeck;
};

export const suitSymbol = suit => {
  if (suit === 'spades') {
    return '♠';
  }
  if (suit === 'clubs') {
    return '♣';
  }
  if (suit === 'hearts') {
    return '♥';
  }
  if (suit === 'diamonds') {
    return '♦';
  }
};
