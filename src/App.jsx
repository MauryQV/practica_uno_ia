// TicTacToe.jsx - VERSIÓN FINAL CON ANÁLISIS DETALLADO

import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

// Hooks
import { useGameState } from "./hooks/useGameState";

// Utils
import { aiAlgorithms } from "./utils/aiAlgorithms";

// Components
import { Board } from "./components/tresEnRaya/Board";
import { GameStatus } from "./components/tresEnRaya/GameStatus";
import { AlgorithmSelector } from "./components/tresEnRaya/AlgorithmSelector";
import { StatsPanel } from "./components/tresEnRaya/StatsPanel";
import { ComparisonPanel } from "./components/tresEnRaya/ComparisonPanel";
import { Scoreboard } from "./components/tresEnRaya/ScoreBoard";
import { InfoPanel } from "./components/tresEnRaya/InfoPanel";
import { DetailedTreeAnalysis } from "./components/tresEnRaya/DetailedTreeAnalysis";

const TicTacToe = () => {
  const gameState = useGameState();
  const [algorithm, setAlgorithm] = useState("minimax");
  const [thinking, setThinking] = useState(false);
  const [currentTreeData, setCurrentTreeData] = useState([]);
  const [stats, setStats] = useState({
    minimax: { nodes: 0, time: 0, moves: [] },
    alphabeta: { nodes: 0, time: 0, moves: [] },
  });

  // IA juega su turno
  useEffect(() => {
    if (!gameState.isXNext && !gameState.gameOver) {
      setThinking(true);

      // Pequeño delay para mostrar el "pensando..."
      setTimeout(() => {
        const result = aiAlgorithms.findBestMove(
          [...gameState.board],
          algorithm
        );

        if (result.move !== -1) {
          // Hacer el movimiento
          gameState.makeMove(result.move, "O");
          gameState.setIsXNext(true);

          // Actualizar estadísticas
          setStats((prev) => ({
            ...prev,
            [algorithm]: {
              nodes: result.nodes,
              time: result.time,
              moves: [...prev[algorithm].moves, result.nodes],
            },
          }));

          // Guardar datos del árbol de decisión
          console.log("Tree Data:", result.treeData);
          setCurrentTreeData(result.treeData || []);
        }

        setThinking(false);
      }, 500);
    }
  }, [gameState.isXNext, gameState.board, gameState.gameOver, algorithm]);

  const handleSquareClick = (i) => {
    if (!gameState.isXNext || thinking) return;
    if (gameState.makeMove(i, "X")) {
      gameState.setIsXNext(false);
    }
  };

  const handleReset = () => {
    gameState.resetGame();
    setCurrentTreeData([]);
  };

  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setCurrentTreeData([]); // Limpiar árbol al cambiar algoritmo
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-black bg-clip-text text-transparent mb-2">
            Tres en raya - Busqueda con Contrincante
          </h1>
          <p className="text-gray-600 text-lg">
            Análisis Detallado: Minimax vs Poda Alfa-Beta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel izquierdo - Controles y estadísticas */}
          <div className="space-y-4">
            <AlgorithmSelector
              algorithm={algorithm}
              onSelect={handleAlgorithmChange}
            />

            <StatsPanel stats={stats[algorithm]} thinking={thinking} />

            <ComparisonPanel stats={stats} />

            <Scoreboard scores={gameState.gamesPlayed} />
          </div>

          {/* Panel central y derecho - Tablero y análisis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tablero de juego */}
            <div className="bg-white rounded-xl  p-8">
              <GameStatus
                gameOver={gameState.gameOver}
                winner={gameState.winner}
                isXNext={gameState.isXNext}
              />

              <div className="flex justify-center mb-6">
                <Board
                  board={gameState.board}
                  onSquareClick={handleSquareClick}
                  winner={gameState.winner}
                  lastMove={gameState.lastMove}
                  disabled={
                    gameState.gameOver || !gameState.isXNext || thinking
                  }
                />
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-linear-to-r bg-blue-600 text-white rounded-lg font-semibold hover: transform hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Nuevo Juego
                </button>
              </div>

              <InfoPanel />
            </div>

            {/* Análisis detallado del árbol de decisión */}
            {currentTreeData.length > 0 && (
              <DetailedTreeAnalysis
                treeData={currentTreeData}
                algorithm={algorithm}
              />
            )}

            {/* Ayuda cuando no hay árbol */}
            {currentTreeData.length === 0 && !gameState.gameOver && (
              <div className="bg-white rounded-xl  p-6">
                <div className="text-center text-gray-500">
                  <div className="text-lg font-semibold mb-2">
                    Esperando el moviento del usuario
                  </div>
                  <div className="text-sm">
                    El análisis aparecera despues de que el agente haga su
                    movimiento
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
