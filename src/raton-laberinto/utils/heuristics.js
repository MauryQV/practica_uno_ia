// Distancia de Manhattan: |x1-x2| + |y1-y2|
// Admisible y consistente en grillas 4-conectadas con costo uniforme 1.
export function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}
