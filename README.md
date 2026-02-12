# G Pixel Art

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Un juego de aventura retro estilo 8/16 bits creado con HTML5, CSS3 y JavaScript puro (vanilla). Explora niveles, recolecta cristales mágicos y evita enemigos en esta aventura pixelada completamente funcional.

---

## Tabla de Contenidos

- [Características](#-características)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación Técnica](#-documentación-técnica)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Controles del Juego](#-controles-del-juego)
- [Elementos del Juego](#-elementos-del-juego)
- [Niveles](#-niveles)
- [Paleta de Colores](#-paleta-de-colores)
- [Compatibilidad](#-compatibilidad)
- [Mejoras Futuras](#-mejoras-futuras)

---

## Características

### Gameplay
- **Aventura RPG minimalista** con mecánicas simples pero adictivas
- **Sistema de recolección** de cristales, pociones y llaves
- **Enemigos variados** con comportamientos únicos (Slimes y Bolas de Fuego)
- **3 niveles progresivos** con dificultad creciente
- **Sistema de vidas** (3 vidas) e invulnerabilidad temporal (2 segundos)
- **Puntuación y high score** guardados en LocalStorage
- **Sistema de pausa** con tecla ESC

### Gráficos Pixel Art
- Resolución nativa: **320x240 píxeles** (escalable a 960x720)
- Paleta de colores limitada (**16 colores** estilo retro)
- Sprites de **16x16 píxeles** para personajes y tiles
- Efectos visuales retro (parpadeo, screen shake, partículas)
- Efecto CRT con **scanlines** animadas
- **image-rendering: pixelated** para mantener estética retro

### Audio
- Efectos de sonido **8-bit** generados con **Web Audio API**
- Sonidos para: recolección, daño, victoria de nivel y game over
- Sistema de audio adaptativo (se activa con interacción del usuario)

### Rendimiento
- **60 FPS** mediante `requestAnimationFrame`
- Optimización de colisiones con sistema **AABB** (Axis-Aligned Bounding Box)
- **Persistencia de datos** con LocalStorage
- **Responsive design** adaptativo

---

## Arquitectura del Sistema

### Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                         PIXEL QUEST                         │
│                    Arquitectura MVC-Like                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │
│  index.html  │────▶│   style.css  │     │   game.js    │
│   (Vista)    │     │   (Vista)    │     │ (Modelo +    │
│              │     │              │     │  Controlador)│
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                    ┌─────────────────────────────┴─────────────────────────────┐
                    │                                                           │
          ┌─────────▼──────────┐                                   ┌────────────▼──────────┐
          │   Game (Clase      │                                   │   Entidades del       │
          │   Principal)       │                                   │   Juego               │
          │                    │                                   │                       │
          │ • Bucle principal  │                                   │ • Player              │
          │ • Game Loop (RAF)  │◀──────────────────────────────────│ • Enemy               │
          │ • Estado del juego │                                   │ • Item                │
          │ • Colisiones       │                                   │ • TileMap             │
          │ • Audio            │                                   │ • Particle            │
          │ • UI Updates       │                                   │                       │
          └────────────────────┘                                   └───────────────────────┘
```

### Patrón de Diseño

El juego implementa una arquitectura orientada a objetos con elementos del patrón **MVC** (Model-View-Controller):

- **Modelo**: Clases de entidades (`Player`, `Enemy`, `Item`, `TileMap`, `Particle`)
- **Vista**: HTML + CSS + Métodos `render()` de cada clase
- **Controlador**: Clase `Game` que coordina todo el sistema

---

## 📁 Estructura del Proyecto

```
pixel-quest/
│
├── index.html              # 📄 Estructura HTML y UI
│   ├── Canvas de juego
│   ├── Pantallas (Start, Pause, Game Over, Level Complete)
│   ├── HUD (Puntos, Vidas, Nivel, Cristales, Llaves)
│   └── Botones de control
│
├── style.css               # 🎨 Estilos y efectos visuales
│   ├── Reset CSS
│   ├── Efectos CRT (scanlines, vignette)
│   ├── Animaciones (glitch, glow, blink)
│   ├── Pixel-perfect rendering
│   ├── Responsive design
│   └── UI Components (botones, pantallas)
│
├── game.js                 # 🎮 Lógica completa del juego
│   ├── CONFIG (Constantes globales)
│   ├── COLORS (Paleta de colores)
│   │
│   ├── Clase Game          # Controlador principal
│   │   ├── Estado y puntuación
│   │   ├── Bucle de juego (gameLoop)
│   │   ├── Gestión de niveles
│   │   ├── Sistema de colisiones
│   │   ├── Sistema de audio
│   │   └── Gestión de UI
│   │
│   ├── Clase Player        # Entidad jugador
│   │   ├── Movimiento y física
│   │   ├── Animaciones
│   │   ├── Inventario (llaves, cristales)
│   │   └── Sistema de vidas
│   │
│   ├── Clase Enemy         # Entidad enemigo
│   │   ├── IA básica
│   │   ├── Tipos (slime, fireball)
│   │   └── Comportamientos
│   │
│   ├── Clase Item          # Objetos recolectables
│   │   ├── Tipos (crystal, potion, key)
│   │   └── Animaciones
│   │
│   ├── Clase TileMap       # Sistema de mapas
│   │   ├── Generación procedural
│   │   ├── Tiles de 16x16
│   │   ├── Colisiones con mapa
│   │   └── Renderizado
│   │
│   └── Clase Particle      # Sistema de partículas
│       ├── Efectos visuales
│       └── Física básica
│
└── README.md               # 📖 Documentación (este archivo)
```

---

## 📚 Documentación Técnica

### Clase `Game` - Controlador Principal

**Responsabilidad**: Orquestar todo el sistema del juego.

```javascript
class Game {
    constructor()           // Inicializa el juego, canvas, estado
    init()                  // Configura event listeners
    setupEventListeners()   // Vincula controles
    
    // === GESTIÓN DE ESTADOS ===
    showStartScreen()       // Muestra pantalla inicial
    startGame()             // Inicia nueva partida
    restartGame()           // Reinicia después de game over
    nextLevel()             // Avanza al siguiente nivel
    togglePause()           // Pausa/reanuda el juego
    gameOver()              // Muestra pantalla de game over
    levelComplete()         // Completa nivel actual
    
    // === CARGA DE NIVELES ===
    loadLevel(levelNum)     // Carga nivel específico
    spawnItems(levelNum)    // Genera items del nivel
    spawnEnemies(levelNum)  // Genera enemigos del nivel
    
    // === BUCLE DE JUEGO ===
    gameLoop(currentTime)   // Bucle principal (60 FPS)
    update(deltaTime)       // Actualiza lógica del juego
    handleInput()           // Procesa entrada del jugador
    render()                // Dibuja todo en canvas
    
    // === SISTEMA DE COLISIONES ===
    checkCollisions()       // Detecta todas las colisiones
    checkAABB(a, b)         // Colisión AABB entre dos entidades
    collectItem(item)       // Procesa recolección de items
    playerHit()             // Maneja daño al jugador
    
    // === INTERFAZ DE USUARIO ===
    updateUI()              // Actualiza HUD
    updateHighScoreDisplay()// Actualiza high score
    
    // === EFECTOS VISUALES ===
    createParticles(x, y, color) // Genera partículas
    
    // === SISTEMA DE AUDIO ===
    playSound(type)         // Reproduce sonidos 8-bit
}
```

**Propiedades principales**:
- `state`: Estado actual (`'start'`, `'playing'`, `'paused'`, `'gameover'`, `'levelcomplete'`)
- `score`: Puntuación actual
- `level`: Nivel actual (1-3)
- `highScore`: Mejor puntuación (persistente)
- `player`: Instancia de `Player`
- `enemies`: Array de `Enemy`
- `items`: Array de `Item`
- `map`: Instancia de `TileMap`
- `particles`: Array de `Particle`

---

### Clase `Player` - Entidad del Jugador

**Responsabilidad**: Controlar al personaje principal.

```javascript
class Player {
    constructor(x, y)       // Inicializa en posición
    
    move(dx, dy, map)       // Mueve al jugador con colisión
    update(deltaTime)       // Actualiza animaciones
    render(ctx)             // Dibuja sprite pixelado
}
```

**Propiedades**:
- `x, y`: Posición en píxeles
- `width, height`: Hitbox (12x14 px)
- `speed`: Velocidad de movimiento (2 px/frame)
- `lives`: Vidas actuales (máx. 3)
- `keys`: Llaves recolectadas
- `crystalsCollected`: Contador de cristales
- `invulnerable`: Estado de invulnerabilidad (booleano)
- `direction`: Dirección actual (`'up'`, `'down'`, `'left'`, `'right'`)
- `animFrame`: Frame de animación (0-1)
- `isMoving`: Si está en movimiento

**Sistema de animación**:
- 2 frames de animación por dirección
- Cambio de frame cada 200ms durante movimiento
- Sprite dibujado manualmente con `fillRect()`

---

### Clase `Enemy` - Entidades Enemigas

**Responsabilidad**: IA y comportamiento de enemigos.

```javascript
class Enemy {
    constructor(x, y, type) // Crea enemigo (slime/fireball)
    
    update(deltaTime, player) // Actualiza IA y movimiento
    render(ctx)               // Dibuja sprite del enemigo
}
```

**Tipos de enemigos**:

| Tipo | Velocidad | Comportamiento | Color |
|------|-----------|----------------|-------|
| `slime` | 1 px/frame | Persigue al jugador | Verde (#4caf50) |
| `fireball` | 1.5 px/frame | Patrón circular | Naranja/Rojo (#ff5722) |

**IA implementada**:
- **Slime**: Cálculo de vector hacia el jugador, normalización, aplicación de velocidad
- **Fireball**: Movimiento en patrón predefinido (arriba → derecha → abajo → izquierda)

---

### Clase `Item` - Objetos Recolectables

**Responsabilidad**: Items que el jugador puede recolectar.

```javascript
class Item {
    constructor(x, y, type) // Crea item (crystal/potion/key)
    
    update(deltaTime)       // Actualiza animación de flotación
    render(ctx)             // Dibuja sprite del item
}
```

**Tipos de items**:

| Item | Efecto | Puntos | Color |
|------|--------|--------|-------|
| `crystal` | Objetivo del nivel | +10 | Cyan (#00ffff) |
| `potion` | Recupera 1 vida | +5 | Magenta (#ff00ff) |
| `key` | Abre puertas | +15 | Dorado (#ffd700) |

**Efectos visuales**:
- Animación de flotación con función seno
- Efecto de brillo intermitente en cristales

---

### Clase `TileMap` - Sistema de Mapas

**Responsabilidad**: Generación y renderizado del mundo del juego.

```javascript
class TileMap {
    constructor(levelNum)   // Genera mapa del nivel
    
    generateMap(levelNum)   // Generación procedural
    addRandomObstacles(type, count) // Añade obstáculos
    addWater(count)         // Añade zonas de agua
    
    getStartPosition()      // Retorna posición inicial
    getExitPosition()       // Retorna posición de salida
    getRandomWalkablePosition() // Posición aleatoria válida
    
    isWalkable(gridX, gridY) // Verifica si tile es caminable
    canWalk(x, y, width, height) // Verifica colisión
    
    render(ctx)             // Dibuja el mapa completo
}
```

**Sistema de tiles**:
- Grid de 20x15 tiles (320x240 px)
- Cada tile: 16x16 píxeles
- Array bidimensional `tiles[y][x]`

**Tipos de tiles**:

| Tile | Caminable | Descripción | Color |
|------|-----------|-------------|-------|
| `grass` | ✅ | Hierba, terreno normal | Verde (#2d8659) |
| `wall` | ❌ | Pared, obstáculo | Gris (#3a3a3a) |
| `water` | ❌ | Agua, intransitable | Azul (#0077be) |
| `door` | ❌ | Puerta (requiere llave) | Marrón (#8b4513) |
| `exit` | ✅ | Portal de salida | Verde brillante (#00ff00) |

**Generación procedural**:
- Bordes siempre son paredes
- Obstáculos colocados aleatoriamente
- Validación para no bloquear posición inicial
- Distribución según dificultad del nivel

---

### Clase `Particle` - Sistema de Partículas

**Responsabilidad**: Efectos visuales de partículas.

```javascript
class Particle {
    constructor(x, y, angle, speed, color) // Crea partícula
    
    update(deltaTime)       // Actualiza física
    render(ctx)             // Dibuja partícula
}
```

**Sistema de física**:
- Velocidad inicial basada en ángulo
- Gravedad aplicada (0.1 px/frame²)
- Vida limitada (60 frames = 1 segundo)
- Fade out progresivo con `globalAlpha`

**Usos**:
- Explosión de 8 partículas al recolectar items
- Color según tipo de item recolectado

---

### Sistema de Colisiones AABB

**Algoritmo**: Axis-Aligned Bounding Box

```javascript
checkAABB(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
```

**Colisiones detectadas**:
1. **Jugador vs Items**: Recolección automática
2. **Jugador vs Enemigos**: Daño al jugador
3. **Jugador vs Mapa**: Límites de movimiento
4. **Jugador vs Salida**: Verificación de nivel completo

**Optimizaciones**:
- Sistema de invulnerabilidad para evitar daño continuo
- Verificación de múltiples esquinas para colisión con mapa
- Early exit en bucles de colisión

---

### Sistema de Audio Web Audio API

**Implementación**: Generación procedural de sonidos 8-bit.

```javascript
playSound(type) {
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Configuración según tipo de sonido
    // ...
}
```

**Tipos de sonidos**:

| Sonido | Forma de Onda | Frecuencia | Duración |
|--------|---------------|------------|----------|
| `collect` | sine | 800→1200 Hz | 0.1s |
| `hit` | sawtooth | 200→50 Hz | 0.2s |
| `levelcomplete` | sine | Secuencia Do-Mi-Sol-Do | 0.4s |
| `gameover` | triangle | 400→100 Hz | 0.5s |

---

### Bucle Principal del Juego

**Implementación**: `requestAnimationFrame` para 60 FPS.

```
┌─────────────────────────────────────────────────┐
│          GAME LOOP (60 FPS)                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. handleInput()                               │
│     └─ Lee teclado (WASD/Flechas)               │
│                                                 │
│  2. update(deltaTime)                           │
│     ├─ player.update()                          │
│     ├─ enemies.forEach(e => e.update())         │
│     ├─ items.forEach(i => i.update())           │
│     ├─ particles.forEach(p => p.update())       │
│     ├─ checkCollisions()                        │
│     └─ updateUI()                               │
│                                                 │
│  3. render()                                    │
│     ├─ Limpiar canvas                           │
│     ├─ Aplicar screen shake (si activo)         │
│     ├─ map.render()                             │
│     ├─ items.forEach(i => i.render())           │
│     ├─ enemies.forEach(e => e.render())         │
│     ├─ player.render()                          │
│     └─ particles.forEach(p => p.render())       │
│                                                 │
│  4. requestAnimationFrame(gameLoop)             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Estados del Juego (FSM)

**Máquina de Estados Finitos**:

```
     START
       │
       ├─ [Botón Start/Enter] ──▶ PLAYING
       │                            │
       │                            ├─ [ESC] ──▶ PAUSED
       │                            │              │
       │                            │              └─ [ESC] ──▶ PLAYING
       │                            │
       │                            ├─ [Vidas = 0] ──▶ GAMEOVER
       │                            │                    │
       │                            │                    ├─ [Restart] ──▶ PLAYING
       │                            │                    └─ [Menu] ──▶ START
       │                            │
       │                            └─ [Nivel completo] ──▶ LEVELCOMPLETE
       │                                                      │
       │                                                      ├─ [Next Level] ──▶ PLAYING
       │                                                      └─ [Último nivel] ──▶ START
       │
       └───────────────────────────────────────────────────────┘
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No requiere servidor ni instalación

### Pasos de Instalación

1. **Clonar o descargar el repositorio**:
```bash
git clone https://github.com/tu-usuario/pixel-quest.git
cd pixel-quest
```

2. **Abrir el juego**:
   - Opción 1: Doble clic en `index.html`
   - Opción 2: Arrastrar `index.html` al navegador
   - Opción 3: Usar servidor local (opcional):
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js (http-server)
     npx http-server
     ```
   - Abrir: `http://localhost:8000`

3. **¡Jugar!** 🎮

---

## 🎮 Controles del Juego

### Teclado

| Tecla | Acción |
|-------|--------|
| **W** / **↑** | Mover arriba |
| **S** / **↓** | Mover abajo |
| **A** / **←** | Mover izquierda |
| **D** / **→** | Mover derecha |
| **ESC** | Pausar/Reanudar |
| **ENTER** | Comenzar juego |

### Notas
- Movimiento diagonal normalizado (no más rápido en diagonal)
- Colisión con mapa impide movimiento en direcciones bloqueadas
- Canvas debe tener focus para recibir input (clic en el juego)

---

## 🎨 Elementos del Juego

### 👤 Personaje Principal
- **Nombre**: Héroe Pixelado
- **Vidas**: 3 ❤️
- **Hitbox**: 12x14 píxeles
- **Velocidad**: 2 píxeles por frame
- **Invulnerabilidad**: 2 segundos tras recibir daño
- **Animación**: 2 frames en 4 direcciones (8 sprites totales)

### 👾 Enemigos

#### 🟢 Slime
- **Velocidad**: 1 px/frame
- **Comportamiento**: Persigue al jugador (pathfinding directo)
- **Tamaño**: 12x12 píxeles
- **Color**: Verde (#4caf50)
- **IA**: Calcula vector hacia jugador cada 500ms

#### 🔥 Bola de Fuego
- **Velocidad**: 1.5 px/frame
- **Comportamiento**: Movimiento en patrón cíclico
- **Tamaño**: 12x12 píxeles
- **Color**: Naranja/Rojo con animación
- **Patrón**: Rotación en 4 direcciones

### 🔷 Objetos Recolectables

#### Cristal (Crystal)
- **Función**: Objetivo principal del nivel
- **Puntos**: +10
- **Color**: Cyan (#00ffff)
- **Efecto**: Brillo intermitente
- **Requisito**: Recolectar todos para activar salida

#### Poción (Potion)
- **Función**: Recupera 1 vida
- **Puntos**: +5
- **Color**: Magenta (#ff00ff)
- **Límite**: Máximo 3 vidas

#### Llave (Key)
- **Función**: Abre puertas
- **Puntos**: +15
- **Color**: Dorado (#ffd700)
- **Uso**: Actualmente decorativo (puertas no bloqueantes en esta versión)

### 🗺️ Tiles del Mapa

#### 🌿 Hierba (Grass)
- **Caminable**: ✅
- **Color**: Verde (#2d8659)
- **Decoración**: Píxeles aleatorios más oscuros

#### 🧱 Pared (Wall)
- **Caminable**: ❌
- **Color**: Gris oscuro (#3a3a3a)
- **Efecto**: Bordes más claros para relieve

#### 💧 Agua (Water)
- **Caminable**: ❌
- **Color**: Azul (#0077be)
- **Animación**: Olas parpadeantes cada 500ms

#### 🚪 Puerta (Door)
- **Caminable**: ❌ (en esta versión)
- **Color**: Marrón (#8b4513)
- **Detalle**: Manija dorada

#### 🌀 Salida (Exit)
- **Caminable**: ✅
- **Color**: Verde brillante (#00ff00)
- **Efecto**: Pulso animado (breathing effect)
- **Función**: Activa pantalla de nivel completado

---

## 🎯 Niveles

### 📊 Tabla Comparativa

| Nivel | Tema | Cristales | Slimes | Fireballs | Llaves | Puertas | Obstáculos | Agua | Dificultad |
|-------|------|-----------|--------|-----------|--------|---------|------------|------|------------|
| **1** | Bosque Pixel | 10 | 3 | 0 | 1 | 1 | 10 | 0 | ⭐ Fácil |
| **2** | Cavernas | 15 | 4 | 2 | 2 | 2 | 20 | 5 | ⭐⭐ Medio |
| **3** | Castillo | 20 | 5 | 4 | 3 | 3 | 30 | 8 | ⭐⭐⭐ Difícil |

### Nivel 1: Bosque Pixel 🌳
**Descripción**: Introducción suave al juego. Bosque sencillo con pocos enemigos.

**Características**:
- 10 cristales dispersos
- 3 slimes con movimiento básico
- 2 pociones de vida
- 1 llave escondida
- 1 puerta bloqueando paso
- Terreno mayormente abierto

**Estrategia**:
- Familiarízate con los controles
- Aprende a evitar slimes
- Recolecta todos los cristales
- Busca la salida en la esquina superior derecha

### Nivel 2: Cavernas 🏔️
**Descripción**: Laberinto subterráneo con agua y más enemigos.

**Características**:
- 15 cristales en zonas difíciles
- 4 slimes + 2 bolas de fuego
- 3 pociones de vida
- 2 llaves
- Zonas de agua que bloquean caminos
- Laberinto con múltiples rutas

**Estrategia**:
- Usa las paredes para escapar de enemigos
- Las bolas de fuego son predecibles, memoriza su patrón
- Planifica tu ruta antes de moverte
- El agua te obliga a tomar caminos específicos

### Nivel 3: Castillo 🏰
**Descripción**: Castillo complejo con muchos enemigos y obstáculos.

**Características**:
- 20 cristales en ubicaciones peligrosas
- 5 slimes + 4 bolas de fuego
- 4 pociones de vida
- 3 llaves
- Laberinto denso
- Zonas de agua estratégicas

**Estrategia**:
- Usa la invulnerabilidad sabiamente (2 segundos)
- Atrae enemigos a esquinas para controlarlos
- No te apresures, planifica cada movimiento
- Memoriza posiciones de pociones para emergencias

### Sistema de Puntuación

**Puntos por acciones**:
- Cristal recolectado: **+10 puntos**
- Poción recolectada: **+5 puntos**
- Llave recolectada: **+15 puntos**

**Bonus de nivel**:
- Cristales recolectados × 10
- Bonus de tiempo: `max(0, 300 - tiempoEnSegundos × 10)`
- Ejemplo: Completar nivel en 20 segundos = **+100 bonus**

**High Score**:
- Guardado automáticamente en **LocalStorage**
- Persiste entre sesiones del navegador
- Se muestra en pantalla de inicio

---

## 🎨 Paleta de Colores

### Paleta Completa (16 Colores)

```css
/* === TERRENO === */
--grass:       #2d8659;  /* Verde hierba */
--stone:       #5a5a5a;  /* Gris piedra */
--water:       #0077be;  /* Azul agua */
--dirt:        #8b5a3c;  /* Marrón tierra */
--wall:        #3a3a3a;  /* Gris oscuro pared */

/* === PERSONAJES === */
--player:      #ff6b6b;  /* Rojo jugador */
--player-dark: #8b0000;  /* Rojo oscuro contorno */
--enemy-slime: #4caf50;  /* Verde slime */
--enemy-fire:  #ff5722;  /* Naranja bola de fuego */

/* === OBJETOS === */
--crystal:     #00ffff;  /* Cyan cristal */
--potion:      #ff00ff;  /* Magenta poción */
--key:         #ffd700;  /* Dorado llave */
--door:        #8b4513;  /* Marrón puerta */
--exit:        #00ff00;  /* Verde salida */

/* === UI === */
--bg:          #0a0a14;  /* Azul oscuro fondo */
--text:        #ffffff;  /* Blanco texto */
```

### Esquema de Color por Función

| Función | Color Principal | Color Secundario | Uso |
|---------|----------------|------------------|-----|
| **Jugador** | Rojo (#ff6b6b) | Rojo oscuro (#8b0000) | Contraste alto para visibilidad |
| **Enemigos** | Verde/Naranja | Negro | Diferenciación clara de tipos |
| **Objetos** | Colores brillantes | - | Fácil identificación |
| **Terreno** | Verdes/Grises | Tonos oscuros | No distrae de acción |
| **UI** | Neón verde/Cyan | Negro/Azul oscuro | Estética retro CRT |

---

## 📱 Compatibilidad

### Navegadores Soportados

| Navegador | Versión Mínima | Estado | Notas |
|-----------|----------------|--------|-------|
| Chrome | 90+ | ✅ Óptimo | Renderizado perfecto |
| Firefox | 88+ | ✅ Óptimo | Excelente soporte |
| Safari | 14+ | ✅ Compatible | Algunas diferencias en audio |
| Edge | 90+ | ✅ Óptimo | Basado en Chromium |
| Opera | 76+ | ✅ Compatible | Basado en Chromium |

### Dispositivos

| Dispositivo | Compatibilidad | Experiencia | Recomendación |
|-------------|----------------|-------------|---------------|
| **Desktop** | ✅ Completa | Óptima | ⭐⭐⭐⭐⭐ Recomendado |
| **Tablet** | ✅ Funcional | Buena | ⭐⭐⭐⭐ Requiere teclado externo |
| **Mobile** | ⚠️ Limitada | Regular | ⭐⭐ No ideal (falta touch controls) |

### Requisitos Técnicos

- **Resolución mínima**: 1024×768
- **JavaScript**: Debe estar habilitado
- **LocalStorage**: Debe estar habilitado (para high score)
- **Web Audio API**: Opcional (para sonidos)

### Tecnologías Utilizadas

```json
{
  "HTML5": {
    "Canvas API": "2D Context",
    "LocalStorage API": "Persistencia de datos"
  },
  "CSS3": {
    "Flexbox": "Layout",
    "Grid": "UI",
    "Animations": "Efectos visuales",
    "Custom Properties": "Variables CSS"
  },
  "JavaScript": {
    "ES6+": "Clases, Arrow Functions, Template Literals",
    "APIs": "RequestAnimationFrame, Web Audio API"
  }
}

```

---

## 🌟 Mejoras Futuras

### Roadmap de Desarrollo

#### Versión 1.1 (Corto Plazo)
- [ ] **Controles táctiles** para móviles
  - Joystick virtual en pantalla
  - Botones de acción
- [ ] **Más niveles** (4-6)
  - Bioma: Desierto
  - Bioma: Nieve
  - Bioma: Volcán
- [ ] **Sistema de guardado**
  - Guardar progreso del nivel
  - Checkpoint system
- [ ] **Estadísticas de juego**
  - Tiempo total jugado
  - Cristales totales recolectados
  - Enemigos evitados

#### Versión 1.2 (Mediano Plazo)
- [ ] **Jefes finales**
  - Boss al final de cada mundo
  - Patrones de ataque únicos
  - Barras de vida
- [ ] **Sistema de combate**
  - Espada básica
  - Proyectiles
  - Sistema de daño a enemigos
- [ ] **Power-ups temporales**
  - Velocidad aumentada (5 segundos)
  - Invulnerabilidad (10 segundos)
  - Doble puntos (30 segundos)
- [ ] **Música de fondo**
  - Loop de 8-bit por nivel
  - Música de jefe
  - Control de volumen

#### Versión 2.0 (Largo Plazo)
- [ ] **Multijugador local**
  - 2 jugadores en split-screen
  - Modo cooperativo
  - Modo competitivo
- [ ] **Editor de niveles**
  - Interfaz drag & drop
  - Exportar/importar niveles
  - Compartir niveles con comunidad
- [ ] **Sistema de logros**
  - 20+ achievements
  - Recompensas desbloqueables
  - Integración con perfil
- [ ] **Modo historia**
  - Diálogos con NPCs
  - Cutscenes pixeladas
  - Narrativa expandida

---

## 🐛 Solución de Problemas

### Problemas Comunes

#### ❌ El juego no se ve pixelado
**Síntoma**: Los sprites se ven borrosos o suavizados.

**Solución**:
1. Verifica que estés usando Chrome 90+, Firefox 88+ o Edge 90+
2. Comprueba en la consola del navegador (F12) si hay errores
3. Asegúrate de que el CSS esté cargado correctamente
4. Prueba desactivando extensiones del navegador

**Causa**: Navegadores antiguos no soportan `image-rendering: pixelated`

---

#### 🔇 No hay sonido
**Síntoma**: El juego funciona pero no se escuchan los efectos de sonido.

**Solución**:
1. Haz clic en el botón "COMENZAR JUEGO" (los navegadores bloquean audio sin interacción)
2. Verifica que el volumen del sistema no esté silenciado
3. Abre la consola (F12) y busca errores de Web Audio API
4. Prueba en otro navegador

**Causa**: Política de autoplay de navegadores modernos

---

#### 🐌 El juego va lento / laggy
**Síntoma**: FPS bajo, movimiento entrecortado.

**Solución**:
1. Cierra otras pestañas del navegador
2. Cierra aplicaciones pesadas en segundo plano
3. Reduce el tamaño de la ventana del navegador
4. Actualiza los drivers de tu tarjeta gráfica
5. Prueba desactivando aceleración por hardware en el navegador

**Causa**: Recursos del sistema limitados

---

#### ⌨️ Los controles no responden
**Síntoma**: El personaje no se mueve al presionar teclas.

**Solución**:
1. Haz clic dentro del área del canvas
2. Verifica que no tengas otra aplicación capturando el teclado
3. Recarga la página (F5)
4. Prueba con las flechas si WASD no funciona (o viceversa)

**Causa**: Canvas sin focus / conflicto de input

---

#### 💾 El high score no se guarda
**Síntoma**: La mejor puntuación se reinicia al cerrar el navegador.

**Solución**:
1. Verifica que LocalStorage esté habilitado en la configuración del navegador
2. No uses modo incógnito (no persiste LocalStorage)
3. Comprueba que no tengas extensiones bloqueando LocalStorage
4. Abre la consola y ejecuta: `localStorage.setItem('test', 'value')`

**Causa**: LocalStorage bloqueado o en modo privado

---

#### 📱 No funciona en móvil
**Síntoma**: Juego carga pero no hay controles.

**Solución**:
- Esta versión (1.0) está diseñada para teclado
- Usa un teclado Bluetooth externo
- Espera la versión 1.1 con controles táctiles

**Causa**: No hay implementación de touch controls en v1.0

---

### Reportar Bugs

Si encuentras un problema no listado:

1. **GitHub Issues**: [Crear nuevo issue](https://github.com/tu-usuario/pixel-quest/issues)
2. **Incluye**:
   - Descripción del problema
   - Navegador y versión
   - Sistema operativo
   - Pasos para reproducir
   - Captura de pantalla (si aplica)
   - Mensajes de error en consola (F12)

---

## 🔧 Desarrollo y Contribución

### Setup de Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/pixel-quest.git
cd pixel-quest

# Abrir en VS Code
code .

# (Opcional) Instalar extensión Live Server para VS Code
# Clic derecho en index.html > "Open with Live Server"
```

### Estructura para Desarrollo

```
pixel-quest/
├── src/                    # (Futuro) Código fuente modular
│   ├── classes/
│   │   ├── Game.js
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   └── ...
│   ├── utils/
│   └── constants/
│
├── assets/                 # (Futuro) Recursos externos
│   ├── sprites/
│   ├── sounds/
│   └── fonts/
│
├── dist/                   # (Futuro) Build para producción
│
├── tests/                  # (Futuro) Tests unitarios
│
├── index.html
├── style.css
├── game.js
├── README.md
└── package.json           # (Futuro) Para build tools
```

### Guía de Contribución

#### Estilo de Código

```javascript
// ✅ BIEN: Nombres descriptivos, comentarios claros
class Enemy {
    constructor(x, y, type) {
        this.x = x;  // Posición en píxeles
        this.type = type;  // 'slime' o 'fireball'
    }
    
    // Actualiza posición según IA
    update(deltaTime, player) {
        // ...
    }
}

// ❌ MAL: Nombres crípticos, sin comentarios
class E {
    constructor(x, y, t) {
        this.x = x;
        this.t = t;
    }
    upd(dt, p) { }
}
```

#### Convenciones

- **Clases**: PascalCase (`Game`, `Player`, `Enemy`)
- **Variables**: camelCase (`playerSpeed`, `enemyCount`)
- **Constantes**: UPPER_CASE (`TILE_SIZE`, `PLAYER_SPEED`)
- **Privadas**: prefijo `_` (`_calculatePath()`)

#### Proceso de Pull Request

1. Fork del repositorio
2. Crea rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m "Añade nueva funcionalidad X"`
4. Push a rama: `git push origin feature/nueva-funcionalidad`
5. Abre Pull Request en GitHub

---

## 📊 Métricas del Proyecto

### Líneas de Código

| Archivo | Líneas | Comentarios | Ratio |
|---------|--------|-------------|-------|
| `game.js` | ~1200 | ~150 | 12.5% |
| `style.css` | ~500 | ~50 | 10% |
| `index.html` | ~100 | ~10 | 10% |
| **Total** | **~1800** | **~210** | **11.7%** |

### Complejidad

- **Clases**: 6 (Game, Player, Enemy, Item, TileMap, Particle)
- **Métodos totales**: ~40
- **Complejidad ciclomática promedio**: 3-5 (baja-media)
- **Dependencias externas**: 0 (vanilla JS)

---

## 📚 Referencias y Recursos

### Tutoriales Útiles

- [MDN Canvas Tutorial](https://developer.mozilla.org/es/docs/Web/API/Canvas_API/Tutorial)
- [MDN Web Audio API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API)
- [Game Loop Tutorial](https://developer.mozilla.org/en-US/docs/Games/Anatomy)
- [Pixel Art Tutorial](https://lospec.com/pixel-art-tutorials)

### Herramientas Recomendadas

- **Editores de Sprites**: [Aseprite](https://www.aseprite.org/), [Piskel](https://www.piskelapp.com/)
- **Paletas**: [Lospec Palette List](https://lospec.com/palette-list)
- **Audio 8-bit**: [BFXR](https://www.bfxr.net/), [ChipTone](https://sfbgames.itch.io/chiptone)
- **Tilemap Editor**: [Tiled](https://www.mapeditor.org/)

### Inspiración

- **Juegos**: The Legend of Zelda (NES), Final Fantasy (NES), Stardew Valley
- **Estilo**: CGA/EGA Graphics, GameBoy aesthetics

---

## 👥 Créditos

### Desarrollador
- **Tu Nombre** - Desarrollo completo, diseño y arte

### Agradecimientos
- Comunidad de **MDN Web Docs** por documentación
- **Lospec** por recursos de pixel art
- **Web Audio API** por posibilitar audio sin archivos

---

## 📄 Licencia

```
MIT License

Copyright (c) 2025 Tu Nombre

Se concede permiso, libre de cargos, a cualquier persona que obtenga una copia
de este software y de los archivos de documentación asociados (el "Software"),
para utilizar el Software sin restricción, incluyendo sin limitación los derechos
a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o vender
copias del Software, y a permitir a las personas a las que se les proporcione el
Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las
copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O
IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD
PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O
TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS
RESPONSABILIDADES, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO
MOTIVO, QUE SURJA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTRO TIPO DE
ACCIONES EN EL SOFTWARE.
```

---

## 📞 Contacto

- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **Email**: tu-email@ejemplo.com
- **Twitter**: [@tu_handle](https://twitter.com/tu_handle)

---

## 🎮 ¡Disfruta el Juego!

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ██████╗ ██╗██╗  ██╗███████╗██╗                        ║
║   ██╔══██╗██║╚██╗██╔╝██╔════╝██║                        ║
║   ██████╔╝██║ ╚███╔╝ █████╗  ██║                        ║
║   ██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║                        ║
║   ██║     ██║██╔╝ ██╗███████╗███████╗                   ║
║   ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝                   ║
║                                                          ║
║    ██████╗ ██╗   ██╗███████╗███████╗████████╗          ║
║   ██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝          ║
║   ██║   ██║██║   ██║█████╗  ███████╗   ██║             ║
║   ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║             ║
║   ╚██████╔╝╚██████╔╝███████╗███████║   ██║             ║
║    ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝             ║
║                                                          ║
║          ¿Lograrás completar los 3 niveles?             ║
║      ¿Conseguirás el high score más alto?               ║
║                                                          ║
║        ¡Buena suerte, aventurero pixelado! 🗡️✨         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025  
**Estado**: ✅ Estable y jugable
