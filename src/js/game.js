// Main Game Controller
window.Game = {
    elements: {},
    initialized: false,

    // Initialize the game
    init() {
        console.log('Initializing Clean Drop Challenge...');
        
        // Initialize components in order
        GameComponents.initializeScreens();
        GameState.init();
        
        if (!DropManager.init()) {
            console.error('Failed to initialize DropManager');
            return false;
        }
        
        if (!AchievementManager.init()) {
            console.error('Failed to initialize AchievementManager');
            return false;
        }
        
        ScreenManager.init();
        
        this.cacheElements();
        this.bindEvents();
        
        this.initialized = true;
        console.log('Game initialized successfully');
        return true;
    },

    // Cache DOM elements
    cacheElements() {
        this.elements = {
            // HUD elements
            score: document.querySelector(GameSelectors.SCORE),
            lives: document.querySelector(GameSelectors.LIVES),
            time: document.querySelector(GameSelectors.TIME),
            
            // Game area
            gameArea: document.querySelector(GameSelectors.GAME_AREA),
            
            // Buttons - will be bound dynamically as screens load
        };
    },

    // Bind event listeners
    bindEvents() {
        // Use event delegation for dynamically created buttons
        document.addEventListener('click', this.handleButtonClick.bind(this));
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Game area clicks for ripple effect
        if (this.elements.gameArea) {
            this.elements.gameArea.addEventListener('click', this.handleGameAreaClick.bind(this));
        }
    },

    // Handle button clicks using event delegation
    handleButtonClick(event) {
        const button = event.target.closest('button');
        if (!button) return;

        switch(button.id) {
            case 'start-game-btn':
                this.startGame();
                break;
            case 'learn-more-btn':
                this.showMissionScreen();
                break;
            case 'pause-btn':
                this.togglePause();
                break;
            case 'resume-btn':
                this.resumeGame();
                break;
            case 'quit-btn':
                this.quitGame();
                break;
            case 'play-again-btn':
                this.resetGame();
                break;
            case 'visit-charity-water-btn':
            case 'donate-btn':
                this.visitCharityWater();
                break;
            case 'share-score-btn':
                this.shareScore();
                break;
            case 'close-mission-btn':
                this.hideMissionScreen();
                break;
            case 'achievement-close':
                AchievementManager.hideAchievement();
                break;
        }
    },

    // Handle keyboard input
    handleKeyPress(event) {
        switch(event.key) {
            case ' ':
            case 'Escape':
                if (GameState.canPause()) {
                    this.pauseGame();
                } else if (GameState.canResume()) {
                    this.resumeGame();
                }
                event.preventDefault();
                break;
            case 'Enter':
                if (ScreenManager.getCurrentScreen() === 'start') {
                    this.startGame();
                }
                break;
        }
    },

    // Handle game area clicks (for ripple effect)
    handleGameAreaClick(event) {
        if (event.target === this.elements.gameArea && GameState.isGameActive()) {
            const rect = this.elements.gameArea.getBoundingClientRect();
            const x = event.clientX;
            const y = event.clientY;
            DropManager.createRippleEffect(x, y);
        }
    },

    // Start new game
    startGame() {
        console.log('Starting game...');
        
        GameState.reset();
        GameState.startPlaying();
        ScreenManager.showScreen('game');
        
        // Reset game screen state
        const gameScreen = document.querySelector('#game-screen');
        if (gameScreen) {
            gameScreen.classList.remove('paused');
        }
        
        // Reset achievement manager
        AchievementManager.reset();
        
        // Reset pause button icon
        const pauseBtn = document.querySelector('#pause-btn i');
        if (pauseBtn) {
            pauseBtn.className = 'bi bi-pause-fill';
        }
        
        // Show player barrel
        const playerBarrel = document.querySelector('.player-barrel');
        if (playerBarrel) {
            playerBarrel.style.display = 'flex';
            playerBarrel.style.opacity = '1';
        }
        
        this.updateHUD();
        this.startGameTimers();
        
        console.log('Game started');
    },

    // Start game timers
    startGameTimers() {
        GameState.startGameTimer(() => {
            this.updateHUD();
        });
        
        GameState.startDropSpawner(() => {
            DropManager.spawnDrop();
        });
    },

    // Toggle pause/resume
    togglePause() {
        // Don't allow manual pause/resume if achievement is showing
        if (AchievementManager.currentAchievement) {
            return;
        }
        
        if (GameState.canPause()) {
            this.pauseGame();
        } else if (GameState.canResume()) {
            this.resumeGame();
        }
    },

    // Pause game
    pauseGame() {
        if (!GameState.canPause()) return;
        
        console.log('Pausing game...');
        GameState.pause();
        GameState.clearAllTimers();
        DropManager.pauseAllDrops();
        
        // Add paused class to game screen
        const gameScreen = document.querySelector('#game-screen');
        if (gameScreen) {
            gameScreen.classList.add('paused');
        }
        
        // Force hide player barrel
        const playerBarrel = document.querySelector('.player-barrel');
        if (playerBarrel) {
            playerBarrel.style.display = 'none';
        }
        
        // Update pause button icon
        const pauseBtn = document.querySelector('#pause-btn i');
        if (pauseBtn) {
            pauseBtn.className = 'bi bi-play-fill';
        }
        
        ScreenManager.showOverlay('pause');
    },

    // Resume game
    resumeGame() {
        if (!GameState.canResume()) return;
        
        console.log('Resuming game...');
        GameState.resume();
        ScreenManager.hideOverlay('pause');
        
        // Remove paused class from game screen
        const gameScreen = document.querySelector('#game-screen');
        if (gameScreen) {
            gameScreen.classList.remove('paused');
        }
        
        // Show player barrel
        const playerBarrel = document.querySelector('.player-barrel');
        if (playerBarrel) {
            playerBarrel.style.display = 'flex';
            playerBarrel.style.opacity = '1';
        }
        
        // Update pause button icon back to pause
        const pauseBtn = document.querySelector('#pause-btn i');
        if (pauseBtn) {
            pauseBtn.className = 'bi bi-pause-fill';
        }
        
        this.startGameTimers();
        DropManager.resumeAllDrops();
    },

    // Quit current game
    quitGame() {
        console.log('Quitting game...');
        this.endGame();
        ScreenManager.showScreen('start');
    },

    // End current game
    endGame() {
        console.log('Ending game...');
        GameState.stop();
        AchievementManager.hideAchievement();
        
        if (ScreenManager.getCurrentScreen() !== 'start') {
            ScreenManager.showScreen('gameOver');
        }
    },

    // Reset and start new game
    resetGame() {
        console.log('Resetting game...');
        this.startGame();
    },

    // Update HUD display
    updateHUD() {
        const state = GameState.current;
        
        if (this.elements.score) {
            this.elements.score.textContent = state.score;
        }
        
        if (this.elements.time) {
            this.elements.time.textContent = state.timeLeft;
        }
        
        this.updateLivesDisplay();
    },

    // Update lives display
    updateLivesDisplay() {
        const livesElement = this.elements.lives;
        if (!livesElement) return;
        
        const hearts = livesElement.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            if (index >= GameState.current.lives) {
                heart.classList.add(GameClasses.HEART_LOST);
            } else {
                heart.classList.remove(GameClasses.HEART_LOST);
            }
        });
    },

    // Check for new achievements
    checkAchievements() {
        AchievementManager.checkAchievements();
    },

    // Show mission screen
    showMissionScreen() {
        ScreenManager.showOverlay('mission');
    },

    // Hide mission screen
    hideMissionScreen() {
        ScreenManager.hideOverlay('mission');
    },

    // Visit charity: water website
    visitCharityWater() {
        window.open(GameConfig.CHARITY_WATER_URL, '_blank');
    },

    // Share score on social media
    shareScore() {
        const score = GameState.current.score;
        const achievements = GameState.current.achievementsUnlocked.length;
        
        const text = `I just scored ${score} points and unlocked ${achievements} achievements in Clean Drop Challenge! Join me in supporting @charitywater's mission to provide clean water access worldwide. 💧 #CleanWater #CharityWater`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Clean Drop Challenge Score',
                text: text,
                url: window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(text);
            });
        } else {
            this.fallbackShare(text);
        }
    },

    // Fallback share method
    fallbackShare(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text + ' ' + window.location.href).then(() => {
                this.showShareConfirmation('Score shared! Text copied to clipboard.');
            }).catch(() => {
                this.showShareConfirmation(`Share your score: ${text}`);
            });
        } else {
            this.showShareConfirmation(`Share your score: ${text}`);
        }
    },

    // Show share confirmation
    showShareConfirmation(message) {
        // Create a temporary toast notification
        const toast = document.createElement('div');
        toast.className = 'position-fixed top-50 start-50 translate-middle bg-dark text-white p-3 rounded';
        toast.style.zIndex = '10000';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    },

    // Get current game statistics
    getGameStats() {
        return {
            ...GameState.getSnapshot(),
            achievements: AchievementManager.getAchievementStats()
        };
    },

    // Debug method to check game state
    debug() {
        console.log('Game Debug Info:', {
            initialized: this.initialized,
            currentScreen: ScreenManager.getCurrentScreen(),
            gameState: GameState.getSnapshot(),
            activeDrops: DropManager.getActiveDropCount(),
            achievements: AchievementManager.getAchievementStats()
        });
    }
};
