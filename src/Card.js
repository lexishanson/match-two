import React from 'react';
import { suitSymbol } from './helpers';

const Card = ({ id, flipped, value, suit, onClick }) => {
  return (
    <div
      className={[
        'card',
        flipped ? 'flipped' : 'unflipped',
        suit === 'diamonds' || suit === 'hearts' ? 'red-card' : 'black-card'
      ].join(' ')}
      onClick={onClick}
    >
      {flipped && `${value} ${suitSymbol(suit)}`}
    </div>
  );
};

export default Card;
