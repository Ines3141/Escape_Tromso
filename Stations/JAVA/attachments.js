window.ATTACHMENTS = {
    sosSignal(step, done) {
        const overlay = document.createElement("div");
        overlay.className = "sos-overlay";

        overlay.innerHTML = `
            <button class="sos-close">Close</button>
            <div class="sos-map">
                <div class="sos-text">SOS</div>
            </div>
            <audio src="../../../../assets/audio/sos.mp3"></audio>
        `;

        document.body.appendChild(overlay);

        const audio = overlay.querySelector("audio");
        audio.play();

        let closed = false;

        const close = () => {
            if (closed) return;
            closed = true;

            audio.pause();
            overlay.remove();

            if (done) {
                done();
            }
        };

        overlay.querySelector(".sos-close").onclick = close;

        setTimeout(close, 10000);
    },

    imagePreview(step, done) {
        const overlay = document.createElement("div");
        overlay.className = "image-overlay";

        overlay.innerHTML = `
            <button class="sos-close">Close</button>
            <img src="${step.src}">
        `;

        document.body.appendChild(overlay);

        overlay.querySelector("button").onclick = () => {
            overlay.remove();

            if (done) {
                done();
            }
        };
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