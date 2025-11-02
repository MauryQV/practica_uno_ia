// components/AlgorithmSelector.jsx

import React from "react";

export const AlgorithmSelector = ({ algorithm, onSelect }) => (
  <div 
    style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}
    // className="bg-white rounded-xl p-6 shadow-lg"
  >
    <h3 
      style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#1f2937'
      }}
      // className="text-xl font-bold mb-4"
    >
      Algoritmo del agente
    </h3>
    <div 
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
      // className="space-y-2"
    >
      {["minimax", "alphabeta"].map((algo) => (
        <button
          key={algo}
          onClick={() => onSelect(algo)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.3s',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 
              algorithm === algo
                ? algo === "minimax"
                  ? "#16a34a"  // verde para minimax
                  : "#2563eb"  // azul para alphabeta
                : "#f3f4f6",   // gris cuando no está seleccionado
            color: algorithm === algo ? "white" : "#374151"
          }}
          onMouseEnter={(e) => {
            if (algorithm !== algo) {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (algorithm !== algo) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          // className={`w-full p-3 rounded-lg font-semibold transition-all ${
          //   algorithm === algo
          //     ? algo === "minimax"
          //       ? "bg-green-600 text-white"
          //       : "bg-blue-600 text-white"
          //     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          // }`}
        >
          {algo === "minimax" ? "Minimax" : "Alfa-Beta"}
        </button>
      ))}
    </div>
  </div>
);