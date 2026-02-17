import { Utils } from './utils.js';

export class UIManager {
    constructor(userManager, audioManager, gameManager, gameStory) {
        this.app = document.getElementById('app');
        this.userManager = userManager;
        this.audioManager = audioManager;
        this.gameManager = gameManager;
        this.gameStory = gameStory;
        this.screens = {};
        this.currentScreen = null;
        
        this.initialize();
    }

    initialize() {
        this.createScreens();
        this.showScreen('login');
        this.setupAudioControls();
    }

    setupAudioControls() {
        document.getElementById('bgm-toggle').addEventListener('click', () => {
            const enabled = this.audioManager.toggleBGM();
            this.updateAudioButton('bgm-toggle', enabled ? '🎵' : '🔇', enabled ? 'Music On' : 'Music Off');
            this.audioManager.saveSettings();
        });

        document.getElementById('sfx-toggle').addEventListener('click', () => {
            const enabled = this.audioManager.toggleSFX();
            this.updateAudioButton('sfx-toggle', enabled ? '🔊' : '🔇', enabled ? 'Sounds On' : 'Sounds Off');
            this.audioManager.saveSettings();
        });

        document.getElementById('tts-toggle').addEventListener('click', () => {
            const enabled = this.audioManager.toggleTTS();
            this.updateAudioButton('tts-toggle', enabled ? '🗣️' : '🔇', enabled ? 'Voice On' : 'Voice Off');
            this.audioManager.saveSettings();
        });
    }

    updateAudioButton(buttonId, emoji, title) {
        const button = document.getElementById(buttonId);
        button.textContent = emoji;
        button.title = title;
    }

    createScreens() {
        this.createLoginScreen();
        this.createRegisterScreen();
        this.createMainMenuScreen();
        this.createCategoryScreen();
        this.createGameScreen();
        this.createSettingsScreen();
    }

    createLoginScreen() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        screen.id = 'login-screen';
        screen.innerHTML = `
            <h1 class="title">POPMATH</h1>
            <p class="subtitle">SURVIVE THE URBAN JUNGLE</p>
            
            <div class="story-container" style="max-width: 600px; text-align: center; margin: 30px 0;">
                <div class="story-dialog">
                    <div style="color: #9d4dff; font-weight: bold; margin-bottom: 10px;">${this.gameStory.characters.titoBen.name}</div>
                    <div>"Welcome to the alley, kid. What's your name? The street only remembers those who can count."</div>
                </div>
                
                <div style="margin-top: 40px;">
                    <div class="input-group">
                        <label class="input-label">ENTER YOUR NAME</label>
                        <input type="text" id="login-username" class="input-field" placeholder="Choose your alley name...">
                    </div>
                    
                    <div style="margin: 40px 0;">
                        <button id="login-btn" class="btn btn-success">ENTER ALLEY</button>
                        <button id="register-btn" class="btn">NEW SURVIVOR</button>
                    </div>
                    
                    <div style="color: #666; font-size: 0.9em;">
                        <p>Your name is your reputation. Choose wisely.</p>
                    </div>
                </div>
            </div>
        `;
        this.app.appendChild(screen);
        this.screens.login = screen;
    }

    createRegisterScreen() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        screen.id = 'register-screen';
        screen.innerHTML = `
            <h1 class="title">CHOOSE YOUR NAME</h1>
            <p class="subtitle">The alley respects unique identities</p>
            
            <div style="max-width: 500px; margin: 30px 0;">
                <div class="story-dialog">
                    <div style="color: #ff4a9d; font-weight: bold; margin-bottom: 10px;">${this.gameStory.characters.maria.name}</div>
                    <div>"Make it a name you can be proud of, anak. One that will echo in the alley."</div>
                </div>
                
                <div class="input-group" style="margin-top: 40px;">
                    <label class="input-label">YOUR ALLEY NAME</label>
                    <input type="text" id="register-username" class="input-field" placeholder="3-20 characters">
                    <div id="username-feedback" style="font-size: 0.8em; margin-top: 5px;"></div>
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                    <button id="create-account-btn" class="btn btn-success">CLAIM NAME</button>
                    <button id="back-to-login-btn" class="btn">BACK</button>
                </div>
            </div>
        `;
        this.app.appendChild(screen);
        this.screens.register = screen;
    }

    createMainMenuScreen() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        screen.id = 'main-menu-screen';
        screen.innerHTML = `
            <h1 class="title">POPMATH</h1>
            <p class="subtitle" id="welcome-message">The alley awaits...</p>
            
            <div style="display: flex; flex-direction: column; gap: 15px; max-width: 400px; width: 100%; margin: 30px 0;">
                <button id="play-btn" class="btn btn-success">START SURVIVAL</button>
                <button id="continue-btn" class="btn" style="display: none;">CONTINUE BATTLE</button>
                <button id="profile-btn" class="btn">MY STATS</button>
                <button id="settings-btn" class="btn">SETTINGS</button>
                <button id="logout-btn" class="btn btn-danger">LEAVE ALLEY</button>
            </div>
            
            <div class="stats-preview" style="margin-top: 40px; text-align: center;">
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <div class="stat">
                        <div class="stat-label">LEVEL</div>
                        <div class="stat-value" id="menu-level">1</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">MONEY</div>
                        <div class="stat-value" id="menu-money">₱0</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">STREAK</div>
                        <div class="stat-value" id="menu-streak">0</div>
                    </div>
                </div>
            </div>
        `;
        this.app.appendChild(screen);
        this.screens.mainMenu = screen;
    }

    createCategoryScreen() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        screen.id = 'category-screen';
        screen.innerHTML = `
            <h1 class="title">CHOOSE YOUR BATTLE</h1>
            <p class="subtitle">Master different math skills to survive</p>
            
            <div class="category-selector" id="category-container">
                <!-- Categories loaded dynamically -->
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
                <button id="back-to-menu-btn" class="btn">BACK</button>
            </div>
        `;
        this.app.appendChild(screen);
        this.screens.category = screen;
    }

    createGameScreen() {
        const screen = document.createElement('div');
        screen.className = 'game-container';
        screen.id = 'game-screen';
        screen.innerHTML = `
            <!-- Game Header -->
            <div class="game-header">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 1.5em; color: #4a9fff;">🧮</div>
                    <div>
                        <div style="font-weight: bold;" id="game-username"></div>
                        <div>Question <span id="question-number">1</span></div>
                    </div>
                </div>
                
                <div class="streak-container">
                    <div class="streak-value" id="game-streak">0</div>
                    <div class="streak-label" id="streak-message">STREAK</div>
                </div>
                
                <div class="game-stats" style="display: flex; gap: 20px;">
                    <div class="stat">
                        <div class="stat-label">SCORE</div>
                        <div class="stat-value" id="game-score">0</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">LIVES</div>
                        <div class="stat-value" id="game-lives">3</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">TIME</div>
                        <div class="stat-value" id="game-time">45</div>
                    </div>
                </div>
            </div>
            
            <!-- Category Info -->
            <div style="text-align: center; margin-bottom: 20px;">
                <span id="game-category" style="background: #4a9fff; padding: 8px 20px; border-radius: 20px; font-weight: bold;"></span>
                <span id="game-difficulty" style="background: #ff4a9d; padding: 8px 20px; border-radius: 20px; font-weight: bold; margin-left: 10px;">Normal</span>
            </div>
            
            <!-- Question Area -->
            <div class="question-container">
                <div class="question-text" id="question-text">
                    Loading question...
                </div>
            </div>
            
            <!-- Answer Options -->
            <div class="answer-options" id="answer-options">
                <!-- Options loaded dynamically -->
            </div>
            
            <!-- Controls -->
            <div class="game-controls">
                <button id="hint-btn" class="btn btn-warning">HINT (-100)</button>
                <button id="skip-btn" class="btn">SKIP</button>
                <button id="quit-btn" class="btn btn-danger">QUIT</button>
            </div>
            
            <!-- Feedback Area -->
            <div class="feedback-area" id="feedback-area"></div>
        `;
        this.app.appendChild(screen);
        this.screens.game = screen;
    }

    createSettingsScreen() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        screen.id = 'settings-screen';
        screen.innerHTML = `
            <h1 class="title">SETTINGS</h1>
            
            <div style="max-width: 500px; margin: 30px 0;">
                <div class="input-group">
                    <label class="input-label">Difficulty</label>
                    <select id="difficulty-select" class="input-field">
                        <option value="easy">Easy</option>
                        <option value="normal" selected>Normal</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Audio Settings</label>
                    <div style="display: flex; gap: 20px; margin-top: 10px;">
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="bgm-checkbox" checked>
                            Music
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="sfx-checkbox" checked>
                            Sounds
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="tts-checkbox">
                            Voice
                        </label>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <button id="save-settings-btn" class="btn btn-success">SAVE</button>
                    <button id="back-from-settings-btn" class="btn">BACK</button>
                </div>
            </div>
        `;
        this.app.appendChild(screen);
        this.screens.settings = screen;
    }

    showScreen(screenName) {
        // Hide current screen
        if (this.currentScreen) {
            this.currentScreen.classList.remove('active');
            if (this.currentScreen.id === 'game-screen') {
                clearInterval(this.gameTimer);
            }
        }

        // Show new screen
        const screen = this.screens[screenName];
        if (!screen) return;

        screen.classList.add('active');
        this.currentScreen = screen;

        // Update screen content
        switch(screenName) {
            case 'mainMenu':
                this.updateMainMenu();
                break;
            case 'category':
                this.updateCategoryScreen();
                break;
            case 'game':
                this.updateGameScreen();
                break;
            case 'settings':
                this.updateSettingsScreen();
                break;
        }

        // Add event listeners
        this.addScreenEventListeners(screenName);
    }

    addScreenEventListeners(screenName) {
        switch(screenName) {
            case 'login':
                document.getElementById('login-btn').onclick = () => this.handleLogin();
                document.getElementById('register-btn').onclick = () => this.showScreen('register');
                document.getElementById('login-username').onkeypress = (e) => {
                    if (e.key === 'Enter') this.handleLogin();
                };
                break;
                
            case 'register':
                document.getElementById('create-account-btn').onclick = () => this.handleRegister();
                document.getElementById('back-to-login-btn').onclick = () => this.showScreen('login');
                document.getElementById('register-username').oninput = (e) => {
                    this.validateUsername(e.target.value);
                };
                document.getElementById('register-username').onkeypress = (e) => {
                    if (e.key === 'Enter') this.handleRegister();
                };
                break;
                
            case 'mainMenu':
                document.getElementById('play-btn').onclick = () => this.showScreen('category');
                document.getElementById('continue-btn').onclick = () => this.handleContinue();
                document.getElementById('profile-btn').onclick = () => this.showProfile();
                document.getElementById('settings-btn').onclick = () => this.showScreen('settings');
                document.getElementById('logout-btn').onclick = () => this.handleLogout();
                break;
                
            case 'category':
                document.getElementById('back-to-menu-btn').onclick = () => this.showScreen('mainMenu');
                break;
                
            case 'game':
                document.getElementById('hint-btn').onclick = () => this.handleHint();
                document.getElementById('skip-btn').onclick = () => this.handleSkip();
                document.getElementById('quit-btn').onclick = () => this.handleQuit();
                break;
                
            case 'settings':
                document.getElementById('save-settings-btn').onclick = () => this.handleSaveSettings();
                document.getElementById('back-from-settings-btn').onclick = () => this.showScreen('mainMenu');
                break;
        }
    }

    // ========== SCREEN UPDATES ==========
    updateMainMenu() {
        const user = this.userManager.getCurrentUser();
        if (!user) return;

        const screen = this.screens.mainMenu;
        screen.querySelector('#welcome-message').textContent = `Welcome, ${user.username}`;
        screen.querySelector('#menu-level').textContent = user.level;
        screen.querySelector('#menu-money').textContent = `₱${Math.floor(user.money)}`;
        screen.querySelector('#menu-streak').textContent = user.streak;

        // Show/hide continue button
        const hasActiveGame = this.gameManager.gameActive && this.gameManager.score > 0;
        screen.querySelector('#continue-btn').style.display = hasActiveGame ? 'block' : 'none';
    }

    updateCategoryScreen() {
        const container = document.getElementById('category-container');
        container.innerHTML = '';

        this.gameManager.categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <div class="category-title">${category.name}</div>
                <div style="color: #a0a0ff; margin-top: 10px;">${category.description}</div>
                <div style="margin-top: 15px; color: #4a9fff; font-weight: bold;">Click to start</div>
            `;
            
            card.onclick = () => this.handleCategorySelect(category.id);
            container.appendChild(card);
        });
    }

    updateGameScreen() {
        if (!this.gameManager.gameActive) {
            this.showScreen('mainMenu');
            return;
        }

        const user = this.userManager.getCurrentUser();
        const screen = this.screens.game;
        const question = this.gameManager.getCurrentQuestion();

        // Update user info
        if (user) {
            screen.querySelector('#game-username').textContent = user.username;
        }

        // Update game stats
        const stats = this.gameManager.getGameStats();
        screen.querySelector('#game-score').textContent = stats.score;
        screen.querySelector('#game-lives').textContent = stats.lives;
        screen.querySelector('#game-time').textContent = Math.floor(stats.timeRemaining);
        screen.querySelector('#question-number').textContent = stats.questionsAnswered + 1;
        
        // Update streak
        screen.querySelector('#game-streak').textContent = stats.streak;
        const streakMessage = this.gameStory.getStreakMessage(stats.streak);
        screen.querySelector('#streak-message').textContent = streakMessage.message;
        screen.querySelector('#streak-message').style.color = streakMessage.color;

        // Update category info
        const category = this.gameManager.categories.find(c => c.id === stats.category);
        screen.querySelector('#game-category').textContent = category?.name || 'Unknown';
        screen.querySelector('#game-difficulty').textContent = stats.difficulty.charAt(0).toUpperCase() + stats.difficulty.slice(1);

        // Update question
        if (question) {
            screen.querySelector('#question-text').textContent = question.question;
            this.updateAnswerOptions(question.options);
            
            // Speak question if TTS enabled
            if (user?.settings?.tts) {
                this.audioManager.speakText(question.question);
            }
        }

        // Start game timer
        this.startGameTimer();
    }

    updateAnswerOptions(options) {
        const container = document.getElementById('answer-options');
        container.innerHTML = '';

        // Shuffle options
        const shuffledOptions = Utils.shuffleArray([...options]);

        shuffledOptions.forEach(option => {
            const button = document.createElement('div');
            button.className = 'answer-option';
            button.textContent = option;
            button.onclick = () => this.handleAnswerSelect(button, option);
            container.appendChild(button);
        });

        // Add keyboard support
        document.onkeydown = (e) => this.handleKeyPress(e);
    }

    startGameTimer() {
        clearInterval(this.gameTimer);
        
        this.gameTimer = setInterval(() => {
            if (!this.gameManager.gameActive) {
                clearInterval(this.gameTimer);
                return;
            }
            
            this.gameManager.timeRemaining--;
            const timeDisplay = document.getElementById('game-time');
            if (timeDisplay) {
                timeDisplay.textContent = Math.max(0, this.gameManager.timeRemaining);
                
                // Color coding for time
                if (this.gameManager.timeRemaining < 10) {
                    timeDisplay.style.color = '#ff4a4a';
                } else if (this.gameManager.timeRemaining < 20) {
                    timeDisplay.style.color = '#ffd44a';
                } else {
                    timeDisplay.style.color = '#4a9fff';
                }
            }
            
            if (this.gameManager.timeRemaining <= 0) {
                clearInterval(this.gameTimer);
                this.handleTimeUp();
            }
        }, 1000);
    }

    updateSettingsScreen() {
        const user = this.userManager.getCurrentUser();
        if (!user) return;

        const screen = this.screens.settings;
        screen.querySelector('#difficulty-select').value = user.settings.difficulty || 'normal';
        screen.querySelector('#bgm-checkbox').checked = user.settings.bgm !== false;
        screen.querySelector('#sfx-checkbox').checked = user.settings.sfx !== false;
        screen.querySelector('#tts-checkbox').checked = user.settings.tts || false;
    }

    // ========== EVENT HANDLERS ==========
    handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        
        if (!username) {
            Utils.showNotification('Please enter a username', 'error');
            return;
        }
        
        try {
            this.userManager.login(username);
            Utils.showNotification(`Welcome back, ${username}!`, 'success');
            this.audioManager.playSFX('correct');
            this.audioManager.loadSettings();
            this.showScreen('mainMenu');
        } catch (error) {
            Utils.showNotification(error.message, 'error');
            this.audioManager.playSFX('incorrect');
        }
    }

    handleRegister() {
        const username = document.getElementById('register-username').value.trim();
        
        if (username.length < 3) {
            Utils.showNotification('Username must be at least 3 characters', 'error');
            return;
        }
        
        try {
            this.userManager.createUser(username);
            Utils.showNotification(`Welcome to the alley, ${username}!`, 'success');
            this.audioManager.playSFX('correct');
            this.showScreen('mainMenu');
        } catch (error) {
            Utils.showNotification(error.message, 'error');
            this.audioManager.playSFX('incorrect');
        }
    }

    validateUsername(username) {
        const feedback = document.getElementById('username-feedback');
        
        if (username.length < 3) {
            feedback.textContent = 'Too short (min 3)';
            feedback.style.color = '#ff4a4a';
        } else if (this.userManager.db.getUser(username)) {
            feedback.textContent = 'Name already taken';
            feedback.style.color = '#ff4a4a';
        } else {
            feedback.textContent = '✓ Available';
            feedback.style.color = '#4aff4a';
        }
    }

    handleCategorySelect(categoryId) {
        const user = this.userManager.getCurrentUser();
        const difficulty = user?.settings?.difficulty || 'normal';
        
        this.gameManager.startGame(categoryId, difficulty);
        this.audioManager.playSFX('click');
        this.showScreen('game');
    }

    handleContinue() {
        if (this.gameManager.gameActive && this.gameManager.score > 0) {
            this.showScreen('game');
        } else {
            Utils.showNotification('No active game found', 'warning');
        }
    }

    handleLogout() {
        this.userManager.logout();
        this.showScreen('login');
        Utils.showNotification('Logged out successfully', 'info');
    }

    handleAnswerSelect(button, answer) {
        if (!this.gameManager.gameActive) return;

        button.classList.add('selected');
        this.audioManager.playSFX('click');

        setTimeout(() => {
            const result = this.gameManager.submitAnswer(answer);
            this.showAnswerFeedback(result);

            if (result.correct) {
                this.audioManager.playSFX('correct');
                
                // Show streak message
                if (result.streakMessage) {
                    Utils.showNotification(result.streakMessage.message, 'info', 2000);
                }
                
                setTimeout(() => {
                    if (!result.gameOver) {
                        this.updateGameScreen();
                    } else {
                        this.showScreen('mainMenu');
                        Utils.showNotification('Game Completed!', 'success');
                    }
                }, 2000);
            } else {
                this.audioManager.playMeme();
                this.audioManager.playSFX('incorrect');
                this.showMeme();
                
                if (result.gameOver) {
                    this.audioManager.playSFX('gameOver');
                    setTimeout(() => {
                        this.showScreen('mainMenu');
                        Utils.showNotification('Game Over!', 'error');
                    }, 3000);
                } else {
                    setTimeout(() => {
                        this.updateGameScreen();
                    }, 3000);
                }
            }
        }, 500);
    }

    showAnswerFeedback(result) {
        const feedbackArea = document.getElementById('feedback-area');
        
        if (result.correct) {
            feedbackArea.innerHTML = `
                <div class="feedback-correct">
                    <div style="font-size: 2em;">✓</div>
                    <div style="font-size: 1.2em; font-weight: bold;">${result.message}</div>
                    <div>+${result.scoreEarned} points</div>
                    <div style="margin-top: 10px; font-size: 0.9em; color: #a0ffa0;">Streak: ${result.streak}</div>
                </div>
            `;
        } else {
            feedbackArea.innerHTML = `
                <div class="feedback-incorrect">
                    <div style="font-size: 2em;">✗</div>
                    <div style="font-size: 1.2em; font-weight: bold;">${result.message}</div>
                    <div style="margin-top: 10px; color: #ffffa0;">💡 ${result.hint}</div>
                    ${result.livesRemaining !== undefined ? 
                        `<div style="margin-top: 10px;">Lives remaining: ${result.livesRemaining}</div>` : ''}
                </div>
            `;
        }
        
        setTimeout(() => {
            feedbackArea.innerHTML = '';
        }, 3000);
    }

    showMeme() {
        const memeData = this.gameStory.getRandomMeme();
        const memeContainer = document.getElementById('meme-container');
        
        // Create meme display
        const memeDisplay = document.createElement('div');
        memeDisplay.className = 'meme-display';
        
        // Check if we have an image file for this meme
        const imagePath = `assets/memes/${memeData.image}`;
        
        // Try to load image, fallback to emoji
        const img = new Image();
        img.onload = () => {
            memeDisplay.innerHTML = `
                <img src="${imagePath}" style="max-width: 100%; max-height: 200px; object-fit: contain;">
                <div class="meme-text">${memeData.text}</div>
            `;
        };
        img.onerror = () => {
            memeDisplay.innerHTML = `
                <div style="font-size: 4em; margin-bottom: 20px;">${memeData.emoji}</div>
                <div class="meme-text">${memeData.text}</div>
            `;
        };
        img.src = imagePath;
        
        memeContainer.innerHTML = '';
        memeContainer.appendChild(memeDisplay);
        memeContainer.style.display = 'block';
        
        setTimeout(() => {
            memeContainer.style.display = 'none';
        }, 3000);
    }

    handleTimeUp() {
        const result = this.gameManager.submitAnswer('');
        this.showAnswerFeedback(result);
        this.audioManager.playMeme();
        
        setTimeout(() => {
            if (result.gameOver) {
                this.showScreen('mainMenu');
                Utils.showNotification('Time\'s up! Game Over', 'error');
            } else {
                this.updateGameScreen();
            }
        }, 3000);
    }

    handleKeyPress(event) {
        if (!this.gameManager.gameActive) return;
        
        const key = event.key;
        
        // Number keys 1-4 for answer selection
        if (key >= '1' && key <= '4') {
            const buttons = document.querySelectorAll('.answer-option');
            const index = parseInt(key) - 1;
            if (buttons[index]) {
                buttons[index].click();
            }
        }
        // Space for hint
        else if (key === ' ') {
            this.handleHint();
        }
        // Escape for quit
        else if (key === 'Escape') {
            this.handleQuit();
        }
    }

    handleHint() {
        const result = this.gameManager.useHint();
        if (result.success) {
            Utils.showNotification(`💡 Hint: ${result.hint}`, 'info');
            this.updateGameScreen();
            this.audioManager.playSFX('click');
        } else {
            Utils.showNotification(result.message, 'warning');
        }
    }

    handleSkip() {
        const result = this.gameManager.skipQuestion();
        if (result.success) {
            Utils.showNotification(result.message, 'warning');
            this.updateGameScreen();
        } else {
            Utils.showNotification(result.message, 'error');
        }
    }

    handleQuit() {
        const confirmed = confirm('Quit this battle? Your progress will be saved.');
        if (confirmed) {
            this.showScreen('mainMenu');
            Utils.showNotification('Battle saved', 'info');
        }
    }

    showProfile() {
        const user = this.userManager.getCurrentUser();
        if (!user) return;

        const stats = this.userManager.getStats();
        const message = `
            🎯 Level: ${stats.level}
            💰 Money: ₱${Math.floor(stats.money)}
            📊 Accuracy: ${stats.accuracy}%
            🔥 Max Streak: ${stats.maxStreak}
            ❓ Questions: ${stats.totalQuestions}
            ✓ Correct: ${stats.totalCorrect}
        `;
        
        alert(`PROFILE - ${user.username}\n\n${message}`);
    }

    handleSaveSettings() {
        const user = this.userManager.getCurrentUser();
        if (!user) return;

        const screen = this.screens.settings;
        const settings = {
            difficulty: screen.querySelector('#difficulty-select').value,
            bgm: screen.querySelector('#bgm-checkbox').checked,
            sfx: screen.querySelector('#sfx-checkbox').checked,
            tts: screen.querySelector('#tts-checkbox').checked
        };

        this.userManager.updateSettings(settings);
        
        // Update audio manager
        this.audioManager.bgmEnabled = settings.bgm;
        this.audioManager.sfxEnabled = settings.sfx;
        this.audioManager.ttsEnabled = settings.tts;
        this.audioManager.saveSettings();
        
        // Update audio controls
        this.updateAudioButton('bgm-toggle', settings.bgm ? '🎵' : '🔇', settings.bgm ? 'Music On' : 'Music Off');
        this.updateAudioButton('sfx-toggle', settings.sfx ? '🔊' : '🔇', settings.sfx ? 'Sounds On' : 'Sounds Off');
        this.updateAudioButton('tts-toggle', settings.tts ? '🗣️' : '🔇', settings.tts ? 'Voice On' : 'Voice Off');
        
        Utils.showNotification('Settings saved', 'success');
        this.showScreen('mainMenu');
    }
}
