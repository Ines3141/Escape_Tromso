/*
All letter references for Gate to the arctic, nansen and amundsen
 */
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
            color: #2b2418 !important; /* very dark warm brown */
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

        /* Station 1 Circle for Lamp illustration */
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
        .toggle-switch {
            width: 80px;
            height: 50px;
            margin: 0 auto 12px;
            position: relative;
            cursor: pointer;
        }

        .toggle-switch::before {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 50px;
            height: 20px;
            background: #444;
            border-radius: 8px;
            border: 2px solid #222;
            box-shadow:
            inset 0 2px 4px rgba(255,255,255,0.2),
            inset 0 -2px 4px rgba(0,0,0,0.4);
        }

        .lever {
            position: absolute;
            left: 50%;
            bottom: 10px;
            width: 8px;
            height: 35px;
            background: silver;
            border-radius: 4px;
            transform-origin: bottom center;
            transform: translateX(-50%) rotate(-30deg);
            transition: transform 0.25s ease;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
        }

        .lever::after {
            content: "";
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #d9d9d9;
            border: 2px solid #888;
        }

        .toggle-switch.on .lever {
            transform: translateX(-50%) rotate(30deg);
        }

        .switch-label {
            text-align: center;
            font-weight: bold;
            margin-bottom: 12px;
            color: #2b2418;
        }

        /* Riddle 2 Nansen */

        .year-lock {
            margin: 18px 0;
            padding: 16px;
            border-radius: 14px;
            background: rgba(0,0,0,0.08);
            text-align: center;
        }

        .lock-row {
            display: flex;
            justify-content: center;
            gap: 6px;
            margin: 8px 0;
        }

        .lock-cell {
            width: 42px;
            height: 46px;
            border: 2px solid #8b6f3e;
            border-radius: 8px;
            background: #fff8e8;
            color: #2b2418;
            font-size: 22px;
            font-weight: 900;
            text-align: center;
        }

        .lock-symbol {
            width: 42px;
            font-size: 24px;
            font-weight: 900;
        }

        .lock-result {
            width: 42px;
            height: 46px;
            border: 2px solid #8b6f3e;
            border-radius: 8px;
            background: #fff8e8;
            color: #2b2418;
            font-size: 20px;
            font-weight: 900;
            text-align: center;
        }

        .lock-cell.correct,
        .lock-result.correct {
            background: #d7ffd9;
            border-color: #2f9e44;
        }

        .lock-message {
            margin-top: 12px;
            font-weight: bold;
        }

        .lock-check-btn {
            margin-top: 12px;
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            background: #2b2418;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }
        `;
}

function renderLetterHTML(letter) {
    return `
        <div class="letter-paper">
            <h3>${letter.title}</h3>

            ${letter.hasLamp ? `
                <div class="lamp-box">
                    <p><strong>Recovered blinking signal:</strong></p>
                    <div class="toggle-switch">
                        <div class="lever"></div>
                    </div>
                    <p class="switch-label">OFF</p>
                    <div class="lamp morse-lamp"></div>
                </div>`: ""}
            <div class="letter-content">
                ${letter.content}
            </div>
        </div>
    `;
}

/* Function for Station 1: Morse Code + ON/OFF lever */
function setupMorseLamps(root) {
    const lamps = root.querySelectorAll(".morse-lamp");

    lamps.forEach(lamp => {
        if (lamp.dataset.ready === "true") return;
        lamp.dataset.ready = "true";

        const switchEl =
            lamp.closest(".lamp-box").querySelector(".toggle-switch");

        const label =
            lamp.closest(".lamp-box").querySelector(".switch-label");

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

        let running = false;
        let timers = [];

        function clearTimers() {
            timers.forEach(timer => clearTimeout(timer));
            timers = [];
            lamp.classList.remove("on");
        }

        function blink() {
            if (!running) return;

            let delay = 0;

            pattern.forEach(symbol => {
                if (symbol === "pause") {
                    delay += 1000;
                    return;
                }

                const duration = symbol === "dot" ? 250 : 750;

                timers.push(setTimeout(() => {
                    if (running) lamp.classList.add("on");
                }, delay));

                timers.push(setTimeout(() => {
                    lamp.classList.remove("on");
                }, delay + duration));

                delay += duration + 300;
            });

            timers.push(setTimeout(blink, delay + 1800));
        }

        switchEl.addEventListener("click", () => {
            running = !running;

            switchEl.classList.toggle("on", running);
            label.textContent = running ? "ON" : "OFF";

            if (running) {
                blink();
            } else {
                clearTimers();
            }
        });
    });
}