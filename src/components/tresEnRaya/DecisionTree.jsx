// components/tresEnRaya/DecisionTree.jsx

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export const DecisionTree = ({ treeData, algorithm }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set([0]));

  if (!treeData || treeData.length === 0) return null;

  const toggleNode = (index) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedNodes(newExpanded);
  };

  const getBestMove = () => {
    return treeData.reduce(
      (best, move) => (move.value > best.value ? move : best),
      treeData[0]
    );
  };

  const bestMove = getBestMove();

  return (
    <div className="bg-white rounded-xl  p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        Árbol de Decisión - {algorithm === "minimax" ? "Minimax" : "Alfa-Beta"}
      </h3>

      {/* Resumen del mejor movimiento */}
      <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">
          Mejor movimiento encontrado:
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-green-700">
            Posición {bestMove.position + 1}
          </div>
          <div className="text-lg text-gray-600">→ Valor: {bestMove.value}</div>
        </div>
      </div>

      {/* Tabla de movimientos evaluados */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2">
              <th className="p-3 text-left">Posición</th>
              <th className="p-3 text-center">Valor</th>
              <th className="p-3 text-center">Nodos</th>
              <th className="p-3 text-center">Tipo</th>
              <th className="p-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {treeData.map((move, idx) => (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  move.position === bestMove.position
                    ? "bg-green-50 font-semibold"
                    : ""
                }`}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                        move.position === bestMove.position
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {move.position + 1}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {move.value > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : move.value < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : null}
                    <span
                      className={`font-bold ${
                        move.value > 0
                          ? "text-green-600"
                          : move.value < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {move.value}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center text-gray-600">
                  {move.nodesExplored}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      move.isMaximizing
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {move.isMaximizing ? "MAX" : "MIN"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {move.isPruned && (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                      PODADO
                    </span>
                  )}
                  {move.position === bestMove.position && !move.isPruned && (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                      ELEGIDO ✓
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
        <div className="font-semibold mb-2">Leyenda:</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            • <strong>Valor positivo:</strong> Favorable para IA (O)
          </div>
          <div>
            • <strong>Valor negativo:</strong> Favorable para Jugador (X)
          </div>
          <div>
            • <strong>MAX:</strong> IA busca maximizar
          </div>
          <div>
            • <strong>MIN:</strong> Jugador busca minimizar
          </div>
        </div>
      </div>
    </div>
  );
};
