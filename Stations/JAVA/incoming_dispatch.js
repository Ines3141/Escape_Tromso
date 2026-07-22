class IncomingDispatch extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const letterId = this.getAttribute("letter-id");
        const title = this.getAttribute("title") || "Incoming Dispatch";
        const from = this.getAttribute("from") || "Dispatch Control";
        const nextPage = this.getAttribute("next") || "#";

        const teamName = localStorage.getItem("teamName") || "XY";
        window.LETTERS = window.LETTERS || {
            "amundsen-dispatch": {
                title: "Dispatch from Roald Amundsen",
                from: "Roald Amundsen",
                content: `
                    <p>Explorer,</p>

                    <p>
                        Thank you for your help. The safety depot has been located
                        and the crew now has supplies to continue their journey.
                    </p>

                    <p>
                        The next clue awaits with <strong>Henry Rudi</strong>.
                    </p>

                    <div class="coordinates">
                        <strong>Safety Depot Coordinates</strong><br>
                        78°13'N, 15°38'E
                    </div>

                    <div class="coordinates">
                        <strong>Next Mission</strong><br>
                        📍 Henry Rudi (Olhallen)
                    </div>

                    <button class="letter-action" onclick="window.location.href='https://www.google.com/maps/search/Olhallen'">
                        Open in Google Maps
                    </button>
                    <p>— Roald Amundsen</p>
                `
            }, 
            "nansen-ice-dispatch": {
                title: "Ice Route Calculation",
                from: "Dispatch Control",
                content: `
                <p> Hello Team ${teamName},</p>
                <p>
                    Greenland and Nobel Peace. What does this give together?
                </p>
                <p>
                    Not sure? Enter the two years and solve the route code.
                </p>
                <div class="year-lock" data-lock-id="nansenIceLock">
                    <div class="lock-row">
                        <input class="lock-cell year-a" maxlength="1">
                        <input class="lock-cell year-a" maxlength="1">
                        <input class="lock-cell year-a" maxlength="1">
                        <input class="lock-cell year-a" maxlength="1">
                    </div>

                    <div class="lock-row">
                        <input class="lock-cell year-b" maxlength="1">
                        <input class="lock-cell year-b" maxlength="1">
                        <input class="lock-cell year-b" maxlength="1">
                        <input class="lock-cell year-b" maxlength="1">
                    </div>

                    <div class="lock-row">
                        <span class="lock-symbol">+</span>
                        <span class="lock-symbol">−</span>
                        <span class="lock-symbol">+</span>
                        <span class="lock-symbol">−</span>
                    </div>

                    <div class="lock-row">
                        <span class="lock-symbol">1</span>
                        <span class="lock-symbol">2</span>
                        <span class="lock-symbol">1</span>
                        <span class="lock-symbol">6</span>
                    </div>
                    <hr>

                    <div class="lock-row">
                        <input class="lock-result result" maxlength="2">
                        <input class="lock-result result" maxlength="2">
                        <input class="lock-result result" maxlength="2">
                        <input class="lock-result result" maxlength="2">
                    </div>

                    <button class="lock-check-btn">Check numbers</button>
                    <p class="lock-message"></p>
                </div>

                <p>
                    Try to connect the numbers with letters.
                </p>

                <p>— Dispatch Control</p>
                `
            }
        };

        const letter = window.LETTERS[letterId];

        if (!letter) {
            this.shadowRoot.innerHTML = `<p>Letter not found.</p>`;
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                ${getLetterStyles()}
                .dispatch-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    background: radial-gradient(circle at top, #123b63, #020812 75%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                .dispatch-overlay.closed {
                    display: none;
                }

                .dispatch-card {
                    max-width: 650px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto; /* It is possible to scroll in y direction */
                    overflow-x: hidden;
                    text-align: center;
                    color: white;
                }

                .close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    border: none;
                    border-radius: 50%;
                    width: 46px;
                    height: 46px;
                    background: #111;
                    color: white;
                    font-size: 26px;
                    cursor: pointer;
                    justify-content: center;
                    align-items: center;
                }

                .envelope {
                    font-size: 64px;
                    margin: 24px 0;
                    animation: dropEnvelope 1.4s ease-out forwards, wiggle 1.5s 1.4s infinite;
                }

                @keyframes dropEnvelope {
                    from {
                        transform: translateY(-180px);
                        opacity: 0;
                    }

                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes wiggle {
                    0%, 100% {
                        transform: rotate(0deg);
                    }

                    25% {
                        transform: rotate(-4deg);
                    }

                    75% {
                        transform: rotate(4deg);
                    }
                }
                .open-letter-btn,
                .continue-btn {
                    border: none;
                    border-radius: 14px;
                    padding: 12px 20px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 12px;
                }

                .open-letter-btn {
                    background: #f7d046;
                    color: #082033;
                }

                .continue-btn {
                    background: #111;
                    color: white;
                }

                .letter {
                    display: none;
                    margin-top: 24px;
                    padding: 24px;
                    background: #f5efe0;
                    color: #2b2418;
                    border-radius: 16px;
                    text-align: left;
                    transform-origin: top;
                }

                .letter.open {
                    display: block;
                    animation: unfold 0.8s ease-out forwards;
                }

                .letter p,
                .letter h3 {
                    color: #2b2418;
                }

                .letter p {
                    line-height: 1.5;
                }

                @keyframes unfold {
                    from {
                        transform: scaleY(0);
                        opacity: 0;
                    }

                    to {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                }
                /* Roald Amundsen Letter */
                .coordinates {
                    margin: 15px 0;
                    padding: 12px;
                    border-radius: 10px;
                    background: rgba(0,0,0,0.08);
                }

                .letter-action {
                    display: block;
                    margin: 14px auto;
                    padding: 12px 18px;
                    border: none;
                    border-radius: 12px;
                    background: #111;
                    color: white !important;
                    font-weight: bold;
                    cursor: pointer;
                }
            </style>

            <div class="dispatch-overlay" id="overlay">
                <button class="close-btn" id="closeBtn">×</button>

                <div class="dispatch-card">
                    <h2>📡 ${title}</h2>
                    <div class="envelope">✉️</div>

                    <button class="open-letter-btn" id="openBtn">
                        Open Dispatch
                    </button>

                    <div class="letter" id="letter">
                        ${renderLetterHTML(letter)}

                        <button class="continue-btn" id="continueBtn">
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById("openBtn").addEventListener("click", () => {
            this.openLetter(letterId, letter);
            setupYearLocks(this.shadowRoot);
        });

        this.shadowRoot.getElementById("continueBtn").addEventListener("click", () => {
            if (nextPage && nextPage !== "#") {
                window.location.href = nextPage;
            } else {
                this.shadowRoot.getElementById("overlay").classList.add("closed");
            }
        });

        this.shadowRoot.getElementById("closeBtn").addEventListener("click", () => {
            if (nextPage && nextPage !== "#") {
                window.location.href = nextPage;
            } else {
                this.shadowRoot.getElementById("overlay").classList.add("closed");
            }
        });
    }

    openLetter(letterId, letter) {
        this.shadowRoot.getElementById("letter").classList.add("open");

        let inbox = JSON.parse(localStorage.getItem("inboxLetters")) || [];

        const alreadyExists = inbox.some(item => item.id === letterId);

        if (!alreadyExists) {
            inbox.push({
                id: letterId,
                title: letter.title,
                from: letter.from,
                content: letter.content,
                /* hasLamp: letter.hasLamp || false, DONT NEED IT I THINK*/
                read: false,
                date: new Date().toISOString()
            });

            localStorage.setItem("inboxLetters", JSON.stringify(inbox));
        }
    }    
}
customElements.define("incoming-dispatch", IncomingDispatch);


function setupYearLocks(root) {
    const locks = root.querySelectorAll(".year-lock");

    locks.forEach(lock => {
        const lockId = lock.dataset.lockId;

        const inputs = lock.querySelectorAll("input");
        const message = lock.querySelector(".lock-message");
        const checkBtn = lock.querySelector(".lock-check-btn");

        const saved = JSON.parse(localStorage.getItem(lockId)) || null;

        if (saved) {
            inputs.forEach((input, index) => {
                input.value = saved.values[index] || "";
            });

            if (saved.correct) {
                markLockCorrect(lock);
                message.textContent = "Correct numbers. Route code unlocked.";
                message.style.color = "green";
            }
        }

        inputs.forEach((input, index) => {
            input.addEventListener("input", () => {
                input.value = input.value.replace(/[^0-9]/g, "");

                if (input.value && inputs[index + 1]) {
                    inputs[index + 1].focus();
                }

                saveLockState(lock, false);
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !input.value && inputs[index - 1]) {
                    inputs[index - 1].focus();
                }
            });
        });

        checkBtn.addEventListener("click", () => {
            const yearA = [...lock.querySelectorAll(".year-a")].map(i => i.value).join("");
            const yearB = [...lock.querySelectorAll(".year-b")].map(i => i.value).join("");
            const extra = [...lock.querySelectorAll(".extra")].map(i => i.value).join("");
            const result = [...lock.querySelectorAll(".result")].map(i => i.value).join(",");

            const correct =
                yearA === "1888" &&
                yearB === "1922" &&
                result === "3,15,11,4";

            if (correct) {
                markLockCorrect(lock);
                message.textContent = "Correct numbers. Route code unlocked.";
                message.style.color = "green";
                saveLockState(lock, true);
            } else {
                message.textContent = "Not the correct numbers.";
                message.style.color = "darkred";
                saveLockState(lock, false);
            }
        });
    });
}

function markLockCorrect(lock) {
    lock.querySelectorAll("input").forEach(input => {
        input.classList.add("correct");
    });
}

function saveLockState(lock, correct) {
    const lockId = lock.dataset.lockId;
    const values = [...lock.querySelectorAll("input")].map(input => input.value);

    localStorage.setItem(lockId, JSON.stringify({
        values,
        correct
    }));
}