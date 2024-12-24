const timerElement = document.getElementById('timer');
const defaultTimeInput = document.getElementById('defaultTimeInput');
const volumeControl = document.getElementById('volumeControl');
const volumeBar = document.getElementById('volumeBar');
const muteIcon = document.getElementById('muteIcon');
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const startStopwatchButton = document.getElementById('startStopwatch');
const resetStopwatchButton = document.getElementById('resetStopwatch');
const muteButton = document.getElementById('muteButton');
const sideMenu = document.getElementById('sideMenu');

let defaultTime = 4;
let count = defaultTime;
let isMuted = false;
let volume = 1;
let isStealthMode = false;

let stopwatchInterval;
let stopwatchRunning = false;
let stopwatchTime = 0;

function updateStopwatchDisplay() {
    const hours = String(Math.floor(stopwatchTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((stopwatchTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(stopwatchTime % 60).padStart(2, '0');
    stopwatchDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatchDisplay();
        }, 1000);
        startStopwatchButton.textContent = 'PAUSE';
        stopwatchRunning = true;
    } else {
        clearInterval(stopwatchInterval);
        startStopwatchButton.textContent = 'START';
        stopwatchRunning = false;
    }
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    updateStopwatchDisplay();
    startStopwatchButton.textContent = 'START';
    stopwatchRunning = false;
}

muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    muteIcon.className = isMuted ? 'muted' : 'unmuted';
    muteButton.textContent = isMuted ? 'UNMUTE' : 'MUTE';
});

startStopwatchButton.addEventListener('click', startStopwatch);
resetStopwatchButton.addEventListener('click', resetStopwatch);

function updateTimer() {
    timerElement.textContent = count;
    document.title = isMuted ? '🔇' : `${count}`;
    if (count <= Math.floor(defaultTime / 2)) {
        document.body.style.backgroundColor = 'red';
    } else {
        document.body.style.backgroundColor = 'black';
    }
    count--;
    if (count < 0) {
        count = defaultTime;
        setTimeout(updateTimer, 3000);
    } else {
        setTimeout(updateTimer, 1000);
    }
}

defaultTimeInput.addEventListener('change', () => {
    const newDefaultTime = parseInt(defaultTimeInput.value);
    if (newDefaultTime > 0) {
        defaultTime = newDefaultTime;
        count = defaultTime;
    }
});

updateTimer();
