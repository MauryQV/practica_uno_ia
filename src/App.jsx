// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import Home from './Home';
import TicTacToe from './TicTacToe'; // Mover tu código actual a este archivo
import LaberintoApp from './raton-laberinto/App';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tresEnRaya" element={<TicTacToe />} />
        <Route path="/laberinto" element={<LaberintoApp />} />
      </Routes>
    </Router>
  );
}

export default App;