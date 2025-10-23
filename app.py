import pygame
import sys

# Inicializar pygame
pygame.init()

# Configuración básica
ANCHO, ALTO = 600, 600
LINE_WIDTH = 15
BG_COLOR = (28, 170, 156)
LINE_COLOR = (23, 145, 135)
CIRCLE_COLOR = (239, 231, 200)
CROSS_COLOR = (84, 84, 84)

# Configurar ventana
pantalla = pygame.display.set_mode((ANCHO, ALTO))
pygame.display.set_caption("3 en Raya")

# Variables del juego
tablero = [[None]*3 for _ in range(3)]
jugador = "X"
juego_terminado = False

# Dibujar líneas del tablero
def dibujar_tablero():
    pantalla.fill(BG_COLOR)
    # Líneas verticales
    pygame.draw.line(pantalla, LINE_COLOR, (200, 0), (200, 600), LINE_WIDTH)
    pygame.draw.line(pantalla, LINE_COLOR, (400, 0), (400, 600), LINE_WIDTH)
    # Líneas horizontales
    pygame.draw.line(pantalla, LINE_COLOR, (0, 200), (600, 200), LINE_WIDTH)
    pygame.draw.line(pantalla, LINE_COLOR, (0, 400), (600, 400), LINE_WIDTH)

# Dibujar X o O
def dibujar_figuras():
    for fila in range(3):
        for col in range(3):
            if tablero[fila][col] == "O":
                pygame.draw.circle(pantalla, CIRCLE_COLOR, (int(col*200+100), int(fila*200+100)), 60, 15)
            elif tablero[fila][col] == "X":
                pygame.draw.line(pantalla, CROSS_COLOR, (col*200+40, fila*200+40), (col*200+160, fila*200+160), 15)
                pygame.draw.line(pantalla, CROSS_COLOR, (col*200+160, fila*200+40), (col*200+40, fila*200+160), 15)

# Comprobar ganador
def comprobar_ganador():
    # Filas
    for fila in range(3):
        if tablero[fila][0] == tablero[fila][1] == tablero[fila][2] and tablero[fila][0] is not None:
            dibujar_linea_horizontal(fila, tablero[fila][0])
            return True
    # Columnas
    for col in range(3):
        if tablero[0][col] == tablero[1][col] == tablero[2][col] and tablero[0][col] is not None:
            dibujar_linea_vertical(col, tablero[0][col])
            return True
    # Diagonales
    if tablero[0][0] == tablero[1][1] == tablero[2][2] and tablero[0][0] is not None:
        dibujar_linea_diagonal_principal(tablero[0][0])
        return True
    if tablero[2][0] == tablero[1][1] == tablero[0][2] and tablero[2][0] is not None:
        dibujar_linea_diagonal_inversa(tablero[2][0])
        return True
    return False

# Dibujar líneas ganadoras
def dibujar_linea_horizontal(fila, jugador):
    color = CROSS_COLOR if jugador == "X" else CIRCLE_COLOR
    y = fila * 200 + 100
    pygame.draw.line(pantalla, color, (15, y), (585, y), 15)

def dibujar_linea_vertical(col, jugador):
    color = CROSS_COLOR if jugador == "X" else CIRCLE_COLOR
    x = col * 200 + 100
    pygame.draw.line(pantalla, color, (x, 15), (x, 585), 15)

def dibujar_linea_diagonal_principal(jugador):
    color = CROSS_COLOR if jugador == "X" else CIRCLE_COLOR
    pygame.draw.line(pantalla, color, (15, 15), (585, 585), 15)

def dibujar_linea_diagonal_inversa(jugador):
    color = CROSS_COLOR if jugador == "X" else CIRCLE_COLOR
    pygame.draw.line(pantalla, color, (15, 585), (585, 15), 15)

# Reiniciar juego
def reiniciar():
    global tablero, jugador, juego_terminado
    jugador = "X"
    juego_terminado = False
    tablero = [[None]*3 for _ in range(3)]
    dibujar_tablero()

# Inicial
dibujar_tablero()

# Bucle principal
while True:
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if evento.type == pygame.MOUSEBUTTONDOWN and not juego_terminado:
            x, y = evento.pos
            fila = y // 200
            col = x // 200
            if tablero[fila][col] is None:
                tablero[fila][col] = jugador
                if comprobar_ganador():
                    juego_terminado = True
                jugador = "O" if jugador == "X" else "X"

        elif evento.type == pygame.MOUSEBUTTONDOWN and juego_terminado:
            reiniciar()

    dibujar_figuras()
    pygame.display.update()
