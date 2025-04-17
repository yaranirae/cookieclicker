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
        }
    } // Kopen van upgrades/auto-clicker

    updateButtonState() {
        if (this.button) {
            this.button.innerHTML = `${this.name} - Cost: ${Upgrade.formatNumber(this.cost)} 🍪 <br> (Level ${this.level})`;

            if (this.game.score >= this.cost) {
                this.button.style.backgroundColor = "#ff627d";
                this.button.disabled = false;
            } else {
                this.button.style.backgroundColor = "#ed8696";
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


class AchievementTracker {
    constructor(game) {
        this.game = game;
        this.achievements = {
            click: false,
            '1k': false,
            grandma: false,
            grandma10: false,
            city: false,
            castle: false,
            country: false,
            '10k': false,
            '100k': false,
            '1m': false
        };

        this.loadAchievements();
        this.applyAchievements();
    }

    checkAchievements() {
        if (!this.achievements.click && this.game.score > 0) {
            this.unlock("click");
        }

        if (!this.achievements["1k"] && this.game.score >= 1000) {
            this.unlock("1k");
        }

        if (!this.achievements.grandma && this.game.upgrades.find(u => u instanceof GrandmaUpgrade && u.level > 0)) {
            this.unlock("grandma");
        }

        if (!this.achievements.grandma10 && this.game.upgrades.find(u => u instanceof GrandmaUpgrade && u.level >= 10)) {
            this.unlock("grandma10");
        }

        if (!this.achievements.city && this.game.upgrades.find(u => u instanceof CityUpgrade && u.level > 0)) {
            this.unlock("city");
        }

        if (!this.achievements.castle && this.game.upgrades.find(u => u instanceof CastleUpgrade && u.level > 0)) {
            this.unlock("castle");
        }

        if (!this.achievements.country && this.game.upgrades.find(u => u instanceof CountryUpgrade && u.level > 0)) {
            this.unlock("country");
        }

        if (!this.achievements["10k"] && this.game.score >= 10000) {
            this.unlock("10k");
        }

        if (!this.achievements["100k"] && this.game.score >= 100000) {
            this.unlock("100k");
        }

        if (!this.achievements["1m"] && this.game.score >= 1000000) {
            this.unlock("1m");
        }
    }

    unlock(id) {
        if (this.achievements[id]) return;

        const el = document.getElementById(`achievement-${id}`);
        if (el) {
            el.classList.remove("locked");
            el.classList.add("unlocked");

            // Prevent multiple checkmarks
            el.textContent = el.textContent.replace(" ✅", "");
            el.textContent += " ✅";
        }

        this.triggerConfetti();

        this.achievements[id] = true;
        this.saveAchievements();
    }

    triggerConfetti() {
        confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
        });
    }


    saveAchievements() {
        localStorage.setItem("achievements", JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const saved = localStorage.getItem("achievements");
        if (saved) {
            this.achievements = JSON.parse(saved);
        }
    }

    applyAchievements() {
        for (const id in this.achievements) {
            if (this.achievements[id]) {
                const el = document.getElementById(`achievement-${id}`);
                if (el) {
                    el.classList.remove("locked");
                    el.classList.add("unlocked");
                    if (!el.textContent.includes("✅")) {
                        el.textContent += " ✅";
                    }
                }
            }
        }
    }

    resetAchievements() {
        this.achievements = {
            click: false,
            '1k': false,
            grandma: false,
            grandma10: false,
            city: false,
            castle: false,
            country: false,
            '10k': false,
            '100k': false,
            '1m': false
        };
        localStorage.removeItem("achievements");

        for (const id in this.achievements) {
            const el = document.getElementById(`achievement-${id}`);
            if (el) {
                el.classList.remove("unlocked");
                el.classList.add("locked");
                el.textContent = el.textContent.replace(" ✅", "");
            }
        }
    }
}

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
        super(500, 200, game, "Cookie Farm");
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
        this.totalClicks = 0;
        this.ui = new UIHandler();
        this.achievementTracker = new AchievementTracker(this);

        this.cookieButton = document.getElementById("cookie-btn");
        this.resetButton = document.getElementById("reset-game");

        this.bakeryNameInput = document.querySelector(".bakery-name");
        this.loadBakeryName();

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
        this.bakeryNameInput.addEventListener("input", () => this.saveBakeryName());

        this.saveButton = document.getElementById("save-game");
        this.saveButton.addEventListener("click", () => {
            GameStorage.saveGame(this.score, this.cookiesPerSecond);
            showCustomAlert("Game saved! 💾");
        });

    }


    saveBakeryName() {
        const bakeryName = this.bakeryNameInput.value.trim();
        if (bakeryName) {
            localStorage.setItem("bakeryName", bakeryName);
        }
    }

    loadBakeryName() {
        const savedBakeryName = localStorage.getItem("bakeryName");
        if (savedBakeryName) {
            this.bakeryNameInput.value = savedBakeryName;
        }
    }

    incrementScore() {
        this.score++;
        this.totalClicks++;
        this.updateGameState();
        this.achievementTracker.checkAchievements();
    }

    updateGameState() {
        this.ui.updateScore(this.score);
        this.ui.updateCPS(this.cookiesPerSecond);

        this.upgrades.forEach(upgrade => upgrade.updateButtonState());

        this.achievementTracker.checkAchievements();
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
            this.achievementTracker.resetAchievements();
            this.updateGameState();

            localStorage.removeItem("bakeryName");
            this.bakeryNameInput.value = "";
        }
    }


} // Class voor de game

function showCustomAlert(message = "Game saved!") {
    const alertBox = document.getElementById("save-alert");
    alertBox.textContent = message;
    alertBox.classList.remove("hidden");
    alertBox.classList.add("show");

    setTimeout(() => {
        alertBox.classList.remove("show");
        alertBox.classList.add("hidden");
    }, 2000); // verdwijnt na 2 seconden
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
        const formattedScore = UIHandler.formatNumber(score);
        this.scoreDisplay.textContent = formattedScore;
        document.title = `${formattedScore} cookies 🍪 - Cookie Clicker`;
    }


    updateCPS(cps) {
        this.cpsDisplay.textContent = `${UIHandler.formatNumber(cps)} cookies per second`;
    }

    static formatNumber(num) {
        return num >= 1_000_000 ? new Intl.NumberFormat("en-US").format(Math.floor(num / 1_000)) + " million" : num.toLocaleString("en-US");
    }
} // Class over cookies per second, 1,000 cijfers voor de cookie




//shop



class ShopUpgrade {
    constructor(button, game) {
        this.button = button;
        this.game = game;
        this.name = button.id;
        this.description = button.title.split(" . ")[1] || "Unknown Description";
        const costMatch = button.title.match(/Cost: ([\d,]+)/);
        this.cost = costMatch ? parseInt(costMatch[1].replace(/,/g, "")) : 0;
        this.type = this.description.includes("Twice Efficient") ? "efficiency" : "boost";

        this.button.addEventListener("click", () => this.purchase());
        this.updateButtonState();
    }

    purchase() {
        if (this.game.score >= this.cost) {
            this.game.score -= this.cost;

            if (this.type === "efficiency") {
                this.applyEfficiencyUpgrade();
            } else if (this.type === "boost") {
                this.applyBoostUpgrade();
            }

            this.cost = Math.floor(this.cost * 1.25);
            this.updateButtonState();
            this.game.updateGameState();
        } else {
            alert("Not enough cookies!");
        }
    }

    applyEfficiencyUpgrade() {
        const targetName = this.description.match(/Makes (.+) Twice Efficient/)[1];
        const targetUpgrade = this.game.upgrades.find(upgrade => upgrade.name === targetName);
        if (targetUpgrade) {
            const additionalCPS = targetUpgrade.cps; // Calculate the additional CPS from doubling
            targetUpgrade.cps *= 2;
            this.game.cookiesPerSecond += additionalCPS; // Add the additional CPS to the game's total CPS
            this.game.totalCookiesPerSecond += additionalCPS; // Ensure it counts towards total production
        }
    }

    applyBoostUpgrade() {
        const boostPercentage = parseFloat(this.description.match(/\+([\d.]+)%/)[1]) / 100;
        const additionalCPS = this.game.cookiesPerSecond * (1 + boostPercentage); // Apply the boost as a multiplier
        this.game.cookiesPerSecond = additionalCPS; // Update the game's total CPS
        this.game.totalCookiesPerSecond = additionalCPS; // Ensure it counts towards total production
    }

    updateButtonState() {
        this.button.title = `${this.name} . ${this.description} . Cost: ${ShopUpgrade.formatNumber(this.cost)} 🍪`;
        this.button.dataset.content = `${this.name} - Cost: ${ShopUpgrade.formatNumber(this.cost)} 🍪`;

        if (this.game.score >= this.cost) {
            this.button.disabled = false;
            this.button.style.backgroundColor = "#fd6c84";
        } else {
            this.button.disabled = true;
            this.button.style.backgroundColor = "#fd8498";
        }
    }

    static formatNumber(num) {
        return num.toLocaleString("en-US");
    }
}

class Shop {
    constructor(game) {
        this.game = game;
        this.shopButtons = Array.from(document.querySelectorAll(".shop-upgrade"));
        this.upgrades = this.shopButtons.map(button => new ShopUpgrade(button, game));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const game = new CookieClicker();
    game.totalCookiesPerSecond = game.cookiesPerSecond; // Initialize total production tracking
    new Shop(game);
});
