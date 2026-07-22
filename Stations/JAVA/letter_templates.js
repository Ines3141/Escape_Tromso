/*
All letter references for nansen and amundsen.
Connected to incoming_dispatch.js.
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
            <div class="letter-content">
                ${letter.content}
            </div>
        </div>
    `;
}

