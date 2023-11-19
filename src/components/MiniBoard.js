import React from "react";
import Square from "./Square";

const MiniBoard = ({
  board,
  onSquareClick,
  isActive,
  winner,
  globalWinner
}) => {
  return (
    <div
      className={`mini-board ${isActive ? "" : "inactive"}`}
      style={{ position: "relative" }}
    >
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() =>
            isActive && !winner && !globalWinner ? onSquareClick(index) : null
          }
          disabled={!isActive || !!winner || !!globalWinner}
        />
      ))}
      {winner && <div className="winner-overlay">{winner} Wins!</div>}
    </div>
  );
};

export default MiniBoard;
