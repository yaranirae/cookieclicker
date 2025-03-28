class Upgrade {
    constructor(cost, cps, game, buttonId) {
        this.baseCost = cost;
        this.cost = cost;
        this.cps = cps;
        this.game = game;
        this.button = document.getElementById(buttonId);
        this.name = buttonId.replace(/([A-Z])/g, ' $1').trim();
        this.level = 0;

        this.loadUpgrade();

        if (this.button) {
            this.button.addEventListener("click", () => this.purchase());
            this.updateButtonState();
        }
    }

    purchase() {
        if (this.game.score >= this.cost) {
            this.game.score -= this.cost;
            this.game.cookiesPerSecond += this.cps;
            this.level++;
            this.cost = Math.floor(this.cost * 1.3);
            this.cps = Math.floor(this.cps * 1.2);

            this.updateButtonState();
            this.game.updateGameState();
            this.saveUpgrade();
        } else {
            alert("Not enough cookies!");
        }
    } // Kopen van upgrades/auto-clicker

    updateButtonState() {
        if (this.button) {
            this.button.innerHTML = `${this.name} - Cost: ${Upgrade.formatNumber(this.cost)} 🍪 <br> (Level ${this.level})`;

            if (this.game.score >= this.cost) {
                this.button.style.backgroundColor = "#fd6c84"; // Normal color
                this.button.disabled = false;
            } else {
                this.button.style.backgroundColor = "#f892a3"; // Grayed out when unavailable
                this.button.disabled = true;
            }
        }
    } // Verandert kleur als er genoeg cookies zijn om een auto-clicker te kopen

    saveUpgrade() {
        const upgradeData = {
            level: this.level,
            cost: this.cost
        };
        localStorage.setItem(`upgrade_${this.name}`, JSON.stringify(upgradeData));
    } // Code voor de level upgrade

    loadUpgrade() {
        const savedData = JSON.parse(localStorage.getItem(`upgrade_${this.name}`));
        if (savedData) {
            this.level = savedData.level || 0;
            this.cost = savedData.cost || this.baseCost;
        }
    } // Code voor de level upgrade

    static formatNumber(num) {
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1) + " million";
        } else {
            return num.toLocaleString("en-US");
        }
    } // Zodat de getallen i.p.v 1000, 1,000 zijn

    resetUpgrade() {
        this.level = 0;
        this.cost = this.baseCost;
        localStorage.removeItem(`upgrade_${this.name}`);
        this.updateButtonState();
    } // Code voor de level upgrade
} // Class voor de upgrades





class ClickerUpgrade extends Upgrade {
    constructor(game) {
        super(50, 1, game, "Cookie Clicker");
    }
} // Een auto-clicker upgrade

class GrandmaUpgrade extends Upgrade {
    constructor(game) {
        super(200, 5, game, "Cookie Grandma");
    }
} // Een auto-clicker upgrade

class FarmUpgrade extends Upgrade {
    constructor(game) {
        super(500, 20, game, "Cookie Farm");
    }
} // Een auto-clicker upgrade

class MineUpgrade extends Upgrade {
    constructor(game) {
        super(1000, 100, game, "Cookie Mine");
    }
} // Een auto-clicker upgrade

class FactoryUpgrade extends Upgrade {
    constructor(game) {
        super(2000, 500, game, "Cookie Factory");
    }
} // Een auto-clicker upgrade

class BankUpgrade extends Upgrade {
    constructor(game) {
        super(5000, 1000, game, "Cookie Bank");
    }
} // Een auto-clicker upgrade

class CastleUpgrade extends Upgrade {
    constructor(game) {
        super(10000, 2000, game, "Cookie Castle");
    }
} // Een auto-clicker upgrade

class CityUpgrade extends Upgrade {
    constructor(game) {
        super(20000, 5000, game, "Cookie City");
    }
} // Een auto-clicker upgrade

class CountryUpgrade extends Upgrade {
    constructor(game) {
        super(50000, 5000, game, "Cookie Country");
    }
} // Een auto-clicker upgrade

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
            new BankUpgrade(this),
            new CastleUpgrade(this),
            new CityUpgrade(this),
            new CountryUpgrade(this)
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

        this.upgrades.forEach(upgrade => upgrade.updateButtonState());

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
            this.upgrades.forEach(upgrade => upgrade.resetUpgrade());
            this.updateGameState();
        }
    }
} // Class voor de game

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

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("upgrade_")) {
                localStorage.removeItem(key);
            }
        });
    }

} // Class voor save, reset en share game

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
} // Class over cookies per second, 1,000 cijfers voor de cookie


document.addEventListener("DOMContentLoaded", () => new CookieClicker());
