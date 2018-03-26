// import React from 'react';
// import { suitSymbol } from './helpers';
//
// export const matchedCards = ownerToFindMatchesFor => {
//   if (this.props.gameType === '2-player') {
//     return this.props.matches
//       .filter(({ owner }) => owner === ownerToFindMatchesFor)
//       .map(({ cards, owner }) => (
//         <li className="pairs">
//           {cards[0].value} {suitSymbol(cards[0].suit)}{' '}
//           {suitSymbol(cards[1].suit)}
//         </li>
//       ));
//   }
//   return this.props.matches.map(({ cards }) => (
//     <li className="pairs">
//       {cards[0].value} {suitSymbol(cards[0].suit)} {suitSymbol(cards[1].suit)}
//     </li>
//   ));
// };
//
// export const matchesSection = () => {
//   return this.props.gameType === '2-player' ? (
//     <div className="player-wrapper">
//       <div className="player-1">
//         <p>Your Matches</p>
//         <ul className="matches-list">{this.matchedCards('p1')}</ul>
//       </div>
//       <div className="player-2">
//         <p>Computer's Matches</p>
//         <ul className="matches-list">{this.matchedCards('p2')}</ul>
//       </div>
//       <p>{`Matches so far ${this.props.matches.length}`}</p>
//     </div>
//   ) : (
//     <div className="single-player-wrapper">
//       <p>Your Matches</p>
//       <ul className="matches-list">{this.matchedCards('p1')}</ul>
//       <p>{`Matches so far: ${this.props.matches.length}`}</p>
//     </div>
//   );
// };
