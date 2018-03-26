
export const shuffle = deck => {
  let shuffledDeck = deck;
  console.log("shuffledeck", shuffledDeck);
  for (let i = 0; i < 1000; i++) {
    let i1 = Math.floor(Math.random() * deck.length);
    let i2 = Math.floor(Math.random() * deck.length);
    [shuffledDeck[i1], shuffledDeck[i2]] = [shuffledDeck[i2], shuffledDeck[i1]];
  }
  console.log(shuffledDeck);
  return shuffledDeck;
};

export const suitSymbol = suit => {
  if (suit === "spades") {
    return "♠";
  }
  if (suit === "clubs") {
    return "♣";
  }
  if (suit === "hearts") {
    return "♥";
  }
  if (suit === "diamonds") {
    return "♦";
  }
};
