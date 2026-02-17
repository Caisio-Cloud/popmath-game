export class UserManager {
    constructor(db) {
        this.currentUser = null;
        this.db = db;
    }

    createUser(username) {
        if (username.length < 3) throw new Error('Username must be at least 3 characters');
        if (this.db.getUser(username)) throw new Error('Username already exists');

        const userData = {
            username,
            createdAt: new Date().toISOString(),
            level: 1,
            experience: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            totalScore: 0,
            streak: 0,
            maxStreak: 0,
            money: 500,
            settings: {
                bgm: true,
                sfx: true,
                tts: false,
                difficulty: 'normal'
            }
        };

        this.db.saveUser(username, userData);
        this.db.saveSettings(username, userData.settings);
        this.currentUser = userData;
        localStorage.setItem('popmath_current_user', username);
        return userData;
    }

    login(username) {
        const userData = this.db.getUser(username);
        if (!userData) throw new Error('User not found');
        
        const settings = this.db.getSettings(username);
        userData.settings = settings;
        
        this.currentUser = userData;
        localStorage.setItem('popmath_current_user', username);
        return userData;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('popmath_current_user');
    }

    updateUser(updates) {
        if (!this.currentUser) throw new Error('No user logged in');
        this.currentUser = { ...this.currentUser, ...updates };
        this.db.saveUser(this.currentUser.username, this.currentUser);
        return this.currentUser;
    }

    updateSettings(settings) {
        if (!this.currentUser) throw new Error('No user logged in');
        this.currentUser.settings = { ...this.currentUser.settings, ...settings };
        this.db.saveSettings(this.currentUser.username, this.currentUser.settings);
        return this.currentUser.settings;
    }

    recordAnswer(isCorrect, category, scoreEarned = 0) {
        if (!this.currentUser) return;

        this.currentUser.totalQuestions++;
        this.currentUser.totalScore += scoreEarned;
        
        if (isCorrect) {
            this.currentUser.totalCorrect++;
            this.currentUser.streak++;
            this.currentUser.maxStreak = Math.max(this.currentUser.maxStreak, this.currentUser.streak);
            this.currentUser.experience += 10;
            this.currentUser.level = Math.floor(Math.sqrt(this.currentUser.experience / 100)) + 1;
            this.currentUser.money += scoreEarned / 10;
        } else {
            this.currentUser.streak = 0;
            this.currentUser.money = Math.max(0, this.currentUser.money - 25);
        }

        this.db.saveProgress(this.currentUser.username, {
            category,
            correct: isCorrect,
            score: scoreEarned,
            timestamp: new Date().toISOString()
        });

        this.updateUser(this.currentUser);
        return this.currentUser;
    }

    getStats() {
        if (!this.currentUser) return null;
        
        const user = this.currentUser;
        const accuracy = user.totalQuestions > 0 ? 
            Math.round((user.totalCorrect / user.totalQuestions) * 100) : 0;
        
        return {
            username: user.username,
            level: user.level,
            experience: user.experience,
            accuracy,
            streak: user.streak,
            maxStreak: user.maxStreak,
            totalQuestions: user.totalQuestions,
            totalCorrect: user.totalCorrect,
            totalScore: user.totalScore,
            money: user.money
        };
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    loadFromLocalStorage() {
        const username = localStorage.getItem('popmath_current_user');
        if (username) {
            try {
                this.login(username);
                return true;
            } catch {
                localStorage.removeItem('popmath_current_user');
                return false;
            }
        }
        return false;
    }
}
