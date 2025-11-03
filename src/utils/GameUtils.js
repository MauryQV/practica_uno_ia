// utils/GameUtils.js - VERSIÓN MEJORADA CON ANÁLISIS HEURÍSTICO

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
  [0, 4, 8], [2, 4, 6] // diagonales
];

export const gameUtils = {
  // Verificar ganador (sin cambios)
  calculateWinner: (squares) => {
    for (let line of WINNING_LINES) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return null;
  },

  // Verificar empate (sin cambios)
  isDraw: (squares) => {
    return !squares.includes(null) && !gameUtils.calculateWinner(squares);
  },

  // NUEVA FUNCIÓN: Contar líneas ganadoras disponibles para un jugador
  countWinningLines: (squares, player) => {
    let count = 0;
    const opponent = player === 'X' ? 'O' : 'X';

    for (let line of WINNING_LINES) {
      const [a, b, c] = line;
      const positions = [squares[a], squares[b], squares[c]];
      
      // Una línea es "ganadora disponible" si:
      // - No tiene fichas del oponente
      // - Puede ser completada por el jugador
      const hasOpponent = positions.includes(opponent);
      const hasPlayer = positions.includes(player);
      
      if (!hasOpponent) {
        count++;
      }
    }

    return count;
  },

  // NUEVA FUNCIÓN: Análisis detallado de un estado
// utils/GameUtils.js - FIX PARA HEURÍSTICA

// SOLO REEMPLAZA LA FUNCIÓN analyzeState:

analyzeState: (squares) => {
  // Verificar si hay ganador
  const winner = gameUtils.calculateWinner(squares);
  if (winner) {
    return {
      isTerminal: true,
      winner: winner.winner,
      maxLines: winner.winner === 'X' ? 8 : 0,
      minLines: winner.winner === 'O' ? 8 : 0,
      // ✅ FIX: No usar heurística en estados terminales
      // El valor terminal lo calcula minimaxDetailed (10/-10 con depth)
      heuristic: 0, // No importa, no se usa en terminales
      explanation: `${winner.winner} ha ganado`
    };
  }

  // Verificar empate
  if (gameUtils.isDraw(squares)) {
    return {
      isTerminal: true,
      winner: null,
      maxLines: 0,
      minLines: 0,
      heuristic: 0,
      explanation: 'Empate'
    };
  }

  // ✅ Estado no terminal: AQUÍ sí se usa la heurística
  const maxLines = gameUtils.countWinningLines(squares, 'X');
  const minLines = gameUtils.countWinningLines(squares, 'O');
  const heuristic = maxLines - minLines;

  return {
    isTerminal: false,
    winner: null,
    maxLines,
    minLines,
    heuristic, // Este es el f(v) = MAX - MIN que se muestra en la tabla
    explanation: `MAX(X)=${maxLines} líneas - MIN(O)=${minLines} líneas = ${heuristic}`
  };
},

  // NUEVA FUNCIÓN: Evaluar con explicación
  evaluateWithExplanation: (squares) => {
    const analysis = gameUtils.analyzeState(squares);
    return {
      score: analysis.heuristic,
      analysis: analysis
    };
  },

  // Evaluar estado (mejorada para usar heurística)
  evaluate: (squares) => {
    const analysis = gameUtils.analyzeState(squares);
    
    // Si es terminal, retornar valor absoluto
    if (analysis.isTerminal) {
      if (analysis.winner === 'X') return 10;
      if (analysis.winner === 'O') return -10;
      return 0;
    }
    
    // Si no es terminal, retornar heurística normalizada
    return analysis.heuristic;
  },

  // NUEVA FUNCIÓN: Crear mini-tablero visual en texto
  boardToString: (squares) => {
    const display = squares.map((s, i) => s || i);
    return `
     ${display[0]} | ${display[1]} | ${display[2]}
    -----------
     ${display[3]} | ${display[4]} | ${display[5]}
    -----------
     ${display[6]} | ${display[7]} | ${display[8]}
    `;
  },

  // NUEVA FUNCIÓN: Obtener representación compacta del tablero
  getBoardKey: (squares) => {
    return squares.map(s => s || '_').join('');
  }
};