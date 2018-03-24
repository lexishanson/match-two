import React from 'react';

const Card = ({ id, flipped, value, suit, onClick }) => {
  const suitSymbol = suit => {
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
  return (
    <div
      className={[
        'card',
        flipped ? 'flipped' : '',
        suit === 'diamonds' || suit === 'hearts' ? 'red-card' : 'black-card'
      ].join(' ')}
      onClick={onClick}
    >
      {flipped && `${value} ${suitSymbol(suit)}`}
    </div>
  );
};

export default Card;
