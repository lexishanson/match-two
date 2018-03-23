import React, { Component } from 'react';

const Card = ({ id, flipped, value, suit, onClick }) => {
  return (
    <div
      className={['Card', flipped ? 'flipped' : ''].join('')}
      onClick={onClick}
    >
      {flipped && `${value} ${suit}`}
    </div>
  );
};

export default Card;
