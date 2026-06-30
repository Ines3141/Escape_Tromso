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
            .chat {
                display:block;
                width: 320px;
                min-height: 560px;
                background: #061927;
                border-radius: 14px;
                padding: 16px;
                font-family: Arial, sans-serif;
                color: white;
            }

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

            .modal {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999;
            }

            .modal-content {
                background: #061927;
                color: white;
                padding: 20px;
                border-radius: 12px;
                max-width: 90%;
                max-height: 90%;
                text-align: center;
            }

            .modal-content img {
                max-width: 100%;
                max-height: 75vh;
            }
            .close {
                margin-top: 15px;
            }
        </style>
            <div class="chat">
                <div class="header">
                    <strong>${this.story.title}</strong>
                    <span>${this.story.status}</span>
                </div>
                <div id="messages"></div>
            </div>`;
        this.next();
    }

    next() {
        if (this.currentStep >= this.story.steps.length) return;
        const step = this.story.steps[this.currentStep];
        this.showTyping(step);
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
        }, 180);
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
        }
    }
    addImage(step) {
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

        this.currentStep++;
        localStorage.setItem(this.storyName + "_step", this.currentStep);
        this.next();
    }
    openImageFullscreen(src) {
        const modal = document.createElement("div");
        modal.className = "modal";

        modal.innerHTML = `
        <div class="modal-content">
            <img src="${src}">
            <br>
            <button class="close">Close</button>
        </div>
    `;

        modal.querySelector(".close").onclick = () => {
            modal.remove();
        };

        this.shadowRoot.appendChild(modal);
    }

    addText(step) {
        const div = document.createElement("div");
        const text = step.text.replaceAll(
            "{teamName}",
            localStorage.getItem("teamName") || ""
        );
        div.innerHTML = `
            <span class="time">${step.time || ""}</span>
            ${text}
        `;
        div.className = "message " + (
            step.sender === "user" ? "from-user" : "from-phone"
        );

        div.innerHTML = `
            <small>${step.time}</small><br>
            ${step.text.replace(
            "{teamName}",
            localStorage.getItem("teamName") || ""
        )}
        `;

        this.shadowRoot
            .querySelector("#messages")
            .appendChild(div);

        this.shadowRoot.querySelector("#messages").scrollTop =
            this.shadowRoot.querySelector("#messages").scrollHeight;
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

            localStorage.setItem(step.variable || "teamName", value);

            container.remove();

            const userMessage = document.createElement("div");
            userMessage.className = "message from-user";
            userMessage.textContent = value;

            this.shadowRoot.querySelector("#messages").appendChild(userMessage);

            this.currentStep++;
            localStorage.setItem(this.storyName + "_step", this.currentStep);
            this.next();
        };

        container.appendChild(input);
        container.appendChild(button);

        this.shadowRoot.querySelector("#messages").appendChild(question);
        this.shadowRoot.querySelector("#messages").appendChild(container);
    }           

    addFile(step) {
        const button = document.createElement("button");
        button.className = "file";
        button.innerHTML = `📄 ${step.name}`;

        button.onclick = () => {
            this.openAttachment(step);
        };

        this.shadowRoot.querySelector("#messages").appendChild(button);
    }
    openAttachment(step) {
        if (step.action && window.ATTACHMENTS && window.ATTACHMENTS[step.action]) {
            window.ATTACHMENTS[step.action](step, () => {
                this.advance();
            });
            return;
        }

        const modal = document.createElement("div");
        modal.className = "modal";

        const content = document.createElement("div");
        content.className = "modal-content";

        if (step.image) {
            content.innerHTML = `<img src="${step.image}">`;
        } else {
            content.innerHTML = `<p>${step.name}</p>`;
        }

        const close = document.createElement("button");
        close.className = "close";
        close.textContent = "Close";

        close.onclick = () => {
            modal.remove();
            this.advance();
        };

        content.appendChild(close);
        modal.appendChild(content);
        this.shadowRoot.appendChild(modal);
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
                container.remove();

                const div = document.createElement("div");
                div.className = "message from-user";

                div.innerHTML = `
                <span class="time">uploaded</span>
                <img class="chat-image" src="${reader.result}" alt="${file.name}">
            `;

                div.querySelector("img").onclick = () => {
                    this.openImageFullscreen(reader.result);
                };

                messages.appendChild(div);

                this.currentStep++;
                localStorage.setItem(this.storyName + "_step", this.currentStep);
                this.next();
            };

            reader.readAsDataURL(file);
        };

        container.appendChild(input);

        messages.appendChild(question);
        messages.appendChild(container);
    }
    advance() {
        this.currentStep++;
        localStorage.setItem(this.storyName + "_step", this.currentStep);
        this.next();
    }
}
customElements.define("story-chat", StoryChat);