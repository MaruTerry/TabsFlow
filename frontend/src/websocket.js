const activateSocketControl = false;

const socket = new WebSocket("ws://localhost:4200");

socket.onopen = function (event) {
    console.log("WebSocket connection established.");
};

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received data:", data);
    if (!activateSocketControl) {
        return;
    }
    switch (data.control) {
        case "playPause":
            togglePlayPause();
            break;
        case "stopSong":
            stopSong();
            break;
        case "countIn":
            toggleCountIn();
            break;
        case "metronome":
            toggleMetronome();
            break;
        case "loop":
            toggleLoop();
            break;
        case "print":
            printSong();
            break;
        default:
            console.log("Unknown control type:", data.control);
    }
};

socket.onerror = function (error) {
    console.error("WebSocket Error: ", error);
};

socket.onclose = function (event) {
    console.log("WebSocket connection closed.");
};
