class StoryChat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    formatTime(date = new Date()) {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    getMessageTime(step) {
        if (step && step.time) {
            return step.time;
        }

        return this.formatTime();
    }

    connectedCallback() {
        const storyName = this.getAttribute("story");
        this.story = STORIES[storyName];
        this.storyName = this.getAttribute("story");
        this.currentStep =
            Number(localStorage.getItem(this.storyName + "_step")
            ) || 0;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
            .chat-link {
                color: #4aa8ff;
                text-decoration: underline;
                cursor: pointer;
            }

            .chat-link:hover {
                color: #7bc3ff;
            }
            :host {
                display: block;
                width: 100%;
                max-width: 440px;
                height: 100%;
                min-width: 0;
                margin: 0 auto;
                padding: 0;
                box-sizing: border-box;
            }

            *,
            *::before,
            *::after {
                box-sizing: border-box;
            }


            /* ======================
               COMPLETE CHAT WINDOW
               ====================== */

        .chat {
            width: 100%;
            max-width: none;
            height: 100%;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
            background: #061927;
            border-radius: 14px;

            /*
            * Slightly tighter than before.
            */
            padding: 8px;
            font-family:
                Inter,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Helvetica,
                Arial,
                sans-serif;
            color: #f5f7f8;
        }


        /* =========================================================
        HEADER
        ========================================================= */

        .header {
            text-align: center;
            margin-bottom: 12px;
            padding: 3px 48px 7px;
        }

        .header strong {
            display: block;
            font-family:
                Inter,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                sans-serif;
            font-size: clamp(15px, 4vw, 18px);
            font-weight: 650;
            line-height: 1.25;
        }

        .header span {
            display: block;
            margin-top: 2px;
            color: #63e66c;
            font-size: 11px;
            line-height: 1.2;
        }


        /* =========================================================
        MESSAGE AREA
        ========================================================= */

        #messages {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 8px;

            /* Space for fixed navigation bar + phone safe area */
            padding-bottom: calc(120px + env(safe-area-inset-bottom));
            box-sizing: border-box;
        }


        /* =========================================================
        MESSAGE BUBBLES
        ========================================================= */

        .message {
            position: relative;
            width: fit-content;
            max-width: 80%;
            padding: 7px 9px;
            padding-right: 37px;
            padding-bottom: 7px;
            border-radius: 13px;
            border-top-left-radius: 5px;
            background: #20465d;
            border: 1px solid rgba(128, 190, 218, 0.16);
            color: #f4f7f8;
            font-size: 14px;
            line-height: 1.3;
            overflow-wrap: anywhere;
            box-shadow:
                0 1px 2px rgba(0, 0, 0, 0.18);
        }

        /* Incoming */

        .from-phone {
            align-self: flex-start;
            margin-right: auto;
            background: #20465d;
            border: 1px solid rgba(128, 190, 218, 0.16);
            border-top-left-radius: 5px;
        }

        /* User */

        .from-user {
            align-self: flex-end;
            margin-left: auto;
            background: #145f68;
            border: 1px solid rgba(115, 218, 201, 0.15);
            border-top-left-radius: 13px;
            border-top-right-radius: 5px;
        }

        /* =========================================================
        MESSAGE TEXT
        ========================================================= */

        .message-text {
            display: inline;
            margin: 0;
            padding: 0;
            word-break: break-word;
        }

        .time {
            position: absolute;
            right: 7px;
            bottom: 5px;
            margin: 0;
            color: rgba(235, 244, 247, 0.68);
            font-size: 9px;
            font-weight: 400;
            line-height: 1;
            white-space: nowrap;
        }


        /* =========================================================
        FILE ATTACHMENTS
        ========================================================= */

        button.file {
            width: fit-content;
            max-width: 86%;
            align-self: flex-start;
            display: flex;
            align-items: center;
            gap: 7px;
            background: #20465d;
            color: #f4f7f8;
            border: 1px solid rgba(128, 190, 218, 0.14);
            border-radius: 12px;
            padding: 8px 10px;
            text-align: left;
            cursor: pointer;
            font-family:
                Inter,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                sans-serif;

            font-size: 12px;
            overflow-wrap: anywhere;

            box-shadow:
                0 1px 2px rgba(0, 0, 0, 0.15);
        }


        /* =========================================================
        TYPING INDICATOR
        ========================================================= */

        .typing {
            align-self: flex-start;

            background: #20465d;

            border-radius: 12px;
            border-top-left-radius: 5px;

            padding: 8px 11px;

            display: flex;
            gap: 4px;

            box-shadow:
                0 1px 2px rgba(0, 0, 0, 0.15);
        }

        .typing span {
            width: 5px;
            height: 5px;

            background: rgba(255, 255, 255, 0.8);

            border-radius: 50%;

            animation: blink 1.2s infinite;
        }


        /* =========================================================
        SMALL PHONES
        ========================================================= */

        @media (max-width: 360px) {

            .chat {
                padding: 7px;
                border-radius: 12px;
            }

            .message,
            button.file {
                max-width: 91%;
            }

            .message {
                padding: 6px 8px;

                font-size: 13.5px;
                line-height: 1.3;
            }

            #messages {
                gap: 4px;
            }
        }


            /* ======================
               TYPING
               ====================== */

            .typing {
                align-self: flex-start;
                background: #20445a;
                border-radius: 12px;
                padding: 10px 13px;
                display: flex;
                gap: 4px;
            }

            .typing span {
                width: 6px;
                height: 6px;
                background: white;
                border-radius: 50%;
                animation: blink 1.2s infinite;
            }

            .typing span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes blink {
                0%,
                80%,
                100% {
                    opacity: 0.3;
                    transform: translateY(0);
                }

                40% {
                    opacity: 1;
                    transform: translateY(-3px);
                }
            }


            /* ======================
               FILE ATTACHMENTS
               ====================== */

            button.file {
                width: fit-content;
                max-width: 85%;
                align-self: flex-start;
                background: #20445a;
                color: white;
                border: none;
                border-radius: 12px;
                padding: 11px 13px;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                overflow-wrap: anywhere;
            }


            /* ======================
               NORMAL TEXT INPUT
               ====================== */

            .input-box {
                align-self: stretch;
                width: 100%;
                display: flex;
                gap: 8px;
                align-items: stretch;
                min-width: 0;
            }

            .input-box input:not([type="file"]) {
                flex: 1 1 auto;
                width: auto;
                min-width: 0;
                min-height: 44px;
                border-radius: 10px;
                border: 1px solid rgba(
                    255,
                    255,
                    255,
                    0.25
                );
                padding: 9px 11px;
                font-size: 16px;
            }

            .input-box button {
                min-height: 44px;
                border: none;
                border-radius: 10px;
                padding: 9px 14px;
                cursor: pointer;
                font-size: 14px;
            }

            /* ======================
               PHOTO UPLOAD
               ====================== */

            .upload-box {
                flex-direction: column;
            }

            .hidden-photo-input {
                position: absolute;
                width: 1px;
                height: 1px;
                opacity: 0;
                pointer-events: none;
                overflow: hidden;
            }

            .upload-actions {
                display: grid;
                grid-template-columns:
                    minmax(0, 1fr)
                    minmax(0, 1fr);
                gap: 8px;
                width: 100%;
            }

            .photo-button {
                width: 100%;
                min-height: 48px;
                border: none;
                border-radius: 10px;
                padding: 10px 12px;
                font-size: 15px;
                font-weight: bold;
                cursor: pointer;
            }

            .photo-button-skip {
                grid-column: 1 / -1;
            }

            .photo-button:disabled {
                opacity: 0.55;
                cursor: default;
            }

            .upload-status {
                min-height: 18px;

                font-size: 12px;

                line-height: 1.4;

                opacity: 0.85;
            }


            /* ======================
               IMAGES
               ====================== */

            .photo-message {
                padding: 6px;
            }

            .chat-image {
                display: block;
                width: 100%;
                max-width: 100%;
                height: auto;
                border-radius: 9px;
                cursor: pointer;
            }


            /* ======================
               VERY SMALL PHONES
               ====================== */

            @media (max-width: 360px) {

                :host {
                    padding-left: 8px;
                    padding-right: 8px;
                }

                .chat {
                    padding: 11px;
                    border-radius: 12px;
                }

                .message,
                button.file {
                    max-width: 92%;
                }

                .upload-actions {
                    grid-template-columns: 1fr;
                }

                .photo-button-skip {
                    grid-column: auto;
                }
            }


            /* ======================
               REDUCED MOTION
               ====================== */

            @media (prefers-reduced-motion: reduce) {

                .typing span {
                    animation: none;
                    opacity: 0.7;
                }
            }
        </style>
            <div class="chat">
                <div class="header">
                    <strong>${this.story.title}</strong>
                    <span>${this.story.status}</span>
                </div>
                <div id="messages"></div>
            </div>`;

        const chatBox = this.shadowRoot.querySelector(".chat");

        this.renderHistory();

        /* Automatically keep the chat scrolled to the newest message. */
        const messages = this.shadowRoot.querySelector("#messages");

        const scrollToBottom = () => {
            requestAnimationFrame(() => {
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        };

        /* Watch for new messages being added. */
        const observer = new MutationObserver(() => { scrollToBottom(); });

        observer.observe(messages, {
            childList: true,
            subtree: true
        });

        /* Also react when images change the height of the chat after loading. */
        if ("ResizeObserver" in window) {
            const resizeObserver =
                new ResizeObserver(() => {
                    scrollToBottom();
                });

            resizeObserver.observe(messages);
        }

        /* Start at the bottom when the page loads.*/
        scrollToBottom();
        this.next();

    }

    next() {
        if (this.currentStep >= this.story.steps.length) return;

        const step = this.story.steps[this.currentStep];

        if (step.type === "waitForFlag") {
            const expectedValue = step.value || "true";
            const actualValue = localStorage.getItem(step.flag);

            if (actualValue === expectedValue) {
                this.advance();
            }
            return;
        }
        this.showTyping(step);
    }

    renderHistory() {
        for (let i = 0; i < this.currentStep; i++) {
            const step = this.story.steps[i];
            switch (step.type) {
                case "text":
                    this.addText(step);
                    break;
                case "file":
                    this.addFile(step, false);
                    break;
                case "image":
                    this.addImage(step, false);
                    break;
                case "input":
                    this.addSavedInput(step);
                    break;
                case "upload":
                    this.addSavedUpload(step, i);
                    break;
                case "link":
                    this.addLink(step, false);
                    break;
                case "action":
                    // Do not replay completed animations.
                    break;
            }
        }
    }

    showTyping(step) {
        const messages = this.shadowRoot.querySelector("#messages");
        const typing = document.createElement("div");
        typing.className = "typing";
        typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>`;
        messages.appendChild(typing);

        const messageText = step.text || step.question || "";
        const baseDelay = 500;
        const delayPerCharacter = 45;
        const maximumDelay = 2500;
        const typingDuration = Math.min(
            baseDelay + messageText.length * delayPerCharacter,
            maximumDelay
        );

        setTimeout(() => {
            typing.remove();
            this.showStep(step);
        }, typingDuration);
    }

    showStep(step) {
        switch (step.type) {
            case "text":
                this.addText(step);
                this.advance();
                break;

            case "file":
                this.addFile(step);
                break;

            case "input":
                this.addInput(step);
                break;

            case "upload":
                this.addUpload(step);
                break;
            case "image":
                this.addImage(step);
                break;
            case "link":
                this.addLink(step);
                break;
            case "action":
                this.runAction(step);
                break;
        }
    }
    addImage(step, shouldAdvance = true) {
        const messages = this.shadowRoot.querySelector("#messages");

        const div = document.createElement("div");
        div.className = "message " + (
            step.sender === "user" ? "from-user" : "from-phone"
        );

        div.innerHTML = `
            <div class="message-text">
                <img class="chat-image" src="${step.src}" alt="${step.name || "image"}">
            </div>
            <span class="time">${this.getMessageTime(step)}</span>
        `;

        div.querySelector("img").onclick = () => {
            this.openImageFullscreen(step.src);
        };

        messages.appendChild(div);

        if (shouldAdvance) {
            this.advance();
        }
    }
    openImageFullscreen(src, alt = "Image preview", onClose = null) {
        window.ATTACHMENTS.openImage({ src, name: alt, alt }, onClose);
    }

    addText(step) {
        const div = document.createElement("div");

        div.className = "message " + (
            step.sender === "user" ? "from-user" : "from-phone"
        );

        const text = (step.text || "").replaceAll(
            "{teamName}",
            localStorage.getItem("teamName") || ""
        );

        div.innerHTML = `
        <div class="message-text">${text}</div>
        <span class="time">${this.getMessageTime(step)}</span>
    `;

        this.shadowRoot.querySelector("#messages").appendChild(div);
    }
    addInput(step) {
        const container = document.createElement("div");
        container.className = "input-box";

        const question = document.createElement("div");
        question.className = "message from-phone";
        question.innerHTML = `
        <div class="message-text">${step.question || ""}</div>
        <span class="time">${this.getMessageTime(step)}</span>
    `;

        const input = document.createElement("input");
        input.placeholder = step.placeholder || "Write here...";

        const button = document.createElement("button");
        button.textContent = "Send";

        button.onclick = () => {
            const value = input.value.trim();

            if (value === "") return;

            const normalizedValue = value.toLowerCase();

            if (step.correctAnswer) {
                if (normalizedValue !== step.correctAnswer.toLowerCase()) {
                    this.showWrongAnswer(step);
                    input.value = "";
                    return;
                }
            }

            if (step.acceptedAnswers) {
                const accepted = step.acceptedAnswers.map(answer => answer.toLowerCase());

                if (!accepted.includes(normalizedValue)) {
                    this.showWrongAnswer(step);
                    input.value = "";
                    return;
                }
            }

            container.remove();

            const userMessage = document.createElement("div");
            userMessage.className = "message from-user";
            userMessage.innerHTML = `
                <div class="message-text">${value}</div>
                <span class="time">${this.formatTime()}</span>
            `;

            this.shadowRoot.querySelector("#messages").appendChild(userMessage);

            this.saveInput(step, value);

            if (step.redirect) {
                window.location.href = step.redirect;
                return;
            }

            this.advance();
        };

        container.appendChild(input);
        container.appendChild(button);

        this.shadowRoot.querySelector("#messages").appendChild(question);
        this.shadowRoot.querySelector("#messages").appendChild(container);
    }
    showWrongAnswer(step) {
        const wrong = document.createElement("div");
        wrong.className = "message from-phone";
        wrong.innerHTML = step.wrongAnswer || "Please try again.";

        this.shadowRoot.querySelector("#messages").appendChild(wrong);
    }

    addFile(step, shouldAdvance = true) {
        const button = document.createElement("button");
        button.className = "file";
        button.innerHTML = `📄 ${step.name}`;

        /*
         * Find the position belonging to this attachment.
         * It may only advance while the chat is still on this step.
         */
        const stepIndex = this.story.steps.indexOf(step);

        button.onclick = () => {
            const canAdvance =
                shouldAdvance &&
                this.currentStep === stepIndex;

            this.openAttachment(step, canAdvance);
        };

        this.shadowRoot
            .querySelector("#messages")
            .appendChild(button);
    }
    openAttachment(step, shouldAdvance = true) {
        if (step.action && window.ATTACHMENTS && window.ATTACHMENTS[step.action]) {
            window.ATTACHMENTS[step.action](step, () => {
                if (shouldAdvance) {
                    this.advance();
                }
            });
            return;
        }

        if (step.open) {
            const dispatch = document.createElement("incoming-dispatch");
            dispatch.setAttribute("letter-id", step.open);
            document.body.appendChild(dispatch);

            if (shouldAdvance) {
                this.advance();
            }
            return;
        }



        if (step.image) {
            this.openImageFullscreen(
                step.image,
                step.name || "Attachment preview",
                () => {
                    if (shouldAdvance) {
                        this.advance();
                    }
                }
            );

            return;
        }

        /*
         * Only used when the attachment has no valid image.
         */
        const modal = document.createElement("div");
        modal.className = "modal";

        modal.innerHTML = `
    <div class="modal-content attachment-error">
        <button
            type="button"
            class="image-close"
            aria-label="Close attachment"
        >
            &times;
        </button>

        <p>
            Attachment not found:
            ${step.name || "Unknown attachment"}
        </p>
    </div>
`;

        const closeButton = modal.querySelector(".image-close");

        closeButton.addEventListener("click", () => {
            modal.remove();

            if (shouldAdvance) {
                this.advance();
            }
        });

        this.shadowRoot.appendChild(modal);
    }
    addSavedInput(step) {
        const messages = this.shadowRoot.querySelector("#messages");

        const question = document.createElement("div");
        question.className = "message from-phone";
        question.innerHTML = `
        <div class="message-text">${step.question || ""}</div>
        <span class="time">${this.getMessageTime(step)}</span>
    `;

        messages.appendChild(question);

        if (step.variable) {
            const savedValue = localStorage.getItem(step.variable);

            if (savedValue) {
                const userMessage = document.createElement("div");
                userMessage.className = "message from-user";
                userMessage.innerHTML = `
                    <div class="message-text">${savedValue}</div>
                    <span class="time">${this.formatTime()}</span>
                `;
                messages.appendChild(userMessage);
            }
        }
    }

    addSavedUpload(step, stepIndex) {
        const messages =
            this.shadowRoot.querySelector("#messages");

        const question = document.createElement("div");

        question.className = "message from-phone";

        question.innerHTML = `
        <div class="message-text">${step.question || "Please take a photo."}</div>
        <span class="time">${this.getMessageTime(step)}</span>
    `;

        messages.appendChild(question);

        const savedUpload = localStorage.getItem(
            this.storyName + "_upload_" + stepIndex
        );

        if (!savedUpload) {
            return;
        }

        let uploadData;

        try {
            uploadData = JSON.parse(savedUpload);
        } catch (error) {
            console.error(
                "Saved upload could not be read:",
                error
            );
            return;
        }

        /*
         * Previously skipped.
         */
        if (uploadData.skipped) {
            const skippedMessage =
                document.createElement("div");

            skippedMessage.className =
                "message from-user";

            skippedMessage.textContent =
                "Photo skipped.";

            messages.appendChild(skippedMessage);

            return;
        }

        /*
         * No actual image stored.
         */
        if (!uploadData.src) {
            return;
        }

        const div = document.createElement("div");

        div.className =
            "message from-user photo-message";

        div.innerHTML = `
        <div class="message-text">
            <img
                class="chat-image"
                src="${uploadData.src}"
                alt="${uploadData.name || "Uploaded photo"}"
            >
        </div>
        <span class="time">${this.formatTime()}</span>
    `;

        div
            .querySelector("img")
            .addEventListener(
                "click",
                () => {
                    this.openImageFullscreen(
                        uploadData.src,
                        uploadData.name ||
                        "Uploaded photo"
                    );
                }
            );

        messages.appendChild(div);
    }

    /* A photo is reduced to a maximum of 1280 px before you put it into storage. */
    compressPhoto(file) {
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
        const MAX_SIDE = 1280;
        const JPEG_QUALITY = 0.72;

        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error("No photo selected."));
                return;
            }

            if (!file.type.startsWith("image/")) {
                reject(new Error("Please select an image."));
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                reject(
                    new Error(
                        "This photo is too large. Please take another photo."
                    )
                );
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            const image = new Image();

            image.onload = () => {
                URL.revokeObjectURL(objectUrl);

                const originalWidth = image.naturalWidth;
                const originalHeight = image.naturalHeight;

                const scale = Math.min(
                    1,
                    MAX_SIDE / originalWidth,
                    MAX_SIDE / originalHeight
                );

                const width = Math.round(originalWidth * scale);
                const height = Math.round(originalHeight * scale);

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext("2d");

                if (!context) {
                    reject(
                        new Error("The photo could not be processed.")
                    );
                    return;
                }

                // White background in case the source has transparency.
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, width, height);

                context.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );

                canvas.toBlob(
                    blob => {
                        if (!blob) {
                            reject(
                                new Error(
                                    "The photo could not be compressed."
                                )
                            );
                            return;
                        }

                        const reader = new FileReader();

                        reader.onload = () => {
                            resolve(reader.result);
                        };

                        reader.onerror = () => {
                            reject(
                                new Error(
                                    "The photo could not be read."
                                )
                            );
                        };

                        reader.readAsDataURL(blob);
                    },
                    "image/jpeg",
                    JPEG_QUALITY
                );
            };

            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);

                reject(
                    new Error(
                        "This photo format could not be opened. Please take a new photo."
                    )
                );
            };

            image.src = objectUrl;
        });
    }
    addUpload(step) {
        const messages =
            this.shadowRoot.querySelector("#messages");

        const question = document.createElement("div");
        question.className = "message from-phone";

        question.innerHTML = `
        <span class="time">${step.time || ""}</span>
        ${step.question || "Please take a photo."}
    `;

        const container = document.createElement("div");
        container.className = "input-box upload-box";

        /*
         * Camera input
         */
        const cameraInput = document.createElement("input");

        cameraInput.type = "file";
        cameraInput.accept = "image/*";

        // Ask mobile phones to use the rear camera.
        cameraInput.setAttribute(
            "capture",
            "environment"
        );

        cameraInput.className = "hidden-photo-input";

        /*
         * Normal photo-library input.
         * This is the fallback for phones/browsers that
         * do not support capture properly.
         */
        const galleryInput = document.createElement("input");

        galleryInput.type = "file";
        galleryInput.accept = "image/*";
        galleryInput.className = "hidden-photo-input";

        /*
         * Visible buttons
         */
        const takePhotoButton =
            document.createElement("button");

        takePhotoButton.type = "button";
        takePhotoButton.className = "photo-button";
        takePhotoButton.textContent = "📷 Take photo";

        const choosePhotoButton =
            document.createElement("button");

        choosePhotoButton.type = "button";
        choosePhotoButton.className =
            "photo-button photo-button-secondary";

        choosePhotoButton.textContent = "Choose photo";

        const skipButton = document.createElement("button");

        skipButton.type = "button";
        skipButton.className =
            "photo-button photo-button-skip";

        skipButton.textContent = "Skip";

        /*
         * Status/error message
         */
        const status = document.createElement("div");

        status.className = "upload-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");

        /*
         * Open camera.
         */
        takePhotoButton.addEventListener(
            "click",
            () => {
                cameraInput.click();
            }
        );

        /*
         * Open normal photo chooser.
         */
        choosePhotoButton.addEventListener(
            "click",
            () => {
                galleryInput.click();
            }
        );

        /*
         * Process photo from either input.
         */
        const processPhoto = async file => {
            if (!file) {
                return;
            }

            takePhotoButton.disabled = true;
            choosePhotoButton.disabled = true;
            skipButton.disabled = true;

            status.textContent = "Preparing photo...";

            try {
                /*
                 * Resize + convert to a reasonably small JPEG.
                 */
                const imageData =
                    await this.compressPhoto(file);

                /*
                 * Save it.
                 *
                 * localStorage can fail when it is full,
                 * so this MUST be inside try/catch.
                 */
                try {
                    localStorage.setItem(
                        this.storyName +
                        "_upload_" +
                        this.currentStep,
                        JSON.stringify({
                            src: imageData,
                            name: "team-photo.jpg"
                        })
                    );

                    localStorage.setItem(
                        "teamPhoto",
                        imageData
                    );
                } catch (storageError) {
                    console.error(
                        "Could not save photo:",
                        storageError
                    );

                    throw new Error(
                        "There is not enough storage space for the photo."
                    );
                }

                /*
                 * Remove upload controls.
                 */
                container.remove();

                /*
                 * Display photo as user message.
                 */
                const div = document.createElement("div");

                div.className =
                    "message from-user photo-message";

                div.innerHTML = `
                <span class="time">uploaded</span>

                <img
                    class="chat-image"
                    src="${imageData}"
                    alt="Uploaded team photo"
                >
            `;

                div
                    .querySelector("img")
                    .addEventListener(
                        "click",
                        () => {
                            this.openImageFullscreen(
                                imageData,
                                "Uploaded team photo"
                            );
                        }
                    );

                messages.appendChild(div);

                this.advance();

            } catch (error) {
                console.error(
                    "Photo upload failed:",
                    error
                );

                status.textContent =
                    error.message ||
                    "The photo could not be uploaded.";

                /*
                 * Allow user to try again.
                 */
                takePhotoButton.disabled = false;
                choosePhotoButton.disabled = false;
                skipButton.disabled = false;

                cameraInput.value = "";
                galleryInput.value = "";
            }
        };

        cameraInput.addEventListener(
            "change",
            () => {
                processPhoto(cameraInput.files[0]);
            }
        );

        galleryInput.addEventListener(
            "change",
            () => {
                processPhoto(galleryInput.files[0]);
            }
        );

        /*
         * Skip photo.
         */
        skipButton.addEventListener(
            "click",
            () => {
                localStorage.setItem(
                    this.storyName +
                    "_upload_" +
                    this.currentStep,
                    JSON.stringify({
                        skipped: true
                    })
                );

                container.remove();

                const div = document.createElement("div");
                div.className = "message from-user";
                div.textContent = "Photo skipped.";

                messages.appendChild(div);

                this.advance();
            }
        );

        /*
         * Button area
         */
        const actions = document.createElement("div");
        actions.className = "upload-actions";

        actions.appendChild(takePhotoButton);
        actions.appendChild(choosePhotoButton);
        actions.appendChild(skipButton);

        container.appendChild(cameraInput);
        container.appendChild(galleryInput);
        container.appendChild(actions);
        container.appendChild(status);

        messages.appendChild(question);
        messages.appendChild(container);
    }
    /* Next step in chat */
    advance() {
        this.currentStep++;
        localStorage.setItem(this.storyName + "_step", this.currentStep);
        this.next();
    }
    /* Helper function to save parameter in local storage. */
    saveInput(step, value) {
        if (step.variable) {
            localStorage.setItem(step.variable, value);
        }
    }
    addLink(step, shouldAdvance = true) {
        const div = document.createElement("div");

        div.className =
            "message " +
            (step.sender === "user" ? "from-user" : "from-phone");

        div.innerHTML = `
        <span class="time">${step.time || ""}</span>
        <span class="chat-link">${step.text}</span>
    `;

        div.onclick = () => {
            if (shouldAdvance) {
                this.currentStep++;
                localStorage.setItem(
                    this.storyName + "_step",
                    this.currentStep
                );
            }

            window.location.href = step.href;
        };

        this.shadowRoot
            .querySelector("#messages")
            .appendChild(div);
    }
    runAction(step) {
        const actionFunction =
            window.ATTACHMENTS &&
            window.ATTACHMENTS[step.action];

        if (typeof actionFunction !== "function") {
            console.error(
                `Attachment action "${step.action}" was not found.`
            );

            this.advance();
            return;
        }

        actionFunction(step, () => {
            this.advance();
        });
    }
}
customElements.define("story-chat", StoryChat);