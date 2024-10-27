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

// Load a song
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
