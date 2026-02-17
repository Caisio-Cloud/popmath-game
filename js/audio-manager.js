export class AudioManager {
    constructor(db) {
        this.db = db;
        this.bgmEnabled = true;
        this.sfxEnabled = true;
        this.ttsEnabled = false;
        this.audioElements = {};
        
        // Initialize audio elements
        this.initAudioElements();
        
        // Load settings
        this.loadSettings();
    }

    initAudioElements() {
        // BGM tracks
        this.audioElements.bgm = {
            urban: this.createAudioElement('assets/bgm/urban-beat.mp3', true, 0.3),
            street: this.createAudioElement('assets/bgm/street-vibes.mp3', true, 0.3),
            tension: this.createAudioElement('assets/bgm/tension-loop.mp3', true, 0.3)
        };
        
        // SFX tracks
        this.audioElements.sfx = {
            correct: this.createAudioElement('assets/sfx/correct.mp3', false, 0.5),
            incorrect: this.createAudioElement('assets/sfx/incorrect.mp3', false, 0.5),
            click: this.createAudioElement('assets/sfx/click.mp3', false, 0.3),
            gameOver: this.createAudioElement('assets/sfx/game-over.mp3', false, 0.7)
        };
        
        // Set default BGM
        this.currentBGM = this.audioElements.bgm.urban;
    }

    createAudioElement(src, loop, volume) {
        const audio = new Audio();
        audio.src = src;
        audio.loop = loop;
        audio.volume = volume;
        audio.preload = 'auto';
        return audio;
    }

    playBGM(track = 'urban') {
        if (!this.bgmEnabled) return;
        
        // Stop current BGM
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
        
        // Play new BGM
        this.currentBGM = this.audioElements.bgm[track] || this.audioElements.bgm.urban;
        this.currentBGM.play().catch(e => console.log('BGM play failed:', e));
    }

    playSFX(type) {
        if (!this.sfxEnabled) return;
        
        const sfx = this.audioElements.sfx[type];
        if (sfx) {
            // Clone and play for overlapping sounds
            const clone = sfx.cloneNode();
            clone.volume = sfx.volume;
            clone.play().catch(e => console.log('SFX play failed:', e));
            
            // Clean up clone after playback
            clone.addEventListener('ended', () => clone.remove());
        }
    }

    stopBGM() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
    }

    playMeme() {
        if (!this.sfxEnabled) return;
        
        // Play a funny sound for memes
        const memeSounds = [
            this.audioElements.sfx.incorrect.cloneNode(),
            this.createAudioElement('assets/sfx/wah-wah.mp3', false, 0.5)
        ];
        
        const sound = memeSounds[Math.floor(Math.random() * memeSounds.length)];
        sound.play().catch(e => console.log('Meme sound failed:', e));
        
        setTimeout(() => sound.remove(), 3000);
    }

    speakText(text) {
        if (!this.ttsEnabled || !window.speechSynthesis) return;
        
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to find a Filipino voice
        const voices = window.speechSynthesis.getVoices();
        const filipinoVoice = voices.find(voice => 
            voice.lang.includes('fil') || voice.lang.includes('tl') || voice.name.includes('Filipino')
        );
        
        if (filipinoVoice) {
            utterance.voice = filipinoVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }

    toggleBGM() {
        this.bgmEnabled = !this.bgmEnabled;
        if (!this.bgmEnabled) {
            this.stopBGM();
        } else {
            this.playBGM();
        }
        return this.bgmEnabled;
    }

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    toggleTTS() {
        this.ttsEnabled = !this.ttsEnabled;
        return this.ttsEnabled;
    }

    loadSettings() {
        const username = localStorage.getItem('popmath_current_user');
        if (username) {
            const settings = this.db.getSettings(username);
            this.bgmEnabled = settings.bgm !== false;
            this.sfxEnabled = settings.sfx !== false;
            this.ttsEnabled = settings.tts || false;
        }
    }

    saveSettings() {
        const username = localStorage.getItem('popmath_current_user');
        if (username) {
            const settings = {
                bgm: this.bgmEnabled,
                sfx: this.sfxEnabled,
                tts: this.ttsEnabled
            };
            this.db.saveSettings(username, settings);
        }
    }
}
