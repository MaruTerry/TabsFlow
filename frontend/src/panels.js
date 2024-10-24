document.addEventListener("DOMContentLoaded", async () => {
    const header = document.getElementById("header");
    const sidebar = document.getElementById("sidebar");
    const dotMenu = document.getElementById("header-dot-menu");
    const toggleSidebar = document.getElementById("toggleSidebar");
    const closeSidebar = document.getElementById("closeSidebar");
    let isSidebarOpen = false;
    const toggleDotMenu = document.getElementById("toggleDotMenu");
    let isDotMenuOpen = false;

    // Show header when user moves to the top, unless sidebar is open
    document.addEventListener("mousemove", (e) => {
        if (!isSidebarOpen && e.clientY < 60 && settings.file) {
            header.style.top = "0";
        } else if (!isSidebarOpen) {
            header.style.top = "-60px";
        }
    });

    toggleSidebar.addEventListener("click", () => {
        isSidebarOpen = !isSidebarOpen;
        sidebar.classList.toggle("sidebar-open");
        toggleSidebar.classList.toggle("sidebar-open");
        if (isSidebarOpen) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    });

    closeSidebar.addEventListener("click", (e) => {
        isSidebarOpen = false;
        sidebar.classList.remove("sidebar-open");
        toggleSidebar.classList.remove("sidebar-open");
        header.classList.remove("sticky");
        // Close header
        header.style.top = "-60px";
    });

    toggleDotMenu.addEventListener("click", () => {
        isDotMenuOpen = !isDotMenuOpen;
        sidebar.classList.toggle("dot-menu-open");
        toggleDotMenu.classList.toggle("dot-menu-open");
        if (isDotMenuOpen) {
            dotMenu.style.opacity = "1";
            header.classList.add("sticky");
        } else {
            dotMenu.style.opacity = "0";
            header.classList.remove("sticky");
        }
    });

    // Close panels when clicked anywhere on the page
    document.addEventListener("click", (e) => {
        const isHeader = header.contains(e.target);
        const isSidebar = sidebar.contains(e.target);
        const isDotMenu = dotMenu.contains(e.target);
        if (!isHeader && !isSidebar && !isDotMenu) {
            // Close panels
            dotMenu.style.opacity = "0";
            sidebar.classList.remove("sidebar-open");
            toggleSidebar.classList.remove("sidebar-open");
            toggleDotMenu.classList.remove("dot-menu-open");
            header.classList.remove("sticky");
            header.style.top = "-60px";
            isSidebarOpen = false;
            isDotMenuOpen = false;
        }
    });

    // Home Button
    const home = wrapper.querySelector(".header-dot-menu .at-home");
    home.onclick = (e) => {
        overlay.style.display = "none";
        content.style.display = "none";
        startContent.style.display = "flex";
        settings.file = undefined;

        // Close panels
        dotMenu.style.opacity = "0";
        sidebar.classList.remove("sidebar-open");
        toggleSidebar.classList.remove("sidebar-open");
        toggleDotMenu.classList.remove("dot-menu-open");
        header.classList.remove("sticky");
        header.style.top = "-60px";
        isSidebarOpen = false;
        isDotMenuOpen = false;

        displaySidbarSongList();
    };

    // Handle song selection
    const songList = document.getElementById("song-list-sidebar");
    songList.addEventListener("click", async (e) => {
        e.preventDefault();
        const file = e.target.getAttribute("data-file");
        if (file) {
            loadSong(file);
            // Close sidebar
            dotMenu.style.opacity = "0";
            sidebar.classList.remove("sidebar-open");
            toggleSidebar.classList.remove("sidebar-open");
            toggleDotMenu.classList.remove("dot-menu-open");
            header.classList.remove("sticky");
            isSidebarOpen = false;
            // Close header
            header.style.top = "-60px";
        }
    });

    // Handle song selection
    const songListStartPage = document.getElementById("song-list-start-page");
    songListStartPage.addEventListener("click", async (e) => {
        e.preventDefault();
        const file = e.target.getAttribute("data-file");
        if (file) {
            loadSong(file);
            // Close sidebar
            dotMenu.style.opacity = "0";
            sidebar.classList.remove("sidebar-open");
            toggleSidebar.classList.remove("sidebar-open");
            toggleDotMenu.classList.remove("dot-menu-open");
            header.classList.remove("sticky");
            isSidebarOpen = false;
            // Close header
            header.style.top = "-60px";
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
});
