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
    return loadStyleOnce(
        "../../../../CSS/inventory.css",
        "inventoryStylesLoaded"
    )
    .then(() => {
        return loadScriptOnce(
        "../../../../Stations/JAVA/inventory.js",
        "inventoryScriptLoaded"
          );
    })
    .then(() => {
        return loadScriptOnce(
        "../../../../Stations/JAVA/explorer_profiles.js",
        "explorerProfilesScriptLoaded"
        );
    });
}
function loadHintScripts() {
    return loadScriptOnce(
        "../../../../Stations/JAVA/hints.js",
        "hintScriptLoaded"
    );
}
function loadStyleOnce(href, flagName) {
    if (window[flagName]) {
        return Promise.resolve();
    }

    if (window[flagName + "Promise"]) {
        return window[flagName + "Promise"];
    }

    window[flagName + "Promise"] =
        new Promise((resolve, reject) => {
            const existingStyle =
                document.querySelector(
                    `link[data-loader="${flagName}"]`
                );

            if (existingStyle) {
                /*
                 * The stylesheet may already be fully loaded.
                 */
                if (existingStyle.sheet) {
                    window[flagName] = true;
                    resolve();
                    return;
                }

                existingStyle.addEventListener(
                    "load",
                    () => {
                        window[flagName] = true;
                        resolve();
                    },
                    { once: true }
                );

                existingStyle.addEventListener(
                    "error",
                    reject,
                    { once: true }
                );

                return;
            }

            const link =
                document.createElement("link");

            link.rel = "stylesheet";
            link.href = href;
            link.dataset.loader = flagName;

            link.onload = () => {
                window[flagName] = true;
                console.log(href + " loaded.");
                resolve();
            };

            link.onerror = () => {
                console.error(href +" could not be loaded. Check the path.");
                reject(new Error("Could not load stylesheet: " + href));
            };

            document.head.appendChild(link);
        });

    return window[flagName + "Promise"];
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
                /* =========================
                   HINT SYSTEM
                   ========================= */

                .hint-overlay {
                    position: fixed;
                    inset: 0;

                    z-index: 200000;

                    display: none;

                    align-items: center;
                    justify-content: center;

                    padding: 20px;

                    background: rgba(0, 0, 0, 0.72);

                    pointer-events: auto;
                }

                .hint-overlay.open {
                    display: flex;
                }

                .hint-panel {
                    position: relative;

                    width: min(100%, 420px);

                    max-height: calc(100vh - 40px);
                    max-height: calc(100dvh - 40px);

                    overflow-y: auto;

                    background: #071b28;
                    color: white;

                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 18px;

                    padding: 26px 22px 22px;

                    box-shadow:
                        0 20px 60px rgba(0, 0, 0, 0.45);
                }

                .hint-label {
                    margin-bottom: 7px;

                    font-size: 11px;
                    font-weight: bold;

                    text-transform: uppercase;
                    letter-spacing: 0.12em;

                    color: #6cff6c;
                }

                .hint-panel h2 {
                    margin: 0 0 15px;

                    font-size: 22px;
                }

                .hint-panel p {
                    margin: 0 0 20px;

                    font-size: 16px;
                    line-height: 1.55;
                }

                .hint-close {
                    position: absolute;

                    top: 10px;
                    right: 12px;

                    width: 44px;
                    height: 44px;

                    border: none;
                    border-radius: 50%;

                    background: transparent;
                    color: white;

                    font-size: 28px;

                    cursor: pointer;
                }

                .hint-actions {
                    display: flex;
                    justify-content: flex-end;
                }

                .hint-actions button,
                .hint-confirm-actions button {
                    min-height: 44px;

                    border: none;
                    border-radius: 10px;

                    padding: 10px 16px;

                    font-size: 15px;
                    font-weight: bold;

                    cursor: pointer;
                }

                #hintNextBtn {
                    background: #6cff6c;
                    color: #071b28;
                }

                .hint-confirm-actions {
                    display: flex;
                    flex-wrap: wrap;

                    gap: 10px;
                }

                .hint-confirm-actions button {
                    flex: 1 1 160px;
                }

                #cancelSolutionBtn {
                    background: #e5e5e5;
                    color: #111;
                }

                .solution-button {
                    background: #b42318;
                    color: white;
                }


                /* Small phones */

                @media (max-width: 400px) {

                    .hint-overlay {
                        padding: 12px;
                    }

                    .hint-panel {
                        padding:
                            24px
                            18px
                            18px;

                        border-radius: 14px;
                    }

                    .hint-panel h2 {
                        font-size: 20px;
                    }

                    .hint-confirm-actions {
                        flex-direction: column;
                    }
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
                        <button id="hintBtn">💡 Hints</button>
                    </div>
                </div>
                <div
                    class="hint-overlay"
                    id="hintOverlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="hintTitle"
                >
                    <div class="hint-panel">

                        <button
                            type="button"
                            class="hint-close"
                            id="hintCloseBtn"
                            aria-label="Close hints"
                        >
                            ×
                        </button>

                        <div class="hint-label">
                            Expedition Assistance
                        </div>

                        <h2 id="hintTitle">
                            Hint
                        </h2>

                        <p id="hintText"></p>

                        <div class="hint-actions">
                            <button
                                type="button"
                                id="hintNextBtn"
                            >
                                Next hint
                            </button>
                        </div>

                    </div>
                </div>


                <div
                    class="hint-overlay"
                    id="solutionConfirmOverlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="solutionConfirmTitle"
                >
                    <div class="hint-panel hint-confirm-panel">

                        <h2 id="solutionConfirmTitle">
                            Reveal solution?
                        </h2>

                        <p>
                            This will show you the complete solution
                            to this puzzle.
                        </p>

                        <p>
                            Are you sure?
                        </p>

                        <div class="hint-confirm-actions">

                            <button
                                type="button"
                                id="cancelSolutionBtn"
                            >
                                No, give me more time
                            </button>

                            <button
                                type="button"
                                id="confirmSolutionBtn"
                                class="solution-button"
                            >
                                Yes, show solution
                            </button>

                        </div>

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
        const hintBtn = this.shadowRoot.getElementById("hintBtn");
        const hintOverlay = this.shadowRoot.getElementById("hintOverlay");
        const hintCloseBtn = this.shadowRoot.getElementById("hintCloseBtn");
        const hintTitle = this.shadowRoot.getElementById("hintTitle");
        const hintText = this.shadowRoot.getElementById("hintText");
        const hintNextBtn = this.shadowRoot.getElementById("hintNextBtn");

        const solutionConfirmOverlay = this.shadowRoot.getElementById("solutionConfirmOverlay");

        const cancelSolutionBtn =
            this.shadowRoot.getElementById(
                "cancelSolutionBtn"
            );

        const confirmSolutionBtn =
            this.shadowRoot.getElementById(
                "confirmSolutionBtn"
            );

        const backBtn = this.shadowRoot.getElementById("backBtn");
        const forwardBtn = this.shadowRoot.getElementById("forwardBtn");

        const getPreviousPage = () => this.getAttribute("previous");
        const getNextPage = () => this.getAttribute("next");

        const currentPage = window.location.pathname + window.location.search;

        let visitedPages = JSON.parse(localStorage.getItem("visitedPages")) || [];

        if (!visitedPages.includes(currentPage)) {
            visitedPages.push(currentPage);
            localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
        }

        function hasVisited(page) {
            if (!page) return false;

            const visited = JSON.parse(localStorage.getItem("visitedPages")) || [];
            const url = new URL(page, window.location.href);
            const link = url.pathname + url.search;

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
        /* =========================
           HINT SYSTEM
           ========================= */

        let activeHints = null;
        let currentHintLevel = 1;

        const getHintId = () => {
            return this.getAttribute("hint-id");
        };

        /* Which hint is currently displayed? 1 = first hint, 2 = stronger hint, 3 = solution */
        /* Storage key is different for every puzzle. */
        const getHintStorageKey = () => {
            return "hintLevel_" + getHintId();
        };

        /* Remember how far the team got. */
        function saveHintLevel(level) {
            const hintId = getHintId();

            if (!hintId) {
                return;
            }

            localStorage.setItem(
                getHintStorageKey(),
                String(level)
            );
        }


        /* Load previously reached level. */
        function loadHintLevel() {
            const hintId = getHintId();
            if (!hintId) {return 1;}

            const stored = Number(
                localStorage.getItem(
                    getHintStorageKey()
                )
            );
            if (stored >= 1 && stored <= 3) {
                return stored;
            }
            return 1;
        }


        /* Show correct text/button for the active hint level. */
        function renderHint() {
            if (!activeHints) {
                return;
            }

            if (currentHintLevel === 1) {

                hintTitle.textContent =
                    "Hint 1";

                hintText.textContent =
                    activeHints.hint1;

                hintNextBtn.textContent =
                    "Give me another hint";

                hintNextBtn.hidden = false;
            }

            else if (currentHintLevel === 2) {

                hintTitle.textContent =
                    "Hint 2";

                hintText.textContent =
                    activeHints.hint2;

                hintNextBtn.textContent =
                    "Show solution";

                hintNextBtn.hidden = false;
            }

            else {

                hintTitle.textContent =
                    "Solution";

                hintText.textContent =
                    activeHints.solution;

                hintNextBtn.textContent =
                    "Close";

                hintNextBtn.hidden = false;
            }
        }


        /* Open hint system. */
        async function openHints() {
            const hintId = getHintId();
            console.log("Hint ID:", hintId);

            try {
                await loadHintScripts();
            } catch (error) {
                console.error(
                    "Hint system could not be loaded:",
                    error
                );
                return;
            }

            if (!hintId) {
                console.warn(
                    "No hint-id set on <game-navigation>."
                );
                return;
            }

            activeHints = window.GAME_HINTS?.[hintId];

            if (!activeHints) {
                console.warn(`No hints defined for "${hintId}".`);
                return;
            }

            currentHintLevel = loadHintLevel();
            renderHint();
            hintOverlay.classList.add("open");
            hamburgerMenu.classList.remove("open");
            hamburgerBtn.classList.remove("open");
            hintCloseBtn.focus();
        }

        /* Close hint window.*/
        function closeHints() {
            hintOverlay.classList.remove("open");
        }


        /* Hint button in hamburger menu. */
        hintBtn.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                openHints();
            }
        );

        /* Close X */
        hintCloseBtn.addEventListener(
            "click",
            closeHints
        );

        /* NEXT HINT / SOLUTION */
        hintNextBtn.addEventListener(
            "click",
            () => {

                /* Hint 1 -> Hint 2 */
                if (currentHintLevel === 1) {
                    currentHintLevel = 2;
                    saveHintLevel(2);
                    renderHint();
                    return;
                }

                /* Hint 2 -> ask before solution. */
                if (currentHintLevel === 2) {
                    solutionConfirmOverlay.classList.add("open");
                    confirmSolutionBtn.focus();
                    return;
                }

                /* Solution -> close. */
                if (currentHintLevel === 3) {closeHints();}
            }
        );

        /* User says NO to solution. */
        cancelSolutionBtn.addEventListener(
            "click",
            () => {
                solutionConfirmOverlay.classList.remove("open");
                hintNextBtn.focus();
            }
        );

        /* User confirms solution. */
        confirmSolutionBtn.addEventListener(
            "click",
            () => {
                solutionConfirmOverlay.classList.remove("open");
                currentHintLevel = 3;
                saveHintLevel(3);
                renderHint();
                hintNextBtn.focus();
            }
        );
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