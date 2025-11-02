# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
#  Práctica IA - Algoritmos de Búsqueda

Implementación de algoritmos de búsqueda e inteligencia artificial aplicados a problemas clásicos.


##  Instalación y Configuración

### Prerequisitos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/MauryQV/practica_uno_ia.git
cd practica_uno_ia.git
```

2. **Crear entorno virtual**
```bash
# Windows
python -m venv venv

# Linux/Mac
python3 -m venv venv
```

3. **Activar el entorno virtual**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

##  Ejecución

Una vez configurado el entorno, ejecuta la aplicación principal:

```bash
python app.py
```

Se abrirá un menú interactivo donde podrás:
- Seleccionar el problema a resolver (Grupo 1 o Grupo 2)
- Elegir el algoritmo de búsqueda a utilizar
- Visualizar la solución en tiempo real
- Comparar resultados entre diferentes algoritmos

##  Tecnologías Utilizadas

- **Python 3.12** - Lenguaje de programación
- **Pygame** - Interfaz gráfica y visualización
- **NumPy** - Operaciones con matrices y estructuras de datos
- **Matplotlib** - Generación de gráficas comparativas

##  Estructura del Proyecto

```
practica_uno_ia/
│
├── app.py                    # Aplicación principal con menú
├── requirements.txt          # Dependencias del proyecto
├── README.md                 # Este archivo
│
├── problemas/
│   ├── problema1/           # Implementación del laberinto
│   └── problema2/        # Implementación del tres en raya
│
└── utils/                   # Utilidades y helpers
```

##  Evaluación de Algoritmos

El proyecto incluye métricas de evaluación para cada algoritmo:
- Tiempo de ejecución
- Nodos explorados
- Longitud de la solución
- Uso de memoria
- Optimalidad de la solución
