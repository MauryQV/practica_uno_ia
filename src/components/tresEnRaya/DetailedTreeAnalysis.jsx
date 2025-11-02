// components/tresEnRaya/DetailedTreeAnalysis.jsx

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Calculator,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export const DetailedTreeAnalysis = ({ treeData, algorithm }) => {
  const [expandedMove, setExpandedMove] = useState(null);

  if (!treeData || treeData.length === 0) return null;

  const bestMove = treeData[0]; // Ya está ordenado

  const renderMiniBoard = (position, board = null) => {
    const displayBoard = board || Array(9).fill(null);
    if (!board) displayBoard[position] = "O";

    return (
      <div className="grid grid-cols-3 gap-0.5 w-14 h-14 bg-gray-300 p-0.5 rounded">
        {displayBoard.map((cell, i) => (
          <div
            key={i}
            className={`flex items-center justify-center text-xs font-bold ${
              cell === "X"
                ? "bg-blue-500 text-white"
                : cell === "O"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-300"
            }`}
          >
            {cell || ""}
          </div>
        ))}
      </div>
    );
  };

  const toggleMove = (index) => {
    setExpandedMove(expandedMove === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl  p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-purple-600" />
        Análisis Detallado -{" "}
        {algorithm === "minimax" ? "Minimax" : "Poda Alfa-Beta"}
      </h3>

      {/* Explicación del cálculo */}
      <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
        <div className="font-semibold text-gray-800 mb-2">
          Función de Evaluación Heurística:
        </div>
        <div className="text-sm space-y-2">
          <div className="font-mono bg-white px-3 py-2 rounded border border-gray-300">
            f(v) = jugadas_ganadoras_max(X) - jugadas_ganadoras_min(O)
          </div>
          <div className="text-gray-700">
            <strong>MIN (IA/O)</strong> busca el valor{" "}
            <strong>más negativo</strong> (minimizar)
            <br />
            <strong>MAX (Jugador/X)</strong> busca el valor{" "}
            <strong>más positivo</strong> (maximizar)
          </div>
        </div>
      </div>

      {/* Mejor movimiento destacado */}
      <div className="mb-4 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
        <div className="flex items-center gap-4">
          <div>{renderMiniBoard(bestMove.position)}</div>
          <div className="flex-1">
            <div className="text-sm text-gray-600">
              ✓ Movimiento Elegido por MIN:
            </div>
            <div className="text-2xl font-bold text-green-700">
              Posición {bestMove.position}
            </div>
            <div className="text-sm text-gray-700 mt-1">
              <span className="font-mono bg-white px-2 py-1 rounded border">
                f(v) = {bestMove.maxLines} - {bestMove.minLines} ={" "}
                {bestMove.heuristic}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">
              {bestMove.value}
            </div>
            <div className="text-xs text-gray-500">Valor Final</div>
          </div>
        </div>
      </div>

      {/* Tabla de todos los movimientos evaluados */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2">
              <th className="p-3 text-left">Tablero</th>
              <th className="p-3 text-center">Posición</th>
              <th className="p-3 text-center">MAX(X)</th>
              <th className="p-3 text-center">MIN(O)</th>
              <th className="p-3 text-center">f(v)</th>
              <th className="p-3 text-center">Valor</th>
              <th className="p-3 text-center">Nodos</th>
              <th className="p-3 text-center">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {treeData.map((move, idx) => (
              <React.Fragment key={idx}>
                <tr
                  className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                    idx === 0 ? "bg-green-50 font-semibold" : ""
                  }`}
                  onClick={() => toggleMove(idx)}
                >
                  <td className="p-3">{renderMiniBoard(move.position)}</td>
                  <td className="p-3 text-center">
                    <div
                      className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center font-bold text-lg ${
                        idx === 0
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {move.position}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-blue-600">
                        {move.maxLines}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="font-bold text-red-600">
                        {move.minLines}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {move.maxLines} - {move.minLines}
                    </div>
                    <div
                      className={`font-bold text-lg ${
                        move.heuristic > 0
                          ? "text-blue-600"
                          : move.heuristic < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      = {move.heuristic}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div
                      className={`text-2xl font-bold ${
                        move.value > 0
                          ? "text-green-600"
                          : move.value < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {move.value}
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-600">
                    {move.nodesExplored}
                    {move.pruned > 0 && (
                      <div className="text-xs text-yellow-600">
                        {move.pruned} podados
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      {expandedMove === idx ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>

                {/* Fila expandida con detalles */}
                {expandedMove === idx && move.children && (
                  <tr>
                    <td colSpan="8" className="p-4 bg-gray-50">
                      <div className="text-sm">
                        <div className="font-semibold mb-2">
                          Siguientes movimientos evaluados (MAX busca
                          maximizar):
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {move.children.map((child, cidx) => (
                            <div
                              key={cidx}
                              className="p-2 bg-white rounded border"
                            >
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-600">
                                  Pos {child.position}
                                </div>
                                <div className="flex-1"></div>
                                <div
                                  className={`font-bold ${
                                    child.value > 0
                                      ? "text-blue-600"
                                      : child.value < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {child.value}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          MIN elige el <strong>mínimo</strong> de estos valores:
                          <span className="font-bold text-green-600 ml-1">
                            {Math.min(...move.children.map((c) => c.value))}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interpretación final */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-semibold mb-2">
          {" "}
          Interpretacion de ls movimientos:
        </div>
        <div className="text-sm space-y-1 text-gray-700">
          <div>
            • <strong>Líneas MAX (X):</strong> Cantidad de líneas que X aún
            puede completar
          </div>
          <div>
            • <strong>Líneas MIN (O):</strong> Cantidad de líneas que O aún
            puede completar
          </div>
          <div>
            • <strong>f(v) negativo:</strong> Ventaja para MIN (O) - ¡Bueno para
            el agente!
          </div>
          <div>
            • <strong>f(v) positivo:</strong> Ventaja para MAX (X) - Malo para
            el agente.
          </div>
        </div>
      </div>
    </div>
  );
};
