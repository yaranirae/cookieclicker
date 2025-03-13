class CookieClicker {
    constructor() {
        this.score = 0;
        this.cookiesPerSecond = 0;

        this.scoreDisplay = document.getElementById("score");
        this.cpsDisplay = document.getElementById("cookie-ps");
        this.cookieButton = document.getElementById("cookie-btn");
        this.resetButton = document.getElementById("reset-game");

        this.upgrades = [
            { button: "clicker", cost: 50, cps: 1 },
            { button: "grandma", cost: 200, cps: 5 },
            { button: "farm", cost: 1000, cps: 20 },
            { button: "mine", cost: 5000, cps: 100 },
            { button: "factory", cost: 20000, cps: 500 }
        ];

        this.loadGame();
        this.setupEventListeners();
        this.startAutoIncrement();
    }

    setupEventListeners() {
        this.cookieButton.addEventListener("click", () => this.incrementScore());
        this.resetButton.addEventListener("click", () => this.resetGame());

        this.upgrades.forEach(upgrade => {
            const button = document.getElementById(upgrade.button);
            if (button) {
                button.addEventListener("click", () => this.buyAutoClicker(upgrade.cost, upgrade.cps));
            }
        });
    }

    incrementScore() {
        this.score++;
        this.updateScore();
        this.saveGame();
    }

    buyAutoClicker(cost, cps) {
        if (this.score >= cost) {
            this.score -= cost;
            this.cookiesPerSecond += cps;
            this.upgrades.cost = Math.floor(1.5);
            this.updateScore();
            this.saveGame();
        } else {
            alert("Not enough cookies!");
        }
    }

    startAutoIncrement() {
        setInterval(() => {
            this.score += this.cookiesPerSecond;
            this.updateScore();
            this.saveGame();
        }, 1000);
    }

    updateScore() {
        this.scoreDisplay.textContent = `${this.formatNumber(this.score)}`;
        this.cpsDisplay.textContent = `${this.formatNumber(this.cookiesPerSecond)} cookies per second`;
    }

    formatNumber(num) {
        if (num >= 1_000_000) {
            return new Intl.NumberFormat("en-US").format(Math.floor(num / 1_000)) + " million";
        } else {
            return num.toLocaleString("en-US");
        }
    }

    saveGame() {
        localStorage.setItem("score", this.score);
        localStorage.setItem("cookiesPerSecond", this.cookiesPerSecond);
    }

    loadGame() {
        let savedScore = localStorage.getItem("score");
        let savedCPS = localStorage.getItem("cookiesPerSecond");

        if (savedScore !== null) this.score = parseInt(savedScore);
        if (savedCPS !== null) this.cookiesPerSecond = parseInt(savedCPS);

        this.updateScore();
    }

    resetGame() {
        if (confirm("Are you sure you want to reset your progress?")) {
            localStorage.removeItem("score");
            localStorage.removeItem("cookiesPerSecond");

            this.score = 0;
            this.cookiesPerSecond = 0;
            this.updateScore();
        }
    }

}

// class Counter {
//     counter;
//     cost;
//     clickerID;
//     buttonID;
//     game;
//
//     constructor() {
//         this.counter = 0;
//         this.cost = 1
//         this.clickerID = clickerID;
//         this.buttonID = buttonID;
//         this.game = game;
//     }
// }

document.addEventListener("DOMContentLoaded", () => new CookieClicker());
