class Upgrade {
    constructor(name, cost, cps) {
        this.name = name;
        this.cost = cost;
        this.cps = cps;
    }

    increaseCost() {
        this.cost = Math.floor(this.cost * 1.3);
    }

    getDescription() {
        return `${this.name} - Cost: ${this.cost}`;
    }
}

class Clicker extends Upgrade {
    constructor() {
        super("Clicker", 50, 1);
    }
}

class Grandma extends Upgrade {
    constructor() {
        super("Grandma", 200, 5);
    }
}

class Farm extends Upgrade {
    constructor() {
        super("Farm", 1000, 20);
    }
}

class Mine extends Upgrade {
    constructor() {
        super("Mine", 5000, 100);
    }
}

class Factory extends Upgrade {
    constructor() {
        super("Factory", 20000, 500);
    }
}

class Bank extends Upgrade {
    constructor() {
        super("Bank", 50000, 1000);
    }
}

class Game {
    constructor() {
        this.score = 0;
        this.cookiesPerSecond = 0;
        this.upgrades = [
            new Clicker(),
            new Grandma(),
            new Farm(),
            new Mine(),
            new Factory(),
            new Bank()
        ];

        this.scoreDisplay = document.getElementById("score");
        this.cpsDisplay = document.getElementById("cookie-ps");
        this.cookieButton = document.getElementById("cookie-btn");
        this.resetButton = document.getElementById("reset-game");

        this.loadGame();
        this.setupEventListeners();
        this.startAutoIncrement();
    }

    setupEventListeners() {
        this.cookieButton.addEventListener("click", () => this.incrementScore());
        this.resetButton.addEventListener("click", () => this.resetGame());

        this.upgrades.forEach(upgrade => {
            const button = document.getElementById(upgrade.name.toLowerCase());
            if (button) {
                button.addEventListener("click", () => this.buyUpgrade(upgrade));
                button.textContent = upgrade.getDescription();
            }
        });
    }

    incrementScore() {
        this.score++;
        this.updateScore();
        this.saveGame();
    }

    buyUpgrade(upgrade) {
        if (this.score >= upgrade.cost) {
            this.score -= upgrade.cost;
            this.cookiesPerSecond += upgrade.cps;
            upgrade.increaseCost();
            this.updateUpgradeButtons();
            this.updateScore();
            this.saveGame();
        } else {
            alert("Not enough cookies!");
        }
    }

    updateUpgradeButtons() {
        this.upgrades.forEach(upgrade => {
            const button = document.getElementById(upgrade.name.toLowerCase());
            if (button) {
                button.textContent = upgrade.getDescription();
            }
        });
    }

    startAutoIncrement() {
        setInterval(() => {
            this.score += this.cookiesPerSecond;
            this.updateScore();
            this.saveGame();
        }, 1000);
    }

    updateScore() {
        this.scoreDisplay.textContent = this.formatNumber(this.score);
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
        this.updateUpgradeButtons();
    }

    resetGame() {
        if (confirm("Are you sure you want to reset your progress?")) {
            localStorage.removeItem("score");
            localStorage.removeItem("cookiesPerSecond");

            this.score = 0;
            this.cookiesPerSecond = 0;
            this.updateScore();
            this.updateUpgradeButtons();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => new Game());
