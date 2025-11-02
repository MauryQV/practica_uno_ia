export default function NodeCell({ type }) {
  // type: 'wall' | 'start' | 'goal' | 'path' | 'visited' | 'empty'
  return <div className={`cell ${type}`} />;
}
