// Screen Management System
window.ScreenManager = {
    screens: {},
    currentScreen: null,

    // Initialize screen manager
    init() {
        this.cacheScreenElements();
        this.hideLoadingScreen();
        this.showScreen('start');
    },

    // Cache all screen elements
    cacheScreenElements() {
        this.screens = {
            loading: document.querySelector(GameSelectors.LOADING_SCREEN),
            start: document.querySelector(GameSelectors.START_SCREEN),
            game: document.querySelector(GameSelectors.GAME_SCREEN),
            pause: document.querySelector(GameSelectors.PAUSE_SCREEN),
            gameOver: document.querySelector(GameSelectors.GAME_OVER_SCREEN),
            mission: document.querySelector(GameSelectors.MISSION_SCREEN)
        };
    },

    // Show specific screen
    showScreen(screenName) {
        // Hide all screens first
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.remove(GameClasses.SCREEN_ACTIVE);
            }
        });

        // Show target screen
        const targetScreen = this.screens[screenName];
        if (targetScreen) {
            targetScreen.classList.add(GameClasses.SCREEN_ACTIVE);
            this.currentScreen = screenName;
            GameState.current.currentScreen = screenName;
            
            // Handle screen-specific setup
            this.handleScreenShown(screenName);
        } else {
            console.error(`Screen not found: ${screenName}`);
        }
    },

    // Handle screen-specific setup when shown
    handleScreenShown(screenName) {
        switch(screenName) {
            case 'start':
                this.setupStartScreen();
                break;
            case 'game':
                this.setupGameScreen();
                break;
            case 'gameOver':
                this.setupGameOverScreen();
                break;
            case 'mission':
                this.setupMissionScreen();
                break;
        }
    },

    // Setup start screen
    setupStartScreen() {
        // Add any start screen specific setup here
        console.log('Start screen shown');
    },

    // Setup game screen
    setupGameScreen() {
        // Ensure game area is ready
        if (!DropManager.gameArea) {
            DropManager.init();
        }
        console.log('Game screen shown');
    },

    // Setup game over screen
    setupGameOverScreen() {
        this.updateGameOverStats();
        console.log('Game over screen shown');
    },

    // Setup mission screen
    setupMissionScreen() {
        console.log('Mission screen shown');
    },

    // Show overlay screen (doesn't hide current screen)
    showOverlay(screenName) {
        const overlayScreen = this.screens[screenName];
        if (overlayScreen) {
            overlayScreen.classList.add(GameClasses.SCREEN_ACTIVE);
        }
    },

    // Hide overlay screen
    hideOverlay(screenName) {
        const overlayScreen = this.screens[screenName];
        if (overlayScreen) {
            overlayScreen.classList.remove(GameClasses.SCREEN_ACTIVE);
        }
    },

    // Show loading screen
    showLoadingScreen() {
        const loadingScreen = this.screens.loading;
        if (loadingScreen) {
            loadingScreen.classList.remove(GameClasses.LOADING_HIDDEN);
        }
    },

    // Hide loading screen
    hideLoadingScreen() {
        const loadingScreen = this.screens.loading;
        if (loadingScreen) {
            loadingScreen.classList.add(GameClasses.LOADING_HIDDEN);
        }
    },

    // Update game over screen with final stats
    updateGameOverStats() {
        const state = GameState.getSnapshot();
        
        // Update final score
        const finalScoreElement = document.querySelector(GameSelectors.FINAL_SCORE);
        if (finalScoreElement) {
            finalScoreElement.textContent = state.score;
        }

        // Update drops collected
        const dropsCollectedElement = document.querySelector(GameSelectors.DROPS_COLLECTED);
        if (dropsCollectedElement) {
            dropsCollectedElement.textContent = state.dropsCollected;
        }

        // Update accuracy
        const accuracyElement = document.querySelector(GameSelectors.ACCURACY_PERCENT);
        if (accuracyElement) {
            accuracyElement.textContent = state.accuracy + '%';
        }

        // Update performance-based messages
        this.updatePerformanceMessages(state);
    },

    // Update messages based on performance
    updatePerformanceMessages(state) {
        const performance = GameConfig.PERFORMANCE_MESSAGES[state.performanceLevel];
        
        // Update title
        const titleElement = document.querySelector(GameSelectors.GAME_OVER_TITLE);
        if (titleElement && performance) {
            titleElement.textContent = performance.title;
        }

        // Update score message
        const scoreMessageElement = document.querySelector(GameSelectors.SCORE_MESSAGE);
        if (scoreMessageElement && performance) {
            scoreMessageElement.textContent = performance.message;
        }

        // Update impact message
        const impactMessageElement = document.querySelector(GameSelectors.IMPACT_MESSAGE);
        if (impactMessageElement && performance) {
            impactMessageElement.textContent = performance.impact;
        }
    },

    // Transition between screens with animation
    transitionToScreen(fromScreen, toScreen, animationType = 'fade') {
        const from = this.screens[fromScreen];
        const to = this.screens[toScreen];
        
        if (!from || !to) {
            this.showScreen(toScreen);
            return;
        }

        switch(animationType) {
            case 'slideLeft':
                from.classList.add('slide-out-left');
                to.classList.add('slide-in-right');
                break;
            case 'slideRight':
                from.classList.add('slide-out-right');
                to.classList.add('slide-in-left');
                break;
            default:
                from.classList.add('fade-out');
                to.classList.add('fade-in');
        }

        setTimeout(() => {
            this.showScreen(toScreen);
            // Clean up animation classes
            from.classList.remove('slide-out-left', 'slide-out-right', 'fade-out');
            to.classList.remove('slide-in-left', 'slide-in-right', 'fade-in');
        }, 500);
    },

    // Get current screen name
    getCurrentScreen() {
        return this.currentScreen;
    },

    // Check if screen exists
    screenExists(screenName) {
        return this.screens[screenName] !== undefined;
    }
};
