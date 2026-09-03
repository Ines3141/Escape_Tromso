/* dispatchSosAudio(step, done) Not neccessary anymore 
- FOR Me: 
    - modal is simply a box that appears above the page 
      and temporarily takes focus.
    - openImageFullscreen(...) creates a modal 
    - <div class="modal-content attachment-error"> creates a box just for an error 
      when the file is not loading 
    - video modal: <div class="modal-content video-modal-content">

this.attachShadow({ mode: "open" }); (is in stroy chat)
    - A Shadow DOM is like a private mini-page inside <story-chat>.
    - Only affect things in story-chat 

FOR ALL HINT: ChatGPT said that the order how the links are added matters:
    - USE THIS ORDER: story_data.js, attachments.js, story_chat.js

*/
/* Creates uniform closing button for all the attchaments */
window.ATTACHMENT_UI = (() => {
    let activeOverlay = null;
    function closeActive() {
        if (activeOverlay?.close) {
            activeOverlay.close();
        }
    }
    function open({
        label = "Attachment",
        content,
        panelClass = "",
        onClose = null
    }) {
        closeActive();

        const overlay = document.createElement("div");
        overlay.className = "attachment-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", label);

        const panel = document.createElement("div");
        panel.className = `attachment-panel ${panelClass}`.trim();

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "attachment-close";
        closeButton.setAttribute("aria-label", `Close ${label}`);
        closeButton.innerHTML = "&times;";

        panel.appendChild(closeButton);
        panel.appendChild(content);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        let closed = false;

        function close() {
            if (closed) return;

            closed = true;

            document.removeEventListener("keydown", handleKeydown);

            const video = panel.querySelector("video");

            if (video) {
                video.pause();
                video.removeAttribute("src");
                video.load();
            }

            overlay.classList.remove("visible");

            window.setTimeout(() => {
                overlay.remove();
                if (activeOverlay?.overlay === overlay) {
                    activeOverlay = null;
                }
                if (typeof onClose === "function") {
                    onClose();
                }
            }, 180);
        }
        function handleKeydown(event) {
            if (event.key === "Escape") {
                close();
            }
        }
        closeButton.addEventListener("click", close);
        panel.addEventListener("click", event => {
            event.stopPropagation();
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                close();
            }
        });

        document.addEventListener("keydown", handleKeydown);

        activeOverlay = {overlay, panel, close};

        requestAnimationFrame(() => {
            overlay.classList.add("visible");
            closeButton.focus();
        });
        return activeOverlay;
    }
    return {open, closeActive};
})();
window.ATTACHMENTS = window.ATTACHMENTS || {};
window.ATTACHMENTS.openMessage = function (
    title,
    message,
    onClose = null
) {
    const content = document.createElement("div");
    content.className = "attachment-message";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    content.append(heading, paragraph);

    window.ATTACHMENT_UI.open({
        label: title,
        content,
        panelClass: "attachment-panel--message",
        onClose
    });
};
window.ATTACHMENTS.openImage = function (
    step,
    onClose = null
) {
    const image = document.createElement("img");

    image.className = "attachment-media attachment-image";
    image.src = step.src || step.image;
    image.alt = step.alt || step.name || "Image preview";

    window.ATTACHMENT_UI.open({
        label: image.alt,
        content: image,
        panelClass: "attachment-panel--media",
        onClose
    });
};

Object.assign(window.ATTACHMENTS, {
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
                    src="../../../../assets/audio/sos.mp3"
                    type="audio/mp3"
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
         * Automatically close after 12 seconds.
         */
        closeTimer = window.setTimeout(close, 12000);

        closeButton.focus();
    },

    /* ====================
       LETTER WITH THE BLINKING LAMP 
       ==================== */

    station1SignalLetter(step, done) {
        const teamName = localStorage.getItem("teamName") || "Team";

        const overlay = document.createElement("div");
        overlay.className = "signal-letter-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Strange Signal Received");

        overlay.innerHTML = `
            <button type="button"
                class="signal-letter-close"
                aria-label="Close letter">
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

                    <div class="signal-note signal-coordinate-note">
                        <!-- ------------- MORSE CODE DEFINITION --------------- -->
                        <input
                            class="signal-character-input"
                            data-answer-index="0"
                            type="text"
                            maxlength="1"
                            inputmode="numeric"
                            aria-label="First coordinate digit"
                        >
                        <span>5m S</span>

                        <span class="signal-coordinate-separator">and</span>
                        
                        <input
                            class="signal-character-input"
                            data-answer-index="1"
                            type="text"
                            maxlength="1"
                            inputmode="numeric"
                            aria-label="Second coordinate digit"
                        >
                        <span>25m </span>

                        <input
                            class="signal-character-input"
                            data-answer-index="2"
                            type="text"
                            maxlength="1"
                            autocapitalize="characters"
                            aria-label="Coordinate direction"
                        >
                    </div>

                    <p class="signal-answer-status"
                        role="status"
                        aria-live="polite"></p>

                    <div class="signal-answer-actions">
                        <button type="button"
                            class="signal-inventory-button">
                            Open inventory
                        </button>

                        <button type="button"
                            class="signal-save-button">
                            Save answer and close
                        </button>
                    </div>

                    <section class="signal-lamp-panel">
                        <p class="signal-panel-title">
                            Recovered blinking signal
                        </p>

                        <div
                            class="signal-lamp"
                            aria-hidden="true"
                        ></div>

                        <audio
                            class="signal-morse-audio"
                            preload="auto"
                        
                        >
                            <source
                                src="../../../../assets/audio/morse.wav"
                                type="audio/wav"
                            >
                        </audio>

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
                        Decode the blinking signal. You can use the inventory for help.
                    </p>

                    <p class="signal-letter-signature">
                        - Dispatch Control
                    </p>
                </div>
            </article>
        `;

        document.body.appendChild(overlay);
        const oldBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const closeButton = overlay.querySelector(".signal-letter-close");

        const lamp = overlay.querySelector(".signal-lamp");

        const lampButton = overlay.querySelector(".signal-lamp-button");

        const lampStatus = overlay.querySelector(".signal-lamp-status");
        const morseAudio = overlay.querySelector(".signal-morse-audio");
        const answerInputs = Array.from(overlay.querySelectorAll(".signal-character-input"));

        const answerStatus = overlay.querySelector(".signal-answer-status");

        const saveButton = overlay.querySelector(".signal-save-button");

        const inventoryButton = overlay.querySelector(".signal-inventory-button");

        /*
         * MorseMorse-style pattern from the recovered signal.
         */

        const pattern = [
            // 8
            "dash", "dash", "dash", "dot", "dot",
            "characterPause",

            // 1
            "dot", "dash", "dash", "dash", "dash",
            "characterPause",

            // W
            "dot", "dash", "dash"
        ];

        const DOT_DURATION = 303;
        const DASH_DURATION = 903;

        // Darkness between individual flashes.
        const SYMBOL_GAP = 302;

        // Darkness between complete digits or letters.
        const expectedAnswer = step.correctAnswer || "85mS125mW";
        const CHARACTER_GAP = 2867;
        let signalRunning = false;
        let closed = false;
        let timers = [];


        function startMorseAudio() {
            morseAudio.pause();
            morseAudio.currentTime = 0;
            morseAudio.play().catch(error => {
                console.warn("Morse audio could not start:", error);
            });
        }
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
                if (symbol === "characterPause") {
                    delay += CHARACTER_GAP;
                    return;
                }
                const lightDuration =
                    symbol === "dot"
                        ? DOT_DURATION
                        : DASH_DURATION;

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

                delay += lightDuration + SYMBOL_GAP;
            });

            // Signal has finished ONE time.
            // Signal has finished ONE time.
            timers.push(
                window.setTimeout(() => {

                    signalRunning = false;

                    lamp.classList.remove("on");

                    /*
                     * Make sure audio has also stopped.
                     */
                    morseAudio.pause();
                    morseAudio.currentTime = 0;

                    lampButton.classList.remove("active");

                    lampButton.setAttribute(
                        "aria-pressed",
                        "false"
                    );

                    lampButton.textContent = "PLAY AGAIN";

                    lampStatus.textContent =
                        "Signal finished. Press PLAY AGAIN to replay.";

                }, delay)
            );
        }
        function normalizeSignalAnswer(value) {
            return String(value || "")
                .toUpperCase()
                .replaceAll(" ", "")
                .replaceAll("-", "")
                .replaceAll("_", "")
                .replaceAll(",", "")
                .replaceAll(".", "");
        }
        function validateAndSaveAnswer() {
            const values = answerInputs.map(input =>
                input.value.trim().toUpperCase()
            );

            const allFieldsCompleted =
                values.every(value => value.length === 1);

            if (!allFieldsCompleted) {
                answerStatus.textContent =
                    "Please complete all three missing characters.";

                const emptyInput = answerInputs.find(
                    input => !input.value.trim()
                );

                emptyInput?.focus();
                return false;
            }

            /*
             * The visible coordinate is:
             * [8]5m S and [1]25m [W]
             */
            const enteredAnswer = `${values[0]}5mS${values[1]}25m${values[2]}`;

            const correctAnswer = normalizeSignalAnswer(step.correctAnswer || "85mS125mW");

            if (normalizeSignalAnswer(enteredAnswer) !== correctAnswer) {
                answerStatus.textContent =
                    "That is not correct yet. Listen to the signal again.";

                answerInputs.forEach(input => {
                    input.classList.add("incorrect");
                });

                answerInputs[0].focus();
                return false;
            }

            localStorage.setItem(
                "station1SignalAnswer",
                enteredAnswer
            );

            localStorage.setItem(
                "station1SignalSolved",
                "true"
            );

            answerInputs.forEach(input => {
                input.classList.remove("incorrect");
            });

            answerStatus.textContent = "Coordinates saved.";

            return true;
        }
        function toggleSignal() {

            /*
             * SIGNAL IS CURRENTLY PLAYING
             * -> STOP IT
             */
            if (signalRunning) {
                signalRunning = false;

                /*
                 * Stop blinking.
                 */
                clearSignalTimers();

                /*
                 * Stop audio and rewind.
                 */
                morseAudio.pause();
                morseAudio.currentTime = 0;

                /*
                 * Change button.
                 */
                lampButton.classList.remove("active");

                lampButton.setAttribute(
                    "aria-pressed",
                    "false"
                );

                lampButton.textContent = "PLAY AGAIN";

                lampStatus.textContent =
                    "Signal stopped.";

                return;
            }


            /*
             * SIGNAL IS NOT PLAYING
             * -> START IT
             */
            signalRunning = true;

            lampButton.classList.add("active");

            lampButton.setAttribute(
                "aria-pressed",
                "true"
            );

            lampButton.textContent = "STOP";

            lampStatus.textContent =
                "Receiving light and audio pattern...";

            /*
             * Start blinking and audio together.
             */
            playSignalPattern();
            startMorseAudio();
        }

        function finishAndCloseLetter() {
            if (closed) {
                return;
            }

            closed = true;
            signalRunning = false;

            
            /*
             * Stop and rewind the audio.
             */
            morseAudio.pause();
            morseAudio.currentTime = 0;

            /*
             * Stop the blinking signal.
             */
            clearSignalTimers();

            document.removeEventListener(
                "keydown",
                handleKeydown
            );

            document.body.style.overflow = oldBodyOverflow;

            overlay.classList.add("closing");

            window.setTimeout(() => {
                overlay.remove();

                if (typeof done === "function") {
                    done();
                }
            }, 250);
        }
        function requestCloseLetter() {
            if (validateAndSaveAnswer()) {
                finishAndCloseLetter();
            }
        }

        function handleKeydown(event) {
            if (event.key === "Escape") {
                requestCloseLetter();
            }
        }      
        /* ============== 
           Inventory Button
           ============== */
        inventoryButton.addEventListener("click", () => {
            /*
             * First try a global inventory-opening function.
             */
            if (typeof window.openInventory === "function") {
                window.openInventory();
                return;
            }

            /*
             * Otherwise, click the existing inventory button
             * elsewhere on the page.
             *
             * Change these selectors to match your actual button.
             */
            const existingInventoryButton =
                document.querySelector(
                    "#inventoryButton, " +
                    ".inventory-button, " +
                    "[data-open-inventory]"
                );

            if (existingInventoryButton) {
                existingInventoryButton.click();
                return;
            }

            /*
             * Optional fallback: open a separate inventory page.
             */
            if (step.inventoryHref) {
                window.open(
                    step.inventoryHref,
                    "_blank",
                    "noopener,noreferrer"
                );
                return;
            }

            answerStatus.textContent =
                "The inventory could not be opened.";
        });

        lampButton.addEventListener(
            "click",
            toggleSignal
        );

        closeButton.addEventListener(
            "click",
            requestCloseLetter
        );

        saveButton.addEventListener(
            "click",
            requestCloseLetter
        );
        answerInputs.forEach((input, index) => {
            input.addEventListener("input", () => {
                input.value = input.value
                    .slice(0, 1)
                    .toUpperCase();

                input.classList.remove("incorrect");
                answerStatus.textContent = "";

                if (
                    input.value &&
                    index < answerInputs.length - 1
                ) {
                    answerInputs[index + 1].focus();
                }
            });

            input.addEventListener("keydown", event => {
                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {
                    answerInputs[index - 1].focus();
                }

                if (event.key === "Enter") {
                    requestCloseLetter();
                }
            });
        });

        /*
         * Clicking the black background also closes it.
         */
        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                requestCloseLetter();
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
        const savedAnswer =
            normalizeSignalAnswer(
                localStorage.getItem("station1SignalAnswer")
            );

        if (savedAnswer.length >= 9) {
            answerInputs[0].value = savedAnswer[0]; // 8
            answerInputs[1].value = savedAnswer[4]; // 1
            answerInputs[2].value = savedAnswer[8]; // W
        }
    },

    imagePreview(step, done) {
        window.ATTACHMENTS.openImage(step, done);
    },

    /* ============================
       DISPATCH VIDEO HENRY RUDI 
       ============================  */ 
    dispatchHenryVideo(step, done) {
        const video = document.createElement("video");
        video.className = "attachment-media attachment-video";

        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";

        const source = document.createElement("source");
        source.src = step.video;
        source.type = "video/mp4";

        video.appendChild(source);
        video.append("Your browser does not support video.");

        window.ATTACHMENT_UI.open({
            label: step.name || "Video",
            content: video,
            panelClass: "attachment-panel--media",
            onClose: done
        });
    },
    /* ============================
       FRIEND REQUEST HERNY RUDI
       ============================ */
    henryRudiContactRequest(step, done) {
        const content = document.createElement("div");
        content.className = "contact-request";

        content.innerHTML = `
        <div class="contact-request__label">
            New contact
        </div>

        <div class="contact-request__profile">
            <div
                class="contact-request__avatar
                       contact-request__initials"
                aria-hidden="true"
            >
                HR
            </div>

            <div class="contact-request__identity">
                <h2>Henry Rudi</h2>
                <p>Dispatch contact</p>
            </div>
        </div>

        <div class="contact-request__body">
            <p>
                Send Henry Rudi a secure contact request?
            </p>

            <p class="contact-request__hint">
                Henry must accept the request before a secure
                communication connection can be established.
            </p>
        </div>

        <div class="contact-request__actions">
            <button
                type="button"
                class="contact-request__send"
            >
                Send request
            </button>

            <button
                type="button"
                class="contact-request__dismiss"
            >
                Cancel
            </button>
        </div>

        <p
            class="contact-request__status"
            role="status"
            aria-live="polite"
        ></p>
    `;

        const overlay = window.ATTACHMENT_UI.open({
            label: "Send Henry Rudi a contact request",
            content,
            panelClass: "attachment-panel--contact"
        });

        const sendButton = content.querySelector(
            ".contact-request__send"
        );

        const dismissButton = content.querySelector(
            ".contact-request__dismiss"
        );

        const status = content.querySelector(
            ".contact-request__status"
        );

        dismissButton.addEventListener("click", () => {
            overlay.close();
        });

        sendButton.addEventListener("click", () => {
            sendButton.disabled = true;
            dismissButton.disabled = true;

            status.textContent =
                "Sending secure contact request";

            window.setTimeout(() => {
                localStorage.setItem(
                    "henry_rudi_contact_request",
                    "sent"
                );

                content.classList.add("sent");

                status.textContent =
                    "Contact request sent to Henry Rudi.";

                sendButton.textContent = "Request sent";

                window.setTimeout(() => {
                    overlay.close();

                    if (typeof done === "function") {
                        done();
                    }

                    if (step.redirect) {
                        window.location.href = step.redirect;
                    }
                }, 900);
            }, 700);
        });
    },
    /* ============================
       HENRY RUDI RIDDLE GALLERY
       ============================ */
    henryRudiGallery(step, done) {
        /*
         * Correct answer is position 3.
         * JavaScript index 2 = third position.
         */
        const correctIndex = 2;

        const galleryImages = [
            "../../../../assets/images/Rudi/wrong1_wb.png",
            "../../../../assets/images/Rudi/wrong2_wb.png",
            "../../../../assets/images/Rudi/correct_wb.png",
            "../../../../assets/images/Rudi/wrong3_wb.png"
        ];

        const resultVideos = [
            "../../../../assets/animation/HR_wrong1.mp4",
            "../../../../assets/animation/HR_wrong2.mp4",
            "../../../../assets/animation/HR_correct.mp4",
            "../../../../assets/animation/HR_wrong3.mp4"
        ];

        const content = document.createElement("div");
        content.className = "henry-gallery";

        content.innerHTML = `
        <h2>${step.name || "Henry Rudi"}</h2>

        <div class="henry-gallery__grid"></div>
        `;

        const galleryOverlay = window.ATTACHMENT_UI.open({
            label: step.name || "Henry Rudi gallery",
            content,
            panelClass: "attachment-panel--henry-gallery",

            onClose() {
                if (completed) {
                    return;
                }

                completed = true;

                if (typeof done === "function") {
                    done();
                }
            }
        });

        const galleryGrid = content.querySelector(
            ".henry-gallery__grid"
        );

        let videoPlaying = false;
        let completed = false;

        function continueStory() {
            if (completed) {
                return;
            }

            completed = true;

            galleryOverlay.close();

            if (typeof done === "function") {
                done();
            }
        }

        galleryImages.forEach((imageSource, index) => {
            const imageButton = document.createElement("button");

            imageButton.type = "button";
            imageButton.className = "henry-gallery__item";

            imageButton.innerHTML = `
        <img
            src="${imageSource}"
            alt="Observatory image ${index + 1}"
        >
    `;

            imageButton.addEventListener("click", () => {
                if (videoPlaying || completed) {
                    return;
                }

                videoPlaying = true;

                galleryGrid
                    .querySelectorAll(".henry-gallery__item")
                    .forEach(button => {
                        button.classList.remove("selected");
                    });

                imageButton.classList.add("selected");

                playHenryRudiResultVideo(
                    resultVideos[index],

                    () => {
                        videoPlaying = false;
                    },

                    () => {
                        videoPlaying = false;
                    }
                );
            });

            galleryGrid.appendChild(imageButton);
        });
    },
    /* ========================
    HACKER ACTION
     ========================== */
     signalInterceptAttack(step, done) {
        const overlay = document.createElement("div");
        overlay.className = "attack-overlay scanlines active flicker";

        overlay.innerHTML = `
            <div class="noise"></div>

            <div class="disconnect-text glitch show">
                Connection interrupted
            </div>

            <div class="code-box"></div>

            <div class="mask-wrap">
                <img
                    class="mask-image"
                    src="../../../../assets/images/mask_hacker.png"
                    alt="Masked intruder"
                >

                <div class="mask-text">
                    We have taken over this communication channel.
                </div>
            </div>

            <div class="video-wrap">
                <video
                    class="hacker-video"
                    controls
                    playsinline
                    preload="auto"
                    style="width: auto; height: 80%;">
                    <source
                        src="../../../../assets/images/monument_video.mp4"
                        type="video/mp4"
                    >

                    Your browser does not support this video.
                </video>

                <button
                    type="button"
                    class="continue-btn"
                >
                    Continue
                </button>
            </div>

            <div class="blackout"></div>
        `;

        document.body.appendChild(overlay);

        const disconnectText = overlay.querySelector(".disconnect-text");
        const codeBox = overlay.querySelector(".code-box");
        const maskWrap = overlay.querySelector(".mask-wrap");
        const videoWrap = overlay.querySelector(".video-wrap");
        const video = overlay.querySelector(".hacker-video");
        const continueButton = overlay.querySelector(".continue-btn");
        const blackout = overlay.querySelector(".blackout");

        const codeLines = [
            {
                text: "[ SIGNAL OVERRIDE INITIATED ]",
                cls: "code-red"
            },
            {
                text: "inject_channel(dispatcher.main_link)",
                cls: "code-green"
            },
            {
                text: "bypass_protocol(alpha.473)",
                cls: "code-blue"
            },
            {
                text: "target_team = 'expedition'",
                cls: "code-yellow"
            },
            {
                text: "disabling remote relay...",
                cls: "code-green"
            },
            {
                text: "intercept_success = TRUE",
                cls: "code-red"
            },
            {
                text: "opening private transmission...",
                cls: "code-blue"
            }
        ];

        function flickerBlackout(times = 4, delay = 120) {
            let count = 0;

            const interval = setInterval(() => {
                blackout.classList.add("show");

                setTimeout(() => {
                    blackout.classList.remove("show");
                }, 70);

                count++;

                if (count >= times) {
                    clearInterval(interval);
                }
            }, delay);
        }

        function showCodeAnimation() {
            let index = 0;

            const interval = setInterval(() => {
                const line = codeLines[index];

                const div = document.createElement("div");
                div.className = `code-line ${line.cls}`;
                div.textContent = line.text;

                codeBox.appendChild(div);
                index++;

                if (index >= codeLines.length) {
                    clearInterval(interval);

                    setTimeout(() => {
                        codeBox.classList.remove("show");
                        showMask();
                    }, 1400);
                }
            }, 500);
        }

        function showMask() {
            flickerBlackout(3, 140);
            maskWrap.classList.add("show");

            setTimeout(() => {
                maskWrap.classList.remove("show");
                showVideo();
            }, 3500);
        }

        function showVideo() {
            videoWrap.classList.add("show");
            video.load();
        }

         function showContinueButton() {
             console.log("Showing Continue button");

             continueButton.classList.add("show");
             video.classList.add("finished");
         }

         video.addEventListener("ended", showContinueButton);

         video.addEventListener("timeupdate", () => {
             if (
                 Number.isFinite(video.duration) &&
                 video.duration > 0 &&
                 video.currentTime >= video.duration - 0.5
             ) {
                 showContinueButton();
             }
         });

         video.addEventListener("error", () => {
             console.error("Video error:", video.error);
             showContinueButton();
         });

        continueButton.addEventListener("click", () => {
            overlay.remove();

            if (typeof done === "function") {
                done();
            }

            window.location.href =
                "../riddle/riddle_4_2_fish.html";
        });

        setTimeout(() => {
            flickerBlackout(5, 130);
        }, 1200);

        setTimeout(() => {
            disconnectText.textContent =
                "Unauthorized access";
        }, 2500);

        setTimeout(() => {
            disconnectText.classList.remove("show");
            codeBox.classList.add("show");
            showCodeAnimation();
        }, 3800);
    }
});

/* =========================
  LOGIC OF THE ANIMATION VIDEO RIDDLE RUDI 
  ========================== */
function playHenryRudiResultVideo(
    videoSource,
    onBack,
    onFinished
) {
    const videoOverlay = document.createElement("div");

    videoOverlay.className =
        "henry-result-overlay visible";

    videoOverlay.setAttribute("role", "dialog");
    videoOverlay.setAttribute("aria-modal", "true");
    videoOverlay.setAttribute(
        "aria-label",
        "Henry Rudi result video"
    );

    videoOverlay.innerHTML = `
        <div class="henry-result-panel">
            <button
                type="button"
                class="henry-result-back"
            >
                ← Back to gallery
            </button>

            <video
                class="henry-result-video"
                playsinline
                preload="auto"
                autoplay
            >
                <source
                    src="${videoSource}"
                    type="video/mp4"
                >

                Your browser does not support this video.
            </video>
        </div>
    `;

    document.body.appendChild(videoOverlay);

    const video = videoOverlay.querySelector(
        ".henry-result-video"
    );

    const backButton = videoOverlay.querySelector(
        ".henry-result-back"
    );

    let closed = false;
    let finished = false;

    function removeOverlay() {
        if (closed) {
            return;
        }

        closed = true;

        video.pause();

        videoOverlay.classList.remove("visible");

        window.setTimeout(() => {
            videoOverlay.remove();
        }, 180);
    }

    function returnToGallery() {
        if (finished) {
            return;
        }

        removeOverlay();

        if (typeof onBack === "function") {
            onBack();
        }
    }

    function finishVideo() {
        if (finished) {
            return;
        }

        finished = true;

        removeOverlay();

        if (typeof onFinished === "function") {
            onFinished();
        }
    }

    backButton.addEventListener(
        "click",
        returnToGallery
    );

    video.addEventListener(
        "ended",
        finishVideo,
        { once: true }
    );

    video.addEventListener(
        "error",
        () => {
            console.error(
                "Henry Rudi video failed:",
                videoSource,
                video.error
            );

            returnToGallery();
        },
        { once: true }
    );

    video.play().catch(error => {
        console.warn(
            "Autoplay was blocked:",
            error
        );

        video.controls = true;
    });
}