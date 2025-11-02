// components/GameStatus.jsx

import React from "react";

export const GameStatus = ({ gameOver, winner, isXNext }) => (
  <div className="text-center mb-6">
    {gameOver ? (
      <div className="text-3xl font-bold">
        {winner ? (
          <span
            className={winner.winner === "X" ? "text-blue-600" : "text-red-600"}
          >
            ¡Gana {winner.winner === "X" ? "Jugador (X)" : "Agente (O)"}!
          </span>
        ) : (
          <span className="text-gray-600"> ¡Empate!</span>
        )}
      </div>
    ) : (
      <div className="text-2xl font-semibold text-gray-700">
        Turno: {isXNext ? " Tu" : " Contraincante (O)"}
      </div>
    )}
  </div>
);
