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

        const close = () => {
            audio.pause();
            overlay.remove();
            done();
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
            done();
        };
    }
};