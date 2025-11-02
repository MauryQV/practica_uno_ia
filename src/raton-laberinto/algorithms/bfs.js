import { neighbors, key } from "../utils/mazeGenerator";

// Búsqueda en Anchura: garantiza el camino más corto en nº de pasos (costo uniforme).
export function bfs(grid, start, goal) {
  const q = [start];
  const visited = new Set([key(start)]);
  const parent = new Map();
  const visitOrder = [start];
  let expansions = 0;

  while (q.length) {
    const cur = q.shift();
    expansions++;

    if (cur.row === goal.row && cur.col === goal.col) {
      const path = reconstruct(parent, cur);
      return { path, visitOrder, stats: { expansions, pathLen: path.length } };
    }

    for (const nb of neighbors(grid, cur)) {
      const k = key(nb);
      if (!visited.has(k)) {
        visited.add(k);
        parent.set(k, cur);
        q.push(nb);
        visitOrder.push(nb);
      }
    }
  }

  return { path: [], visitOrder, stats: { expansions, pathLen: 0 }, notFound: true };
}

function reconstruct(parent, end) {
  const out = [end];
  let cur = end;
  while (parent.has(key(cur))) {
    cur = parent.get(key(cur));
    out.push(cur);
  }
  return out.reverse();
}
