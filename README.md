# 🎮 Pixel Quest - Juego Retro en Pixel Art

Un juego de aventura retro estilo 8/16 bits creado con HTML5, CSS3 y JavaScript puro. Explora niveles, recolecta cristales mágicos y evita enemigos en esta aventura pixelada.

## 🕹️ Características

### Gameplay
- ⚔️ **Aventura RPG minimalista** con mecánicas simples pero adictivas
- 🔷 **Sistema de recolección** de cristales, pociones y llaves
- 👾 **Enemigos variados** con comportamientos únicos (Slimes y Bolas de Fuego)
- 🎯 **3 niveles progresivos** con dificultad creciente
- ❤️ **Sistema de vidas** e invulnerabilidad temporal
- 🏆 **Puntuación y high score** guardados en LocalStorage

### Gráficos Pixel Art
- 🎨 Resolución 320x240 píxeles (escalable)
- 🌈 Paleta de colores limitada (16 colores)
- 👤 Sprites de 16x16 píxeles
- ✨ Efectos visuales retro (parpadeo, screen shake, partículas)
- 📺 Efecto CRT con scanlines

### Audio
- 🔊 Efectos de sonido 8-bit generados con Web Audio API
- 🎵 Sonidos para recolección, daño, victoria y derrota

## 🚀 Cómo Jugar

### Instalación
1. **Descarga** los archivos del proyecto
2. **Abre** `index.html` en cualquier navegador moderno
3. ¡**Juega**! No requiere instalación ni servidor

### Controles
- **WASD** o **Flechas** - Mover al personaje
- **ESC** - Pausar/Reanudar
- **ENTER** - Comenzar juego

### Objetivo
1. 🔷 Recolecta todos los **cristales** del nivel
2. 🔑 Encuentra **llaves** para abrir puertas
3. ❤️ Recoge **pociones** para recuperar vida
4. 👾 Evita a los **enemigos**
5. 🚪 Alcanza la **salida** para completar el nivel

## 📁 Estructura del Proyecto

```
pixel-quest/
│
├── index.html          # Estructura principal y UI
├── style.css           # Estilos pixel-perfect y tema retro
├── game.js             # Lógica completa del juego
└── README.md           # Este archivo
```

## 🎨 Elementos del Juego

### Personaje Principal
- 👤 Héroe pixelado con animaciones en 4 direcciones
- ❤️ 3 vidas
- 🛡️ Invulnerabilidad temporal tras recibir daño

### Enemigos
- 🟢 **Slime**: Movimiento lento, persigue al jugador
- 🔥 **Bola de Fuego**: Movimiento en patrón, más rápida

### Objetos Recolectables
- 🔷 **Cristales**: +10 puntos (objetivo principal)
- ❤️ **Pociones**: Recupera 1 vida
- 🔑 **Llaves**: Abre puertas

### Escenario
- 🌿 **Hierba**: Terreno caminable
- 🧱 **Paredes**: Obstáculos sólidos
- 💧 **Agua**: Área no caminable
- 🚪 **Puertas**: Requieren llaves
- 🌀 **Portal de Salida**: Siguiente nivel

## 🏗️ Arquitectura del Código

### Clases Principales

#### `Game`
Clase principal que maneja:
- Inicialización y bucle de juego (RequestAnimationFrame)
- Gestión de estados (start, playing, paused, gameover, levelcomplete)
- Sistema de puntuación y high score
- Carga de niveles
- Sistema de colisiones
- Efectos de sonido

#### `Player`
- Movimiento en 4 direcciones
- Animaciones de caminar
- Colisión con el mapa
- Sistema de invulnerabilidad

#### `Enemy`
- Dos tipos: Slime (persigue) y Fireball (patrón)
- IA básica para movimiento
- Animaciones

#### `Item`
- Tres tipos: Crystal, Potion, Key
- Animación de flotación
- Efectos visuales

#### `TileMap`
- Generación procedural de niveles
- Sistema de tiles de 16x16
- Detección de colisiones
- Renderizado del mapa

#### `Particle`
- Sistema de partículas para efectos visuales
- Animación y física básica

## 🎯 Niveles

### Nivel 1: Bosque Pixel
- 10 cristales
- 3 slimes
- 1 llave y 1 puerta
- Dificultad: Fácil

### Nivel 2: Cavernas
- 15 cristales
- 4 slimes + 2 bolas de fuego
- 2 llaves y 2 puertas
- Laberinto simple con agua
- Dificultad: Media

### Nivel 3: Castillo
- 20 cristales
- 5 slimes + 4 bolas de fuego
- 3 llaves y 3 puertas
- Laberinto complejo
- Dificultad: Alta

## 🔧 Características Técnicas

- ✅ **Canvas 2D** para renderizado
- ✅ **RequestAnimationFrame** para 60 FPS
- ✅ **Grid system** de 16px para alineación perfecta
- ✅ **Colisión AABB** (Axis-Aligned Bounding Box)
- ✅ **LocalStorage** para guardar high score
- ✅ **Web Audio API** para sonidos 8-bit
- ✅ **CSS image-rendering: pixelated** para estética retro
- ✅ **Responsive design** que mantiene proporciones

## 🎨 Paleta de Colores

```javascript
Terreno:
- Hierba: #2d8659
- Piedra: #5a5a5a
- Agua: #0077be
- Pared: #3a3a3a

Personajes:
- Jugador: #ff6b6b
- Slime: #4caf50
- Bola de Fuego: #ff5722

Objetos:
- Cristal: #00ffff (cyan)
- Poción: #ff00ff (magenta)
- Llave: #ffd700 (dorado)
- Salida: #00ff00 (verde)
```

## 🌟 Mejoras Futuras

### Posibles Expansiones
- [ ] Más niveles con diferentes biomas
- [ ] Jefes finales por mundo
- [ ] Sistema de inventario visual
- [ ] Power-ups temporales (velocidad, invulnerabilidad)
- [ ] Música de fondo en loop
- [ ] Diferentes armas/ataques
- [ ] Sistema de guardado de progreso
- [ ] Modo multijugador local
- [ ] Editor de niveles

## 🐛 Solución de Problemas

### El juego no se ve pixelado
Asegúrate de que tu navegador soporta `image-rendering: pixelated`. Probado en Chrome, Firefox y Edge modernos.

### No hay sonido
Algunos navegadores bloquean audio hasta que el usuario interactúe. Haz clic en el botón "COMENZAR JUEGO" primero.

### El juego va lento
El juego está optimizado para 60 FPS. Si experimenta lag, cierra otras pestañas del navegador.

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Dispositivos
- 💻 Desktop (recomendado)
- 📱 Tablet (funcional)
- 📱 Mobile (limitado - se recomienda teclado externo)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y personal.

## 👨‍💻 Desarrollo

Creado como demostración de juego retro usando tecnologías web modernas.

### Tecnologías Utilizadas
- HTML5 Canvas
- CSS3 (Animaciones, Grid, Flexbox)
- JavaScript ES6+ (Clases, Arrow Functions, etc.)
- Web Audio API
- LocalStorage API

## 🎮 ¡Disfruta el Juego!

¿Lograrás completar los 3 niveles y conseguir el high score más alto?

**¡Buena suerte, aventurero pixelado!** 🗡️✨
