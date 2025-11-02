import { useMemo, useState } from "react";
import LabyrinthBoard from "./components/LabyrinthBoard";
import ControlsPanel from "./components/ControlsPanel";
import { demoMaze } from "./utils/mazeGenerator";
import { bfs } from "./algorithms/bfs";
import { astar } from "./algorithms/astar";
import "./components/labyrinth.css";

export default function LabyrinthApp() {
  const base = useMemo(() => demoMaze(), []);
  const [grid, setGrid] = useState(base.grid);
  const [start, setStart] = useState(base.start);
  const [goal, setGoal] = useState(base.goal);

  const [visitedSet, setVisitedSet] = useState(new Set());
  const [pathSet, setPathSet] = useState(new Set());
  const [stats, setStats] = useState(null);

  // Animación simple: primero pinta visitados, luego el camino solución
  function animate(visitOrder, path) {
    const vset = new Set();
    let i = 0;

    const vTimer = setInterval(() => {
      if (i >= visitOrder.length) {
        clearInterval(vTimer);
        const pset = new Set(path.map(p => `${p.row},${p.col}`));
        setPathSet(pset);
        return;
      }
      vset.add(`${visitOrder[i].row},${visitOrder[i].col}`);
      setVisitedSet(new Set(vset));
      i++;
    }, 10);
  }

  function run(algo) {
    setVisitedSet(new Set());
    setPathSet(new Set());
    setStats(null);

    const res = algo(grid, start, goal);
    setStats(res.stats);
    animate(res.visitOrder, res.path);
  }

  function reset() {
    const { grid, start, goal } = demoMaze();
    setGrid(grid); setStart(start); setGoal(goal);
    setVisitedSet(new Set()); setPathSet(new Set()); setStats(null);
  }

  return (
    <div className="labyrinth-app">
      <h2>Ratón & Laberinto — BFS vs A*</h2>

      <ControlsPanel
        onRunBFS={() => run(bfs)}
        onRunAStar={() => run(astar)}
        onReset={reset}
        stats={stats}
      />

      <LabyrinthBoard
        grid={grid}
        start={start}
        goal={goal}
        visitedSet={visitedSet}
        pathSet={pathSet}
      />

      <p className="legend">
        <span className="badge start"/> Ratón &nbsp;
        <span className="badge goal"/> Queso &nbsp;
        <span className="badge visited"/> Visitado &nbsp;
        <span className="badge path"/> Camino &nbsp;
        <span className="badge wall"/> Muro
      </p>
    </div>
  );
}
