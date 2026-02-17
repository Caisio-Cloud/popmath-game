// ==================== GAME STORY & LORE ====================
export const GameStory = {
    intro: [
        "In the heart of Metro Manila's toughest district, where dreams are traded for survival...",
        "You are KAI, a 16-year-old with a rare gift: numbers speak to you.",
        "Your family's sari-sari store is failing. Bills pile up like monsoon floodwaters.",
        "School feels like a distant memory, another casualty of the alley's relentless grind.",
        "But you've discovered something: in the chaos of the streets, math becomes your weapon.",
        "Every calculation is a step toward salvation. Every mistake costs you dearly.",
        "The alley doesn't forgive errors, but it respects those who can count under pressure."
    ],

    characters: {
        kai: {
            name: "KAI",
            description: "You - a street-smart teen with a gift for numbers",
            color: "#4a9fff"
        },
        titoBen: {
            name: "🚬 TITO BEN",
            description: "Sampaguita supplier, your first employer",
            color: "#9d4dff",
            dialogs: [
                "Kid, 30 garlands at ₱15 each. How much you earn if you sell all? Get it wrong, you pay for the unsold ones.",
                "Good. Now what if you add 20 more garlands? Think fast!",
                "Street's getting competitive. Price increase to ₱20. Recalculate!",
                "You're smarter than you look. Want a real challenge?",
                "The alley respects skill. You're earning your place."
            ]
        },
        maria: {
            name: "👵 MARIA (Your Mother)",
            description: "Struggling store owner, your motivation",
            color: "#ff4a9d",
            dialogs: [
                "Anak, we need ₱2,000 by Friday or we lose the store...",
                "You're doing well! Keep it up, but don't skip school.",
                "The bill collectors are coming tomorrow...",
                "You saved us... I'm so proud of you, my smart child.",
                "Your father would be proud. He always said you had the numbers gift."
            ]
        }
    },

    getRandomMeme() {
        const memes = [
            { text: "WHEN YOU GET THE MATH WRONG", emoji: "🤦‍♂️", image: "math-fail.jpg" },
            { text: "MY BRAIN RIGHT NOW", emoji: "🧠💥", image: "brain-explode.gif" },
            { text: "THE NUMBERS MASON!", emoji: "😱", image: "numbers-mason.jpg" },
            { text: "CALCULATOR BROKE", emoji: "📱💀", image: "calculator-broke.gif" },
            { text: "MATH IS HARD", emoji: "😭", image: "math-hard.jpg" },
            { text: "I USED TO BE GOOD AT THIS", emoji: "🎓➡️🤡", image: "used-to-be.jpg" },
            { text: "GO BACK TO SCHOOL", emoji: "🏫👈", image: "back-to-school.jpg" },
            { text: "EVEN MY DOG KNOWS THIS", emoji: "🐶➡️📚", image: "dog-math.jpg" }
        ];
        return memes[Math.floor(Math.random() * memes.length)];
    },

    getStreakMessage(streak) {
        if (streak >= 20) return { message: "M-M-M-MONSTER KILL!", color: "#ff0000" };
        if (streak >= 15) return { message: "RAMPAGE!", color: "#ff6b00" };
        if (streak >= 10) return { message: "DOMINATING!", color: "#ffd700" };
        if (streak >= 7) return { message: "KILLING SPREE!", color: "#4aff4a" };
        if (streak >= 5) return { message: "ON FIRE!", color: "#ff4a4a" };
        if (streak >= 3) return { message: "FIRST BLOOD!", color: "#4a9fff" };
        return { message: "GETTING STARTED", color: "#a0a0ff" };
    }
};

// ==================== HARDCODED QUESTIONS (50 per category) ====================
export const GameQuestions = {
    arithmetic: [
        { id: "arith_1", question: "What is 15 + 27?", answer: "42", options: ["40", "42", "45", "38"], hint: "15 + 27 = 42" },
        { id: "arith_2", question: "Multiply 8 by 7", answer: "56", options: ["54", "56", "58", "60"], hint: "8 × 7 = 56" },
        { id: "arith_3", question: "What is 64 ÷ 8?", answer: "8", options: ["6", "7", "8", "9"], hint: "8 × 8 = 64" },
        { id: "arith_4", question: "Subtract 89 from 125", answer: "36", options: ["34", "36", "38", "40"], hint: "125 - 89 = 36" },
        { id: "arith_5", question: "What is 9 × 6?", answer: "54", options: ["52", "54", "56", "58"], hint: "9 × 6 = 54" },
        // ... (rest of your 50 arithmetic questions)
    ],
    fractions: [
        // ... (your 50 fractions questions)
    ],
    algebra: [
        // ... (your 50 algebra questions)
    ],
    geometry: [
        // ... (your 50 geometry questions)
    ],
    word_problems: [
        // ... (your 50 word problems)
    ]
};

// ==================== GAME MANAGER ====================
export class GameManager {
    constructor(questions) {
        this.questions = questions;
        this.currentCategory = null;
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 3;
        this.streak = 0;
        this.difficulty = 'normal';
        this.gameActive = false;
        
        this.categories = [
            { id: 'arithmetic', name: 'Basic Arithmetic', icon: '➕', description: '50 questions' },
            { id: 'fractions', name: 'Fractions', icon: '½', description: '50 questions' },
            { id: 'algebra', name: 'Algebra', icon: '𝑥', description: '50 questions' },
            { id: 'geometry', name: 'Geometry', icon: '△', description: '50 questions' },
            { id: 'word_problems', name: 'Street Problems', icon: '📖', description: '50 questions' }
        ];
    }

    startGame(category, difficulty = 'normal') {
        this.currentCategory = category;
        this.difficulty = difficulty;
        this.score = 0;
        this.lives = 3;
        this.streak = 0;
        this.gameActive = true;
        this.currentQuestionIndex = 0;
        this.questionsAnswered = 0;
        
        // Shuffle questions for this category
        this.shuffledQuestions = this.shuffleArray([...this.questions[category]]);
        
        // Set time based on difficulty
        this.timePerQuestion = {
            easy: 60,
            normal: 45,
            hard: 30,
            expert: 20
        }[difficulty] || 45;
        
        this.timeRemaining = this.timePerQuestion;
        
        return this.getCurrentQuestion();
    }

    getCurrentQuestion() {
        if (!this.gameActive || !this.currentCategory) return null;
        
        if (this.currentQuestionIndex >= this.shuffledQuestions.length) {
            // Re-shuffle if we've gone through all questions
            this.shuffledQuestions = this.shuffleArray([...this.questions[this.currentCategory]]);
            this.currentQuestionIndex = 0;
        }
        
        this.currentQuestion = this.shuffledQuestions[this.currentQuestionIndex];
        this.currentQuestionIndex++;
        this.timeRemaining = this.timePerQuestion;
        
        return this.currentQuestion;
    }

    submitAnswer(answer) {
        if (!this.gameActive || !this.currentQuestion) {
            return { correct: false, message: 'Game not active' };
        }

        this.questionsAnswered++;
        const isCorrect = answer === this.currentQuestion.answer;
        
        let result = {
            correct: isCorrect,
            correctAnswer: this.currentQuestion.answer,
            hint: this.currentQuestion.hint,
            category: this.currentCategory
        };

        if (isCorrect) {
            this.streak++;
            
            // Calculate score
            const baseScore = 100;
            const streakBonus = Math.min(this.streak * 50, 500);
            const difficultyMultiplier = {
                easy: 0.5,
                normal: 1,
                hard: 1.5,
                expert: 2
            }[this.difficulty] || 1;
            
            const scoreEarned = Math.round((baseScore + streakBonus) * difficultyMultiplier);
            this.score += scoreEarned;
            
            result.scoreEarned = scoreEarned;
            result.streak = this.streak;
            result.message = this.getRandomRewardMessage();
            result.streakMessage = GameStory.getStreakMessage(this.streak);
            
        } else {
            this.streak = 0;
            this.lives--;
            
            result.livesRemaining = this.lives;
            result.message = "Wrong answer! Try again.";
            result.streakMessage = { message: "STREAK ENDED", color: "#ff4a4a" };
            
            if (this.lives <= 0) {
                this.gameActive = false;
                result.gameOver = true;
            }
        }

        return result;
    }

    getRandomRewardMessage() {
        const messages = [
            "Perfect! The alley respects precision!",
            "Excellent calculation! You're surviving!",
            "Outstanding! Numbers bow to your skill!",
            "Brilliant! You're mastering the urban jungle!",
            "Flawless! Keep this up and you'll own the street!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    getGameStats() {
        return {
            score: this.score,
            lives: this.lives,
            streak: this.streak,
            category: this.currentCategory,
            difficulty: this.difficulty,
            questionsAnswered: this.questionsAnswered,
            timePerQuestion: this.timePerQuestion,
            timeRemaining: this.timeRemaining
        };
    }

    useHint() {
        if (this.score >= 100) {
            this.score -= 100;
            return {
                success: true,
                hint: this.currentQuestion?.hint || 'Try your best!',
                scoreCost: 100
            };
        }
        
        return {
            success: false,
            message: "Not enough points for a hint (need 100)",
            scoreCost: 100
        };
    }

    skipQuestion() {
        if (this.lives > 1) {
            this.lives--;
            this.streak = 0;
            return {
                success: true,
                livesRemaining: this.lives,
                message: "Question skipped! -1 life"
            };
        }
        
        return {
            success: false,
            message: "Cannot skip with only 1 life remaining"
        };
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
