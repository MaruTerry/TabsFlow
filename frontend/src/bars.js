document.addEventListener("DOMContentLoaded", async () => {
    const header = document.getElementById("header");
    const sidebar = document.getElementById("sidebar");
    const toggleSidebar = document.getElementById("toggleSidebar");
    const closeSidebar = document.getElementById("closeSidebar");

    let isSidebarOpen = false;

    // Toggle sidebar visibility
    toggleSidebar.addEventListener("click", () => {
        isSidebarOpen = !isSidebarOpen;
        sidebar.classList.toggle("sidebar-open");
        if (isSidebarOpen) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
            checkHeaderHover(); // Ensure header behaves correctly
        }
    });

    // Close sidebar
    closeSidebar.addEventListener("click", () => {
        isSidebarOpen = false;
        sidebar.classList.remove("sidebar-open");
        header.classList.remove("sticky");
        checkHeaderHover(); // Ensure header behaves correctly
    });

    // Show header when user moves to the top, unless sidebar is open
    function checkHeaderHover() {
        document.addEventListener("mousemove", (e) => {
            if (!isSidebarOpen && e.clientY < 50) {
                header.style.top = "0";
            } else if (!isSidebarOpen) {
                header.style.top = "-60px";
            }
        });
    }

    checkHeaderHover(); // Ensure the hover effect is initially active

    const songList = document.getElementById("song-list");

    const updateSongList = async () => {
        const response = await fetch("http://localhost:5000/list-songs"); // Backend-Ressource, die die Liste der Tracks zurückgibt
        if (response.ok) {
            const songs = await response.json();
            songList.innerHTML = ""; // Leert das Dropdown-Menü
            songs.forEach((song) => {
                const li = document.createElement("li");
                li.innerText = song.name; // Dateiname`;
                li.setAttribute("data-file", song.path); // Pfad zur .gp Datei
                songList.appendChild(li);
            });
        } else {
            console.error("Failed to fetch song list");
        }
    };

    // Initial song list fetch
    updateSongList();

    // Handle song selection
    songList.addEventListener("click", (e) => {
        e.preventDefault();
        const songFile = e.target.getAttribute("data-file");
        console.log("Selected song:", songFile);
        loadSong(songFile);
        isSidebarOpen = false;
        sidebar.classList.remove("sidebar-open");
        header.classList.remove("sticky");
        checkHeaderHover();
    });

    // Handle file upload automatically upon selection
    const fileInput = document.getElementById("file-input");
    fileInput.addEventListener("change", async (e) => {
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
                await updateSongList();
            } else {
                console.error("Upload failed");
            }
        }
    });
});

// Funktion zum Laden des Songs
function loadSong(file) {
    settings.file = file;
    if (api.isPlaying) {
        api.stop();
    }
    api.load(file);
}
