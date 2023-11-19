import React, { useState } from "react";
import MiniBoard from "./MiniBoard";
import Scoreboard from "./Scoreboard";

const UltimateGame = () => {
  const initialBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
  const [globalBoard, setGlobalBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [activeMiniBoard, setActiveMiniBoard] = useState(null);
  const [globalWins, setGlobalWins] = useState({ playerX: 0, playerO: 0 });
  const [miniBoardWinners, setMiniBoardWinners] = useState(Array(9).fill(null));
  const [globalWinner, setGlobalWinner] = useState(null);

  const handleSquareClick = (miniBoardIndex, squareIndex) => {
    if (
      (activeMiniBoard === null || activeMiniBoard === miniBoardIndex) &&
      !globalBoard[miniBoardIndex][squareIndex] &&
      !globalWinner &&
      !miniBoardWinners[miniBoardIndex]
    ) {
      const newGlobalBoard = globalBoard.map((miniBoard, index) => {
        if (index === miniBoardIndex) {
          const newMiniBoard = miniBoard.slice();
          newMiniBoard[squareIndex] = currentPlayer;
          return newMiniBoard;
        }
        return miniBoard;
      });

      setGlobalBoard(newGlobalBoard);

      // Define newMiniBoardWinners outside the if block
      const newMiniBoardWinners = miniBoardWinners.slice();
      const miniBoardWinner = checkForMiniBoardWinner(
        newGlobalBoard[miniBoardIndex]
      );

      if (miniBoardWinner) {
        newMiniBoardWinners[miniBoardIndex] = miniBoardWinner;
        setMiniBoardWinners(newMiniBoardWinners);
        checkForGlobalWinner(newMiniBoardWinners);
      }

      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      setActiveMiniBoard(
        getNextActiveMiniBoard(squareIndex, newMiniBoardWinners)
      );
    }
  };

  const checkForMiniBoardWinner = (miniBoard) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        miniBoard[a] &&
        miniBoard[a] === miniBoard[b] &&
        miniBoard[a] === miniBoard[c]
      ) {
        return miniBoard[a];
      }
    }
    return null;
  };

  const checkForGlobalWinner = (miniBoardWinners) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        miniBoardWinners[a] &&
        miniBoardWinners[a] === miniBoardWinners[b] &&
        miniBoardWinners[a] === miniBoardWinners[c]
      ) {
        setGlobalWinner(miniBoardWinners[a]);

        // Update globalWins count
        if (miniBoardWinners[a] !== "Draw") {
          setGlobalWins({
            ...globalWins,
            [`player${miniBoardWinners[a]}`]:
              globalWins[`player${miniBoardWinners[a]}`] + 1
          });
        }

        return;
      }
    }

    // If no winner is found and all mini-boards are decided (won or draw), it's a draw
    if (miniBoardWinners.every((winner) => winner !== null)) {
      setGlobalWinner("Draw");
      return;
    }

    // Reset globalWinner to null if no winner is found
    setGlobalWinner(null);
  };

  const getNextActiveMiniBoard = (squareIndex, miniBoardWinners) => {
    if (
      miniBoardWinners[squareIndex] ||
      allSquaresFilled(globalBoard[squareIndex])
    ) {
      return null; // Free choice if the targeted mini-board is won or full
    }
    return squareIndex;
  };

  const allSquaresFilled = (miniBoard) => {
    return miniBoard.every((square) => square !== null);
  };

  // Function to calculate scores from miniBoardWinners
  const calculateScores = () => {
    const scores = { playerX: 0, playerO: 0 };
    miniBoardWinners.forEach((winner) => {
      if (winner === "X") {
        scores.playerX += 1;
      } else if (winner === "O") {
        scores.playerO += 1;
      }
    });
    return scores;
  };

  const resetGame = () => {
    setGlobalBoard(initialBoard);
    setCurrentPlayer("X");
    setActiveMiniBoard(null);
    setMiniBoardWinners(Array(9).fill(null));
    setGlobalWinner(null);
  };

  return (
    <div className="ultimate-game-container">
      <Scoreboard
        scores={globalWins}
        currentPlayer={currentPlayer}
        globalWinner={globalWinner}
      />
      <div className="ultimate-game">
        {globalBoard.map((miniBoard, index) => (
          <MiniBoard
            key={index}
            board={miniBoard}
            onSquareClick={(squareIndex) =>
              handleSquareClick(index, squareIndex)
            }
            isActive={activeMiniBoard === null || activeMiniBoard === index}
            winner={miniBoardWinners[index]}
          />
        ))}
      </div>
      {globalWinner && (
        <div>
          <p>Winner: {globalWinner}</p>
          <button onClick={resetGame}>Reset Board</button>
        </div>
      )}
    </div>
  );
};

export default UltimateGame;
