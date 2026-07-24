window.ATTACHMENTS = {

    sosSignal(step, done) {
        const overlay = document.createElement("div");
        overlay.className = "sos-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Emergency signal");

        overlay.innerHTML = `
            <div class="sos-blackout" aria-hidden="true"></div>

            <button
                type="button"
                class="overlay-close"
                aria-label="Close emergency signal"
            >
                &times;
            </button>

            <div class="sos-danger-effect" aria-hidden="true">
                <div class="sos-beacon">
                    <div class="sos-beacon-light"></div>
                    <div class="sos-beacon-base"></div>
                </div>

                <div class="sos-ring sos-ring-one"></div>
                <div class="sos-ring sos-ring-two"></div>
                <div class="sos-ring sos-ring-three"></div>
            </div>

            <audio class="sos-audio" preload="auto" loop>
                <source
                    src="../../../../assets/audio/SOS_signal.m4a"
                    type="audio/mp4"
                >
            </audio>
        `;

        document.body.appendChild(overlay);

        const audio = overlay.querySelector(".sos-audio");
        const closeButton = overlay.querySelector(".overlay-close");

        let closed = false;
        let closeTimer;

        /*
         * Adding the class on the next animation frame allows
         * the entrance transition to run.
         */
        requestAnimationFrame(() => {
            overlay.classList.add("visible");
        });

        /*
         * A value between 0 and 1.
         * Reduce this if the alarm is too loud.
         */
        audio.volume = 0.75;

        audio.play().catch(error => {
            console.warn("SOS audio could not start:", error);
        });

        const close = () => {
            if (closed) {
                return;
            }

            closed = true;

            clearTimeout(closeTimer);

            audio.pause();
            audio.currentTime = 0;

            document.removeEventListener("keydown", handleKeydown);

            overlay.classList.remove("visible");
            overlay.classList.add("closing");

            window.setTimeout(() => {
                overlay.remove();

                if (typeof done === "function") {
                    done();
                }
            }, 350);
        };

        const handleKeydown = event => {
            if (event.key === "Escape") {
                close();
            }
        };

        closeButton.addEventListener("click", close);
        document.addEventListener("keydown", handleKeydown);

        /*
         * Automatically close after ten seconds.
         */
        closeTimer = window.setTimeout(close, 12000);

        closeButton.focus();
    },

    /* ====================
       LETTER WITH THE BLINKING LAMP 
       ==================== */

    station1SignalLetter(step, done) {
        const teamName =
            localStorage.getItem("teamName") || "Team";

        const overlay = document.createElement("div");
        overlay.className = "signal-letter-overlay";

        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute(
            "aria-label",
            "Strange Signal Received"
        );

        overlay.innerHTML = `
        <button
            type="button"
            class="signal-letter-close"
            aria-label="Close letter"
        >
            &times;
        </button>

        <article class="signal-letter-paper">
            <header class="signal-letter-header">
                <span class="signal-letter-category">
                    Incoming field report
                </span>

                <h2>Strange Signal Received</h2>

                <p class="signal-letter-sender">
                    From: Dispatch Control
                </p>
            </header>

            <div class="signal-letter-content">
                <p>Hello Team ${teamName},</p>

                <p>
                    We got this really strange signal from a
                    blinking lamp.
                </p>

                <p>
                    Along with it came this kind of note:
                </p>

                <div class="signal-note">
                    _ _ m _ and _ _ 9 m _
                </div>

                <section class="signal-lamp-panel">
                    <p class="signal-panel-title">
                        Recovered blinking signal
                    </p>

                    <div
                        class="signal-lamp"
                        aria-hidden="true"
                    ></div>

                    <button
                        type="button"
                        class="signal-lamp-button"
                        aria-pressed="false"
                    >
                        Start signal
                    </button>

                    <p
                        class="signal-lamp-status"
                        aria-live="polite"
                    >
                        Signal stopped
                    </p>
                </section>

                <p>
                    Maybe you can do more with this information!
                </p>

                <p>
                    Remember to look for help in the inventory.
                </p>

                <p class="signal-letter-signature">
                    � Dispatch Control
                </p>
            </div>
        </article>
    `;

        document.body.appendChild(overlay);

        const oldBodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const closeButton = overlay.querySelector(
            ".signal-letter-close"
        );

        const lamp = overlay.querySelector(
            ".signal-lamp"
        );

        const lampButton = overlay.querySelector(
            ".signal-lamp-button"
        );

        const lampStatus = overlay.querySelector(
            ".signal-lamp-status"
        );

        /*
         * Morse-style pattern from the recovered signal.
         */
        const pattern = [
            "dash", "dot", "dot", "dot", "dot",
            "pause",

            "dot", "dot", "dot", "dot", "dash",
            "pause",

            "dot", "dot", "dot",
            "pause",

            "dot", "dash", "dash", "dash", "dash",
            "pause",

            "dot", "dot", "dash", "dash", "dash",
            "pause",

            "dot", "dash", "dash"
        ];

        let signalRunning = false;
        let closed = false;
        let timers = [];

        function clearSignalTimers() {
            timers.forEach(timer => {
                window.clearTimeout(timer);
            });

            timers = [];
            lamp.classList.remove("on");
        }

        function playSignalPattern() {
            if (!signalRunning) {
                return;
            }

            clearSignalTimers();

            let delay = 0;

            pattern.forEach(symbol => {
                if (symbol === "pause") {
                    delay += 1000;
                    return;
                }

                const lightDuration =
                    symbol === "dot" ? 250 : 750;

                timers.push(
                    window.setTimeout(() => {
                        if (signalRunning) {
                            lamp.classList.add("on");
                        }
                    }, delay)
                );

                timers.push(
                    window.setTimeout(() => {
                        lamp.classList.remove("on");
                    }, delay + lightDuration)
                );

                delay += lightDuration + 300;
            });

            /*
             * Repeat the complete signal.
             */
            timers.push(
                window.setTimeout(() => {
                    playSignalPattern();
                }, delay + 1800)
            );
        }

        function toggleSignal() {
            signalRunning = !signalRunning;

            lampButton.classList.toggle(
                "active",
                signalRunning
            );

            lampButton.setAttribute(
                "aria-pressed",
                String(signalRunning)
            );

            lampButton.textContent = signalRunning
                ? "Stop signal"
                : "Start signal";

            lampStatus.textContent = signalRunning
                ? "Receiving repeating light pattern..."
                : "Signal stopped";

            if (signalRunning) {
                playSignalPattern();
            } else {
                clearSignalTimers();
            }
        }

        function closeLetter() {
            if (closed) {
                return;
            }

            closed = true;
            signalRunning = false;

            clearSignalTimers();

            document.removeEventListener(
                "keydown",
                handleKeydown
            );

            document.body.style.overflow =
                oldBodyOverflow;

            overlay.classList.add("closing");

            window.setTimeout(() => {
                overlay.remove();

                if (typeof done === "function") {
                    done();
                }
            }, 250);
        }

        function handleKeydown(event) {
            if (event.key === "Escape") {
                closeLetter();
            }
        }

        lampButton.addEventListener(
            "click",
            toggleSignal
        );

        closeButton.addEventListener(
            "click",
            closeLetter
        );

        /*
         * Clicking the black background also closes it.
         */
        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                closeLetter();
            }
        });

        document.addEventListener(
            "keydown",
            handleKeydown
        );

        requestAnimationFrame(() => {
            overlay.classList.add("visible");
        });

        closeButton.focus();
    },

    imagePreview(step, done) {
        const overlay = document.createElement("div");
        overlay.className = "image-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Image preview");

        overlay.innerHTML = `
        <button
            type="button"
            class="overlay-close"
            aria-label="Close image preview"
        >
            &times;
        </button>

        <div class="image-preview-frame">
            <img
                src="${step.src}"
                alt="${step.alt || "Received transmission image"}"
            >
        </div>
    `;

        document.body.appendChild(overlay);

        const closeButton = overlay.querySelector(".overlay-close");

        requestAnimationFrame(() => {
            overlay.classList.add("visible");
        });

        let closed = false;

        const close = () => {
            if (closed) {
                return;
            }

            closed = true;

            document.removeEventListener("keydown", handleKeydown);

            overlay.classList.remove("visible");

            window.setTimeout(() => {
                overlay.remove();

                if (typeof done === "function") {
                    done();
                }
            }, 300);
        };

        const handleKeydown = event => {
            if (event.key === "Escape") {
                close();
            }
        };

        closeButton.addEventListener("click", close);
        document.addEventListener("keydown", handleKeydown);

        closeButton.focus();
    },

    dispatchHenryVideo(step, done) {
        const modal = document.createElement("div");
        modal.className = "attachment-modal";
        modal.innerHTML = `
            <div class="attachment-content video-content">
                <h2>Dispatch Video</h2>

                <video controls class="dispatch-video">
                    <source src="${step.video}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>

                <button class="close-attachment">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector(".close-attachment").onclick = () => {
            modal.remove();

            if (done) {
                done();
            }
        };
    },

    dispatchSosAudio(step, done) {
        const modal = document.createElement("div");
        modal.className = "attachment-modal";
        modal.innerHTML = `
            <div class="attachment-content audio-content">
                <h2>Dispatch Audio</h2>

                <audio controls class="dispatch-audio">
                    <source src="${step.audio}" type="audio/mp3">
                    Your browser does not support the audio element.
                </audio>

                <button class="close-attachment">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector(".close-attachment").onclick = () => {
            modal.remove();

            if (done) {
                done();
            }
        };
    },


    henryRudiContactRequest(step, done) {
        const modal = document.createElement("div");
        modal.className = "attachment-modal";
        modal.innerHTML = `
            <div class="attachment-content contact-content">
                <div class="contact-avatar">HR</div>

                <h2>Henry Rudi</h2>
                <p class="contact-subtitle">Arctic hunter and explorer</p>

                <p class="contact-text">
                    Henry Rudi may have information that can help the lost crew.
                </p>

                <button class="friend-request-button">Send friend request</button>

                <p class="request-status"></p>
            </div>
        `;

        document.body.appendChild(modal);

        const button = modal.querySelector(".friend-request-button");
        const status = modal.querySelector(".request-status");

        button.onclick = () => {
            button.disabled = true;
            button.textContent = "Sending request...";
            status.textContent = "";

            setTimeout(() => {
                button.textContent = "Request sent";
                status.textContent = "Waiting for Henry Rudi to answer...";
            }, 900);

            setTimeout(() => {
                status.textContent = "Friend request accepted!";
                modal.classList.add("accepted");
            }, 2300);

            setTimeout(() => {
                modal.remove();

                if (step.redirect) {
                    window.location.href = step.redirect;
                    return;
                }

                if (done) {
                    done();
                }
            }, 3500);
        };
    }
};