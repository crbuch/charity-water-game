// Drop Management System
window.DropManager = {
    gameArea: null,

    // Initialize drop manager
    init() {
        this.gameArea = document.querySelector(GameSelectors.GAME_AREA);
        if (!this.gameArea) {
            console.error('Game area not found');
            return false;
        }
        return true;
    },

    // Spawn a new water drop
    spawnDrop() {
        if (!this.gameArea) return null;

        const drop = this.createDropElement();
        this.positionDrop(drop);
        this.setupDropAnimation(drop);
        this.addDropEvents(drop);
        
        this.gameArea.appendChild(drop);
        GameState.addActiveDrop(drop);
        GameState.spawnDrop();

        // Auto-remove drop when animation ends
        setTimeout(() => {
            if (drop.parentNode && !drop.classList.contains(GameClasses.DROP_CLICKED)) {
                this.handleDropMissed(drop);
            }
        }, GameConfig.DROP_FALL_SPEED);

        return drop;
    },

    // Create drop DOM element
    createDropElement() {
        const drop = document.createElement('div');
        drop.className = GameClasses.WATER_DROP;
        
        // Determine if drop is clean or polluted
        const isClean = Math.random() < GameConfig.CLEAN_DROP_RATIO;
        drop.classList.add(isClean ? GameClasses.CLEAN_DROP : GameClasses.POLLUTED_DROP);
        drop.setAttribute('data-type', isClean ? 'clean' : 'polluted');
        
        return drop;
    },

    // Position drop randomly horizontally
    positionDrop(drop) {
        const gameAreaWidth = this.gameArea.offsetWidth;
        const dropWidth = GameConfig.DROP_WIDTH;
        const maxLeft = gameAreaWidth - dropWidth;
        const left = Math.random() * maxLeft;
        
        drop.style.left = left + 'px';
        drop.style.top = '-50px'; // Start above visible area
    },

    // Setup drop falling animation
    setupDropAnimation(drop) {
        drop.style.animationDuration = GameConfig.DROP_FALL_SPEED + 'ms';
    },

    // Add click and touch events to drop
    addDropEvents(drop) {
        const handleClick = (e) => this.handleDropClick(e, drop);
        
        drop.addEventListener('click', handleClick);
        drop.addEventListener('touchstart', handleClick);
        
        // Hover effect for desktop
        drop.addEventListener('mouseenter', () => {
            if (!drop.classList.contains(GameClasses.DROP_CLICKED)) {
                drop.style.transform = 'scale(1.1)';
            }
        });
        
        drop.addEventListener('mouseleave', () => {
            if (!drop.classList.contains(GameClasses.DROP_CLICKED)) {
                drop.style.transform = 'scale(1)';
            }
        });
    },

    // Handle drop click/tap
    handleDropClick(event, drop) {
        event.stopPropagation();
        event.preventDefault();
        
        if (drop.classList.contains(GameClasses.DROP_CLICKED)) return;
        
        const dropType = drop.getAttribute('data-type');
        drop.classList.add(GameClasses.DROP_CLICKED);
        
        if (dropType === 'clean') {
            this.handleCleanDropCollected(drop);
        } else {
            this.handlePollutedDropHit(drop);
        }
        
        this.removeDrop(drop, GameConfig.COLLECT_ANIMATION_DURATION);
    },

    // Handle clean drop collection
    handleCleanDropCollected(drop) {
        const points = GameConfig.POINTS_PER_CLEAN_DROP;
        GameState.addScore(points);
        GameState.collectDrop();
        
        this.showScoreEffect(drop, points);
        this.animateDropCollection(drop);
        
        // Update HUD
        if (window.Game) {
            window.Game.updateHUD();
            window.Game.checkAchievements();
        }
    },

    // Handle polluted drop hit
    handlePollutedDropHit(drop) {
        GameState.loseLife();
        
        this.showPollutionEffect(drop);
        this.animateDropSplash(drop);
        
        // Update HUD and check game over
        if (window.Game) {
            window.Game.updateHUD();
            if (GameState.current.lives <= 0) {
                setTimeout(() => window.Game.endGame(), 500);
            }
        }
    },

    // Handle drop that fell off screen
    handleDropMissed(drop) {
        drop.classList.add(GameClasses.DROP_MISSED);
        this.removeDrop(drop, GameConfig.SPLASH_ANIMATION_DURATION);
    },

    // Remove drop from game area
    removeDrop(drop, delay = 0) {
        setTimeout(() => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
                GameState.removeActiveDrop(drop);
            }
        }, delay);
    },

    // Show score effect animation
    showScoreEffect(drop, points) {
        const effect = document.createElement('div');
        effect.className = 'score-effect position-absolute';
        effect.textContent = '+' + points;
        
        const rect = drop.getBoundingClientRect();
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        effect.style.left = (rect.left - gameAreaRect.left + 15) + 'px';
        effect.style.top = (rect.top - gameAreaRect.top) + 'px';
        effect.style.color = 'var(--success-green)';
        effect.style.fontWeight = 'bold';
        effect.style.fontSize = '1.2rem';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '100';
        
        this.gameArea.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    },

    // Show pollution effect
    showPollutionEffect(drop) {
        drop.style.background = 'radial-gradient(circle, #ff5722, #d32f2f)';
        
        // Screen shake effect
        if (this.gameArea) {
            this.gameArea.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                this.gameArea.style.animation = '';
            }, 500);
        }
    },

    // Animate drop collection
    animateDropCollection(drop) {
        drop.style.animation = 'collect 0.3s ease-out forwards';
    },

    // Animate drop splash
    animateDropSplash(drop) {
        drop.style.animation = 'splash 0.5s ease-out forwards';
    },

    // Create ripple effect for missed clicks
    createRippleEffect(x, y) {
        if (!this.gameArea) return;
        
        const ripple = document.createElement('div');
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        ripple.className = 'position-absolute';
        ripple.style.left = (x - gameAreaRect.left - 10) + 'px';
        ripple.style.top = (y - gameAreaRect.top - 10) + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(79, 195, 247, 0.6)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out forwards';
        ripple.style.zIndex = '5';
        
        this.gameArea.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    },

    // Clear all drops from game area
    clearAllDrops() {
        GameState.clearActiveDrops();
    },

    // Pause all drop animations
    pauseAllDrops() {
        GameState.pauseActiveDrops();
    },

    // Resume all drop animations
    resumeAllDrops() {
        GameState.resumeActiveDrops();
    },

    // Get current number of active drops
    getActiveDropCount() {
        return GameState.timers.activeDrops.size;
    }
};
