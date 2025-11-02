// components/Board.jsx

import React from "react";
import { Square } from "./Square";

export const Board = ({ board, onSquareClick, winner, lastMove, disabled }) => (
  <div className="inline-grid grid-cols-3 gap-3 p-6 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl">
    {board.map((value, i) => (
      <Square
        key={i}
        value={value}
        onClick={() => onSquareClick(i)}
        isWinning={winner?.line?.includes(i)}
        isLastMove={lastMove === i}
        disabled={disabled || !!value}
      />
    ))}
  </div>
);
