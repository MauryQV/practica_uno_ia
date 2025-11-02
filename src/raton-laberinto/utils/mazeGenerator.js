// Representación: 0 = libre, 1 = muro
// Devuelve { grid, start, goal }
export function demoMaze() {
  const grid = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,0,1,0,0,0,0],
    [0,0,0,1,0,1,0,1,1,0],
    [0,1,0,1,0,0,0,0,1,0],
    [0,1,0,1,1,1,1,0,1,0],
    [0,0,0,0,0,0,1,0,0,0],
    [1,1,1,1,1,0,1,1,1,0],
    [0,0,0,0,1,0,0,0,1,0],
    [0,1,1,0,1,1,1,0,1,0],
    [0,0,0,0,0,0,0,0,0,0],
  ];
  const start = { row: 0, col: 0 }; // ratón
  const goal  = { row: 9, col: 9 }; // queso
  return { grid, start, goal };
}

// Vecinos válidos (4-direcciones)
export function neighbors(grid, node) {
  const moves = [[1,0],[-1,0],[0,1],[0,-1]];
  const L = grid.length, C = grid[0].length;
  const res = [];
  for (const [dr, dc] of moves) {
    const r = node.row + dr, c = node.col + dc;
    if (r>=0 && r<L && c>=0 && c<C && grid[r][c] === 0) {
      res.push({ row: r, col: c });
    }
  }
  return res;
}

export function key(n){ return `${n.row},${n.col}`; }
