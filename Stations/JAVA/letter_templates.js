function getLetterStyles() {
    return `
        .letter-paper {
            margin-top: 24px;
            padding: 24px;
            background: #f5efe0;
            color: #2b2418;
            border-radius: 16px;
            text-align: left;
        }

        .letter-paper h3,
        .letter-paper p,
        .letter-paper strong,
        .letter-content,
        .letter-content * {
            color: #2b2418 !important;
        }

        .letter-content {
            line-height: 1.5;
        }

        .note {
            margin: 18px 0;
            padding: 16px;
            border-radius: 12px;
            background: rgba(0,0,0,0.08);
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 4px;
            color: #2b2418 !important;
        }

        .lamp-box {
            margin: 18px 0;
            padding: 16px;
            border-radius: 12px;
            background: rgba(0,0,0,0.08);
            text-align: center;
        }

        .lamp {
            width: 90px;
            height: 90px;
            margin: 16px auto;
            border-radius: 50%;
            background: #202020;
            border: 5px solid #111;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.8);
        }

        .lamp.on {
            background: #ffe66d;
            box-shadow:
                0 0 25px #ffe66d,
                0 0 55px #ffe66d,
                inset 0 0 10px rgba(255,255,255,0.8);
        }
    `;
}

function renderLetterHTML(letter) {
    return `
        <div class="letter-paper">
            <h3>${letter.title}</h3>

            ${letter.hasLamp
            ? `
                        <div class="lamp-box">
                            <p><strong>Recovered blinking signal:</strong></p>
                            <div class="lamp morse-lamp"></div>
                        </div>
                    `
            : ""
        }

            <div class="letter-content">
                ${letter.content}
            </div>
        </div>
    `;
}

function startMorseLamps(root) {
    const lamps = root.querySelectorAll(".morse-lamp");

    lamps.forEach(lamp => {
        if (lamp.dataset.started === "true") return;
        lamp.dataset.started = "true";

        const pattern = [
            "dot", "dot", "dash", "dot",
            "pause",
            "dot", "dot", "dash", "dot"
        ];

        function blink() {
            let delay = 0;

            pattern.forEach(symbol => {
                if (symbol === "pause") {
                    delay += 1000;
                    return;
                }

                const duration = symbol === "dot" ? 250 : 750;

                setTimeout(() => lamp.classList.add("on"), delay);
                setTimeout(() => lamp.classList.remove("on"), delay + duration);

                delay += duration + 300;
            });

            setTimeout(blink, delay + 1800);
        }

        blink();
    });
}