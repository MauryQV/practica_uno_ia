import React from "react";
import { Activity } from "lucide-react";

export const StatsPanel = ({ stats, thinking }) => (
  <div className="bg-white rounded-xl  p-6">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
      Último Movimiento
    </h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Nodos explorados:</span>
        <span className="font-bold text-2xl text-blue-600">{stats.nodes}</span>
      </div>

      {thinking && (
        <div className="text-center py-2">
          <div className="animate-pulse text-purple-600 font-semibold">
            Contraincante pensando...
          </div>
        </div>
      )}
    </div>
  </div>
);
