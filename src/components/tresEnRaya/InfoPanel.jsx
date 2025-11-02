// components/InfoPanel.jsx

import React from "react";

export const InfoPanel = () => (
  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
    <h4 className="font-bold text-gray-800 mb-2"> Funcionamiento</h4>
    <ul className="text-sm text-gray-600 space-y-1">
      <li>
        <strong>minimax:</strong> Exploramos todo el arbol de decisión
      </li>
      <li>
        <strong>Alfa-Beta:</strong> Poda ramas que no afectan la decision
      </li>
      <li>
        El agente juega de forma <strong>analitica</strong> - mo se le puede
        ganar en todo caso sera empate
      </li>
      <li>Observa cómo Alfa-Beta explora menos nodos con el mismo resultado</li>
    </ul>
  </div>
);
