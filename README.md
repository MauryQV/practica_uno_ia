# 🎮 Raton y el queso y Tres en Raya - Instrucciones de Uso

**Práctica - Primer Parcial**

---

## Demostración en Línea

**Ver el proyecto funcionando**: [https://practica-uno-ia.vercel.app/]

> **Nota**: Puedes probar el proyecto directamente desde el navegador sin necesidad de instalación local.

---

## Instalación y Ejecución Local

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)

  - Descargar desde: [https://nodejs.org/](https://nodejs.org/)
  - Verificar instalación: `node --version`

- **npm** (se instala automáticamente con Node.js)
  - Verificar instalación: `npm --version`

### Pasos de Instalación

#### 1. Descomprimir el proyecto

```
# Si está en un archivo .zip
Descomprime el archivo en la ubicación deseada
```

#### 2. Abrir terminal en la carpeta del proyecto

```
# Navega a la carpeta del proyecto
cd ruta/donde/descomprimiste/Practica-Primer-Parcial
```

#### 3. Instalar dependencias

```
# Ejecuta este comando (tomará unos minutos)
npm install
```

> **Importante**: Este comando descargará todas las dependencias necesarias (~300MB). Es normal que tarde unos minutos.

#### 4. Ejecutar el proyecto

```
# Inicia el servidor de desarrollo
npm run dev
```

#### 5. Abrir en el navegador

Después de ejecutar el comando anterior, verás algo como:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Abre tu navegador** y ve a: `http://localhost:5173/`

---

## Detener el Proyecto

Para detener el servidor de desarrollo:

# En la terminal, presiona:

Ctrl + C

```

---

## Contenido del CD/Carpeta

```

Practica-Primer-Parcial/
├── src/ # Código fuente
├── public/ # Archivos estáticos
├── package.json # Dependencias del proyecto
├── README.md # Este archivo
└── [otros archivos de configuración]

```


---

##  Solución de Problemas Comunes

### Error: "node no se reconoce como comando"
**Solución**: Instala Node.js desde [nodejs.org](https://nodejs.org/)

### Error: "Cannot find module..."
**Solución**: Ejecuta nuevamente `npm install`

### Error: "Puerto 5173 en uso"
**Solución**: Cierra otras aplicaciones que usen ese puerto o cambia el puerto en `vite.config.js`

### La página no carga o muestra error
**Solución**:
1. Detén el servidor (Ctrl+C)
2. Ejecuta `npm install` nuevamente
3. Ejecuta `npm run dev`

---



---

##  Documentación Adicional

Para más información sobre los algoritmos implementados y el análisis técnico, consulte el código fuente en la carpeta `src/` o revisar el informe....

---

**Última actualización**: Noviembre 2025
```
