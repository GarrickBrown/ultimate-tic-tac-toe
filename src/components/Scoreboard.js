import React from "react";

const Scoreboard = ({ scores, currentPlayer, globalWinner }) => {
  return (
    <div>
      <p>Current Player: {currentPlayer}</p>
      <p>Player X: {scores.playerX}</p>
      <p>Player O: {scores.playerO}</p>
    </div>
  );
};

export default Scoreboard;
