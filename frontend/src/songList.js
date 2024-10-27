let allSongs = [];

// Fetch the list of songs from the server
async function fetchAllSongs() {
    const response = await fetch("http://localhost:5000/list-songs");
    if (response.ok) {
        allSongs = await response.json();
    } else {
        console.error("Failed to fetch song list");
    }
}

// Delete a song from the server
function deleteSong(filename) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
        fetch("http://127.0.0.1:5000/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    fetchAllSongs();
                } else if (data.error) {
                    console.error(data.error);
                }
            })
            .catch((error) => {
                console.error("Error deleting the song:", error);
            });
    }
}

// Display the list of songs in the sidebar
async function displaySidbarSongList() {
    const songList = document.getElementById("song-list-sidebar");
    songList.innerHTML = "";
    allSongs.forEach((song) => {
        const li = document.createElement("li");
        li.classList.add("song-item-sidebar");
        li.innerHTML = song.name;
        li.setAttribute("data-file", song.path);
        li.setAttribute("style", "cursor: pointer;");
        songList.appendChild(li);
        if (settings.file === song.path) {
            li.setAttribute("style", "cursor: pointer; border-right: 3px solid #85beff;");
        }
    });
}

// Display the list of songs on the main page
async function displayMainPageSongList() {
    const songList = document.getElementById("song-list-start-page");
    songList.innerHTML = "";
    allSongs.forEach((song) => {
        const li = document.createElement("li");
        li.classList.add("song-item");
        li.setAttribute("data-file", song.path);
        li.innerHTML = song.name;

        // Delete button (with trash icon)
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = "🗑️"; // Unicode trash icon
        deleteBtn.onclick = () => deleteSong(song.name); // Hook up the delete function

        li.appendChild(deleteBtn);
        songList.appendChild(li);
    });
}

// Handle song selection in the sidebar
const songList = document.getElementById("song-list-sidebar");
songList.addEventListener("click", async (e) => {
    e.preventDefault();
    const file = e.target.getAttribute("data-file");
    if (file) {
        loadSong(file);
        closeAllPanels();
    }
});

// Handle song selection on the start page
const songListStartPage = document.getElementById("song-list-start-page");
songListStartPage.addEventListener("click", async (e) => {
    e.preventDefault();
    const file = e.target.getAttribute("data-file");
    if (file) {
        loadSong(file);
        closeAllPanels();
    }
});

// Handle file upload upon selection in the sidebar
const uploadForm = document.getElementById("upload-form");
uploadForm.addEventListener("change", async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            console.log("File uploaded successfully");
            displaySidbarSongList();
        } else {
            console.error("Upload failed");
        }
    }
});

// Handle file upload upon selection on the start page
const uploadFormStartPage = document.getElementById("upload-form-start-page");
uploadFormStartPage.addEventListener("change", async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            console.log("File uploaded successfully");
            displaySidbarSongList();
        } else {
            console.error("Upload failed");
        }
    }
});

// Add event listeners for delete buttons
document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
        const filename = this.getAttribute("data-filename");
        deleteSong(filename);
    });
});

async function displaySongLists() {
    await fetchAllSongs();
    displayMainPageSongList();
    displaySidbarSongList();
}

displaySongLists();
