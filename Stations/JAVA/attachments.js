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
                    - Dispatch Control
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
                "Sending secure contact request…";

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
        const galleryImages = [
            "../../../../assets/images/Rudi_1.jpg",
            "../../../../assets/images/Rudi_2.jpg",
            "../../../../assets/images/Rudi_3.jpg",
            "../../../../assets/images/Rudi_2.jpg"
        ];

        const resultVideos = [
            "../../../../assets/animation/HR_correct.mp4",
            "../../../../assets/animation/HR_wrong1.mp4",
            "../../../../assets/animation/HR_wrong2.mp4",
            "../../../../assets/animation/HR_wrong3.mp4"
        ];

        const content = document.createElement("div");
        content.className = "henry-gallery";

        content.innerHTML = `
        <h2>${step.name || "Henry Rudi"}</h2>

        <div class="henry-gallery__grid"></div>

        <p class="henry-gallery__feedback">
            Select the image that matches the signal.
        </p>
    `;

        const overlay = window.ATTACHMENT_UI.open({
            label: step.name || "Henry Rudi gallery",
            content,
            panelClass: "attachment-panel--henry-gallery"
        });

        const galleryGrid = content.querySelector(
            ".henry-gallery__grid"
        );

        let videoPlaying = false;

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
                if (videoPlaying) {
                    return;
                }

                videoPlaying = true;
                imageButton.classList.add("selected");

                playHenryRudiResultVideo(
                    resultVideos[index],
                    () => {
                        videoPlaying = false;

                        if (
                            index === 0 &&
                            typeof done === "function"
                        ) {
                            done();
                        }
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

        overlay.className =
            "attack-overlay scanlines active flicker";

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
                    muted
                >
                    <source
                        src="../../../../assets/images/hacker_video.mp4"
                        type="video/mp4"
                    >
                </video>

                <button
                    type="button"
                    class="continue-btn"
                >
                    Continue
                </button>
            </div>

            <div class="blackout"></div>

            <audio
                class="monument-sound"
                src="../../../../assets/audio/Hacker.mp3"
                preload="auto"
            ></audio>
        `;

        document.body.appendChild(overlay);

        const disconnectText =
            overlay.querySelector(".disconnect-text");

        const codeBox =
            overlay.querySelector(".code-box");

        const maskWrap =
            overlay.querySelector(".mask-wrap");

        const videoWrap =
            overlay.querySelector(".video-wrap");

        const video =
            overlay.querySelector(".hacker-video");

        const continueButton =
            overlay.querySelector(".continue-btn");

        const blackout =
            overlay.querySelector(".blackout");

        const monumentSound =
            overlay.querySelector(".monument-sound");

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

        video.addEventListener("play", () => {
            monumentSound.play().catch(error => {
                console.log(
                    "Audio could not start:",
                    error
                );
            });
        });

        video.addEventListener("pause", () => {
            monumentSound.pause();
        });

        video.addEventListener("ended", () => {
            monumentSound.pause();
            monumentSound.currentTime = 0;
            continueButton.classList.add("show");
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
    onFinished
) {
    const video = document.createElement("video");

    video.className =
        "attachment-media attachment-video";

    video.src = videoSource;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";
    video.controls = false;

    let completed = false;
    let videoOverlay = null;

    function complete() {
        if (completed) {
            return;
        }

        completed = true;

        video.pause();
        video.removeAttribute("src");
        video.load();

        if (videoOverlay) {
            videoOverlay.close();
        }
    }

    videoOverlay = window.ATTACHMENT_UI.open({
        label: "Henry Rudi result",
        content: video,
        panelClass: "attachment-panel--media",

        onClose() {
            if (typeof onFinished === "function") {
                onFinished();
            }
        }
    });

    video.addEventListener(
        "ended",
        complete,
        { once: true }
    );

    video.addEventListener(
        "error",
        () => {
            console.error(
                "Could not load Henry Rudi video:",
                videoSource,
                video.error
            );

            complete();
        },
        { once: true }
    );

    video.play().catch(error => {
        console.error(
            "Could not start Henry Rudi video:",
            videoSource,
            error
        );

        complete();
    });
}


/* dispatchSosAudio(step, done) {
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
}, */
