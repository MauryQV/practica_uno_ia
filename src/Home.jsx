import React from 'react';
import { Brain, Grid3x3, Compass, Sparkles, ArrowRight, Search, Gamepad2 } from 'lucide-react';

const Home = () => {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Inteligencia Artificial
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Búsqueda de Caminos & Juegos con Adversarios
          </p>
          <p className="text-sm text-gray-500">
            Implementación y comparación de algoritmos clásicos de IA
          </p>
        </div>
      </header>

      {/* Cards Container */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Card 1: Laberinto */}
          <div 
            onClick={() => navigateTo('/laberinto')} 
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-400 transform hover:-translate-y-2">
              {/* Header visual */}
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <Compass className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      El Ratón en el Laberinto
                    </h2>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Búsqueda de Caminos • Pathfinding
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    Algoritmos Implementados
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-700">BFS (Breadth-First Search)</p>
                        <p className="text-sm text-gray-500">Búsqueda en anchura no informada</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-700">A* (A-star)</p>
                        <p className="text-sm text-gray-500">Búsqueda informada con heurística Manhattan</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-4">
                    Encuentra el camino óptimo desde el ratón hasta el queso, comparando eficiencia entre búsqueda ciega e informada.
                  </p>
                  
                  <div className="flex items-center justify-between text-blue-600 font-semibold group-hover:text-blue-700">
                    <span>Explorar Laberinto</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Tres en Raya */}
          <div 
            onClick={() => navigateTo('/tresEnRaya')} 
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-400 transform hover:-translate-y-2">
              {/* Header visual */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <Grid3x3 className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Gamepad2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Tres en Raya
                    </h2>
                  </div>
                  <p className="text-purple-100 text-sm">
                    Búsqueda con Adversarios • Game Theory
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Algoritmos Implementados
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-700">Minimax</p>
                        <p className="text-sm text-gray-500">Algoritmo fundamental para juegos de adversarios</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-700">Poda Alfa-Beta</p>
                        <p className="text-sm text-gray-500">Optimización con reducción de nodos explorados</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-4">
                    Juega contra una IA perfecta y observa cómo ambos algoritmos toman decisiones óptimas con diferente eficiencia computacional.
                  </p>
                  
                  <div className="flex items-center justify-between text-purple-600 font-semibold group-hover:text-purple-700">
                    <span>Jugar Partida</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            Objetivo del Proyecto
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Este proyecto implementa y compara algoritmos clásicos de Inteligencia Artificial en dos dominios: 
            <span className="font-semibold text-gray-800"> búsqueda de caminos</span> (BFS vs A*) y 
            <span className="font-semibold text-gray-800"> juegos con adversarios</span> (Minimax vs Poda Alfa-Beta). 
            El análisis demuestra cómo los algoritmos informados y optimizados encuentran las mismas soluciones óptimas 
            explorando significativamente menos estados del espacio de búsqueda.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;