let homeScore = 0;
let guestScore = 0;
let homeFouls = 0;
let guestFouls = 0;
let period = 1;

const GAME_SECONDS = 10 * 60;
let timeLeft = GAME_SECONDS;
let timerId = null;

const homeScoreDisplay = document.getElementById("home-score");
const guestScoreDisplay = document.getElementById("guest-score");
const homePlus1 = document.getElementById("home-plus-1");
const homePlus2 = document.getElementById("home-plus-2");
const homePlus3 = document.getElementById("home-plus-3");
const guestPlus1 = document.getElementById("guest-plus-1");
const guestPlus2 = document.getElementById("guest-plus-2");
const guestPlus3 = document.getElementById("guest-plus-3");
const newGame = document.getElementById("new-game");

const homeFoulsDisplay = document.getElementById("home-fouls");
const guestFoulsDisplay = document.getElementById("guest-fouls");
const homeFoulBtn = document.getElementById("home-foul");
const guestFoulBtn = document.getElementById("guest-foul");
const periodDisplay = document.getElementById("period");
const nextPeriodBtn = document.getElementById("next-period");
const timeDisplay = document.getElementById("time");
const startPauseBtn = document.getElementById("start-pause");
const timerResetBtn = document.getElementById("timer-reset");
const winnerDisplay = document.getElementById("winner");

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ":" + String(seconds).padStart(2, "0");
}

function render() {
    homeScoreDisplay.textContent = homeScore;
    guestScoreDisplay.textContent = guestScore;
    homeFoulsDisplay.textContent = homeFouls;
    guestFoulsDisplay.textContent = guestFouls;
    periodDisplay.textContent = period;
    timeDisplay.textContent = formatTime(timeLeft);

    homeScoreDisplay.classList.toggle("leading", homeScore > guestScore);
    guestScoreDisplay.classList.toggle("leading", guestScore > homeScore);
}

render();

homePlus1.addEventListener("click", () => {
    homeScore += 1;
    render();
});

homePlus2.addEventListener("click", () => {
    homeScore += 2;
    render();
});

homePlus3.addEventListener("click", () => {
    homeScore += 3;
    render();
});

guestPlus1.addEventListener("click", () => {
    guestScore += 1;
    render();
});

guestPlus2.addEventListener("click", () => {
    guestScore += 2;
    render();
});

guestPlus3.addEventListener("click", () => {
    guestScore += 3;
    render();
});

homeFoulBtn.addEventListener("click", () => {
    homeFouls += 1;
    render();
});

guestFoulBtn.addEventListener("click", () => {
    guestFouls += 1;
    render();
});

nextPeriodBtn.addEventListener("click", () => {
    if (period < 4) {
        period += 1;
        render();
    }
});

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    startPauseBtn.textContent = "Start";
}

function tick() {
    timeLeft -= 1;
    render();

    if (timeLeft <= 0) {
        stopTimer();
        announceWinner();
    }
}

function announceWinner() {
    if (homeScore > guestScore) {
        winnerDisplay.textContent = "HOME WINS!";
    } else if (guestScore > homeScore) {
        winnerDisplay.textContent = "GUEST WINS!";
    } else {
        winnerDisplay.textContent = "IT'S A TIE!";
    }
}

startPauseBtn.addEventListener("click", () => {
    if (timerId === null) {
        if (timeLeft <= 0) {
            return;
        }
        timerId = setInterval(tick, 1000);
        startPauseBtn.textContent = "Pause";
    } else {
        stopTimer();
    }
});

timerResetBtn.addEventListener("click", () => {
    stopTimer();
    timeLeft = GAME_SECONDS;
    winnerDisplay.textContent = "";
    render();
});

newGame.addEventListener("click", () => {
    stopTimer();
    homeScore = 0;
    guestScore = 0;
    homeFouls = 0;
    guestFouls = 0;
    period = 1;
    timeLeft = GAME_SECONDS;
    winnerDisplay.textContent = "";
    render();
});
