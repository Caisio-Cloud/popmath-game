export class GameDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('popmath_users') || '{}');
        this.progress = JSON.parse(localStorage.getItem('popmath_progress') || '{}');
        this.settings = JSON.parse(localStorage.getItem('popmath_settings') || '{}');
    }

    saveUser(username, userData) {
        this.users[username] = userData;
        localStorage.setItem('popmath_users', JSON.stringify(this.users));
    }

    getUser(username) {
        return this.users[username] || null;
    }

    saveProgress(username, progressData) {
        if (!this.progress[username]) this.progress[username] = [];
        this.progress[username].push(progressData);
        localStorage.setItem('popmath_progress', JSON.stringify(this.progress));
    }

    getProgress(username) {
        return this.progress[username] || [];
    }

    saveSettings(username, settings) {
        this.settings[username] = settings;
        localStorage.setItem('popmath_settings', JSON.stringify(this.settings));
    }

    getSettings(username) {
        return this.settings[username] || { bgm: true, sfx: true, tts: false, difficulty: 'normal' };
    }
}
