import React, { useState, useEffect } from "react";
import { RotateCcw, ChevronDown, ChevronRight, TrendingUp, TrendingDown, Calculator, Trophy, Activity, Zap } from "lucide-react";
import { GameAnalysisSummary } from "./GameAnalysisSummary1";
// ============== UTILIDADES DEL JUEGO ==============
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const GameUtils = {
  calculateWinner: (squares) => {
    if (!squares) return null;
    for (let line of WINNING_LINES) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return null;
  },

  isDraw: (squares) => {
    if (!squares) return false;
    return !squares.includes(null) && !GameUtils.calculateWinner(squares);
  },

  countWinningLines: (squares, player) => {
    if (!squares) return 0;
    let count = 0;
    const opponent = player === 'X' ? 'O' : 'X';
    for (let line of WINNING_LINES) {
      const [a, b, c] = line;
      const positions = [squares[a], squares[b], squares[c]];
      if (!positions.includes(opponent)) {
        count++;
      }
    }
    return count;
  },

  analyzeState: (squares) => {
    if (!squares) {
      return {
        isTerminal: false,
        winner: null,
        maxLines: 0,
        minLines: 0,
        heuristic: 0,
        explanation: 'Estado inválido'
      };
    }

    const winner = GameUtils.calculateWinner(squares);
    if (winner) {
      return {
        isTerminal: true,
        winner: winner.winner,
        maxLines: winner.winner === 'X' ? 8 : 0,
        minLines: winner.winner === 'O' ? 8 : 0,
        heuristic: 0,
        explanation: `${winner.winner} ha ganado`
      };
    }

    if (GameUtils.isDraw(squares)) {
      return {
        isTerminal: true,
        winner: null,
        maxLines: 0,
        minLines: 0,
        heuristic: 0,
        explanation: 'Empate'
      };
    }

    const maxLines = GameUtils.countWinningLines(squares, 'X');
    const minLines = GameUtils.countWinningLines(squares, 'O');
    const heuristic = maxLines - minLines;

    return {
      isTerminal: false,
      winner: null,
      maxLines,
      minLines,
      heuristic,
      explanation: `MAX(X)=${maxLines} líneas - MIN(O)=${minLines} líneas = ${heuristic}`
    };
  },

  isWinningMove: (squares, position, player) => {
    const testSquares = [...squares];
    testSquares[position] = player;
    const winner = GameUtils.calculateWinner(testSquares);
    return winner && winner.winner === player;
  },

  getPositionPriority: (position) => {
    if (position === 4) return 3;
    if ([0, 2, 6, 8].includes(position)) return 2;
    return 1;
  }
};

// ============== ALGORITMOS DE IA ==============
const AIAlgorithms = {
  minimaxDetailed: (squares, depth, isMaximizing, stats, path = []) => {
    stats.nodes++;
    const analysis = GameUtils.analyzeState(squares);
    
    const nodeInfo = {
      depth,
      board: [...squares],
      isMaximizing,
      maxLines: analysis.maxLines,
      minLines: analysis.minLines,
      heuristic: analysis.heuristic,
      explanation: analysis.explanation,
      path: [...path]
    };
    
    if (analysis.isTerminal) {
      nodeInfo.isTerminal = true;
      nodeInfo.finalValue = analysis.heuristic;
      stats.evaluations.push(nodeInfo);
      
      if (analysis.winner === 'X') return 10 - depth;
      if (analysis.winner === 'O') return -10 + depth;
      return 0;
    }
    
    if (isMaximizing) {
      let best = -Infinity;
      const children = [];
      
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const boardAfterMove = [...squares];
          const childValue = AIAlgorithms.minimaxDetailed(
            squares, depth + 1, false, stats, [...path, { pos: i, player: 'X' }]
          );
          squares[i] = null;
          children.push({ position: i, value: childValue, board: boardAfterMove });
          best = Math.max(best, childValue);
        }
      }
      
      nodeInfo.children = children;
      nodeInfo.chosenValue = best;
      nodeInfo.type = 'MAX';
      stats.evaluations.push(nodeInfo);
      return best;
    } else {
      let best = Infinity;
      const children = [];
      
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const boardAfterMove = [...squares];
          const childValue = AIAlgorithms.minimaxDetailed(
            squares, depth + 1, true, stats, [...path, { pos: i, player: 'O' }]
          );
          squares[i] = null;
          children.push({ position: i, value: childValue, board: boardAfterMove });
          best = Math.min(best, childValue);
        }
      }
      
      nodeInfo.children = children;
      nodeInfo.chosenValue = best;
      nodeInfo.type = 'MIN';
      stats.evaluations.push(nodeInfo);
      return best;
    }
  },

  alphabetaDetailed: (squares, depth, alpha, beta, isMaximizing, stats, path = []) => {
    stats.nodes++;
    const analysis = GameUtils.analyzeState(squares);
    
    const nodeInfo = {
      depth,
      board: [...squares],
      isMaximizing,
      maxLines: analysis.maxLines,
      minLines: analysis.minLines,
      heuristic: analysis.heuristic,
      explanation: analysis.explanation,
      alpha,
      beta,
      path: [...path],
      pruned: false
    };
    
    if (analysis.isTerminal) {
      nodeInfo.isTerminal = true;
      nodeInfo.finalValue = analysis.heuristic;
      stats.evaluations.push(nodeInfo);
      
      if (analysis.winner === 'X') return 10 - depth;
      if (analysis.winner === 'O') return -10 + depth;
      return 0;
    }
    
    if (isMaximizing) {
      let best = -Infinity;
      const children = [];
      let currentAlpha = alpha;
      
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const boardAfterMove = [...squares];
          const childValue = AIAlgorithms.alphabetaDetailed(
            squares, depth + 1, currentAlpha, beta, false, stats, [...path, { pos: i, player: 'X' }]
          );
          squares[i] = null;
          
          children.push({ 
            position: i, 
            value: childValue, 
            board: boardAfterMove,
            alpha: currentAlpha,
            beta: beta,
            wasPruned: false
          });
          
          best = Math.max(best, childValue);
          currentAlpha = Math.max(currentAlpha, best);
          
          if (beta <= currentAlpha) {
            nodeInfo.pruned = true;
            nodeInfo.prunedAfterPosition = i;
            nodeInfo.pruneReason = `β(${beta}) ≤ α(${currentAlpha}) - Poda en nodo MAX`;
            
            for (let j = i + 1; j < 9; j++) {
              if (squares[j] === null) {
                children.push({
                  position: j,
                  value: null,
                  board: null,
                  alpha: currentAlpha,
                  beta: beta,
                  wasPruned: true,
                  pruneReason: `Podado por β(${beta}) ≤ α(${currentAlpha})`
                });
              }
            }
            
            stats.pruned = (stats.pruned || 0) + (9 - i - 1);
            break;
          }
        }
      }
      
      nodeInfo.children = children;
      nodeInfo.chosenValue = best;
      nodeInfo.type = 'MAX';
      nodeInfo.finalAlpha = currentAlpha;
      stats.evaluations.push(nodeInfo);
      return best;
    } else {
      let best = Infinity;
      const children = [];
      let currentBeta = beta;
      
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const boardAfterMove = [...squares];
          const childValue = AIAlgorithms.alphabetaDetailed(
            squares, depth + 1, alpha, currentBeta, true, stats, [...path, { pos: i, player: 'O' }]
          );
          squares[i] = null;
          
          children.push({ 
            position: i, 
            value: childValue, 
            board: boardAfterMove,
            alpha: alpha,
            beta: currentBeta,
            wasPruned: false
          });
          
          best = Math.min(best, childValue);
          currentBeta = Math.min(currentBeta, best);
          
          if (currentBeta <= alpha) {
            nodeInfo.pruned = true;
            nodeInfo.prunedAfterPosition = i;
            nodeInfo.pruneReason = `β(${currentBeta}) ≤ α(${alpha}) - Poda en nodo MIN`;
            
            for (let j = i + 1; j < 9; j++) {
              if (squares[j] === null) {
                children.push({
                  position: j,
                  value: null,
                  board: null,
                  alpha: alpha,
                  beta: currentBeta,
                  wasPruned: true,
                  pruneReason: `Podado por β(${currentBeta}) ≤ α(${alpha})`
                });
              }
            }
            
            stats.pruned = (stats.pruned || 0) + (9 - i - 1);
            break;
          }
        }
      }
      
      nodeInfo.children = children;
      nodeInfo.chosenValue = best;
      nodeInfo.type = 'MIN';
      nodeInfo.finalBeta = currentBeta;
      stats.evaluations.push(nodeInfo);
      return best;
    }
  },

  findBestMove: (squares, algorithm) => {
    const stats = { nodes: 0, pruned: 0, evaluations: [] };
    const startTime = performance.now();
    let bestMove = -1;
    let bestVal = Infinity;
    const rootMoves = [];
    let tiebreakReason = '';

    let globalAlpha = -Infinity;
    let globalBeta = Infinity;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const moveStats = { nodes: 0, pruned: 0, evaluations: [] };
        squares[i] = 'O';
        const stateAnalysis = GameUtils.analyzeState(squares);
        const isWinning = GameUtils.isWinningMove(squares, i, 'O');
        
        let moveVal;
        let rootAlpha = globalAlpha;
        let rootBeta = globalBeta;
        
        if (algorithm === 'minimax') {
          moveVal = AIAlgorithms.minimaxDetailed([...squares], 0, true, moveStats, [{ pos: i, player: 'O' }]);
        } else {
          moveVal = AIAlgorithms.alphabetaDetailed([...squares], 0, globalAlpha, globalBeta, true, moveStats, [{ pos: i, player: 'O' }]);
          globalBeta = Math.min(globalBeta, moveVal);
          
          if (moveStats.evaluations.length > 0) {
            const firstEval = moveStats.evaluations[0];
            if (firstEval.finalAlpha !== undefined) rootAlpha = firstEval.finalAlpha;
            if (firstEval.finalBeta !== undefined) rootBeta = firstEval.finalBeta;
          }
        }
        
        squares[i] = null;

        rootMoves.push({
          position: i,
          value: moveVal,
          nodesExplored: moveStats.nodes,
          pruned: moveStats.pruned,
          alpha: rootAlpha,
          beta: rootBeta,
          maxLines: stateAnalysis.maxLines,
          minLines: stateAnalysis.minLines,
          heuristic: stateAnalysis.heuristic,
          explanation: stateAnalysis.explanation,
          isMaximizing: false,
          depth: 0,
          children: (() => {
            const rootNode = moveStats.evaluations.find(e => e.depth === 0);
            if (rootNode && rootNode.children) {
              return rootNode.children;
            }
            return moveStats.evaluations.filter(e => e.depth === 1);
          })(),
          isWinningMove: isWinning,
          positionPriority: GameUtils.getPositionPriority(i)
        });

        stats.nodes += moveStats.nodes;
        stats.pruned += moveStats.pruned;
        stats.evaluations.push(...moveStats.evaluations);

        if (moveVal < bestVal) {
          bestMove = i;
          bestVal = moveVal;
          tiebreakReason = '';
        } else if (moveVal === bestVal) {
          const currentBestMove = rootMoves.find(m => m.position === bestMove);
          
          if (isWinning && !currentBestMove.isWinningMove) {
            bestMove = i;
            tiebreakReason = 'Jugada ganadora inmediata';
          } else if (!isWinning && currentBestMove.isWinningMove) {
            // Mantener el actual
          } else if (stateAnalysis.heuristic < currentBestMove.heuristic) {
            bestMove = i;
            tiebreakReason = `Mejor heurística: ${stateAnalysis.heuristic} < ${currentBestMove.heuristic}`;
          } else if (stateAnalysis.heuristic === currentBestMove.heuristic) {
            if (GameUtils.getPositionPriority(i) > currentBestMove.positionPriority) {
              bestMove = i;
              tiebreakReason = `Posición prioritaria (${i === 4 ? 'centro' : [0,2,6,8].includes(i) ? 'esquina' : 'lado'})`;
            } else if (GameUtils.getPositionPriority(i) === currentBestMove.positionPriority && !tiebreakReason) {
              tiebreakReason = 'Primera opción encontrada (orden de exploración)';
            }
          }
        }
      }
    }

    const endTime = performance.now();
    rootMoves.sort((a, b) => a.value - b.value);

    return {
      move: bestMove,
      nodes: stats.nodes,
      time: (endTime - startTime).toFixed(2),
      pruned: stats.pruned,
      treeData: rootMoves,
      fullTree: stats.evaluations,
      tiebreakReason
    };
  }
};

// ============== COMPONENTES ==============
const Square = ({ value, onClick, isWinning, isLastMove, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-24 h-24 text-4xl font-bold rounded-lg transition-all duration-200
      ${value === "X" ? "text-blue-500" : "text-red-500"}
      ${isWinning ? "bg-green-200 scale-105" : "bg-white hover:bg-gray-50"}
      ${isLastMove && !isWinning ? "ring-4 ring-yellow-400" : ""}
      ${!value && !disabled ? "hover:shadow-lg cursor-pointer" : ""}
      ${disabled ? "cursor-not-allowed" : ""}
      shadow-md
    `}
  >
    {value}
  </button>
);

const Board = ({ board, onSquareClick, winner, lastMove, disabled }) => (
  <div className="inline-grid grid-cols-3 gap-3 p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
    {board.map((value, i) => (
      <Square
        key={i}
        value={value}
        onClick={() => onSquareClick(i)}
        isWinning={winner?.line?.includes(i)}
        isLastMove={lastMove === i}
        disabled={disabled || !!value}
      />
    ))}
  </div>
);

const MiniBoard = ({ position, board }) => {
  const displayBoard = board || Array(9).fill(null);
  if (!board && position >= 0) displayBoard[position] = "O";

  return (
    <div className="grid grid-cols-3 gap-0.5 w-16 h-16 bg-gray-300 p-1 rounded">
      {displayBoard.map((cell, i) => (
        <div
          key={i}
          className={`flex items-center justify-center text-xs font-bold ${
            cell === "X" ? "bg-blue-500 text-white" :
            cell === "O" ? "bg-red-500 text-white" :
            "bg-white text-gray-300"
          }`}
        >
          {cell || ""}
        </div>
      ))}
    </div>
  );
};

const DetailedAnalysis = ({ treeData, algorithm, selectedPosition, tiebreakReason }) => {
  const [expandedMove, setExpandedMove] = useState(null);

  if (!treeData || treeData.length === 0) return null;

  const bestMove = treeData.find(m => m.position === selectedPosition) || treeData[0];
  const tiedMoves = treeData.filter(m => m.value === bestMove.value);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-purple-600" />
        Análisis Detallado - {algorithm === "minimax" ? "Minimax" : "Poda Alfa-Beta"}
      </h3>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
        <div className="font-semibold text-gray-800 mb-2">
          {algorithm === "minimax" ? "Algoritmo Minimax:" : "Algoritmo Poda Alfa-Beta:"}
        </div>
        <div className="text-sm space-y-2">
          {algorithm === "minimax" ? (
            <>
              <div>📊 <strong>Explora TODOS los nodos</strong> del árbol de decisión</div>
              <div>🔄 Alterna entre niveles MAX (jugador) y MIN (IA)</div>
              <div>🎯 MIN busca el <strong>menor valor</strong> (mejor para O)</div>
            </>
          ) : (
            <>
              <div>✂️ <strong>Poda ramas innecesarias</strong> que no afectan la decisión</div>
              <div>📉 Condición de poda: <strong>β ≤ α</strong></div>
              <div>⚡ Mismo resultado óptimo que Minimax, pero más eficiente</div>
            </>
          )}
          <div className="mt-2 font-mono bg-white px-3 py-2 rounded border border-gray-300">
            f(v) = MAX(X) - MIN(O) = jugadas_X - jugadas_O
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
        <div className="flex items-center gap-4">
          <div><MiniBoard position={bestMove.position} /></div>
          <div className="flex-1">
            <div className="text-sm text-gray-600">✓ Movimiento Elegido por MIN (IA):</div>
            <div className="text-2xl font-bold text-green-700">Posición {bestMove.position}</div>
            <div className="text-sm text-gray-700 mt-1">
              <span className="font-mono bg-white px-2 py-1 rounded border">
                f(v) = {bestMove.maxLines} - {bestMove.minLines} = {bestMove.heuristic}
              </span>
            </div>
            {tiedMoves.length > 1 && tiebreakReason && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded text-sm">
                <strong>⚖️ Desempate:</strong> {tiebreakReason}
                <div className="text-xs text-gray-600 mt-1">
                  Otros {tiedMoves.length - 1} movimiento(s) con valor {bestMove.value}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2">
              <th className="p-3 text-left">Tablero</th>
              <th className="p-3 text-center">Pos</th>
              <th className="p-3 text-center">MAX(X)</th>
              <th className="p-3 text-center">MIN(O)</th>
              <th className="p-3 text-center">f(v)</th>
              {algorithm === "alphabeta" && <th className="p-3 text-center">α, β</th>}
              <th className="p-3 text-center">Valor Final</th>
              <th className="p-3 text-center">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {treeData.map((move, idx) => (
              <React.Fragment key={idx}>
                <tr
                  className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                    move.position === bestMove.position ? "bg-green-50 font-semibold" : ""
                  }`}
                  onClick={() => setExpandedMove(expandedMove === idx ? null : idx)}
                >
                  <td className="p-3"><MiniBoard position={move.position} /></td>
                  <td className="p-3 text-center">
                    <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center font-bold text-lg ${
                      move.position === bestMove.position ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                      {move.position}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-blue-600">{move.maxLines}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="font-bold text-red-600">{move.minLines}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {move.maxLines} - {move.minLines}
                    </div>
                    <div className={`font-bold text-lg ${
                      move.heuristic > 0 ? "text-blue-600" :
                      move.heuristic < 0 ? "text-red-600" : "text-gray-600"
                    }`}>
                      = {move.heuristic}
                    </div>
                  </td>
                  {algorithm === "alphabeta" && (
                    <td className="p-3 text-center">
                      <div className="text-xs font-mono">
                        <div className="text-blue-600">α: {(move.alpha === undefined || move.alpha === -Infinity) ? "-∞" : move.alpha}</div>
                        <div className="text-red-600">β: {(move.beta === undefined || move.beta === Infinity) ? "+∞" : move.beta}</div>
                      </div>
                    </td>
                  )}
                  <td className="p-3 text-center">
                    <div className={`text-2xl font-bold ${
                      move.value > 0 ? "text-green-600" :
                      move.value < 0 ? "text-red-600" : "text-gray-600"
                    }`}>
                      {move.value}
                    </div>
                    <div className="text-xs text-gray-500">{move.nodesExplored} nodos</div>
                    {algorithm === "alphabeta" && move.children && move.children.some(c => c.wasPruned) && (
                      <div className="flex items-center justify-center gap-1 mt-2 px-2 py-1 bg-red-100 rounded border-2 border-red-400">
                        <span className="text-2xl">✂️</span>
                        <div className="text-sm font-semibold text-red-700">
                          <div>
                            {move.children.filter(c => c.wasPruned).length} PODADOS
                          </div>
                          <div className="text-xs text-red-600">
                            de {move.children.length} hijos
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      {expandedMove === idx ? 
                        <ChevronDown className="w-5 h-5" /> : 
                        <ChevronRight className="w-5 h-5" />
                      }
                    </button>
                  </td>
                </tr>
                {expandedMove === idx && move.children && move.children.length > 0 && (
                  <tr>
                    <td colSpan={algorithm === "alphabeta" ? "8" : "7"} className="p-4 bg-blue-50">
                      <div className="text-sm">
                        <div className="font-semibold mb-3 text-blue-900 flex items-center justify-between">
                          <span>📊 Nivel MAX (Jugador X busca maximizar):</span>
                          {algorithm === "alphabeta" && move.children.some(c => c.wasPruned) && (
                            <span className="text-red-600 flex items-center gap-2 bg-red-100 px-3 py-1 rounded-lg border-2 border-red-300">
                              <span className="text-lg">✂️</span>
                              <span className="font-bold">
                                {move.children.filter(c => c.wasPruned).length} ramas podadas
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {move.children.map((child, cidx) => {
                            if (child.wasPruned) {
                              return (
                                <div key={cidx} className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-4 border-red-400 relative">
                                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">✂️</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-red-200 rounded-lg flex items-center justify-center border-2 border-red-400">
                                      <span className="text-4xl font-bold text-red-500">✗</span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-xs text-red-700 font-bold mb-1">Posición {child.position}</div>
                                      <div className="font-bold text-red-600 text-lg mb-2">🚫 NO EXPLORADO</div>
                                      <div className="text-xs text-red-700 bg-white p-2 rounded border-2 border-red-300 font-semibold">
                                        {child.pruneReason}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            
                            if (!child.board) {
                              return (
                                <div key={cidx} className="p-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                                  <div className="text-center text-gray-500 text-sm">
                                    Datos no disponibles
                                  </div>
                                </div>
                              );
                            }
                            
                            const analysis = GameUtils.analyzeState(child.board);
                            
                            return (
                              <div key={cidx} className="p-3 bg-white rounded-lg border-2 border-green-300 shadow-sm">
                                <div className="flex items-center gap-3">
                                  <MiniBoard position={-1} board={child.board} />
                                  <div className="flex-1">
                                    <div className="text-xs text-gray-600 mb-1">✓ X en posición {child.position}</div>
                                    <div className="font-bold text-blue-700 text-lg">
                                      Valor: {child.value}
                                    </div>
                                    <div className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded mt-1">
                                      f(v) = {analysis.maxLines} - {analysis.minLines} = {analysis.heuristic}
                                    </div>
                                    {algorithm === "alphabeta" && (
                                      <div className="text-xs font-mono mt-1 bg-blue-50 px-2 py-1 rounded">
                                        <span className="text-blue-600 font-bold">α:{child.alpha === -Infinity ? "-∞" : child.alpha}</span> 
                                        {" "}
                                        <span className="text-red-600 font-bold">β:{child.beta === Infinity ? "+∞" : child.beta}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 text-xs text-gray-700 bg-white p-3 rounded-lg border-2 border-blue-300">
                          <strong>💡 Interpretación:</strong> MAX elige el valor <strong>más alto</strong>: {move.children.filter(c => !c.wasPruned && c.value !== null).length > 0 ? Math.max(...move.children.filter(c => !c.wasPruned && c.value !== null).map(c => c.value)) : 'N/A'}. 
                          Luego MIN (en el nivel padre) elige el <strong>más bajo</strong> entre todas sus opciones.
                          {algorithm === "alphabeta" && move.children.some(c => c.wasPruned) && (
                            <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500">
                              <strong className="text-red-700">🔍 Poda Alfa-Beta:</strong> Se <strong>descartaron {move.children.filter(c => c.wasPruned).length} rama(s)</strong> porque ya sabíamos que no podían mejorar el resultado. ¡Esto ahorra explorar muchos nodos innecesarios!
                            </div>
                          )}
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

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-semibold mb-2">🔍 Interpretación de los valores:</div>
        <div className="text-sm space-y-1 text-gray-700">
          <div>• <strong>f(v) negativo:</strong> Ventaja para MIN (O/IA) - ¡Bueno para el agente!</div>
          <div>• <strong>f(v) positivo:</strong> Ventaja para MAX (X/Jugador) - Malo para el agente</div>
          <div>• <strong>Valor Final:</strong> Resultado después de explorar todo el subárbol</div>
          <div>• <strong>MIN busca minimizar:</strong> Elige el valor más bajo (más negativo es mejor)</div>
        </div>
      </div>
    </div>
  );
};

// ============== COMPONENTE PRINCIPAL ==============
const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [algorithm, setAlgorithm] = useState("minimax");
  const [thinking, setThinking] = useState(false);
  const [currentTreeData, setCurrentTreeData] = useState({ moves: [], selectedPosition: null, tiebreakReason: '' });
  const [stats, setStats] = useState({
    minimax: { nodes: 0, time: 0 },
    alphabeta: { nodes: 0, time: 0 }
  });
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [gameStats, setGameStats] = useState({
  totalMoves: 0,
  totalNodes: 0,
  totalTime: 0,
  totalPruned: 0,
  moves: [],

});

  useEffect(() => {
    const winnerResult = GameUtils.calculateWinner(board);
    if (winnerResult) {
      setWinner(winnerResult);
      setGameOver(true);
      setScores(prev => ({
        ...prev,
        [winnerResult.winner.toLowerCase()]: prev[winnerResult.winner.toLowerCase()] + 1
      }));
    } else if (GameUtils.isDraw(board)) {
      setGameOver(true);
      setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
    }
  }, [board]);

  useEffect(() => {
    if (!isXNext && !gameOver) {
      setThinking(true);
      setTimeout(() => {
        const result = AIAlgorithms.findBestMove([...board], algorithm);
        if (result.move !== -1) {
          const newBoard = [...board];
          newBoard[result.move] = "O";
          setBoard(newBoard);
          setLastMove(result.move);
          setIsXNext(true);

          setStats(prev => ({
            ...prev,
            [algorithm]: { nodes: result.nodes, time: result.time }
          }));

        // Actualizar estadísticas acumuladas del juego
          setGameStats((prev) => {

            const newStats = {
              totalMoves: prev.totalMoves + 1,
              totalNodes: prev.totalNodes + result.nodes,
              totalTime: prev.totalTime + parseFloat(result.time || 0),
              totalPruned: prev.totalPruned + (result.pruned || 0),
              moves: [
                ...prev.moves,
                {
                  moveNumber: prev.totalMoves + 1,
                  position: result.move,
                  nodes: result.nodes,
                  time: result.time,
                  pruned: result.pruned || 0,
                },
              ],
            };
            return newStats;
          });
          setCurrentTreeData({
            moves: result.treeData || [],
            selectedPosition: result.move,
            tiebreakReason: result.tiebreakReason
          });
        }
        setThinking(false);
      }, 500);
    }
  }, [isXNext, board, gameOver, algorithm]);

  const handleSquareClick = (i) => {
    if (!isXNext || thinking || board[i] || gameOver) return;
    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setLastMove(i);
    setIsXNext(false);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameOver(false);
    setLastMove(null);
    setCurrentTreeData({ moves: [], selectedPosition: null, tiebreakReason: '' });
    setGameStats({
      totalMoves: 0,
      totalNodes: 0,
      totalTime: 0,
      totalPruned: 0,
      moves: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tres en Raya - Búsqueda con Adversario
          </h1>
          <p className="text-gray-600 text-lg">
            Análisis Completo: Minimax vs Poda Alfa-Beta (Russell & Norvig)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Algoritmo del Agente
              </h3>
              <div className="space-y-2">
              <div className="space-y-2">
                {["minimax", "alphabeta"].map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setAlgorithm(algo)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 
                        algorithm === algo
                          ? algo === "minimax"
                            ? "#16a34a"  // verde para minimax
                            : "#2563eb"  // azul para alphabeta
                          : "#f3f4f6",   // gris cuando no está seleccionado
                      color: algorithm === algo ? "white" : "#374151"
                    }}
                    onMouseEnter={(e) => {
                      if (algorithm !== algo) {
                        e.currentTarget.style.backgroundColor = '#e5e7eb';              e.currentTarget.style.backgroundColor = '#e5e7eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (algorithm !== algo) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';              e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                  >
                    {algo === "minimax" ? "Minimax" : "Alfa-Beta"}
                  </button>
                ))}

              </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Último Movimiento
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nodos explorados:</span>
                  <span className="font-bold text-2xl text-blue-600">
                    {stats[algorithm].nodes}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tiempo:</span>
                  <span className="font-bold text-lg text-purple-600">
                    {stats[algorithm].time} ms
                  </span>
                </div>
                {thinking && (
                  <div className="text-center py-2">
                    <div className="animate-pulse text-purple-600 font-semibold">
                      Agente pensando...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/** Comparación de Eficiencia */}
            {/* {stats.minimax.nodes > 0 && stats.alphabeta.nodes > 0 && (
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Comparación de Eficiencia
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
                        {((stats.minimax.nodes - stats.alphabeta.nodes) / stats.minimax.nodes * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Reducción con poda</div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Marcador
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{scores.x}</div>
                  <div className="text-xs text-gray-600">Jugador (X)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{scores.draw}</div>
                  <div className="text-xs text-gray-600">Empates</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{scores.o}</div>
                  <div className="text-xs text-gray-600">Agente (O)</div>
                </div>
              </div>
            </div>
            {/* Game Analysis Summary */}
            {gameOver && gameStats?.totalMoves > 0 && (
              <GameAnalysisSummary
                gameStats={gameStats}
                algorithm={algorithm}
              />
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                {gameOver ? (
                  <div className="text-3xl font-bold">
                    {winner ? (
                      <span className={winner.winner === "X" ? "text-blue-600" : "text-red-600"}>
                        ¡Gana {winner.winner === "X" ? "Jugador (X)" : "Agente (O)"}!
                      </span>
                    ) : (
                      <span className="text-gray-600">¡Empate!</span>
                    )}
                  </div>
                ) : (
                  <div className="text-2xl font-semibold text-gray-700">
                    Turno: {isXNext ? "Jugador (X)" : "Agente (O)"}
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-6">
                <Board
                  board={board}
                  onSquareClick={handleSquareClick}
                  winner={winner}
                  lastMove={lastMove}
                  disabled={gameOver || !isXNext || thinking}
                />
              </div>

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

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">📚 Funcionamiento</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Minimax:</strong> Explora TODO el árbol de decisión (Russell & Norvig, Cap. 5)</li>
                  <li><strong>Alfa-Beta:</strong> Poda ramas que no afectan la decisión (β ≤ α)</li>
                  <li><strong>Niveles:</strong> MAX (jugador) → MIN (IA) → MAX → MIN...</li>
                  <li><strong>Criterios de desempate:</strong> 1) Jugada ganadora, 2) Heurística, 3) Posición prioritaria</li>
                  <li>El agente juega de forma <strong>óptima</strong> - no se le puede ganar (empate garantizado)</li>
                </ul>
              </div>
            </div>

            {currentTreeData.moves && currentTreeData.moves.length > 0 && (
              <DetailedAnalysis
                treeData={currentTreeData.moves}
                algorithm={algorithm}
                selectedPosition={currentTreeData.selectedPosition}
                tiebreakReason={currentTreeData.tiebreakReason}
              />
            )}

            {(!currentTreeData.moves || currentTreeData.moves.length === 0) && !gameOver && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-center text-gray-500">
                  <div className="text-lg font-semibold mb-2">
                    🎮 Esperando tu movimiento
                  </div>
                  <div className="text-sm">
                    Haz clic en una casilla para jugar. El análisis del árbol de decisión aparecerá después del movimiento del agente.
                  </div>
                </div>
              </div>
            )}

            {currentTreeData.moves && currentTreeData.moves.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg border-2 border-yellow-300">
                <h3 className="text-lg font-bold mb-3 text-gray-800">
                  ⚖️ Criterios de Desempate (Russell & Norvig)
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="p-3 bg-white rounded border-l-4 border-green-500">
                    <strong>1. Jugada Ganadora Inmediata:</strong> Si hay una jugada que gana el juego inmediatamente, se elige automáticamente.
                  </div>
                  <div className="p-3 bg-white rounded border-l-4 border-blue-500">
                    <strong>2. Mejor Heurística:</strong> Si varios movimientos tienen el mismo valor final, se elige el que tiene la heurística más favorable (más negativa para MIN).
                  </div>
                  <div className="p-3 bg-white rounded border-l-4 border-purple-500">
                    <strong>3. Posición Prioritaria:</strong> Centro {'>'} Esquinas {'>'} Lados (estrategia clásica del tres en raya).
                  </div>
                  <div className="p-3 bg-white rounded border-l-4 border-gray-500">
                    <strong>4. Orden de Exploración:</strong> Si todo lo demás es igual, se elige el primer movimiento encontrado (posición más baja).
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