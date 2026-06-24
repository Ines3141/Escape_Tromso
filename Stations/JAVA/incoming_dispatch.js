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

        const letters = {
            "station-1-signal": {
                title: "Strange Signal Received",
                hasLamp: true,
                from: "Dispatch Control",
                content: `
                    <p>Hello Team ${teamName},</p>

                    <p>
                        We got this really strange signal from a blinking lamp.
                        Along with it came this kind of note:
                    </p>

                    <div class="note">
                        _ _ m _ and _ _ 9 m _
                    </div>

                    <p>
                        Maybe you can do more with this information!
                    </p>

                    <p>
                        Remember to look for help in the inventory.
                    </p>

                    <p>— Dispatch Control</p>
                `
            },

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

                    <p>— Roald Amundsen</p>
                `
            }
        };

        const letter = letters[letterId];

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
            setupMorseLamps(this.shadowRoot);
        });

        this.shadowRoot.getElementById("continueBtn").addEventListener("click", () => {
            this.shadowRoot.getElementById("overlay").classList.add("closed");
        });

        this.shadowRoot.getElementById("closeBtn").addEventListener("click", () => {
            this.shadowRoot.getElementById("overlay").classList.add("closed");
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
                hasLamp: letter.hasLamp || false,
                read: false,
                date: new Date().toISOString()
            });

            localStorage.setItem("inboxLetters", JSON.stringify(inbox));
        }
    }    
}
customElements.define("incoming-dispatch", IncomingDispatch);