class StoryChat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
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
            .header {
                text-align: center;
                margin-bottom: 20px;
            }

            .header strong {
                display: block;
                font-size: 14px;
            }

            .header span {
                color: #6cff6c;
                font-size: 12px;
            }

            #messages {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .message {
                max-width: 85%;
                background: #20445a;
                border-radius: 9px;
                padding: 8px 10px;
                font-size: 12px;
                line-height: 1.35;
                color: white;
            }

            .from-phone {
                align-self: flex-start;
            }

            .from-user {
                align-self: flex-end;
            }

            .time {
                display: block;
                text-align: center;
                font-size: 10px;
                opacity: 0.7;
                margin-bottom: 2px;
            }

            .typing {
                align-self: flex-start;
                background: #20445a;
                border-radius: 9px;
                padding: 8px 12px;
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
                0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
                40% { opacity: 1; transform: translateY(-3px); }
            }

            button.file {
                max-width: 85%;
                align-self: flex-start;
                background: #20445a;
                color: white;
                border: none;
                border-radius: 9px;
                padding: 10px;
                text-align: left;
                cursor: pointer;
                font-weight: bold;
            }

            .input-box {
                align-self: flex-end;
                display: flex;
                gap: 5px;
            }

            .input-box input {
                width: 130px;
            }

            .chat-image {
                max-width: 100%;
                border-radius: 8px;
                cursor: pointer;
            }
            :host {
                display: flex;
                justify-content: center;
                width: 100%;
                max-width: 100%;
                min-width: 0;
                margin: 20px auto 0;
                box-sizing: border-box;
            }

            * {
                box-sizing: border-box;
            }

            .chat {
                display: block;
                width: 100%;
                max-width: 320px;
                height: 560px;
                overflow-y: auto;
                overflow-x: hidden;
                background: #061927;
                border-radius: 14px;
                padding: 16px;
                font-family: Arial, sans-serif;
                color: white;
            }
            .chat-link {
                color: #4aa8ff;
                text-decoration: underline;
                cursor: pointer;
            }

            .chat-link:hover {
                color: #7bc3ff;
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

        chatBox.addEventListener("scroll", () => {
            localStorage.setItem(this.storyName + "_scroll", chatBox.scrollTop);
        });

        this.renderHistory();

        setTimeout(() => {
            const savedScroll = Number(localStorage.getItem(this.storyName + "_scroll")) || 0;
            chatBox.scrollTop = savedScroll;
        }, 1000);

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
        setTimeout(() => {
            typing.remove();
            this.showStep(step);
        }, 1000);
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
            <span class="time">${step.time || ""}</span>
            <img class="chat-image" src="${step.src}" alt="${step.name || "image"}">
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
        <span class="time">${step.time || ""}</span>
        ${text}
    `;

        this.shadowRoot.querySelector("#messages").appendChild(div);
    }
    addInput(step) {
        const container = document.createElement("div");
        container.className = "input-box";

        const question = document.createElement("div");
        question.className = "message from-phone";
        question.innerHTML = `
        <span class="time">${step.time || ""}</span>
        ${step.question || ""}
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
            userMessage.textContent = value;

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
        <span class="time">${step.time || ""}</span>
        ${step.question || ""}
    `;

        messages.appendChild(question);

        if (step.variable) {
            const savedValue = localStorage.getItem(step.variable);

            if (savedValue) {
                const userMessage = document.createElement("div");
                userMessage.className = "message from-user";
                userMessage.textContent = savedValue;
                messages.appendChild(userMessage);
            }
        }
    }

    addSavedUpload(step, stepIndex) {
        const messages = this.shadowRoot.querySelector("#messages");

        const question = document.createElement("div");
        question.className = "message from-phone";
        question.innerHTML = `
        <span class="time">${step.time || ""}</span>
        ${step.question || "Please upload a file."}
    `;

        messages.appendChild(question);

        const savedUpload = localStorage.getItem(this.storyName + "_upload_" + stepIndex);

        if (!savedUpload) return;

        const uploadData = JSON.parse(savedUpload);

        const div = document.createElement("div");
        div.className = "message from-user";
        div.innerHTML = `
        <span class="time">uploaded</span>
        <img class="chat-image" src="${uploadData.src}" alt="${uploadData.name}">
    `;

        div.querySelector("img").onclick = () => {
            this.openImageFullscreen(uploadData.src);
        };

        messages.appendChild(div);
    }
    addUpload(step) {
        const messages = this.shadowRoot.querySelector("#messages");

        const question = document.createElement("div");
        question.className = "message from-phone";
        question.innerHTML = `
        <span class="time">${step.time || ""}</span>
        ${step.question || "Please upload a file."}
    `;

        const container = document.createElement("div");
        container.className = "input-box";

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = () => {
            if (!input.files.length) return;

            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const imageData = reader.result;

                localStorage.setItem(
                    this.storyName + "_upload_" + this.currentStep,
                    JSON.stringify({
                        src: imageData,
                        name: file.name
                    })
                );

                localStorage.setItem("teamPhoto", imageData);

                container.remove();

                const div = document.createElement("div");
                div.className = "message from-user";

                div.innerHTML = `
                    <span class="time">uploaded</span>
                    <img
                        class="chat-image"
                        src="${imageData}"
                        alt="${file.name}"
                    >
                `;

                div.querySelector("img").onclick = () => {
                    this.openImageFullscreen(imageData);
                };

                messages.appendChild(div);
                this.advance();
            };

            reader.readAsDataURL(file);
        };

        container.appendChild(input);

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