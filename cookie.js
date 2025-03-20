class Upgrade {
    constructor(cost, cps, game, buttonId) {
        this.cost = cost;
        this.cps = cps;
        this.game = game;
        this.button = document.getElementById(buttonId);
        this.name = buttonId.replace(/([A-Z])/g, ' $1').trim();


        if (this.button) {
            this.button.addEventListener("click", () => this.purchase());
            this.updateButtonText();
        }
    }

    purchase() {
        if (this.game.score >= this.cost) {
            this.game.score -= this.cost;
            this.game.cookiesPerSecond += this.cps;
            this.cost = Math.floor(this.cost * 1.3);
            this.updateButtonText();
            this.game.updateGameState();
        } else {
            alert("Not enough cookies!");
        }
    }

    updateButtonText() {
        if (this.button) {
            this.button.innerHTML = `${this.name} - Cost: ${this.cost} 🍪`;
        }
    }
}

class ClickerUpgrade extends Upgrade {
    constructor(game) {
        super(50, 1, game, "Cookie Clicker");
    }
}

class GrandmaUpgrade extends Upgrade {
    constructor(game) {
        super(200, 5, game, "Cookie Grandma");
    }
}

class FarmUpgrade extends Upgrade {
    constructor(game) {
        super(500, 20, game, "Cookie Farm");
    }
}

class MineUpgrade extends Upgrade {
    constructor(game) {
        super(1000, 100, game, "Cookie Mine");
    }
}

class FactoryUpgrade extends Upgrade {
    constructor(game) {
        super(2000, 500, game, "Cookie Factory");
    }
}

class BankUpgrade extends Upgrade {
    constructor(game) {
        super(5000, 1000, game, "Cookie Bank");
    }
}

class CookieClicker {
    constructor() {
        this.score = 0;
        this.cookiesPerSecond = 0;
        this.ui = new UIHandler();

        this.cookieButton = document.getElementById("cookie-btn");
        this.resetButton = document.getElementById("reset-game");

        this.upgrades = [
            new ClickerUpgrade(this),
            new GrandmaUpgrade(this),
            new FarmUpgrade(this),
            new MineUpgrade(this),
            new FactoryUpgrade(this),
            new BankUpgrade(this)
        ];

        this.loadGame();
        this.setupEventListeners();
        this.startAutoIncrement();
    }

    setupEventListeners() {
        this.cookieButton.addEventListener("click", () => this.incrementScore());
        this.resetButton.addEventListener("click", () => this.resetGame());
    }

    incrementScore() {
        this.score++;
        this.updateGameState();
    }

    updateGameState() {
        this.ui.updateScore(this.score);
        this.ui.updateCPS(this.cookiesPerSecond);
        GameStorage.saveGame(this.score, this.cookiesPerSecond);
    }

    startAutoIncrement() {
        setInterval(() => {
            this.score += this.cookiesPerSecond;
            this.updateGameState();
        }, 1000);
    }

    loadGame() {
        let savedData = GameStorage.loadGame();
        this.score = savedData.score;
        this.cookiesPerSecond = savedData.cookiesPerSecond;
        this.updateGameState();
    }

    resetGame() {
        if (confirm("Are you sure you want to reset your progress?")) {
            GameStorage.resetGame();
            this.score = 0;
            this.cookiesPerSecond = 0;
            this.updateGameState();
        }
    }
}

class GameStorage {
    static saveGame(score, cookiesPerSecond) {
        localStorage.setItem("score", score);
        localStorage.setItem("cookiesPerSecond", cookiesPerSecond);
    }

    static loadGame() {
        return {
            score: parseInt(localStorage.getItem("score")) || 0,
            cookiesPerSecond: parseInt(localStorage.getItem("cookiesPerSecond")) || 0
        };
    }

    static resetGame() {
        localStorage.removeItem("score");
        localStorage.removeItem("cookiesPerSecond");
    }
}

class UIHandler {
    constructor() {
        this.scoreDisplay = document.getElementById("score");
        this.cpsDisplay = document.getElementById("cookie-ps");
    }

    updateScore(score) {
        this.scoreDisplay.textContent = UIHandler.formatNumber(score);
    }

    updateCPS(cps) {
        this.cpsDisplay.textContent = `${UIHandler.formatNumber(cps)} cookies per second`;
    }

    static formatNumber(num) {
        return num >= 1_000_000 ? new Intl.NumberFormat("en-US").format(Math.floor(num / 1_000)) + " million" : num.toLocaleString("en-US");
    }
}

document.addEventListener("DOMContentLoaded", () => new CookieClicker());
