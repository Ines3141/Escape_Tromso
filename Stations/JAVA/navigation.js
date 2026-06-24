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
                    position: absolute;
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
                }

                .menu {
                    display: none;
                    display: none;
                    position: relative;
                    z-index: 100001;
                    margin-top: 10px;
                    background: white;
                    border-radius: 12px;
                    padding: 10px;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.25);
                    flex-direction: column;
                    gap: 8px;
                    min-width: 150px;
                }

                .menu.open {
                    display: flex;
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
                <div class="top-left">
                    <button class="icon-btn" id="settingsBtn">⚙</button>

                    <div class="menu" id="settingsMenu">
                        <label for="volumeSlider">Volume</label>
                        <input id="volumeSlider" type="range" min="0" max="1" step="0.1" value="1">
                        <button id="locationBtn">Show location</button>
                    </div>
                </div>

                <div class="top-right">
                    <button class="icon-btn" id="hamburgerBtn">☰</button>

                    <div class="menu" id="hamburgerMenu">
                        <button id="inventoryBtn">Inventory</button>
                        <button id="inboxBtn">Inbox</button>
                        <button id="profileBtn">Profile</button>
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
        const inboxBtn = this.shadowRoot.getElementById("inboxBtn");
        const profileBtn = this.shadowRoot.getElementById("profileBtn");

        const backBtn = this.shadowRoot.getElementById("backBtn");
        const forwardBtn = this.shadowRoot.getElementById("forwardBtn");

        const previousPage = this.getAttribute("previous");
        const nextPage = this.getAttribute("next");

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
            backBtn.disabled = !previousPage;
            forwardBtn.disabled = !nextPage || !hasVisited(nextPage);
        }

        settingsBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            settingsMenu.classList.toggle("open");
            hamburgerMenu.classList.remove("open");
        });

        hamburgerBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            hamburgerMenu.classList.toggle("open");
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
            hamburgerMenu.classList.remove("open");
        });

        volumeSlider.addEventListener("input", () => {
            document.querySelectorAll("audio").forEach(audio => {
                audio.volume = volumeSlider.value;
            });
        });

        locationBtn.addEventListener("click", () => {
            window.open("https://www.google.com/maps/search/Tromsø+Harbour");
        });

        inventoryBtn.addEventListener("click", () => {
            alert("Inventory will open here.");
        });

        inboxBtn.addEventListener("click", () => {
            openInbox();
        });

        profileBtn.addEventListener("click", () => {
            if (typeof openProfile === "function") {
                openProfile();
            }
        });

        backBtn.addEventListener("click", () => {
            if (previousPage) {
                window.location.href = previousPage;
            }
        });

        forwardBtn.addEventListener("click", () => {
            if (nextPage && hasVisited(nextPage)) {
                window.location.href = nextPage;
            }
        });

        updateButtons();
        function getInboxLetters() {
            return JSON.parse(localStorage.getItem("inboxLetters")) || [];
        }

        function hasUnreadLetters() {
            return getInboxLetters().some(letter => !letter.read);
        }
        function openInbox() {
            let inbox = getInboxLetters();

            let overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.inset = "0";
            overlay.style.zIndex = "100000";
            overlay.style.background = "rgba(2, 8, 18, 0.95)";
            overlay.style.display = "flex";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            overlay.style.padding = "20px";

            let card = document.createElement("div");
            card.style.background = "#f5efe0";
            card.style.color = "#2b2418";
            card.style.borderRadius = "18px";
            card.style.padding = "24px";
            card.style.maxWidth = "650px";
            card.style.width = "100%";
            card.style.maxHeight = "80vh";
            card.style.overflowY = "auto";

            function showInboxList() {
                card.innerHTML = `
                    <button id="closeInbox"
                    style="
                        display:flex;
                        float:right;
                        border:none;
                        border-radius:50%;
                        width:36px;
                        height:36px;
                        background:#111;
                        color:white;
                        font-size:22px;
                        cursor:pointer;
                        justify-content: center;
                        align-items: center;
                    ">
                        ×
                    </button>
                    <h2>📨 Inbox</h2>
                `;

                if (inbox.length === 0) {
                    card.innerHTML += `<p>No letters yet.</p>`;
                } else {
                    inbox.forEach((letter, index) => {
                        card.innerHTML += `
                            <div
                                style="
                                margin:14px 0;
                                padding:14px;
                                border-radius:12px;
                                background:${letter.read ? "rgba(0,0,0,0.06)" : "rgba(255,0,0,0.12)"};
                                border:${letter.read ? "none" : "2px solid red"};
                            ">
                            <h3>${letter.read ? "" : "🔴 "}${letter.title}</h3>
                            <p style="color:#2b2418;">
                                <strong>From:</strong> ${letter.from}
                            </p>

                            <button data-index="${index}" class="readLetterBtn" style="
                                border:none;
                                border-radius:10px;
                                padding:10px 14px;
                                background:#111;
                                color:white;
                                cursor:pointer;
                            ">
                                Read letter
                            </button>
                            </div>
                        `;
                    });
                }

                card.querySelector("#closeInbox").addEventListener("click", () => {
                    overlay.remove();
                });

                card.querySelectorAll(".readLetterBtn").forEach(button => {
                    button.addEventListener("click", () => {
                        const index = button.dataset.index;
                        showLetter(index);
                    });
                });
            }

            function showLetter(index) {
                inbox[index].read = true;
                localStorage.setItem("inboxLetters", JSON.stringify(inbox));

                card.innerHTML = `
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:20px;
                    ">
                        <button id="backToInbox" style="
                            border:none;
                            border-radius:10px;
                            padding:10px 14px;
                            background:#111;
                            color:white;
                            cursor:pointer;
                        ">
                            ← Inbox
                        </button>

                        <button id="closeInbox" style="
                            display:flex;
                            border:none;
                            border-radius:50%;
                            width:40px;
                            height:40px;
                            background:#111;
                            color:white;
                            font-size:20px;
                            cursor:pointer;
                            justify-content: center;
                            align-items: center;
                        ">
                            ✕
                        </button>
                    </div>

                    <style>
                        ${getLetterStyles()}
                    </style>

                    ${renderLetterHTML(inbox[index])}
                `;

                startMorseLamps(card);

                card.querySelector("#closeInbox").addEventListener("click", () => {
                    overlay.remove();
                });

                card.querySelector("#backToInbox").addEventListener("click", () => {
                    showInboxList();
                });
            }

            overlay.appendChild(card);
            document.body.appendChild(overlay);

            showInboxList();
        }
    }
}

customElements.define("game-navigation", GameNavigation);