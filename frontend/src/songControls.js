// Get the dropdown element
const instrumentDropdown = document.querySelector("#instrumentDropdown");

// Variables to hold the state
let currentScore = null;

// Update the dropdown when the score is loaded
api.scoreLoaded.on((score) => {
    currentScore = score;
    updateInstrumentDropdown(score);
});

// Control functions for each control in the UI
function updateInstrumentDropdown(score) {
    instrumentDropdown.innerHTML = "";
    score.tracks.forEach((track) => {
        const option = document.createElement("option");
        option.value = track.index;
        option.textContent = track.name;
        instrumentDropdown.appendChild(option);
    });
}

instrumentDropdown.onchange = (e) => changeTrack(parseInt(e.target.value));

function changeTrack(selectedTrackIndex) {
    if (currentScore) {
        const selectedTrack = currentScore.tracks.find((track) => track.index === selectedTrackIndex);
        if (selectedTrack) {
            api.renderTracks([selectedTrack]);
        }
    } else {
        console.log("No score is loaded yet.");
    }
}

// ----------------- Player Controls -----------------

const countIn = wrapper.querySelector(".header .at-count-in");
countIn.onclick = toggleCountIn;

function toggleCountIn() {
    countIn.classList.toggle("active");
    api.countInVolume = countIn.classList.contains("active") ? 1 : 0;
}

const metronome = wrapper.querySelector(".header .at-metronome");
metronome.onclick = toggleMetronome;

function toggleMetronome() {
    metronome.classList.toggle("active");
    api.metronomeVolume = metronome.classList.contains("active") ? 1 : 0;
}

const loop = wrapper.querySelector(".header .at-loop");
loop.onclick = toggleLoop;

function toggleLoop() {
    loop.classList.toggle("active");
    api.isLooping = loop.classList.contains("active");
}

const printer = wrapper.querySelector(".header-dot-menu .at-print");
printer.onclick = printSong;

function printSong() {
    api.pause();
    api.print();
}

const zoom = wrapper.querySelector(".header-dot-menu .at-zoom select");
zoom.onchange = updateZoom;

function updateZoom() {
    const zoomLevel = parseInt(zoom.value) / 100;
    api.settings.display.scale = zoomLevel;
    api.updateSettings();
    api.render();
}

const layout = wrapper.querySelector(".header-dot-menu .at-layout select");
layout.onchange = updateLayout;

function updateLayout() {
    switch (layout.value) {
        case "horizontal":
            api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
            break;
        case "page":
            api.settings.display.layoutMode = alphaTab.LayoutMode.Page;
            break;
    }
    api.updateSettings();
    api.render();
}

const playAndPause = document.getElementById("playPauseButton");
const playAndPauseIcon = document.getElementById("playPauseIcon");
playAndPause.onclick = togglePlayPause;

function togglePlayPause(e) {
    api.playPause();
    updatePlayPauseIcon(api.isPlaying);
}

function updatePlayPauseIcon(isPlaying) {
    playAndPauseIcon.src = isPlaying ? "./resources/controls/pause.png" : "./resources/controls/play.png";
    playAndPauseIcon.alt = isPlaying ? "Pause" : "Play";
}

// Watch Play/Pause status and update the icon
api.playerStateChanged.on((e) => {
    updatePlayPauseIcon(e.state === alphaTab.synth.PlayerState.Playing);
});

const stop = wrapper.querySelector(".header .at-player-stop");
stop.onclick = stopSong;

function stopSong(e) {
    api.stop();
    settings.player.scrollElement.scrollTop = 0;
}

// ----------------- Song Position Update -----------------

const songPosition = wrapper.querySelector(".at-song-position");

api.playerPositionChanged.on((e) => updateSongPosition(e.currentTime, e.endTime));

let previousTime = -1;
function updateSongPosition(currentTime, endTime) {
    const currentSeconds = Math.floor(currentTime / 1000);
    if (currentSeconds === previousTime) return;
    previousTime = currentSeconds;
    songPosition.innerText = `${formatDuration(currentTime)} / ${formatDuration(endTime)}`;
}

function formatDuration(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
