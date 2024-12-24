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

startStopwatchButton.addEventListener('click', startStopwatch);
resetStopwatchButton.addEventListener('click', resetStopwatch);

// MUTE Button Functionality
muteButton.addEventListener('click', () => {
    isMuted = !isMuted; // Toggle mute state
    muteIcon.className = isMuted ? 'muted' : 'unmuted'; // Update the mute icon
    muteButton.textContent = isMuted ? 'UNMUTE' : 'MUTE'; // Update button text
    document.title = isMuted ? '🔇' : `${count}`; // Update the tab title
});

// Start the stopwatch on load
startStopwatch();

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

defaultTimeInput.addEventListener('wheel', (event) => {
    event.preventDefault();
    const step = event.deltaY < 0 ? 1 : -1;
    const currentValue = parseInt(defaultTimeInput.value) || defaultTime;
    const newValue = Math.max(1, currentValue + step);
    defaultTimeInput.value = newValue;
    defaultTime = newValue;
    count = defaultTime;
});

document.body.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    } else if (event.key.toLowerCase() === 'm' || event.key === 'צ') {
        toggleMute();
    } else if (event.key === 'ArrowUp') {
        volume = Math.min(1, volume + 0.1);
        volumeBar.value = volume;
    } else if (event.key === 'ArrowDown') {
        volume = Math.max(0, volume - 0.1);
        volumeBar.value = volume;
    } else if (event.key === 'Home') {
        toggleStealthMode();
    }
});

document.body.addEventListener('mousemove', (event) => {
    if (event.clientX <= window.innerWidth * 0.03) {
        volumeControl.style.display = 'flex';
    } else {
        volumeControl.style.display = 'none';
    }
});

volumeBar.addEventListener('input', (event) => {
    volume = parseFloat(event.target.value);
});

muteIcon.addEventListener('click', toggleMute);

function toggleMute() {
    isMuted = !isMuted;
    muteIcon.className = isMuted ? 'muted' : 'unmuted';
    document.title = isMuted ? '🔇' : `${count}`;
}

function toggleStealthMode() {
    isStealthMode = !isStealthMode;
    document.body.classList.toggle('stealth-mode', isStealthMode);
    if (isStealthMode) {
        isMuted = true;
        muteIcon.className = 'muted';
        document.title = '🔇';
    } else {
        isMuted = false;
        muteIcon.className = 'unmuted';
        document.title = `${count}`;
    }
}

updateTimer();
