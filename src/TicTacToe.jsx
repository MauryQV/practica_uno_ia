// TicTacToe.jsx - VERSIÓN FINAL CON ANÁLISIS DETALLADO

import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

// Hooks
// Probablemente .js porque es un hook (lógica)
import { useGameState } from "./hooks/useGameState.js";

// Utils (lógica)
import { aiAlgorithms } from "./utils/AiAlgorithms.js";

// Components (casi seguro .jsx porque tienen HTML)
import { Board } from "./components/tresEnRaya/Board.jsx";
import { GameStatus } from "./components/tresEnRaya/GameStatus.jsx";
import { AlgorithmSelector } from "./components/tresEnRaya/AlgorithmSelector.jsx";
import { StatsPanel } from "./components/tresEnRaya/StatsPanel.jsx";
import { ComparisonPanel } from "./components/tresEnRaya/ComparisonPanel.jsx";
import { Scoreboard } from "./components/tresEnRaya/ScoreBoard.jsx";
import { InfoPanel } from "./components/tresEnRaya/InfoPanel.jsx";
import { DetailedTreeAnalysis } from "./components/tresEnRaya/DetailedTreeAnalysis.jsx";

const TicTacToe = () => {
  const gameState = useGameState();
  const [algorithm, setAlgorithm] = useState("minimax");
  const [thinking, setThinking] = useState(false);
  const [currentTreeData, setCurrentTreeData] = useState({ moves: [], selectedPosition: null });
  // const [currentTreeData, setCurrentTreeData] = useState([]);
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
          // console.log("Tree Data:", result.treeData);
          // setCurrentTreeData(result.treeData || []);
          // Guardar datos del árbol de decisión
          console.log("Tree Data:", result.treeData);
          console.log("Selected Move:", result.move);
          setCurrentTreeData({
            moves: result.treeData || [],
            selectedPosition: result.move
          });
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

  // const handleReset = () => {
  //   gameState.resetGame();
  //   setCurrentTreeData([]);
  // };
  const handleReset = () => {
    gameState.resetGame();
    setCurrentTreeData({ moves: [], selectedPosition: null });
  };
  // const handleAlgorithmChange = (newAlgorithm) => {
  //   setAlgorithm(newAlgorithm);
  //   setCurrentTreeData([]); // Limpiar árbol al cambiar algoritmo
  // };
  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setCurrentTreeData({ moves: [], selectedPosition: null });
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

              {/* <div className="text-center space-y-4">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-linear-to-r bg-blue-600 text-white rounded-lg font-semibold hover: transform hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Nuevo Juego
                </button>
              </div> */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                    onClick={handleReset}
                    style={{
                    padding: '12px 32px',
                    background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                    color: 'white',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <RotateCcw style={{ width: '20px', height: '20px' }} />
                    Nuevo Juego
                </button>
                </div>
              

              <InfoPanel />
            </div>

            {/* Análisis detallado del árbol de decisión */}
            {/* {currentTreeData.length > 0 && (
              <DetailedTreeAnalysis
                treeData={currentTreeData}
                algorithm={algorithm}
              />
            )} */}
            {currentTreeData.moves && currentTreeData.moves.length > 0 && (
              <DetailedTreeAnalysis
                treeData={currentTreeData.moves}
                algorithm={algorithm}
                selectedPosition={currentTreeData.selectedPosition}
              />
            )}
            {/* Ayuda cuando no hay árbol */}
            {/* {currentTreeData.length === 0 && !gameState.gameOver && (
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
            )} */}
            {(!currentTreeData.moves || currentTreeData.moves.length === 0) && !gameState.gameOver && (
              <div className="bg-white rounded-xl p-6">
                <div className="text-center text-gray-500">
                  <div className="text-lg font-semibold mb-2">
                    Esperando el movimiento del usuario
                  </div>
                  <div className="text-sm">
                    El análisis aparecerá después de que el agente haga su movimiento
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
