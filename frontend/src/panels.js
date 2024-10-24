document.addEventListener("DOMContentLoaded", async () => {
    const header = document.getElementById("header");
    const sidebar = document.getElementById("sidebar");
    const dotMenu = document.getElementById("header-dot-menu");
    const toggleSidebarButton = document.getElementById("toggleSidebar");
    const closeSidebarButton = document.getElementById("closeSidebar");
    const toggleDotMenuButton = document.getElementById("toggleDotMenu");
    let isSidebarOpen = false;
    let isDotMenuOpen = false;

    // Show header when user moves to the top, unless sidebar is open
    document.addEventListener("mousemove", (e) => {
        if (!isSidebarOpen && !isDotMenuOpen && e.clientY < 60 && settings.file) {
            header.style.top = "0";
            header.style.opacity = "1";
        } else if (!isSidebarOpen && !isDotMenuOpen) {
            header.style.top = "-60px";
            header.style.opacity = "0";
        }
    });

    toggleSidebarButton.addEventListener("click", () => {
        isSidebarOpen = !isSidebarOpen;
        sidebar.classList.toggle("sidebar-open");
        toggleSidebarButton.classList.toggle("sidebar-open");
        if (isSidebarOpen || isDotMenuOpen) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    });

    closeSidebarButton.addEventListener("click", (e) => {
        isSidebarOpen = false;
        closeAllPanels();
    });

    toggleDotMenuButton.addEventListener("click", () => {
        isDotMenuOpen = !isDotMenuOpen;
        dotMenu.classList.toggle("dot-menu-open");
        toggleDotMenuButton.classList.toggle("dot-menu-open");
        if (isDotMenuOpen || isSidebarOpen) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    });

    // Close panels when clicked anywhere on the page
    document.addEventListener("click", (e) => {
        const isHeader = header.contains(e.target);
        const isSidebar = sidebar.contains(e.target);
        const isDotMenu = dotMenu.contains(e.target);
        if (!isHeader && !isSidebar && !isDotMenu) {
            closeAllPanels();
        }
    });

    // Home Button
    const home = wrapper.querySelector(".header-dot-menu .at-home");
    home.onclick = (e) => {
        overlay.style.display = "none";
        content.style.display = "none";
        startContent.style.display = "flex";
        settings.file = undefined;
        closeAllPanels();
        displaySidbarSongList();
    };

    // Handle song selection
    const songList = document.getElementById("song-list-sidebar");
    songList.addEventListener("click", async (e) => {
        e.preventDefault();
        const file = e.target.getAttribute("data-file");
        if (file) {
            loadSong(file);
            closeAllPanels();
        }
    });

    // Handle song selection
    const songListStartPage = document.getElementById("song-list-start-page");
    songListStartPage.addEventListener("click", async (e) => {
        e.preventDefault();
        const file = e.target.getAttribute("data-file");
        if (file) {
            loadSong(file);
            closeAllPanels();
        }
    });

    // Handle file upload automatically upon selection
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

    // Handle file upload automatically upon selection on the start page
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

    function closeAllPanels() {
        sidebar.classList.remove("sidebar-open");
        toggleSidebarButton.classList.remove("sidebar-open");
        dotMenu.classList.remove("dot-menu-open");
        toggleDotMenuButton.classList.remove("dot-menu-open");
        header.classList.remove("sticky");
        header.style.top = "-60px";
        isSidebarOpen = false;
        isDotMenuOpen = false;
    }
});
