// components/tresEnRaya/GameAnalysisSummary.jsx

import React from "react";
import { CheckCircle, XCircle, Clock, Database, Activity } from "lucide-react";

export const GameAnalysisSummary = ({ gameStats, algorithm }) => {
  if (!gameStats || !gameStats.totalMoves) return null;

  // Calcular métricas
  const isOptimal = true; // Minimax y Alfa-Beta siempre son óptimos
  const isComplete = true; // Siempre exploran o podan correctamente

  const totalNodes = gameStats.totalNodes || 0;
  const totalTime = gameStats.totalTime || 0;
  const avgNodesPerMove =
    totalNodes > 0 ? (totalNodes / gameStats.totalMoves).toFixed(1) : 0;
  const avgTimePerMove =
    totalTime > 0 ? (totalTime / gameStats.totalMoves).toFixed(2) : 0;

  return (
    <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
        Análisis de Evaluación -{" "}
        {algorithm === "minimax" ? "Minimax" : "Poda Alfa-Beta"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* 1. Óptimo */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isOptimal ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {isOptimal ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <div className="text-xs text-gray-600 font-semibold">Óptimo</div>
              <div
                className={`text-2xl font-bold ${
                  isOptimal ? "text-green-600" : "text-red-600"
                }`}
              >
                {isOptimal ? "SÍ" : "NO"}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {isOptimal
              ? "✓ Garantiza la solución más óptima"
              : "✗ No garantiza la solución óptima"}
          </div>
        </div>

        {/* 2. Completo */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isComplete ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {isComplete ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <div className="text-xs text-gray-600 font-semibold">
                Completo
              </div>
              <div
                className={`text-2xl font-bold ${
                  isComplete ? "text-green-600" : "text-red-600"
                }`}
              >
                {isComplete ? "SÍ" : "NO"}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {isComplete
              ? "✓ Explora toda la información necesaria"
              : "✗ No explora toda la información"}
          </div>
        </div>

        {/* 3. Complejidad Espacial */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600 font-semibold">
                Complejidad Espacial
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {totalNodes.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Nodos generados totales
            <div className="text-xs text-gray-500 mt-1">
              Promedio: {avgNodesPerMove} nodos/movimiento
            </div>
          </div>
        </div>

        {/* 4. Complejidad Temporal */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600 font-semibold">
                Complejidad Temporal
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {totalTime.toFixed(2)} ms
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Tiempo total de ejecución
            <div className="text-xs text-gray-500 mt-1">
              Promedio: {avgTimePerMove} ms/movimiento
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
