export default function ControlsPanel({ onRunBFS, onRunAStar, onReset, stats }) {
  return (
    <div className="controls">
      <button onClick={onRunBFS}>Ejecutar BFS</button>
      <button onClick={onRunAStar}>Ejecutar A*</button>
      <button className="secondary" onClick={onReset}>Reiniciar</button>

      {stats && (
        <div className="stats">
          <div><strong>Nodos expandidos:</strong> {stats.expansions}</div>
          <div><strong>Longitud del camino:</strong> {stats.pathLen}</div>
        </div>
      )}
    </div>
  );
}
