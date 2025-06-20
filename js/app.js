// Application Entry Point
(function() {
    'use strict';

    // App initialization
    const App = {
        init() {
            console.log('Clean Drop Challenge - Loading...');
            
            // Show loading screen immediately
            this.showLoadingScreen();
            
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.onDOMReady();
                });
            } else {
                this.onDOMReady();
            }
        },

        // Called when DOM is ready
        onDOMReady() {
            console.log('DOM ready, initializing game...');
            
            // Simulate loading time for better UX
            setTimeout(() => {
                this.initializeGame();
            }, 1500);
        },

        // Initialize the game
        initializeGame() {
            try {
                // Check for required dependencies
                if (!this.checkDependencies()) {
                    this.showError('Missing required dependencies');
                    return;
                }

                // Initialize game
                const success = window.Game.init();
                
                if (success) {
                    this.hideLoadingScreen();
                    console.log('✅ Clean Drop Challenge loaded successfully!');
                } else {
                    this.showError('Failed to initialize game');
                }
                
            } catch (error) {
                console.error('Error initializing game:', error);
                this.showError('Failed to load game: ' + error.message);
            }
        },

        // Check for required dependencies
        checkDependencies() {
            const required = [
                'GameConfig',
                'GameComponents', 
                'GameState',
                'DropManager',
                'ScreenManager',
                'AchievementManager',
                'Game'
            ];

            for (const dep of required) {
                if (!window[dep]) {
                    console.error(`Missing dependency: ${dep}`);
                    return false;
                }
            }

            return true;
        },

        // Show loading screen
        showLoadingScreen() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.remove('hidden');
            }
        },

        // Hide loading screen
        hideLoadingScreen() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        },

        // Show error message
        showError(message) {
            this.hideLoadingScreen();
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'position-fixed top-50 start-50 translate-middle bg-danger text-white p-4 rounded shadow text-center';
            errorDiv.style.zIndex = '10000';
            errorDiv.innerHTML = `
                <h5>❌ Game Load Error</h5>
                <p class="mb-3">${message}</p>
                <button class="btn btn-light" onclick="location.reload()">
                    Reload Page
                </button>
            `;
            
            document.body.appendChild(errorDiv);
        },

        // Handle app visibility changes (for pause/resume)
        handleVisibilityChange() {
            if (document.hidden) {
                // Page is hidden, pause game if playing
                if (window.Game && window.GameState && window.GameState.isGameActive()) {
                    window.Game.pauseGame();
                }
            }
            // Note: We don't auto-resume when page becomes visible
            // to avoid disrupting player
        },

        // Handle window focus/blur
        handleFocusChange() {
            window.addEventListener('blur', () => {
                if (window.Game && window.GameState && window.GameState.isGameActive()) {
                    window.Game.pauseGame();
                }
            });
        },

        // Setup global error handling
        setupErrorHandling() {
            window.addEventListener('error', (event) => {
                console.error('Global error:', event.error);
                
                // Don't break the game for minor errors
                if (event.error && event.error.message) {
                    console.warn('Handled global error:', event.error.message);
                }
            });

            window.addEventListener('unhandledrejection', (event) => {
                console.error('Unhandled promise rejection:', event.reason);
                event.preventDefault();
            });
        },

        // Setup performance monitoring
        setupPerformanceMonitoring() {
            // Monitor performance if needed
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        if (perfData) {
                            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                        }
                    }, 1000);
                });
            }
        },

        // Setup accessibility features
        setupAccessibility() {
            // Respect reduced motion preference
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.style.setProperty('--transition-fast', '0.01ms');
                document.documentElement.style.setProperty('--transition-normal', '0.01ms');
                document.documentElement.style.setProperty('--transition-slow', '0.01ms');
                console.log('Reduced motion mode activated');
            }

            // Setup keyboard navigation
            document.addEventListener('keydown', (event) => {
                // Allow escape to close modals/overlays
                if (event.key === 'Escape') {
                    const popup = document.querySelector('.popup.show');
                    if (popup && window.AchievementManager) {
                        window.AchievementManager.hideAchievement();
                    }
                }
            });
        }
    };

    // Setup all app features
    App.setupErrorHandling();
    App.setupPerformanceMonitoring();
    App.setupAccessibility();

    // Setup visibility and focus handling
    document.addEventListener('visibilitychange', () => App.handleVisibilityChange());
    App.handleFocusChange();

    // Start the app
    App.init();

    // Expose App globally for debugging
    window.App = App;

    // Add some helpful debug commands
    window.debugGame = () => {
        if (window.Game) {
            window.Game.debug();
        }
    };

    console.log('🎮 Clean Drop Challenge - charity: water Edition');
    console.log('Created for raising awareness about clean water access worldwide');
    console.log('Visit https://charitywater.org to learn more about their mission');

})();
