import NodeCell from "./NodeCell";

export default function LabyrinthBoard({ grid, start, goal, pathSet, visitedSet }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 28px)` }}>
      {grid.map((row, r) =>
        row.map((v, c) => {
          const k = `${r},${c}`;
          let type = v === 1 ? "wall" : "empty";
          if (visitedSet?.has(k)) type = "visited";
          if (pathSet?.has(k)) type = "path";
          if (r === start.row && c === start.col) type = "start";
          if (r === goal.row && c === goal.col) type = "goal";
          return <NodeCell key={k} type={type} />;
        })
      )}
    </div>
  );
}
