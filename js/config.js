// Game Configuration and Constants
window.GameConfig = {
    // Difficulty Modes
    DIFFICULTY_MODES: {
        EASY: {
            name: "Easy",
            description: "More time, slower drops, more lives",
            GAME_DURATION: 45, // seconds
            MAX_LIVES: 5,
            DROP_SPAWN_RATE: 1000, // milliseconds
            CLEAN_DROP_RATIO: 0.8, // 80% clean, 20% polluted
            DROP_FALL_SPEED: 4000, // milliseconds to fall from top to bottom
            POINTS_PER_CLEAN_DROP: 10,
            WIN_CONDITION: 150 // points needed to win
        },
        NORMAL: {
            name: "Normal",
            description: "Balanced gameplay",
            GAME_DURATION: 30, // seconds
            MAX_LIVES: 3,
            DROP_SPAWN_RATE: 750, // milliseconds
            CLEAN_DROP_RATIO: 0.7, // 70% clean, 30% polluted
            DROP_FALL_SPEED: 3000, // milliseconds to fall from top to bottom
            POINTS_PER_CLEAN_DROP: 10,
            WIN_CONDITION: 200 // points needed to win
        },
        HARD: {
            name: "Hard",
            description: "Fast-paced challenge",
            GAME_DURATION: 20, // seconds
            MAX_LIVES: 2,
            DROP_SPAWN_RATE: 500, // milliseconds
            CLEAN_DROP_RATIO: 0.6, // 60% clean, 40% polluted
            DROP_FALL_SPEED: 2000, // milliseconds to fall from top to bottom
            POINTS_PER_CLEAN_DROP: 15,
            WIN_CONDITION: 250 // points needed to win
        }
    },
    
    // Default Settings (will be overridden by selected difficulty)
    GAME_DURATION: 30, // seconds
    MAX_LIVES: 3,
    DROP_SPAWN_RATE: 750, // milliseconds
    CLEAN_DROP_RATIO: 0.7, // 70% clean, 30% polluted
    DROP_FALL_SPEED: 3000, // milliseconds to fall from top to bottom
    POINTS_PER_CLEAN_DROP: 10,
    WIN_CONDITION: 200, // points needed to win
    
    // Achievement Thresholds
    ACHIEVEMENT_THRESHOLDS: [50, 100, 200, 300, 500],
    
    // Visual Settings
    DROP_WIDTH: 30,
    DROP_HEIGHT: 40,
    GAME_AREA_HEIGHT: 400,
    
    // Animation Durations
    COLLECT_ANIMATION_DURATION: 300,
    SPLASH_ANIMATION_DURATION: 500,
    POPUP_AUTO_HIDE_DELAY: 5000,
    
    // URLs
    CHARITY_WATER_URL: 'https://www.charitywater.org/',
    
    // Achievement Data
    ACHIEVEMENTS: [
        {
            threshold: 50,
            title: "Water Warrior!",
            text: "You've collected 50 clean water drops!",
            fact: "💡 The average person in the developing world uses 2-5 gallons of water per day.",
            image: "./images/pictures/clean_water/468x302px.png"
        },
        {
            threshold: 100,
            title: "Clean Water Champion!",
            text: "Amazing! 100 clean drops collected!",
            fact: "💡 Americans use an average of 80-100 gallons of water per day.",
            image: "./images/pictures/clean_water/469x552px.png"
        },
        {
            threshold: 200,
            title: "Hope Bringer!",
            text: "Incredible! 200 drops of hope!",
            fact: "💡 Every $1 invested in water and sanitation provides a $4 economic return.",
            image: "./images/pictures/dirty_source_clean_water/617x604px.png"
        },
        {
            threshold: 300,
            title: "Life Changer!",
            text: "You're changing lives! 300 drops!",
            fact: "💡 charity: water has helped provide clean water to over 16 million people.",
            image: "./images/pictures/dirty_source_clean_water/959x604px.png"
        },
        {
            threshold: 500,
            title: "Water Hero!",
            text: "You're a true water hero! 500 drops!",
            fact: "💡 When people get access to clean water, child mortality rates drop by up to 88%.",
            image: "./images/pictures/portraits/546x660px.png"
        }
    ],
    
    // Screen Performance Messages
    PERFORMANCE_MESSAGES: {
        excellent: {
            title: "Water Hero!",
            message: "Incredible performance! You're making a real difference!",
            impact: "Your dedication to clean water access is inspiring. You've shown that every action counts in the fight for clean water worldwide."
        },
        great: {
            title: "Clean Water Champion!",
            message: "Amazing work! You're a true champion for clean water!",
            impact: "Your commitment to helping others access clean water is remarkable. Keep spreading awareness about this important cause."
        },
        good: {
            title: "Water Warrior!",
            message: "Great job! You're fighting for clean water access!",
            impact: "You've shown real dedication to the cause of clean water. Your efforts help raise awareness about this critical global issue."
        },
        fair: {
            title: "Good Effort!",
            message: "Every drop counts in the fight for clean water!",
            impact: "Thank you for taking action! Even small efforts contribute to the larger movement for clean water access worldwide."
        },
        poor: {
            title: "Keep Trying!",
            message: "Practice makes perfect! Every attempt helps spread awareness.",
            impact: "Don't give up! Each time you play, you're learning more about the importance of clean water access. Try again!"
        }
    }
};

// Element IDs and Selectors
window.GameSelectors = {
    // Screens
    LOADING_SCREEN: '#loading-screen',
    START_SCREEN: '#start-screen',
    GAME_SCREEN: '#game-screen',
    PAUSE_SCREEN: '#pause-screen',
    GAME_OVER_SCREEN: '#game-over-screen',
    MISSION_SCREEN: '#mission-screen',
    
    // Screen Containers
    START_CONTAINER: '#start-screen-container',
    GAME_CONTAINER: '#game-screen-container',
    PAUSE_CONTAINER: '#pause-screen-container',
    GAME_OVER_CONTAINER: '#game-over-screen-container',
    MISSION_CONTAINER: '#mission-screen-container',
    
    // Game Elements
    GAME_AREA: '#game-area',
    HUD: '.hud',
    SCORE: '#score',
    LIVES: '#lives',
    TIME: '#time',
    
    // Buttons
    START_GAME_BTN: '#start-game-btn',
    LEARN_MORE_BTN: '#learn-more-btn',
    PAUSE_BTN: '#pause-btn',
    RESUME_BTN: '#resume-btn',
    QUIT_BTN: '#quit-btn',
    PLAY_AGAIN_BTN: '#play-again-btn',
    VISIT_CHARITY_WATER_BTN: '#visit-charity-water-btn',
    SHARE_SCORE_BTN: '#share-score-btn',
    CLOSE_MISSION_BTN: '#close-mission-btn',
    DONATE_BTN: '#donate-btn',
    ACHIEVEMENT_CLOSE_BTN: '#achievement-close',
    
    // Popups and Overlays
    ACHIEVEMENT_POPUP: '#achievement-popup',
    ACHIEVEMENT_TITLE: '#achievement-title',
    ACHIEVEMENT_TEXT: '#achievement-text',
    ACHIEVEMENT_IMAGE: '#achievement-image',
    ACHIEVEMENT_FACT_TEXT: '#achievement-fact-text',
    
    // Game Over Elements
    GAME_OVER_TITLE: '#game-over-title',
    FINAL_SCORE: '#final-score',
    SCORE_MESSAGE: '#score-message',
    IMPACT_MESSAGE: '#impact-message',
    DROPS_COLLECTED: '#drops-collected',
    ACCURACY_PERCENT: '#accuracy-percent'
};

// Game State Constants
window.GameStates = {
    LOADING: 'loading',
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    MISSION: 'mission'
};

// CSS Classes
window.GameClasses = {
    SCREEN_ACTIVE: 'active',
    POPUP_SHOW: 'show',
    HIDDEN: 'hidden',
    WATER_DROP: 'water-drop',
    CLEAN_DROP: 'clean',
    POLLUTED_DROP: 'polluted',
    DROP_CLICKED: 'clicked',
    DROP_MISSED: 'missed',
    HEART_LOST: 'lost',
    LOADING_HIDDEN: 'hidden'
};
