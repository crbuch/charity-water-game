// HTML Components Generator
window.GameComponents = {
    
    // Generate Start Screen HTML
    generateStartScreen() {
        return `
            <div id="start-screen" class="screen active start-screen">
                <div class="welcome-content">
                    <div class="content-top">
                        <div class="mb-3">
                            <img src="./images/pictures/clean_water/677x464px.png" 
                                 alt="Clean water access" class="feature-image">
                        </div>
                        <h2 class="text-charity-blue mb-3">Help Provide Clean Water Access</h2>
                        <p class="mission-text mb-3">
                            Collect clean water drops while avoiding polluted ones. 
                            Every point you earn represents hope for communities in need.
                        </p>
                        
                        <!-- Difficulty Selection -->
                        <div class="difficulty-selection mb-4">
                            <h5 class="text-charity-blue mb-3">Choose Difficulty:</h5>
                            <div class="row g-1">
                                <div class="col-4">
                                    <button class="difficulty-btn" data-difficulty="EASY">
                                        <strong>Easy</strong><br>
                                        <small>5 lives • 45s</small>
                                    </button>
                                </div>
                                <div class="col-4">
                                    <button class="difficulty-btn active" data-difficulty="NORMAL">
                                        <strong>Normal</strong><br>
                                        <small>3 lives • 30s</small>
                                    </button>
                                </div>
                                <div class="col-4">
                                    <button class="difficulty-btn" data-difficulty="HARD">
                                        <strong>Hard</strong><br>
                                        <small>2 lives • 20s</small>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="game-stats-preview mb-3" id="stats-preview">
                            <div class="stat">
                                <span class="stat-icon">🎯</span>
                                <small id="time-display">30 seconds</small>
                            </div>
                            <div class="stat">
                                <span class="stat-icon">❤️</span>
                                <small id="lives-display">3 lives</small>
                            </div>
                            <div class="stat">
                                <span class="stat-icon">🏆</span>
                                <small id="goal-display">200 to win</small>
                            </div>
                        </div>
                    </div>
                    <div class="content-bottom">
                        <div class="d-grid gap-2">
                            <button id="start-game-btn" class="btn btn-charity-blue btn-lg">
                                <i class="bi bi-play-fill me-2"></i>Start Game
                            </button>
                            <button id="learn-more-btn" class="btn btn-outline-charity-blue">
                                <i class="bi bi-info-circle me-2"></i>Learn About Our Mission
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Generate Game Screen HTML
    generateGameScreen() {
        return `
            <div id="game-screen" class="screen game-screen">
                <!-- HUD -->
                <div class="hud">
                    <div class="hud-item">
                        <span class="hud-label">Score</span>
                        <span id="score" class="hud-value">0</span>
                    </div>
                    <div class="hud-item">
                        <span class="hud-label">Lives</span>
                        <div id="lives" class="lives-container">
                            <span class="heart">❤️</span>
                            <span class="heart">❤️</span>
                            <span class="heart">❤️</span>
                        </div>
                    </div>
                    <div class="hud-item">
                        <span class="hud-label">Time</span>
                        <span id="time" class="hud-value">30</span>
                    </div>
                </div>

                <!-- Game Area -->
                <div id="game-area" class="game-area position-relative"></div>

                <!-- Player Barrel -->
                <div class="player-barrel">
                    <img src="./images/logo_4x5.png" alt="Collection Barrel" class="barrel-icon">
                </div>

                <!-- Pause Button -->
                <button id="pause-btn" class="pause-btn">
                    <i class="bi bi-pause-fill"></i>
                </button>
            </div>
        `;
    },

    // Generate Pause Screen HTML
    generatePauseScreen() {
        return `
            <div id="pause-screen" class="screen pause-screen">
                <div class="pause-content">
                    <h2 class="text-charity-blue mb-3">Game Paused</h2>
                    <p class="mb-4">Take a moment to reflect on the impact of clean water access.</p>
                    <div class="pause-fact bg-light rounded p-3 mb-4">
                        <img src="./images/pictures/dirty_source_clean_water/617x604px.png" 
                             alt="Water transformation" class="fact-image mb-3">
                        <p class="fact-text mb-0">💡 charity: water has funded over 91,000 water projects in 29 countries.</p>
                    </div>
                    <div class="d-grid gap-2">
                        <button id="resume-btn" class="btn btn-charity-blue btn-lg">
                            <i class="bi bi-play-fill me-2"></i>Resume Game
                        </button>
                        <button id="quit-btn" class="btn btn-outline-charity-blue">
                            <i class="bi bi-house-fill me-2"></i>Quit Game
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Generate Game Over Screen HTML
    generateGameOverScreen() {
        const isWin = GameState.current.isWin;
        const title = isWin ? "🏆 Congratulations!" : "Time's Up!";
        const titleClass = isWin ? "text-success" : "text-charity-blue";
        
        return `
            <div id="game-over-screen" class="screen game-over-screen">
                <div class="container-fluid p-3">
                    <div class="game-over-content">
                        <!-- Final Score Section -->
                        <div class="final-score-container text-center mb-4">
                            <h2 id="game-over-title" class="${titleClass} mb-3">${title}</h2>
                            ${isWin ? '<p class="text-success fw-bold mb-3">🎯 You reached the goal! Amazing work!</p>' : ''}
                            <div class="final-score mb-3">
                                <div class="score-label text-muted">Final Score</div>
                                <div id="final-score" class="score-value display-1 text-charity-blue fw-bold">0</div>
                                ${isWin ? '<div class="text-success small">🏆 Goal: ' + GameState.activeDifficulty.WIN_CONDITION + ' points</div>' : ''}
                            </div>
                            <p id="score-message" class="score-message text-muted fst-italic">
                                ${isWin ? 'You\'re making a real difference in the fight for clean water!' : 'Every drop counts in the fight for clean water!'}
                            </p>
                        </div>

                        <!-- Impact Section -->
                        <div class="impact-section bg-light rounded p-3 mb-4">
                            <div class="text-center mb-3">
                                <img src="./images/pictures/portraits/779x1020px.png" 
                                     alt="Community member" class="impact-image">
                            </div>
                            <div class="impact-text text-center">
                                <h5 class="text-charity-blue mb-2">Your Impact</h5>
                                <p id="impact-message" class="mb-3 small">
                                    ${isWin ? 'Incredible performance! Your dedication to clean water access is inspiring.' : 'Thanks to players like you, charity: water continues to bring clean water to communities worldwide.'}
                                </p>
                                <div class="row">
                                    <div class="col-6">
                                        <div class="impact-stat">
                                            <div id="drops-collected" class="impact-number">0</div>
                                            <div class="impact-label">Clean Drops Collected</div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="impact-stat">
                                            <div id="accuracy-percent" class="impact-number">0%</div>
                                            <div class="impact-label">Accuracy</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CTA Section -->
                        <div class="cta-section text-center">
                            <h5 class="text-charity-blue mb-2">Continue Making a Difference</h5>
                            <p class="mb-3 small">Learn more about charity: water's mission and how you can help provide clean water access.</p>
                            <div class="d-grid gap-2">
                                <button id="play-again-btn" class="btn btn-charity-blue">
                                    <i class="bi bi-arrow-clockwise me-2"></i>Play Again
                                </button>
                                <button id="visit-charity-water-btn" class="btn btn-outline-charity-blue">
                                    <i class="bi bi-globe me-2"></i>Visit charity: water
                                </button>
                                <button id="share-score-btn" class="btn btn-charity-yellow">
                                    <i class="bi bi-share me-2"></i>Share Your Score
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Generate Mission Screen HTML
    generateMissionScreen() {
        return `
            <div id="mission-screen" class="screen mission-screen">
                <div class="container-fluid h-100 position-relative">
                    <button id="close-mission-btn" class="close-btn">
                        <i class="bi bi-x-lg"></i>
                    </button>
                    <div class="mission-content">
                        <h2 class="text-charity-blue text-center mb-4">About charity: water</h2>
                        
                        <div class="mission-story">
                            <img src="./images/pictures/dirty_source_clean_water/1114x604px.png" 
                                 alt="Water transformation story" class="mission-hero-image mb-4">
                            
                            <div class="mission-text-content">
                                <h5 class="text-charity-blue">Our Mission</h5>
                                <p class="mb-3">
                                    charity: water is a non-profit organization bringing clean and safe drinking water 
                                    to people in developing countries. We fund water projects in communities around the 
                                    world and prove every single project funded.
                                </p>
                                
                                <h5 class="text-charity-blue">The Water Crisis</h5>
                                <ul class="mb-3">
                                    <li>703 million people lack access to clean water</li>
                                    <li>1 in 10 people worldwide lack access to clean water</li>
                                    <li>Women and children walk hours every day to collect water</li>
                                    <li>Waterborne diseases are a leading cause of death</li>
                                </ul>

                                <h5 class="text-charity-blue">Our Impact</h5>
                                <div class="impact-grid mb-4">
                                    <div class="impact-item mb-3">
                                        <img src="./images/pictures/clean_water/468x302px.png" 
                                             alt="Clean water project" class="impact-thumb me-3">
                                        <div>
                                            <strong class="text-charity-blue d-block">91,000+</strong>
                                            <small>Water projects funded</small>
                                        </div>
                                    </div>
                                    <div class="impact-item">
                                        <img src="./images/pictures/portraits/546x660px.png" 
                                             alt="Community member" class="impact-thumb me-3">
                                        <div>
                                            <strong class="text-charity-blue d-block">16 million</strong>
                                            <small>People served</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="text-center">
                                    <button id="donate-btn" class="btn btn-charity-blue btn-lg">
                                        <i class="bi bi-heart-fill me-2"></i>Learn How to Help
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Initialize all screen components
    initializeScreens() {
        // Get containers
        const startContainer = document.querySelector(GameSelectors.START_CONTAINER);
        const gameContainer = document.querySelector(GameSelectors.GAME_CONTAINER);
        const pauseContainer = document.querySelector(GameSelectors.PAUSE_CONTAINER);
        const gameOverContainer = document.querySelector(GameSelectors.GAME_OVER_CONTAINER);
        const missionContainer = document.querySelector(GameSelectors.MISSION_CONTAINER);

        // Inject HTML
        if (startContainer) startContainer.innerHTML = this.generateStartScreen();
        if (gameContainer) gameContainer.innerHTML = this.generateGameScreen();
        if (pauseContainer) pauseContainer.innerHTML = this.generatePauseScreen();
        if (gameOverContainer) gameOverContainer.innerHTML = this.generateGameOverScreen();
        if (missionContainer) missionContainer.innerHTML = this.generateMissionScreen();
    }
};
