// components/tresEnRaya/VisualTreeDiagram.jsx

import React from "react";

export const VisualTreeDiagram = ({ treeData, algorithm }) => {
  if (!treeData || treeData.length === 0) return null;

  const getBestMove = () => {
    return treeData.reduce(
      (best, move) => (move.value < best.value ? move : best),
      treeData[0]
    );
  };

  const bestMove = getBestMove();

  // Renderizar mini-tablero para cada posición
  const renderMiniBoard = (position, value, isBest) => {
    const board = Array(9).fill(null);
    board[position] = "O";

    return (
      <div
        className={`flex flex-col items-center ${isBest ? "scale-110" : ""}`}
      >
        <div
          className={`grid grid-cols-3 gap-0.5 w-16 h-16 bg-gray-300 p-1 rounded ${
            isBest ? "ring-4 ring-green-400 " : ""
          }`}
        >
          {board.map((cell, i) => (
            <div
              key={i}
              className={`flex items-center justify-center text-xs font-bold ${
                i === position
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-300"
              }`}
            >
              {cell || (i === position ? "O" : "")}
            </div>
          ))}
        </div>
        <div className={`mt-2 text-center ${isBest ? "font-bold" : ""}`}>
          <div className="text-xs text-gray-600">Pos: {position}</div>
          <div
            className={`text-sm font-bold ${
              value > 0
                ? "text-green-600"
                : value < 0
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            f(v)={value}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl  p-6">
      <h3 className="text-xl font-bold mb-4">
        📊 Visualización del Árbol - Nivel Raíz
      </h3>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
        <div className="font-semibold mb-1">
          Proceso de {algorithm === "minimax" ? "Minimax" : "Poda Alfa-Beta"}:
        </div>
        <div className="text-gray-700">
          La IA evalúa cada movimiento posible (O) y elige el que tiene el{" "}
          <strong>menor valor</strong>
          (mejor para O). Los valores negativos son malos para O, positivos son
          buenos.
        </div>
      </div>

      {/* Visualización tipo árbol horizontal */}
      <div className="relative">
        {/* Nodo raíz (estado inicial) */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-purple-100 px-6 py-3 rounded-lg border-2 border-purple-300">
            <div className="text-center">
              <div className="text-sm text-gray-600">Estado Inicial (Ei)</div>
              <div className="font-bold text-lg">IA debe elegir</div>
              <div className="text-xs text-gray-500 mt-1">
                Nivel MIN (busca minimizar)
              </div>
            </div>
          </div>
        </div>

        {/* Líneas conectoras */}
        <div className="flex justify-center mb-4">
          <div className="h-8 w-px bg-gray-400"></div>
        </div>

        {/* Nodos hijos (movimientos posibles) */}
        <div className="flex flex-wrap justify-center gap-6">
          {treeData.map((move, idx) => (
            <div key={idx} className="relative">
              {/* Línea conectora individual */}
              <div className="absolute -top-8 left-1/2 w-px h-8 bg-gray-400"></div>

              {/* Nodo del movimiento */}
              <div
                className={`p-3 rounded-lg border-2 ${
                  move.position === bestMove.position
                    ? "bg-green-50 border-green-400"
                    : move.isPruned
                    ? "bg-gray-50 border-gray-300 opacity-50"
                    : "bg-white border-gray-300"
                }`}
              >
                {renderMiniBoard(
                  move.position,
                  move.value,
                  move.position === bestMove.position
                )}

                {/* Indicadores adicionales */}
                <div className="mt-2 text-center space-y-1">
                  <div className="text-xs text-gray-500">
                    {move.nodesExplored} nodos
                  </div>
                  {move.position === bestMove.position && (
                    <div className="px-2 py-0.5 bg-green-500 text-white text-xs rounded font-semibold">
                      ✓ ELEGIDO
                    </div>
                  )}
                  {move.isPruned && algorithm === "alphabeta" && (
                    <div className="px-2 py-0.5 bg-yellow-400 text-gray-800 text-xs rounded font-semibold">
                      PODADO
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda mejorada */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="font-semibold mb-3 text-sm">🔍 Interpretación:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-400 rounded mt-0.5"></div>
            <div>
              <strong>Movimiento elegido:</strong> El de menor valor (mejor para
              IA/O)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-50 border-2 border-gray-300 rounded mt-0.5 opacity-50"></div>
            <div>
              <strong>Podado:</strong> Rama descartada por Alfa-Beta (si aplica)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-600 font-bold">f(v) {"<"} 0:</span>
            <div>Favorable para Jugador (X) - malo para IA</div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">f(v) {">"} 0:</span>
            <div>Favorable para IA (O) - malo para Jugador</div>
          </div>
        </div>
      </div>

      {/* Comparación de eficiencia si es Alfa-Beta */}
      {algorithm === "alphabeta" && treeData.some((m) => m.isPruned) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm">
            <strong>💡 Ventaja de Alfa-Beta:</strong> Se podaron{" "}
            {treeData.filter((m) => m.isPruned).length} ramas innecesarias,
            ahorrando cálculos sin afectar el resultado final.
          </div>
        </div>
      )}
    </div>
  );
};
