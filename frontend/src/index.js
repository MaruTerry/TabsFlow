// This is the main file that initialises the Alphatab API and controls the UI logic.

// load elements
const wrapper = document.querySelector(".at-wrap");
const main = wrapper.querySelector(".at-main");
const overlay = wrapper.querySelector(".at-overlay");
const content = wrapper.querySelector(".at-content");
const startContent = wrapper.querySelector(".start-content");

// initialize alphatab
const settings = {
    player: {
        enablePlayer: true,
        soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
        scrollElement: wrapper.querySelector(".at-viewport"),
    },
};
const api = new alphaTab.AlphaTabApi(main, settings);

// Funktion zum Laden des Songs
function loadSong(file) {
    overlay.style.display = "flex";
    content.style.display = "block";
    startContent.style.display = "none";
    settings.file = file;
    if (api.isPlaying) {
        api.stop();
    }
    api.load(file);
    displaySidbarSongList(); // Update sidebar list for highlighting
}

// overlay logic
api.renderStarted.on(() => {
    overlay.style.display = "flex";
});
api.renderFinished.on(() => {
    setTimeout(() => {
        overlay.style.display = "none";
    }, 200);
});

// Get the dropdown element
const instrumentDropdown = document.querySelector("#instrumentDropdown");

// Function to create track options in the dropdown
function createTrackOption(track) {
    const option = document.createElement("option");
    option.value = track.index; // Use track index as value
    option.textContent = track.name; // Display track name
    return option;
}

let currentScore = null;
// Update the dropdown when the score is loaded
api.scoreLoaded.on((score) => {
    currentScore = score; // Save the loaded score
    instrumentDropdown.innerHTML = ""; // Clear previous options

    // Populate the dropdown with track options
    score.tracks.forEach((track) => {
        const option = document.createElement("option");
        option.value = track.index; // Use track index as value
        option.textContent = track.name; // Display track name
        instrumentDropdown.appendChild(option);
    });
});

// Change track based on dropdown selection
instrumentDropdown.onchange = (e) => {
    const selectedTrackIndex = parseInt(e.target.value);
    if (currentScore) {
        const selectedTrack = currentScore.tracks.find((track) => track.index === selectedTrackIndex);
        if (selectedTrack) {
            api.renderTracks([selectedTrack]); // Render the selected track
        }
    } else {
        console.log("No score is loaded yet.");
    }
};

const countIn = wrapper.querySelector(".header .at-count-in");
countIn.onclick = () => {
    countIn.classList.toggle("active");
    if (countIn.classList.contains("active")) {
        api.countInVolume = 1;
    } else {
        api.countInVolume = 0;
    }
};

const metronome = wrapper.querySelector(".header .at-metronome");
metronome.onclick = () => {
    metronome.classList.toggle("active");
    if (metronome.classList.contains("active")) {
        api.metronomeVolume = 1;
    } else {
        api.metronomeVolume = 0;
    }
};

const loop = wrapper.querySelector(".header .at-loop");
loop.onclick = () => {
    loop.classList.toggle("active");
    api.isLooping = loop.classList.contains("active");
};

wrapper.querySelector(".header-dot-menu .at-print").onclick = () => {
    api.pause();
    api.print();
};

const zoom = wrapper.querySelector(".header-dot-menu .at-zoom select");
zoom.onchange = () => {
    const zoomLevel = parseInt(zoom.value) / 100;
    api.settings.display.scale = zoomLevel;
    api.updateSettings();
    api.render();
};

const layout = wrapper.querySelector(".header-dot-menu .at-layout select");
layout.onchange = () => {
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
};

// Player Button
const playPauseButton = document.getElementById("playPauseButton");
const playPauseIcon = document.getElementById("playPauseIcon");

// Main player controls
playPauseButton.onclick = (e) => {
    if (e.target.classList.contains("disabled")) {
        return;
    }
    api.playPause(); // Spielt oder pausiert die Musik

    // Icon wechseln
    if (api.isPlaying) {
        playPauseIcon.src = "./resources/controls/pause.png"; // Setze das Pause-Icon
        playPauseIcon.alt = "Pause"; // Alt-Text aktualisieren
    } else {
        playPauseIcon.src = "./resources/controls/play.png"; // Setze das Play-Icon
        playPauseIcon.alt = "Play"; // Alt-Text aktualisieren
    }
};

// Player-Status überwachen
api.playerStateChanged.on((e) => {
    if (e.state === alphaTab.synth.PlayerState.Playing) {
        playPauseIcon.src = "./resources/controls/pause.png"; // Setze das Pause-Icon
        playPauseIcon.alt = "Pause"; // Alt-Text aktualisieren
    } else {
        playPauseIcon.src = "./resources/controls/play.png"; // Setze das Play-Icon
        playPauseIcon.alt = "Play"; // Alt-Text aktualisieren
    }
});

// Update der "isPlaying" Status (Falls diese Logik vorhanden ist)
api.playerReady.on(() => {
    playPauseButton.classList.remove("disabled");
});

// Stop Button
const stop = wrapper.querySelector(".header .at-player-stop");
stop.onclick = (e) => {
    if (e.target.classList.contains("disabled")) {
        return;
    }
    api.stop();
    settings.player.scrollElement.scrollTop = 0;
};
api.playerReady.on(() => {
    stop.classList.remove("disabled");
});

// song position
function formatDuration(milliseconds) {
    let seconds = milliseconds / 1000;
    const minutes = (seconds / 60) | 0;
    seconds = (seconds - minutes * 60) | 0;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

const songPosition = wrapper.querySelector(".at-song-position");
let previousTime = -1;
api.playerPositionChanged.on((e) => {
    // reduce number of UI updates to second changes.
    const currentSeconds = (e.currentTime / 1000) | 0;
    if (currentSeconds == previousTime) {
        return;
    }

    songPosition.innerText = formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
});
