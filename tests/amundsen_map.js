const ZOOM_MS = 520;
const pins = document.querySelectorAll(".pin");

pins.forEach(pin => {
    pin.addEventListener("click", () => {
        const targetMap = document.getElementById(pin.dataset.map);
        const activeMap = document.querySelector(".map.active");
        // If no active map or no target, nothing to do
        if (!activeMap || !targetMap || activeMap === targetMap) return;

        // Play zoom animation on the active (world) map, then swap
        activeMap.classList.add("zooming");
        setTimeout(() => {
            activeMap.classList.remove("zooming");
            activeMap.classList.remove("active");
            targetMap.classList.add("active");
        }, ZOOM_MS);
    });
});

document.querySelectorAll(".back-btn").forEach(button => {
    button.addEventListener("click", () => {
        const activeMap = document.querySelector(".map.active");
        const worldMap = document.getElementById("worldMap");
        if (!activeMap || !worldMap || activeMap === worldMap) return;

        // Zoom the detail map out, then show the world map
        activeMap.classList.add("zooming");
        setTimeout(() => {
            activeMap.classList.remove("zooming");
            activeMap.classList.remove("active");
            worldMap.classList.add("active");
        }, ZOOM_MS);
    });
});

// No automatic zoom on load; maps controlled by user interaction