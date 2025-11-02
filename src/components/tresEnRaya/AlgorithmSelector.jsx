// components/AlgorithmSelector.jsx

import React from "react";

export const AlgorithmSelector = ({ algorithm, onSelect }) => (
  <div className="bg-white rounded-xl p-6">
    <h3 className="text-xl font-bold mb-4">Algoritmo del agente</h3>
    <div className="space-y-2">
      {["minimax", "alphabeta"].map((algo) => (
        <button
          key={algo}
          onClick={() => onSelect(algo)}
          className={`w-full p-3 rounded-lg font-semibold transition-all ${
            algorithm === algo
              ? algo === "minimax"
                ? "bg-green-600 text-white "
                : "bg-blue-600 text-white "
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {algo === "minimax" ? "Minimax" : "Alfa-Beta "}
        </button>
      ))}
    </div>
  </div>
);
