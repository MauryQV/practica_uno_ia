import { neighbors, key } from "../utils/mazeGenerator";
import { manhattan } from "../utils/heuristics";

// Cola de prioridad sencilla (suficiente para grillas chicas/medianas)
class PQueue {
  constructor(){ this.arr=[]; }
  push(item, f){ this.arr.push({item, f}); this.arr.sort((a,b)=>a.f-b.f); }
  pop(){ return this.arr.shift()?.item; }
  get size(){ return this.arr.length; }
}

export function astar(grid, start, goal) {
  const open = new PQueue();
  const g = new Map([[key(start), 0]]);
  const parent = new Map();
  const closed = new Set();
  const visitOrder = [start];
  let expansions = 0;

  open.push(start, manhattan(start, goal));

  while (open.size) {
    const cur = open.pop();
    const ck = key(cur);
    if (closed.has(ck)) continue;
    closed.add(ck);
    expansions++;

    if (cur.row === goal.row && cur.col === goal.col) {
      const path = reconstruct(parent, cur);
      return { path, visitOrder, stats: { expansions, pathLen: path.length } };
    }

    for (const nb of neighbors(grid, cur)) {
      const nk = key(nb);
      const tentative = g.get(ck) + 1; // costo por paso = 1
      if (!g.has(nk) || tentative < g.get(nk)) {
        g.set(nk, tentative);
        parent.set(nk, cur);
        const f = tentative + manhattan(nb, goal);
        open.push(nb, f);
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
