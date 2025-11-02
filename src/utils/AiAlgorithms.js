// utils/aiAlgorithms.js - VERSIÓN CON ANÁLISIS DETALLADO

import { gameUtils } from './GameUtils.js';

export const aiAlgorithms = {
  // Minimax con captura de información detallada
  minimaxDetailed: (squares, depth, isMaximizing, stats, path = []) => {
    stats.nodes++;
    
    // Analizar el estado actual
    const analysis = gameUtils.analyzeState(squares);
    
    // Guardar información de este nodo
    const nodeInfo = {
      depth,
      board: [...squares],
      boardKey: gameUtils.getBoardKey(squares),
      isMaximizing,
      maxLines: analysis.maxLines,
      minLines: analysis.minLines,
      heuristic: analysis.heuristic,
      explanation: analysis.explanation,
      path: [...path]
    };
    
    // Si es terminal o llegamos a profundidad máxima, retornar
    if (analysis.isTerminal) {
      nodeInfo.isTerminal = true;
      nodeInfo.finalValue = analysis.heuristic;
      stats.evaluations.push(nodeInfo);
      
      if (analysis.winner === 'X') return 10 - depth;
      if (analysis.winner === 'O') return -10 + depth;
      return 0;
    }
    
    // Estado no terminal
    if (isMaximizing) {
      let best = -Infinity;
      const children = [];
      
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const childValue = aiAlgorithms.minimaxDetailed(
            squares, 
            depth + 1, 
            false, 
            stats,
            [...path, { pos: i, player: 'X' }]
          );
          squares[i] = null;
          
          children.push({ position: i, value: childValue });
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
          const childValue = aiAlgorithms.minimaxDetailed(
            squares, 
            depth + 1, 
            true, 
            stats,
            [...path, { pos: i, player: 'O' }]
          );
          squares[i] = null;
          
          children.push({ position: i, value: childValue });
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

  // Alfa-Beta con captura de información detallada
  alphabetaDetailed: (squares, depth, alpha, beta, isMaximizing, stats, path = []) => {
    stats.nodes++;
    
    const analysis = gameUtils.analyzeState(squares);
    
    const nodeInfo = {
      depth,
      board: [...squares],
      boardKey: gameUtils.getBoardKey(squares),
      isMaximizing,
      maxLines: analysis.maxLines,
      minLines: analysis.minLines,
      heuristic: analysis.heuristic,
      explanation: analysis.explanation,
      alpha,
      beta,
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
          const childValue = aiAlgorithms.alphabetaDetailed(
            squares, 
            depth + 1, 
            alpha, 
            beta, 
            false, 
            stats,
            [...path, { pos: i, player: 'X' }]
          );
          squares[i] = null;
          
          children.push({ position: i, value: childValue });
          best = Math.max(best, childValue);
          alpha = Math.max(alpha, best);
          
          if (beta <= alpha) {
            nodeInfo.pruned = true;
            nodeInfo.pruneReason = `β(${beta}) ≤ α(${alpha})`;
            stats.pruned = (stats.pruned || 0) + 1;
            break;
          }
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
          const childValue = aiAlgorithms.alphabetaDetailed(
            squares, 
            depth + 1, 
            alpha, 
            beta, 
            true, 
            stats,
            [...path, { pos: i, player: 'O' }]
          );
          squares[i] = null;
          
          children.push({ position: i, value: childValue });
          best = Math.min(best, childValue);
          beta = Math.min(beta, best);
          
          if (beta <= alpha) {
            nodeInfo.pruned = true;
            nodeInfo.pruneReason = `β(${beta}) ≤ α(${alpha})`;
            stats.pruned = (stats.pruned || 0) + 1;
            break;
          }
        }
      }
      
      nodeInfo.children = children;
      nodeInfo.chosenValue = best;
      nodeInfo.type = 'MIN';
      stats.evaluations.push(nodeInfo);
      
      return best;
    }
  },

  // Encontrar mejor movimiento con análisis completo
  findBestMove: (squares, algorithm) => {
    const stats = { 
      nodes: 0, 
      pruned: 0,
      evaluations: []  // Array con TODA la información de cada nodo
    };
    
    const startTime = performance.now();
    let bestMove = -1;
    let bestVal = Infinity;
    const rootMoves = [];

    // Evaluar cada movimiento posible
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const moveStats = { 
          nodes: 0, 
          pruned: 0,
          evaluations: []
        };
        
        squares[i] = 'O';
        
        // Analizar el estado después de este movimiento
        const stateAnalysis = gameUtils.analyzeState(squares);
        
        const moveVal = algorithm === 'minimax'
          ? aiAlgorithms.minimaxDetailed(
              [...squares], 
              0, 
              true,  // Siguiente es MAX (X)
              moveStats,
              [{ pos: i, player: 'O' }]
            )
          : aiAlgorithms.alphabetaDetailed(
              [...squares], 
              0, 
              -Infinity, 
              Infinity, 
              true,  // Siguiente es MAX (X)
              moveStats,
              [{ pos: i, player: 'O' }]
            );
        
        squares[i] = null;

        // Guardar información detallada de este movimiento
        rootMoves.push({
          position: i,
          value: moveVal,
          nodesExplored: moveStats.nodes,
          pruned: moveStats.pruned,
          maxLines: stateAnalysis.maxLines,
          minLines: stateAnalysis.minLines,
          heuristic: stateAnalysis.heuristic,
          explanation: stateAnalysis.explanation,
          isMaximizing: false,
          depth: 0,
          children: moveStats.evaluations.filter(e => e.depth === 1)
        });

        stats.nodes += moveStats.nodes;
        stats.pruned += moveStats.pruned;
        stats.evaluations.push(...moveStats.evaluations);

        if (moveVal < bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }

    const endTime = performance.now();

    // Ordenar por valor (mejor primero para MIN)
    rootMoves.sort((a, b) => a.value - b.value);

    return {
      move: bestMove,
      nodes: stats.nodes,
      time: (endTime - startTime).toFixed(2),
      pruned: stats.pruned,
      treeData: rootMoves,
      fullTree: stats.evaluations  // NUEVO: árbol completo con todos los detalles
    };
  }
};