// ============================================
// PIXEL QUEST - JUEGO COMPLETO
// ============================================

/* ==========================================
   CONFIGURACIÓN GLOBAL Y CONSTANTES
   ========================================== */

const CONFIG = {
    CANVAS_WIDTH: 320,
    CANVAS_HEIGHT: 240,
    TILE_SIZE: 16,
    PLAYER_SPEED: 2,
    ENEMY_SPEED: 1,
    FPS: 60,
    GRID_WIDTH: 20,  // 320 / 16
    GRID_HEIGHT: 15  // 240 / 16
};

// Paleta de colores retro (16 colores)
const COLORS = {
    // Terreno
    GRASS: '#2d8659',
    STONE: '#5a5a5a',
    WATER: '#0077be',
    DIRT: '#8b5a3c',
    WALL: '#3a3a3a',
    
    // Personajes
    PLAYER: '#ff6b6b',
    PLAYER_OUTLINE: '#8b0000',
    ENEMY_SLIME: '#4caf50',
    ENEMY_FIRE: '#ff5722',
    
    // Objetos
    CRYSTAL: '#00ffff',
    POTION: '#ff00ff',
    KEY: '#ffd700',
    DOOR: '#8b4513',
    EXIT: '#00ff00',
    
    // UI
    BG: '#0a0a14',
    TEXT: '#ffffff'
};

/* ==========================================
   CLASE PRINCIPAL DEL JUEGO
   ========================================== */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        // Estado del juego
        this.state = 'start'; // start, playing, paused, gameover, levelcomplete
        this.score = 0;
        this.level = 1;
        this.maxLevel = 3;
        this.highScore = parseInt(localStorage.getItem('pixelQuestHighScore')) || 0;
        
        // Entidades del juego
        this.player = null;
        this.enemies = [];
        this.items = [];
        this.map = null;
        
        // Input
        this.keys = {};
        
        // Control de tiempo
        this.lastTime = 0;
        this.animationId = null;
        this.levelStartTime = 0;
        
        // Efectos
        this.particles = [];
        this.screenShake = 0;
        
        // Audio context para sonidos 8-bit
        this.audioContext = null;
        
        this.init();
    }
    
    /* ==========================================
       INICIALIZACIÓN
       ========================================== */
    
    init() {
        this.setupEventListeners();
        this.updateHighScoreDisplay();
        this.showStartScreen();
    }
    
    setupEventListeners() {
        // Botones de menú
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
        document.getElementById('menuButton').addEventListener('click', () => this.showStartScreen());
        document.getElementById('nextLevelButton').addEventListener('click', () => this.nextLevel());
        
        // Controles del teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Prevenir scroll con flechas
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            
            // Controles especiales
            if(e.key === 'Enter' && this.state === 'start') {
                this.startGame();
            }
            
            if(e.key === 'Escape' && this.state === 'playing') {
                this.togglePause();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Focus en canvas
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.focus();
    }
    
    /* ==========================================
       GESTIÓN DE ESTADOS DEL JUEGO
       ========================================== */
    
    showStartScreen() {
        this.state = 'start';
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('gameContainer').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        
        if(this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.level = 1;
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameContainer').classList.remove('hidden');
        
        this.loadLevel(this.level);
        this.levelStartTime = Date.now();
        this.gameLoop(0);
    }
    
    restartGame() {
        this.startGame();
    }
    
    nextLevel() {
        this.level++;
        
        if(this.level > this.maxLevel) {
            // Victoria total
            alert('¡FELICIDADES! ¡HAS COMPLETADO TODOS LOS NIVELES!');
            this.showStartScreen();
            return;
        }
        
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        this.state = 'playing';
        this.loadLevel(this.level);
        this.levelStartTime = Date.now();
    }
    
    togglePause() {
        if(this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseScreen').classList.remove('hidden');
        } else if(this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseScreen').classList.add('hidden');
            this.canvas.focus();
        }
    }
    
    gameOver() {
        this.state = 'gameover';
        this.playSound('gameover');
        
        // Actualizar high score
        if(this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pixelQuestHighScore', this.highScore);
            this.updateHighScoreDisplay();
        }
        
        // Mostrar estadísticas
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('finalCrystals').textContent = this.player ? this.player.crystalsCollected : 0;
        
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    levelComplete() {
        this.state = 'levelcomplete';
        this.playSound('levelcomplete');
        
        // Calcular bonus
        const timeElapsed = Math.floor((Date.now() - this.levelStartTime) / 1000);
        const timeBonus = Math.max(0, 300 - timeElapsed * 10);
        const crystalBonus = this.player.crystalsCollected * 10;
        const totalPoints = crystalBonus + timeBonus;
        
        this.score += totalPoints;
        
        // Mostrar estadísticas
        document.getElementById('levelCrystals').textContent = this.player.crystalsCollected;
        document.getElementById('timeBonus').textContent = timeBonus;
        document.getElementById('levelPoints').textContent = totalPoints;
        
        document.getElementById('levelCompleteScreen').classList.remove('hidden');
    }
    
    /* ==========================================
       CARGA DE NIVELES Y GENERACIÓN DE MAPAS
       ========================================== */
    
    loadLevel(levelNum) {
        // Limpiar entidades previas
        this.enemies = [];
        this.items = [];
        this.particles = [];
        
        // Crear mapa
        this.map = new TileMap(levelNum);
        
        // Crear jugador en posición inicial
        const startPos = this.map.getStartPosition();
        this.player = new Player(startPos.x, startPos.y);
        
        // Generar items según el nivel
        this.spawnItems(levelNum);
        
        // Generar enemigos según el nivel
        this.spawnEnemies(levelNum);
        
        // Actualizar UI
        this.updateUI();
    }
    
    spawnItems(levelNum) {
        const itemsConfig = {
            1: { crystals: 10, potions: 2, keys: 1 },
            2: { crystals: 15, potions: 3, keys: 2 },
            3: { crystals: 20, potions: 4, keys: 3 }
        };
        
        const config = itemsConfig[levelNum] || itemsConfig[1];
        
        // Cristales
        for(let i = 0; i < config.crystals; i++) {
            const pos = this.map.getRandomWalkablePosition();
            this.items.push(new Item(pos.x, pos.y, 'crystal'));
        }
        
        // Pociones
        for(let i = 0; i < config.potions; i++) {
            const pos = this.map.getRandomWalkablePosition();
            this.items.push(new Item(pos.x, pos.y, 'potion'));
        }
        
        // Llaves
        for(let i = 0; i < config.keys; i++) {
            const pos = this.map.getRandomWalkablePosition();
            this.items.push(new Item(pos.x, pos.y, 'key'));
        }
    }
    
    spawnEnemies(levelNum) {
        const enemiesConfig = {
            1: { slimes: 3, fireballs: 0 },
            2: { slimes: 4, fireballs: 2 },
            3: { slimes: 5, fireballs: 4 }
        };
        
        const config = enemiesConfig[levelNum] || enemiesConfig[1];
        
        // Slimes
        for(let i = 0; i < config.slimes; i++) {
            const pos = this.map.getRandomWalkablePosition();
            this.enemies.push(new Enemy(pos.x, pos.y, 'slime'));
        }
        
        // Bolas de fuego
        for(let i = 0; i < config.fireballs; i++) {
            const pos = this.map.getRandomWalkablePosition();
            this.enemies.push(new Enemy(pos.x, pos.y, 'fireball'));
        }
    }
    
    /* ==========================================
       BUCLE PRINCIPAL DEL JUEGO
       ========================================== */
    
    gameLoop(currentTime) {
        if(this.state !== 'playing') {
            if(this.state !== 'gameover' && this.state !== 'levelcomplete') {
                this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
            }
            return;
        }
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Actualizar
        this.update(deltaTime);
        
        // Renderizar
        this.render();
        
        // Continuar loop
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /* ==========================================
       ACTUALIZACIÓN DE LÓGICA
       ========================================== */
    
    update(deltaTime) {
        // Actualizar jugador
        this.handleInput();
        this.player.update(deltaTime);
        
        // Actualizar enemigos
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime, this.player);
        });
        
        // Actualizar items (animaciones)
        this.items.forEach(item => {
            item.update(deltaTime);
        });
        
        // Actualizar partículas
        this.particles = this.particles.filter(p => {
            p.update(deltaTime);
            return p.life > 0;
        });
        
        // Verificar colisiones
        this.checkCollisions();
        
        // Actualizar screen shake
        if(this.screenShake > 0) {
            this.screenShake--;
        }
        
        // Actualizar UI
        this.updateUI();
    }
    
    handleInput() {
        let dx = 0;
        let dy = 0;
        
        // Movimiento con WASD
        if(this.keys['w'] || this.keys['arrowup']) dy = -1;
        if(this.keys['s'] || this.keys['arrowdown']) dy = 1;
        if(this.keys['a'] || this.keys['arrowleft']) dx = -1;
        if(this.keys['d'] || this.keys['arrowright']) dx = 1;
        
        // Normalizar movimiento diagonal
        if(dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        // Intentar mover al jugador
        if(dx !== 0 || dy !== 0) {
            this.player.move(dx, dy, this.map);
        }
    }
    
    /* ==========================================
       SISTEMA DE COLISIONES
       ========================================== */
    
    checkCollisions() {
        // Colisión con items
        for(let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            
            if(this.checkAABB(this.player, item)) {
                // Recolectar item
                this.collectItem(item);
                this.items.splice(i, 1);
            }
        }
        
        // Colisión con enemigos
        this.enemies.forEach(enemy => {
            if(!this.player.invulnerable && this.checkAABB(this.player, enemy)) {
                this.playerHit();
            }
        });
        
        // Verificar si llegó a la salida
        const exitTile = this.map.getExitPosition();
        const playerGridX = Math.floor((this.player.x + this.player.width / 2) / CONFIG.TILE_SIZE);
        const playerGridY = Math.floor((this.player.y + this.player.height / 2) / CONFIG.TILE_SIZE);
        
        if(playerGridX === exitTile.x && playerGridY === exitTile.y) {
            // Verificar si recolectó todos los cristales
            const totalCrystals = this.items.filter(item => item.type === 'crystal').length;
            
            if(totalCrystals === 0) {
                this.levelComplete();
            }
        }
    }
    
    checkAABB(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    collectItem(item) {
        this.playSound('collect');
        
        switch(item.type) {
            case 'crystal':
                this.player.crystalsCollected++;
                this.score += 10;
                this.createParticles(item.x + item.width/2, item.y + item.height/2, COLORS.CRYSTAL);
                break;
                
            case 'potion':
                if(this.player.lives < 3) {
                    this.player.lives++;
                }
                this.score += 5;
                this.createParticles(item.x + item.width/2, item.y + item.height/2, COLORS.POTION);
                break;
                
            case 'key':
                this.player.keys++;
                this.score += 15;
                this.createParticles(item.x + item.width/2, item.y + item.height/2, COLORS.KEY);
                break;
        }
    }
    
    playerHit() {
        this.player.lives--;
        this.player.invulnerable = true;
        this.screenShake = 10;
        this.playSound('hit');
        
        setTimeout(() => {
            this.player.invulnerable = false;
        }, 2000);
        
        if(this.player.lives <= 0) {
            this.gameOver();
        }
    }
    
    /* ==========================================
       RENDERIZADO
       ========================================== */
    
    render() {
        // Limpiar canvas
        this.ctx.fillStyle = COLORS.BG;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // Aplicar screen shake
        this.ctx.save();
        if(this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(shakeX, shakeY);
        }
        
        // Renderizar mapa
        this.map.render(this.ctx);
        
        // Renderizar items
        this.items.forEach(item => item.render(this.ctx));
        
        // Renderizar enemigos
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Renderizar jugador
        this.player.render(this.ctx);
        
        // Renderizar partículas
        this.particles.forEach(p => p.render(this.ctx));
        
        this.ctx.restore();
    }
    
    /* ==========================================
       INTERFAZ DE USUARIO
       ========================================== */
    
    updateUI() {
        document.getElementById('scoreDisplay').textContent = this.score;
        document.getElementById('levelDisplay').textContent = this.level;
        
        // Vidas
        const hearts = '❤️'.repeat(this.player.lives) + '🖤'.repeat(3 - this.player.lives);
        document.getElementById('livesDisplay').textContent = hearts;
        
        // Cristales restantes
        const totalCrystals = this.items.filter(item => item.type === 'crystal').length;
        document.getElementById('crystalsDisplay').textContent = 
            `${this.player.crystalsCollected}/${this.player.crystalsCollected + totalCrystals}`;
        
        // Llaves
        document.getElementById('keysDisplay').textContent = this.player.keys;
    }
    
    updateHighScoreDisplay() {
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    /* ==========================================
       SISTEMA DE PARTÍCULAS
       ========================================== */
    
    createParticles(x, y, color) {
        for(let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 1 + Math.random();
            this.particles.push(new Particle(x, y, angle, speed, color));
        }
    }
    
    /* ==========================================
       SISTEMA DE SONIDO 8-BIT
       ========================================== */
    
    playSound(type) {
        try {
            if(!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const ctx = this.audioContext;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            switch(type) {
                case 'collect':
                    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.1);
                    break;
                    
                case 'hit':
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.2);
                    break;
                    
                case 'levelcomplete':
                    [0, 0.1, 0.2, 0.3].forEach((time, i) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        
                        const freq = [523, 659, 784, 1047][i];
                        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
                        gain.gain.setValueAtTime(0.2, ctx.currentTime + time);
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.2);
                        osc.start(ctx.currentTime + time);
                        osc.stop(ctx.currentTime + time + 0.2);
                    });
                    break;
                    
                case 'gameover':
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.5);
                    break;
            }
        } catch(e) {
            console.log('Audio not supported');
        }
    }
}

/* ==========================================
   CLASE JUGADOR
   ========================================== */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 12;
        this.height = 14;
        this.speed = CONFIG.PLAYER_SPEED;
        this.lives = 3;
        this.keys = 0;
        this.crystalsCollected = 0;
        this.invulnerable = false;
        
        // Animación
        this.direction = 'down'; // up, down, left, right
        this.animFrame = 0;
        this.animTimer = 0;
        this.isMoving = false;
    }
    
    move(dx, dy, map) {
        this.isMoving = true;
        
        // Determinar dirección
        if(Math.abs(dx) > Math.abs(dy)) {
            this.direction = dx > 0 ? 'right' : 'left';
        } else {
            this.direction = dy > 0 ? 'down' : 'up';
        }
        
        // Calcular nueva posición
        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;
        
        // Verificar colisión con mapa
        if(map.canWalk(newX, this.y, this.width, this.height)) {
            this.x = newX;
        }
        
        if(map.canWalk(this.x, newY, this.width, this.height)) {
            this.y = newY;
        }
        
        // Mantener dentro del canvas
        this.x = Math.max(0, Math.min(this.x, CONFIG.CANVAS_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, CONFIG.CANVAS_HEIGHT - this.height));
    }
    
    update(deltaTime) {
        // Animación de caminar
        if(this.isMoving) {
            this.animTimer += deltaTime;
            if(this.animTimer > 200) {
                this.animFrame = (this.animFrame + 1) % 2;
                this.animTimer = 0;
            }
        } else {
            this.animFrame = 0;
        }
        
        this.isMoving = false;
    }
    
    render(ctx) {
        // Efecto de invulnerabilidad (parpadeo)
        if(this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }
        
        // Dibujar sprite pixelado del jugador
        ctx.fillStyle = COLORS.PLAYER;
        
        // Cuerpo principal
        ctx.fillRect(this.x + 2, this.y + 2, 8, 10);
        
        // Cabeza
        ctx.fillStyle = COLORS.PLAYER;
        ctx.fillRect(this.x + 3, this.y, 6, 6);
        
        // Ojos
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 4, this.y + 2, 1, 1);
        ctx.fillRect(this.x + 7, this.y + 2, 1, 1);
        
        // Brazos y piernas según animación
        ctx.fillStyle = COLORS.PLAYER_OUTLINE;
        
        if(this.direction === 'down') {
            // Brazos
            ctx.fillRect(this.x + 1, this.y + 6, 2, 3);
            ctx.fillRect(this.x + 9, this.y + 6, 2, 3);
            // Piernas
            const offset = this.animFrame === 1 ? 1 : 0;
            ctx.fillRect(this.x + 3, this.y + 12, 2, 2);
            ctx.fillRect(this.x + 7 + offset, this.y + 12, 2, 2);
        } else if(this.direction === 'up') {
            // Brazos
            ctx.fillRect(this.x + 1, this.y + 6, 2, 3);
            ctx.fillRect(this.x + 9, this.y + 6, 2, 3);
            // Piernas
            ctx.fillRect(this.x + 3, this.y + 12, 2, 2);
            ctx.fillRect(this.x + 7, this.y + 12, 2, 2);
        } else if(this.direction === 'left') {
            // Brazo
            ctx.fillRect(this.x, this.y + 6, 2, 3);
            // Piernas
            const offset = this.animFrame === 1 ? 1 : 0;
            ctx.fillRect(this.x + 3, this.y + 12, 2, 2);
            ctx.fillRect(this.x + 5 + offset, this.y + 12, 2, 2);
        } else {
            // Brazo
            ctx.fillRect(this.x + 10, this.y + 6, 2, 3);
            // Piernas
            const offset = this.animFrame === 1 ? 1 : 0;
            ctx.fillRect(this.x + 3, this.y + 12, 2, 2);
            ctx.fillRect(this.x + 5 + offset, this.y + 12, 2, 2);
        }
    }
}

/* ==========================================
   CLASE ENEMIGO
   ========================================== */

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 12;
        this.height = 12;
        this.type = type; // slime, fireball
        this.speed = type === 'slime' ? CONFIG.ENEMY_SPEED : CONFIG.ENEMY_SPEED * 1.5;
        
        // Comportamiento
        this.moveTimer = 0;
        this.moveDelay = type === 'slime' ? 500 : 300;
        this.direction = { x: 0, y: 0 };
        
        // Animación
        this.animFrame = 0;
        this.animTimer = 0;
    }
    
    update(deltaTime, player) {
        this.moveTimer += deltaTime;
        this.animTimer += deltaTime;
        
        if(this.animTimer > 150) {
            this.animFrame = (this.animFrame + 1) % 3;
            this.animTimer = 0;
        }
        
        if(this.moveTimer > this.moveDelay) {
            if(this.type === 'slime') {
                // Seguir al jugador
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if(dist > 0) {
                    this.direction.x = (dx / dist) * this.speed;
                    this.direction.y = (dy / dist) * this.speed;
                }
            } else if(this.type === 'fireball') {
                // Movimiento en patrón
                const patterns = [
                    { x: 1, y: 0 },
                    { x: 0, y: 1 },
                    { x: -1, y: 0 },
                    { x: 0, y: -1 }
                ];
                
                const pattern = patterns[Math.floor(this.animFrame / 2) % patterns.length];
                this.direction.x = pattern.x * this.speed;
                this.direction.y = pattern.y * this.speed;
            }
            
            this.moveTimer = 0;
        }
        
        // Mover
        this.x += this.direction.x;
        this.y += this.direction.y;
        
        // Mantener dentro del canvas
        if(this.x < 0 || this.x > CONFIG.CANVAS_WIDTH - this.width) {
            this.direction.x = -this.direction.x;
            this.x = Math.max(0, Math.min(this.x, CONFIG.CANVAS_WIDTH - this.width));
        }
        
        if(this.y < 0 || this.y > CONFIG.CANVAS_HEIGHT - this.height) {
            this.direction.y = -this.direction.y;
            this.y = Math.max(0, Math.min(this.y, CONFIG.CANVAS_HEIGHT - this.height));
        }
    }
    
    render(ctx) {
        if(this.type === 'slime') {
            // Dibujar slime verde
            ctx.fillStyle = COLORS.ENEMY_SLIME;
            
            // Cuerpo (blob)
            ctx.fillRect(this.x + 2, this.y + 4, 8, 6);
            ctx.fillRect(this.x + 1, this.y + 6, 10, 4);
            ctx.fillRect(this.x + 3, this.y + 2, 6, 4);
            
            // Ojos
            ctx.fillStyle = '#000000';
            const eyeOffset = this.animFrame % 2;
            ctx.fillRect(this.x + 3, this.y + 5 + eyeOffset, 2, 2);
            ctx.fillRect(this.x + 7, this.y + 5 + eyeOffset, 2, 2);
            
            // Brillo
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(this.x + 4, this.y + 3, 1, 1);
            
        } else if(this.type === 'fireball') {
            // Dibujar bola de fuego
            const colors = ['#ff5722', '#ff9800', '#ffeb3b'];
            const color = colors[this.animFrame % colors.length];
            
            ctx.fillStyle = color;
            
            // Núcleo
            ctx.fillRect(this.x + 3, this.y + 3, 6, 6);
            ctx.fillRect(this.x + 2, this.y + 4, 8, 4);
            ctx.fillRect(this.x + 4, this.y + 2, 4, 8);
            
            // Llamas externas
            ctx.fillStyle = '#ff5722';
            ctx.fillRect(this.x + 1, this.y + 5, 1, 2);
            ctx.fillRect(this.x + 10, this.y + 5, 1, 2);
            ctx.fillRect(this.x + 5, this.y + 1, 2, 1);
            ctx.fillRect(this.x + 5, this.y + 10, 2, 1);
        }
    }
}

/* ==========================================
   CLASE ITEM
   ========================================== */

class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.type = type; // crystal, potion, key
        
        // Animación
        this.animFrame = 0;
        this.animTimer = 0;
        this.bobOffset = 0;
    }
    
    update(deltaTime) {
        this.animTimer += deltaTime;
        
        if(this.animTimer > 100) {
            this.animFrame++;
            this.animTimer = 0;
        }
        
        // Efecto de flotación
        this.bobOffset = Math.sin(this.animFrame * 0.1) * 2;
    }
    
    render(ctx) {
        const drawY = this.y + this.bobOffset;
        
        if(this.type === 'crystal') {
            // Cristal azul brillante
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(this.x + 3, drawY, 2, 8);
            ctx.fillRect(this.x + 1, drawY + 3, 6, 2);
            ctx.fillRect(this.x + 2, drawY + 2, 4, 4);
            
            // Brillo
            if(this.animFrame % 20 < 10) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(this.x + 3, drawY + 3, 1, 1);
            }
            
        } else if(this.type === 'potion') {
            // Poción magenta
            ctx.fillStyle = COLORS.POTION;
            
            // Botella
            ctx.fillRect(this.x + 2, drawY + 2, 4, 5);
            ctx.fillRect(this.x + 3, drawY + 1, 2, 1);
            
            // Líquido
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(this.x + 2, drawY + 4, 4, 3);
            
            // Tapa
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(this.x + 3, drawY, 2, 2);
            
        } else if(this.type === 'key') {
            // Llave dorada
            ctx.fillStyle = COLORS.KEY;
            
            // Mango
            ctx.fillRect(this.x + 1, drawY + 1, 3, 3);
            
            // Cuerpo
            ctx.fillRect(this.x + 4, drawY + 2, 3, 1);
            
            // Dientes
            ctx.fillRect(this.x + 6, drawY + 3, 1, 2);
            ctx.fillRect(this.x + 5, drawY + 4, 1, 1);
        }
    }
}

/* ==========================================
   CLASE MAPA DE TILES
   ========================================== */

class TileMap {
    constructor(levelNum) {
        this.width = CONFIG.GRID_WIDTH;
        this.height = CONFIG.GRID_HEIGHT;
        this.tiles = [];
        this.levelNum = levelNum;
        
        this.generateMap(levelNum);
    }
    
    generateMap(levelNum) {
        // Inicializar con hierba
        for(let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for(let x = 0; x < this.width; x++) {
                this.tiles[y][x] = 'grass';
            }
        }
        
        // Agregar bordes de paredes
        for(let x = 0; x < this.width; x++) {
            this.tiles[0][x] = 'wall';
            this.tiles[this.height - 1][x] = 'wall';
        }
        
        for(let y = 0; y < this.height; y++) {
            this.tiles[y][0] = 'wall';
            this.tiles[y][this.width - 1] = 'wall';
        }
        
        // Generar obstáculos según nivel
        if(levelNum === 1) {
            // Nivel 1: Bosque simple
            this.addRandomObstacles('wall', 10);
            this.tiles[7][10] = 'door';
            this.tiles[2][18] = 'exit';
            
        } else if(levelNum === 2) {
            // Nivel 2: Cavernas con laberinto
            this.addRandomObstacles('wall', 20);
            this.addWater(5);
            this.tiles[7][10] = 'door';
            this.tiles[7][15] = 'door';
            this.tiles[2][18] = 'exit';
            
        } else if(levelNum === 3) {
            // Nivel 3: Castillo complejo
            this.addRandomObstacles('wall', 30);
            this.addWater(8);
            this.tiles[5][8] = 'door';
            this.tiles[9][10] = 'door';
            this.tiles[7][15] = 'door';
            this.tiles[2][18] = 'exit';
        }
    }
    
    addRandomObstacles(type, count) {
        for(let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * (this.width - 4)) + 2;
            const y = Math.floor(Math.random() * (this.height - 4)) + 2;
            
            // No colocar en posición inicial
            if(x === 2 && y === 2) continue;
            
            this.tiles[y][x] = type;
        }
    }
    
    addWater(count) {
        for(let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * (this.width - 4)) + 2;
            const y = Math.floor(Math.random() * (this.height - 4)) + 2;
            
            if(x === 2 && y === 2) continue;
            
            this.tiles[y][x] = 'water';
            
            // Agregar tiles de agua adyacentes
            if(x + 1 < this.width - 1) this.tiles[y][x + 1] = 'water';
            if(y + 1 < this.height - 1) this.tiles[y + 1][x] = 'water';
        }
    }
    
    getStartPosition() {
        return { x: 2 * CONFIG.TILE_SIZE, y: 2 * CONFIG.TILE_SIZE };
    }
    
    getExitPosition() {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(this.tiles[y][x] === 'exit') {
                    return { x, y };
                }
            }
        }
        return { x: this.width - 2, y: 1 };
    }
    
    getRandomWalkablePosition() {
        let x, y;
        let attempts = 0;
        
        do {
            x = Math.floor(Math.random() * (this.width - 4)) + 2;
            y = Math.floor(Math.random() * (this.height - 4)) + 2;
            attempts++;
            
            if(attempts > 100) {
                x = 5;
                y = 5;
                break;
            }
        } while(!this.isWalkable(x, y));
        
        return { x: x * CONFIG.TILE_SIZE, y: y * CONFIG.TILE_SIZE };
    }
    
    isWalkable(gridX, gridY) {
        if(gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
            return false;
        }
        
        const tile = this.tiles[gridY][gridX];
        return tile === 'grass' || tile === 'dirt' || tile === 'exit';
    }
    
    canWalk(x, y, width, height) {
        // Verificar las 4 esquinas del jugador
        const corners = [
            { x: x, y: y },
            { x: x + width, y: y },
            { x: x, y: y + height },
            { x: x + width, y: y + height }
        ];
        
        for(const corner of corners) {
            const gridX = Math.floor(corner.x / CONFIG.TILE_SIZE);
            const gridY = Math.floor(corner.y / CONFIG.TILE_SIZE);
            
            if(!this.isWalkable(gridX, gridY)) {
                return false;
            }
        }
        
        return true;
    }
    
    render(ctx) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                const drawX = x * CONFIG.TILE_SIZE;
                const drawY = y * CONFIG.TILE_SIZE;
                
                switch(tile) {
                    case 'grass':
                        ctx.fillStyle = COLORS.GRASS;
                        ctx.fillRect(drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                        
                        // Detalles de hierba
                        if((x + y) % 3 === 0) {
                            ctx.fillStyle = '#248f4a';
                            ctx.fillRect(drawX + 2, drawY + 2, 2, 2);
                        }
                        break;
                        
                    case 'wall':
                        ctx.fillStyle = COLORS.WALL;
                        ctx.fillRect(drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                        
                        // Borde
                        ctx.fillStyle = '#2a2a2a';
                        ctx.fillRect(drawX, drawY, CONFIG.TILE_SIZE, 2);
                        ctx.fillRect(drawX, drawY, 2, CONFIG.TILE_SIZE);
                        break;
                        
                    case 'water':
                        ctx.fillStyle = COLORS.WATER;
                        ctx.fillRect(drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                        
                        // Olas animadas
                        if(Math.floor(Date.now() / 500) % 2 === 0) {
                            ctx.fillStyle = '#0088cc';
                            ctx.fillRect(drawX + 4, drawY + 4, 4, 2);
                        }
                        break;
                        
                    case 'door':
                        ctx.fillStyle = COLORS.GRASS;
                        ctx.fillRect(drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                        
                        ctx.fillStyle = COLORS.DOOR;
                        ctx.fillRect(drawX + 2, drawY, 12, CONFIG.TILE_SIZE);
                        
                        // Manija
                        ctx.fillStyle = COLORS.KEY;
                        ctx.fillRect(drawX + 10, drawY + 7, 2, 2);
                        break;
                        
                    case 'exit':
                        ctx.fillStyle = COLORS.GRASS;
                        ctx.fillRect(drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                        
                        // Portal brillante
                        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
                        ctx.fillStyle = COLORS.EXIT;
                        ctx.globalAlpha = pulse;
                        ctx.fillRect(drawX + 2, drawY + 2, 12, 12);
                        ctx.fillRect(drawX + 4, drawY, 8, CONFIG.TILE_SIZE);
                        ctx.globalAlpha = 1;
                        
                        // Centro
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(drawX + 6, drawY + 6, 4, 4);
                        break;
                }
            }
        }
    }
}

/* ==========================================
   CLASE PARTÍCULA
   ========================================== */

class Particle {
    constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.life = 60; // frames
        this.maxLife = 60;
        this.size = 2;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        
        // Gravedad
        this.vy += 0.1;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

/* ==========================================
   INICIAR JUEGO
   ========================================== */

// Esperar a que el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
