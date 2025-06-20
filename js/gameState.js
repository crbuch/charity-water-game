// Game State Management
window.GameState = {
    // Current game state
    current: {
        isPlaying: false,
        isPaused: false,
        score: 0,
        lives: GameConfig.MAX_LIVES,
        timeLeft: GameConfig.GAME_DURATION,
        dropsCollected: 0,
        totalDropsSpawned: 0,
        achievementsUnlocked: [],
        currentScreen: GameStates.LOADING
    },

    // Game timers and intervals
    timers: {
        gameTimer: null,
        dropSpawner: null,
        activeDrops: new Set()
    },

    // Initialize game state
    init() {
        this.reset();
    },

    // Reset game state to initial values
    reset() {
        this.current.isPlaying = false;
        this.current.isPaused = false;
        this.current.score = 0;
        this.current.lives = GameConfig.MAX_LIVES;
        this.current.timeLeft = GameConfig.GAME_DURATION;
        this.current.dropsCollected = 0;
        this.current.totalDropsSpawned = 0;
        this.current.achievementsUnlocked = [];
        
        this.clearAllTimers();
    },

    // Update score and return new score
    addScore(points) {
        this.current.score += points;
        return this.current.score;
    },

    // Lose a life and return remaining lives
    loseLife() {
        this.current.lives = Math.max(0, this.current.lives - 1);
        return this.current.lives;
    },

    // Increment drops collected
    collectDrop() {
        this.current.dropsCollected++;
        return this.current.dropsCollected;
    },

    // Increment total drops spawned
    spawnDrop() {
        this.current.totalDropsSpawned++;
        return this.current.totalDropsSpawned;
    },

    // Check if achievement should be unlocked
    checkAchievement(threshold) {
        return this.current.score >= threshold && 
               !this.current.achievementsUnlocked.includes(threshold);
    },

    // Mark achievement as unlocked
    unlockAchievement(threshold) {
        if (!this.current.achievementsUnlocked.includes(threshold)) {
            this.current.achievementsUnlocked.push(threshold);
        }
    },

    // Calculate accuracy percentage
    getAccuracy() {
        if (this.current.totalDropsSpawned === 0) return 0;
        return Math.round((this.current.dropsCollected / this.current.totalDropsSpawned) * 100);
    },

    // Get performance level based on score
    getPerformanceLevel() {
        const score = this.current.score;
        if (score >= 500) return 'excellent';
        if (score >= 300) return 'great';
        if (score >= 150) return 'good';
        if (score >= 50) return 'fair';
        return 'poor';
    },

    // Timer management
    startGameTimer(callback) {
        this.timers.gameTimer = setInterval(() => {
            this.current.timeLeft--;
            if (callback) callback(this.current.timeLeft);
            
            if (this.current.timeLeft <= 0) {
                this.clearGameTimer();
                if (window.Game) window.Game.endGame();
            }
        }, 1000);
    },

    startDropSpawner(callback) {
        this.timers.dropSpawner = setInterval(() => {
            if (this.current.isPlaying && !this.current.isPaused) {
                if (callback) callback();
            }
        }, GameConfig.DROP_SPAWN_RATE);
    },

    clearGameTimer() {
        if (this.timers.gameTimer) {
            clearInterval(this.timers.gameTimer);
            this.timers.gameTimer = null;
        }
    },

    clearDropSpawner() {
        if (this.timers.dropSpawner) {
            clearInterval(this.timers.dropSpawner);
            this.timers.dropSpawner = null;
        }
    },

    clearAllTimers() {
        this.clearGameTimer();
        this.clearDropSpawner();
    },

    // Drop tracking
    addActiveDrop(drop) {
        this.timers.activeDrops.add(drop);
    },

    removeActiveDrop(drop) {
        this.timers.activeDrops.delete(drop);
    },

    clearActiveDrops() {
        this.timers.activeDrops.forEach(drop => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        });
        this.timers.activeDrops.clear();
    },

    pauseActiveDrops() {
        this.timers.activeDrops.forEach(drop => {
            drop.style.animationPlayState = 'paused';
        });
    },

    resumeActiveDrops() {
        this.timers.activeDrops.forEach(drop => {
            drop.style.animationPlayState = 'running';
        });
    },

    // Game state getters
    isGameActive() {
        return this.current.isPlaying && !this.current.isPaused;
    },

    isGameOver() {
        return this.current.lives <= 0 || this.current.timeLeft <= 0;
    },

    canPause() {
        return this.current.isPlaying && !this.current.isPaused;
    },

    canResume() {
        return this.current.isPlaying && this.current.isPaused;
    },

    // State change methods
    startPlaying() {
        this.current.isPlaying = true;
        this.current.isPaused = false;
    },

    pause() {
        this.current.isPaused = true;
    },

    resume() {
        this.current.isPaused = false;
    },

    stop() {
        this.current.isPlaying = false;
        this.current.isPaused = false;
        this.clearAllTimers();
        this.clearActiveDrops();
    },

    // Get current state snapshot
    getSnapshot() {
        return {
            ...this.current,
            accuracy: this.getAccuracy(),
            performanceLevel: this.getPerformanceLevel()
        };
    }
};
