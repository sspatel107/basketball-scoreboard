/*
  ============================================================
  INDEX.JS — LOGIC GUIDE (you write the JavaScript)
  ============================================================

  GOLDEN RULE: keep DATA separate from the SCREEN.
  Store the scores in variables (the "source of truth"), then write a
  function that copies those variables onto the screen. Never read the
  current number back off the HTML — always trust your variables.

  ----------------------------------------------------------------
  STEP 1 — State (the data)
  ----------------------------------------------------------------
  - Declare two variables to hold the scores, starting at 0.
      e.g. let homeScore = 0; let guestScore = 0;
    (Later you can refactor into one object { home: 0, guest: 0 } — optional.)

  ----------------------------------------------------------------
  STEP 2 — Grab the display elements
  ----------------------------------------------------------------
  - Use document.getElementById(...) to get #home-score and #guest-score.
  - Store each in a const so you're not searching the DOM repeatedly.

  ----------------------------------------------------------------
  STEP 3 — A render function
  ----------------------------------------------------------------
  - Write one function (e.g. render()) whose only job is to put
    homeScore / guestScore into the .textContent of the display elements.
  - Call render() once at the very end so the board shows 0 / 0 on load.
  - From now on: whenever a score changes, call render() again.

  ----------------------------------------------------------------
  STEP 4 — Make the six buttons work (the smart way)
  ----------------------------------------------------------------
  Two approaches — pick ONE:

    OPTION A (recommended — event delegation, ~1 listener):
      - Select ALL buttons (document.querySelectorAll) OR listen on a parent.
      - On click, read the button's data-team and data-points attributes
        (event.target.dataset.team / .dataset.points).
      - Convert points to a number (dataset values are strings! use Number()).
      - Add the points to the matching score variable, then call render().
      - This is why we put data-* attributes on the buttons in the HTML.

    OPTION B (beginner-friendly — explicit):
      - Give each of the six buttons its own id.
      - Add six addEventListener("click", ...) calls, each adding the right
        amount to the right variable, then calling render().
      - More repetitive, but very clear if you're new to JS.

  ----------------------------------------------------------------
  STEP 5 — Test
  ----------------------------------------------------------------
  - Open index.html in the browser, click each button, confirm the right
    side goes up by the right amount. Use console.log if a button misbehaves.

  ----------------------------------------------------------------
  STRETCH GOALS (do these only after the six buttons work)
  ----------------------------------------------------------------
  - NEW GAME: one listener on #new-game that sets both scores to 0 and renders.
  - HIGHLIGHT THE LEADER: inside render(), compare the two scores; add the CSS
    .leading class to the higher side and remove it from the other (handle ties
    by removing it from both). classList.add / classList.remove are your tools.
  - EXTRA COUNTERS (period/fouls): repeat the same pattern — a variable, a
    display element, buttons, and render it. Don't reinvent; reuse Step 1–4.
  - TIMER: this introduces setInterval — ask me and I'll walk you through it
    separately, since it has start/stop/reset edge cases.
*/

// ----- STATE (the "source of truth"; all values that change live here) -----
let homeScore = 0;
let guestScore = 0;
let homeFouls = 0;
let guestFouls = 0;
let period = 1;

const GAME_SECONDS = 10 * 60;   // clock starts at 10:00
let timeLeft = GAME_SECONDS;    // seconds remaining
let timerId = null;             // the setInterval handle; null means "not running"

// ----- ELEMENT REFERENCES (never reassigned -> const) -----
const homeScoreDisplay = document.getElementById("home-score");
const guestScoreDisplay = document.getElementById("guest-score");
const homePlus1 = document.getElementById("home-plus-1");
const homePlus2 = document.getElementById("home-plus-2");
const homePlus3 = document.getElementById("home-plus-3");
const guestPlus1 = document.getElementById("guest-plus-1");
const guestPlus2 = document.getElementById("guest-plus-2");
const guestPlus3 = document.getElementById("guest-plus-3");
const newGame = document.getElementById("new-game");

// New stretch-goal elements.
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

// Turn a number of seconds into "M:SS" (e.g. 65 -> "1:05").
// padStart makes sure the seconds always show two digits.
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

    // Highlight whoever is ahead. classList.toggle(name, condition) adds the
    // class when the condition is true and removes it when false — so a tie
    // (including the 0-0 start / New Game reset) clears both highlights.
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

// ----- FOULS: one click adds a foul to that team. -----
homeFoulBtn.addEventListener("click", () => {
    homeFouls += 1;
    render();
});

guestFoulBtn.addEventListener("click", () => {
    guestFouls += 1;
    render();
});

// ----- PERIOD: bump the quarter, capped at 4. -----
nextPeriodBtn.addEventListener("click", () => {
    if (period < 4) {
        period += 1;
        render();
    }
});

// ----- TIMER -----
// stopTimer clears the running interval and marks us "not running".
// Centralising this avoids leaving a stray interval running in the background.
function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    startPauseBtn.textContent = "Start";
}

// Called once every second by setInterval.
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

// Start/Pause toggles based on whether a timer is currently running.
startPauseBtn.addEventListener("click", () => {
    if (timerId === null) {
        // Don't start if the clock is already at 0.
        if (timeLeft <= 0) {
            return;
        }
        timerId = setInterval(tick, 1000);
        startPauseBtn.textContent = "Pause";
    } else {
        stopTimer();
    }
});

// Reset just the clock back to the full game time.
timerResetBtn.addEventListener("click", () => {
    stopTimer();
    timeLeft = GAME_SECONDS;
    winnerDisplay.textContent = "";
    render();
});

// ----- NEW GAME: reset EVERYTHING back to the starting state. -----
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