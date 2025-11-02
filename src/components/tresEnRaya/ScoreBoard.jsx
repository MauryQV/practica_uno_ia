// components/Scoreboard.jsx
import React from "react";
import { Trophy } from "lucide-react";

export const Scoreboard = ({ scores }) => (
  <div className="bg-white rounded-xl  p-6">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Marcador</h3>
    <div className="grid grid-cols-3 gap-2">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{scores.x}</div>
        <div className="text-xs text-gray-600">Jugador</div>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-600">{scores.draw}</div>
        <div className="text-xs text-gray-600">Empates</div>
      </div>
      <div className="text-center p-3 bg-red-50 rounded-lg">
        <div className="text-2xl font-bold text-red-600">{scores.o}</div>
        <div className="text-xs text-gray-600">Agente</div>
      </div>
    </div>
  </div>
);
