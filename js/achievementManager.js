// Achievement Management System
window.AchievementManager = {
    popup: null,
    currentAchievement: null,
    wasGamePausedByAchievement: false,

    // Initialize achievement manager
    init() {
        this.popup = document.querySelector(GameSelectors.ACHIEVEMENT_POPUP);
        if (!this.popup) {
            console.error('Achievement popup not found');
            return false;
        }
        return true;
    },

    // Check for achievements based on current score
    checkAchievements() {
        const currentScore = GameState.current.score;
        
        for (const achievement of GameConfig.ACHIEVEMENTS) {
            if (GameState.checkAchievement(achievement.threshold)) {
                GameState.unlockAchievement(achievement.threshold);
                this.showAchievement(achievement);
                break; // Show one achievement at a time
            }
        }
    },

    // Show achievement popup
    showAchievement(achievement) {
        if (!this.popup) return;
        
        // Pause the game when showing achievement
        if (GameState.isGameActive()) {
            Game.pauseGame();
            this.wasGamePausedByAchievement = true;
        }
        
        this.currentAchievement = achievement;
        this.updateAchievementContent(achievement);
        this.popup.classList.add(GameClasses.POPUP_SHOW);
        
        // Add achievement animation
        const popupContent = this.popup.querySelector('.popup-content');
        if (popupContent) {
            popupContent.style.animation = 'achievementSlideIn 0.5s ease-out';
        }
        
        // Auto-hide after delay if user doesn't interact
        setTimeout(() => {
            if (this.popup.classList.contains(GameClasses.POPUP_SHOW)) {
                this.hideAchievement();
            }
        }, GameConfig.POPUP_AUTO_HIDE_DELAY);
        
        // Log achievement for analytics
        this.logAchievement(achievement);
    },

    // Update achievement popup content
    updateAchievementContent(achievement) {
        // Update title
        const titleElement = document.querySelector(GameSelectors.ACHIEVEMENT_TITLE);
        if (titleElement) {
            titleElement.textContent = achievement.title;
        }

        // Update text
        const textElement = document.querySelector(GameSelectors.ACHIEVEMENT_TEXT);
        if (textElement) {
            textElement.textContent = achievement.text;
        }

        // Update fact
        const factElement = document.querySelector(GameSelectors.ACHIEVEMENT_FACT_TEXT);
        if (factElement) {
            factElement.textContent = achievement.fact;
        }

        // Update image
        const imageElement = document.querySelector(GameSelectors.ACHIEVEMENT_IMAGE);
        if (imageElement) {
            imageElement.src = achievement.image;
            imageElement.alt = `Achievement: ${achievement.title}`;
            
            // Handle image load error
            imageElement.onerror = () => {
                imageElement.style.display = 'none';
                console.warn(`Achievement image failed to load: ${achievement.image}`);
            };
        }
    },

    // Hide achievement popup
    hideAchievement() {
        if (!this.popup) return;
        
        const popupContent = this.popup.querySelector('.popup-content');
        if (popupContent) {
            popupContent.style.animation = 'fadeOut 0.3s ease-out';
        }
        
        setTimeout(() => {
            this.popup.classList.remove(GameClasses.POPUP_SHOW);
            this.currentAchievement = null;
            
            // Resume the game if it was paused by this achievement
            if (this.wasGamePausedByAchievement && GameState.canResume()) {
                Game.resumeGame();
                this.wasGamePausedByAchievement = false;
            }
        }, 300);
    },

    // Log achievement for analytics/debugging
    logAchievement(achievement) {
        console.log(`Achievement unlocked: ${achievement.title} (${achievement.threshold} points)`);
        
        // Here you could send analytics data to a service
        // analytics.track('achievement_unlocked', {
        //     achievement_name: achievement.title,
        //     threshold: achievement.threshold,
        //     player_score: GameState.current.score
        // });
    },

    // Get achievement by threshold
    getAchievementByThreshold(threshold) {
        return GameConfig.ACHIEVEMENTS.find(achievement => 
            achievement.threshold === threshold
        );
    },

    // Get next achievement to unlock
    getNextAchievement() {
        const currentScore = GameState.current.score;
        const unlockedThresholds = GameState.current.achievementsUnlocked;
        
        for (const achievement of GameConfig.ACHIEVEMENTS) {
            if (achievement.threshold > currentScore && 
                !unlockedThresholds.includes(achievement.threshold)) {
                return achievement;
            }
        }
        
        return null; // All achievements unlocked
    },

    // Get progress to next achievement (0-1)
    getProgressToNext() {
        const nextAchievement = this.getNextAchievement();
        if (!nextAchievement) return 1; // All achievements unlocked
        
        const currentScore = GameState.current.score;
        const prevThreshold = this.getPreviousThreshold(nextAchievement.threshold);
        
        const progress = (currentScore - prevThreshold) / 
                        (nextAchievement.threshold - prevThreshold);
        
        return Math.max(0, Math.min(1, progress));
    },

    // Get previous achievement threshold
    getPreviousThreshold(currentThreshold) {
        const sortedThresholds = GameConfig.ACHIEVEMENT_THRESHOLDS.sort((a, b) => a - b);
        const currentIndex = sortedThresholds.indexOf(currentThreshold);
        
        return currentIndex > 0 ? sortedThresholds[currentIndex - 1] : 0;
    },

    // Get all unlocked achievements
    getUnlockedAchievements() {
        return GameConfig.ACHIEVEMENTS.filter(achievement =>
            GameState.current.achievementsUnlocked.includes(achievement.threshold)
        );
    },

    // Get achievement statistics
    getAchievementStats() {
        const totalAchievements = GameConfig.ACHIEVEMENTS.length;
        const unlockedCount = GameState.current.achievementsUnlocked.length;
        const progress = totalAchievements > 0 ? unlockedCount / totalAchievements : 0;
        
        return {
            total: totalAchievements,
            unlocked: unlockedCount,
            progress: progress,
            nextAchievement: this.getNextAchievement(),
            progressToNext: this.getProgressToNext()
        };
    },

    // Show achievement summary (could be used in game over screen)
    showAchievementSummary() {
        const stats = this.getAchievementStats();
        const unlockedAchievements = this.getUnlockedAchievements();
        
        console.log('Achievement Summary:', {
            stats,
            unlocked: unlockedAchievements.map(a => a.title)
        });
        
        return {
            stats,
            achievements: unlockedAchievements
        };
    },

    // Reset achievements (for new game)
    reset() {
        this.currentAchievement = null;
        this.wasGamePausedByAchievement = false;
        if (this.popup) {
            this.popup.classList.remove(GameClasses.POPUP_SHOW);
        }
    }
};
