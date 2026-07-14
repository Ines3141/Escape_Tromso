function loadScriptOnce(src, flagName) {
    if (window[flagName]) {
        return Promise.resolve();
    }

    if (window[flagName + "Promise"]) {
        return window[flagName + "Promise"];
    }

    window[flagName + "Promise"] = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[data-loader="${flagName}"]`);

        if (existingScript) {
            existingScript.addEventListener("load", resolve);
            existingScript.addEventListener("error", reject);
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.dataset.loader = flagName;

        script.onload = () => {
            window[flagName] = true;
            console.log(src + " loaded.");
            resolve();
        };

        script.onerror = () => {
            console.error(src + " could not be loaded. Check the path.");
            reject();
        };

        document.head.appendChild(script);
    });

    return window[flagName + "Promise"];
}

function loadInventoryScripts() {
    return loadScriptOnce("../../../../Stations/JAVA/inventory.js", "inventoryScriptLoaded")
        .then(() => {
            return loadScriptOnce("../../../../Stations/JAVA/explorer_profiles.js", "explorerProfilesScriptLoaded");
        });
}

loadInventoryScripts();
class GameNavigation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                .nav {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                }

                .top-left,
                .top-right,
                .bottom-nav {
                    pointer-events: auto;
                }

                .top-left {
                    position: absolute;
                    top: 18px;
                    left: 18px;
                }

                // .top-right {
                //     position: absolute;
                //     top: 18px;
                //     right: 18px;
                // }

                .top-right {
                    position: fixed;
                    top: 18px;
                    right: 18px;
                }


                .icon-btn {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: none;
                    background: #111;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    transition: transform 0.25s ease, border-radius 0.25s ease;
                }

                .menu {
                    position: absolute;
                    top: 58px;
                    left: 0;
                    z-index: 100001;

                    background: white;
                    border-radius: 14px;
                    padding: 10px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.25);

                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    min-width: 150px;

                    opacity: 0;
                    transform: translateY(-8px) scale(0.96);
                    pointer-events: none;

                    transition: opacity 0.22s ease, transform 0.22s ease;
                }

                #hamburgerMenu {
                    left: 0;
                    right: auto;
                }

                #settingsMenu {
                    right: 0;
                    left: auto;
                }

                .icon-btn:hover {
                    transform: scale(1.06);
                }

                #hamburgerBtn.open {
                    border-radius: 14px;
                    transform: rotate(90deg);
                }

                #settingsBtn {
                    transition: transform 0.35s ease;
                }

                #settingsBtn:hover {
                    transform: rotate(45deg) scale(1.06);
                }

                #settingsBtn.open {
                    transform: rotate(90deg);
                }

                .menu.open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: auto;
                }

                .menu button,
                .menu input {
                    width: 100%;
                }

                .menu button {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    background: #eee;
                    cursor: pointer;
                    text-align: left;
                }

                .menu label {
                    color: #111;
                    font-size: 14px;
                    margin-bottom: 4px;
                }

                .bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 10000;

                    height: 72px;

                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 16px;

                    background: #111;
                    border-top: 1px solid #333;
                }

                .move-btn {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: none;
                    background: #222;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }

                .move-btn:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }
            </style>

            <div class="nav">
                <div class="top-right">
                    <button class="icon-btn" id="settingsBtn">⚙</button>

                    <div class="menu" id="settingsMenu">
                        <label for="volumeSlider">Volume</label>
                        <input id="volumeSlider" type="range" min="0" max="1" step="0.1" value="1">
                        <button id="locationBtn">Show location</button>
                    </div>
                </div>

                <div class="top-left">
                    <button class="icon-btn" id="hamburgerBtn">☰</button>

                    <div class="menu" id="hamburgerMenu">
                        <button id="inventoryBtn">Inventory</button>
                    </div>
                </div>

                <div class="bottom-nav">
                    <button class="move-btn" id="backBtn">←</button>
                    <button class="move-btn" id="forwardBtn">→</button>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        const settingsBtn = this.shadowRoot.getElementById("settingsBtn");
        const settingsMenu = this.shadowRoot.getElementById("settingsMenu");

        const hamburgerBtn = this.shadowRoot.getElementById("hamburgerBtn");
        const hamburgerMenu = this.shadowRoot.getElementById("hamburgerMenu");

        const volumeSlider = this.shadowRoot.getElementById("volumeSlider");
        const locationBtn = this.shadowRoot.getElementById("locationBtn");

        const inventoryBtn = this.shadowRoot.getElementById("inventoryBtn");

        const backBtn = this.shadowRoot.getElementById("backBtn");
        const forwardBtn = this.shadowRoot.getElementById("forwardBtn");

        const getPreviousPage = () => this.getAttribute("previous");
        const getNextPage = () => this.getAttribute("next");

        const currentPage = window.location.pathname;

        let visitedPages = JSON.parse(localStorage.getItem("visitedPages")) || [];

        if (!visitedPages.includes(currentPage)) {
            visitedPages.push(currentPage);
            localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
        }

        function hasVisited(page) {
            if (!page) return false;

            const visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
            const link = new URL(page, window.location.href).pathname;

            return visited.includes(link);
        }
        function updateButtons() {
            const previousPage = getPreviousPage();
            const nextPage = getNextPage();

            backBtn.disabled = !previousPage;
            forwardBtn.disabled = !nextPage || !hasVisited(nextPage);
        }
        this.updateButtons = updateButtons;

        settingsBtn.addEventListener("click", (event) => {
            event.stopPropagation();

            settingsMenu.classList.toggle("open");
            settingsBtn.classList.toggle("open");

            hamburgerMenu.classList.remove("open");
            hamburgerBtn.classList.remove("open");
        });

        hamburgerBtn.addEventListener("click", (event) => {
            event.stopPropagation();

            hamburgerMenu.classList.toggle("open");
            hamburgerBtn.classList.toggle("open");

            settingsMenu.classList.remove("open");
        });

        settingsMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        hamburgerMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        document.addEventListener("click", () => {
            settingsMenu.classList.remove("open");
            settingsBtn.classList.remove("open");

            hamburgerMenu.classList.remove("open");
            hamburgerBtn.classList.remove("open");
        });

        volumeSlider.addEventListener("input", () => {
            document.querySelectorAll("audio").forEach(audio => {
                audio.volume = volumeSlider.value;
            });
        });

        locationBtn.addEventListener("click", () => {
            window.open("https://www.google.com/maps/search/Tromsø+Harbour");
        });

        /* Opens the inventory.js file */
        inventoryBtn.addEventListener("click", () => {
            loadInventoryScripts().then(() => {
                openInventory();
            });
        });

        backBtn.addEventListener("click", () => {
            const previousPage = getPreviousPage();

            if (previousPage) {
                window.location.href = previousPage;
            }
        });

        forwardBtn.addEventListener("click", () => {
            const nextPage = getNextPage();

            if (nextPage && hasVisited(nextPage)) {
                window.location.href = nextPage;
            }
        });
        updateButtons();
    }
}
function setupGameNavigation() {
    /* Every page should have on the top the next/previous page defined.
       One has only to add 
       <game-navigation></game-navigation>
       <script>
            setupGameNavigation();
       </script>
    */
    const gameNav = document.querySelector("game-navigation");
    if (!gameNav) return;
    gameNav.setAttribute("previous", previousPage);
    gameNav.setAttribute("next", nextPage);
    if (typeof gameNav.updateButtons === "function") {
        gameNav.updateButtons();
    }
}
customElements.define("game-navigation", GameNavigation);