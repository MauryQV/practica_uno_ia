// components/Square.jsx

import React from "react";

export const Square = ({ value, onClick, isWinning, isLastMove, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-24 h-24 text-4xl font-bold rounded-lg transition-all duration-200
      ${value === "X" ? "text-blue-500" : "text-red-500"}
      ${isWinning ? "bg-green-200 scale-105" : "bg-white hover:bg-gray-50"}
      ${isLastMove && !isWinning ? "ring-4 ring-yellow-400" : ""}
      ${!value && !disabled ? "hover: cursor-pointer" : ""}
      ${disabled ? "cursor-not-allowed" : ""}
      shadow-md
    `}
  >
    {value}
  </button>
);
