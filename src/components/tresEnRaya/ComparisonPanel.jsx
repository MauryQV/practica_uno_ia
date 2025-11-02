// components/ComparisonPanel.jsx

import React from "react";
import { Zap } from "lucide-react";

export const ComparisonPanel = ({ stats }) => {
  const reduction =
    stats.minimax.nodes > 0
      ? (
          ((stats.minimax.nodes - stats.alphabeta.nodes) /
            stats.minimax.nodes) *
          100
        ).toFixed(1)
      : 0;

  if (stats.minimax.nodes === 0 || stats.alphabeta.nodes === 0) return null;

  return (
    <div className="bg-linear-to-r from-purple-100 to-blue-100 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="w-6 h-6 text-yellow-600" />
        Eficiencia
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-700">Minimax:</span>
          <span className="font-bold">{stats.minimax.nodes} nodos</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Alfa-Beta:</span>
          <span className="font-bold">{stats.alphabeta.nodes} nodos</span>
        </div>
        <div className="pt-2 border-t-2">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {reduction}%
            </div>
            <div className="text-sm text-gray-600">Reducción con poda</div>
          </div>
        </div>
      </div>
    </div>
  );
};
