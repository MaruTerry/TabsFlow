const socket = new WebSocket("ws://localhost:4200");

socket.onopen = function (event) {
    console.log("WebSocket connection established.");
};

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received data:", data);
};

socket.onerror = function (error) {
    console.error("WebSocket Error: ", error);
};

socket.onclose = function (event) {
    console.log("WebSocket connection closed.");
};
