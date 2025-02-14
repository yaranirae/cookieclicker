// script.js
let score = 0;
let cookiesPerSecond = 0;

const scoreDisplay = document.getElementById("score");
const cpsDisplay = document.getElementById("cookie-ps")
const cookieButton = document.getElementById("cookie-btn");

const smallAutoClickerButton = document.getElementById("small-autoclicker");
const bigAutoClickerButton = document.getElementById("big-autoclicker");
const megaAutoClickerButton = document.getElementById("mega-autoclicker");
const goldenCookieButton = document.getElementById("golden-cookie");
const cookieFactoryButton = document.getElementById("cookie-factory");

cookieButton.addEventListener("click", () => {
    score++;
    updateScore();
});

// Auto-clicker upgrade functions
smallAutoClickerButton.addEventListener("click", () => {
    buyAutoClicker(50, 1);
});

bigAutoClickerButton.addEventListener("click", () => {
    buyAutoClicker(200, 5);
});

megaAutoClickerButton.addEventListener("click", () => {
    buyAutoClicker(1000, 20);
});

goldenCookieButton.addEventListener("click", () => {
    buyAutoClicker(5000, 100);
});

cookieFactoryButton.addEventListener("click", () => {
    buyAutoClicker(20000, 500);
});

//Loads saved game
function loadGame() {
    let savedScore = localStorage.getItem("score");
    let savedCPS = localStorage.getItem("cookiePerSecond");

    if (savedScore !== null) {
        score = parseInt(savedScore);
    }

    if (savedCPS !== null) {
        cookiesPerSecond = parseInt(savedCPS);
    }

    updateScore();
}


// Save game
function saveGame(){
    localStorage.setItem("score", score);
    localStorage.setItem("cookiePerSecond", cookiesPerSecond)
}

// Auto-clicker purchase function
function buyAutoClicker(cost, cps) {
    if (score >= cost) {
        score -= cost;
        cookiesPerSecond += cps;
        updateScore();
        saveGame();
    } else {
        alert("Not enough cookies!");
    }
}

// Auto-clicker interval
setInterval(() => {
    score += cookiesPerSecond;
    updateScore();
    saveGame();
}, 1000);  // Every second

// Update the cookies per second score
function updateScore() {
    scoreDisplay.textContent = `${score} Cookies`;
    cpsDisplay.textContent = `Cookies per second: ${cookiesPerSecond}`;
}

const resetButton = document.getElementById("reset-game");

// Reset game function
resetButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset your progress?")) {
        localStorage.removeItem("score");
        localStorage.removeItem("cookiesPerSecond");

        score = 0;
        cookiesPerSecond = 0;
        updateScore();
    }
});

loadGame();