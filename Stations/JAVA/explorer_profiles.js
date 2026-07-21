(function () {
    window.INVENTORY_FILES = window.INVENTORY_FILES || {};

    const PROFILE_IMAGES = {
        rudi: "../../../../assets/images/rudi.jpg",
        amundsen: "../../../../assets/images/amundsen.jpg",
        nansen: "../../../../assets/images/nansen.jpg",
        wanny: "../../../../assets/images/wanny.jpg",
        placeholder: "../../../../assets/images/file_placeholder.png"
    };

    function injectRudiNewspaperStyles() {
        if (document.getElementById("rudi-newspaper-styles")) return;

        const style = document.createElement("style");
        style.id = "rudi-newspaper-styles";

        style.textContent = `
            .rudi-newspaper-overlay {
                position: fixed;
                inset: 0;
                z-index: 100002;
                background: rgba(12, 8, 4, 0.88);
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 22px;
            }

            .rudi-newspaper-paper {
                position: relative;
                width: min(92vw, 820px);
                max-height: 90vh;
                overflow-y: auto;
                padding: 34px;
                color: #24190f;
                background:
                    radial-gradient(circle at 20% 15%, rgba(120, 90, 50, 0.12), transparent 28%),
                    radial-gradient(circle at 80% 45%, rgba(100, 70, 35, 0.11), transparent 30%),
                    linear-gradient(135deg, #f1e4c5 0%, #e2cf9e 48%, #f5e8c8 100%);
                border: 1px solid #6f5735;
                box-shadow:
                    0 25px 70px rgba(0, 0, 0, 0.65),
                    inset 0 0 55px rgba(80, 45, 15, 0.22);
                font-family: Georgia, "Times New Roman", serif;
            }

            .rudi-newspaper-paper::before {
                content: "";
                position: absolute;
                inset: 12px;
                border: 2px solid rgba(63, 42, 22, 0.75);
                pointer-events: none;
            }

            .rudi-newspaper-paper::after {
                content: "";
                position: absolute;
                inset: 0;
                background-image:
                    repeating-linear-gradient(
                        0deg,
                        rgba(40, 25, 12, 0.035) 0px,
                        rgba(40, 25, 12, 0.035) 1px,
                        transparent 1px,
                        transparent 4px
                    );
                opacity: 0.5;
                pointer-events: none;
            }

            .rudi-newspaper-close {
                position: absolute;
                top: 14px;
                right: 14px;
                z-index: 3;
                width: 38px;
                height: 38px;
                border: 1px solid #3b2a18;
                border-radius: 50%;
                background: #24190f;
                color: #f5e8c8;
                font-size: 24px;
                line-height: 1;
                cursor: pointer;
            }

            .rudi-newspaper-header {
                position: relative;
                z-index: 2;
                text-align: center;
                border-bottom: 5px double #2d2115;
                padding-bottom: 16px;
                margin-bottom: 22px;
            }

            .rudi-newspaper-kicker {
                font-size: 13px;
                letter-spacing: 4px;
                text-transform: uppercase;
                margin-bottom: 8px;
            }

            .rudi-newspaper-header h1 {
                margin: 0;
                font-size: clamp(32px, 6vw, 58px);
                line-height: 0.95;
                text-transform: uppercase;
                letter-spacing: -1px;
            }

            .rudi-newspaper-date {
                margin-top: 10px;
                font-size: 14px;
                font-style: italic;
            }

            .rudi-newspaper-main {
                position: relative;
                z-index: 2;
            }

            .rudi-newspaper-figure {
                margin: 0 0 16px;
                padding: 10px;
                border: 2px solid #3d2b18;
                background: rgba(255, 248, 220, 0.35);
            }

            .rudi-newspaper-figure img {
                display: block;
                width: 100%;
                max-height: 380px;
                object-fit: cover;
                filter: sepia(55%) contrast(1.05) grayscale(20%);
                border: 1px solid #2d2115;
            }

            .rudi-newspaper-figure figcaption {
                margin-top: 8px;
                font-size: 13px;
                font-style: italic;
                text-align: center;
            }

            .rudi-newspaper-divider {
                height: 1px;
                background: #2d2115;
                margin: 18px 0;
            }

            .rudi-newspaper-body h2 {
                margin: 0 0 12px;
                font-size: 28px;
                line-height: 1;
                text-align: center;
                text-transform: uppercase;
                border-top: 2px solid #2d2115;
                border-bottom: 2px solid #2d2115;
                padding: 8px 0;
            }

            .rudi-newspaper-text {
                column-count: 2;
                column-gap: 34px;
                text-align: justify;
                font-size: 17px;
                line-height: 1.55;
            }

            .rudi-newspaper-text p {
                margin-top: 0;
                margin-bottom: 14px;
            }

            .rudi-newspaper-text p:first-child::first-letter {
                float: left;
                font-size: 54px;
                line-height: 0.9;
                padding-right: 8px;
                font-weight: bold;
            }

            @media (max-width: 650px) {
                .rudi-newspaper-paper {
                    padding: 24px;
                }

                .rudi-newspaper-text {
                    column-count: 1;
                    text-align: left;
                }

                .rudi-newspaper-body h2 {
                    font-size: 22px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function openPlaceholderFile(item, message) {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.zIndex = "100002";
        overlay.style.background = "rgba(0,0,0,0.85)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.padding = "20px";

        const box = document.createElement("div");
        box.style.background = "#f5efe0";
        box.style.color = "#2b2418";
        box.style.borderRadius = "18px";
        box.style.padding = "24px";
        box.style.maxWidth = "600px";
        box.style.width = "100%";
        box.style.position = "relative";
        box.style.textAlign = "center";

        box.innerHTML = `
            <button id="closeExplorerPlaceholder" style="
                position:absolute;
                top:12px;
                right:12px;
                width:40px;
                height:40px;
                border:none;
                border-radius:50%;
                background:#111;
                color:white;
                font-size:22px;
                cursor:pointer;
            ">×</button>

            <h2>${item.fileTitle || item.title}</h2>

            <p style="line-height:1.5;">
                ${message || "This file content will be added later."}
            </p>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        box.querySelector("#closeExplorerPlaceholder").onclick = () => {
            overlay.remove();
        };

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    }

    /* =========================================================
       HENRY RUDI FILE
       ========================================================= */

    window.INVENTORY_FILES.rudiNewspaper = function (item) {
        injectRudiNewspaperStyles();

        const overlay = document.createElement("div");
        overlay.className = "rudi-newspaper-overlay";

        const imageSrc = item.newspaperImage || item.fileImage || PROFILE_IMAGES.rudi;

        overlay.innerHTML = `
            <article class="rudi-newspaper-paper">
                <button class="rudi-newspaper-close" id="closeRudiNewspaper">×</button>

                <header class="rudi-newspaper-header">
                    <div class="rudi-newspaper-kicker">Arctic Historical News</div>

                    <h1>${item.newspaperTitle || item.title}</h1>

                    <div class="rudi-newspaper-date">
                        ${item.newspaperDate || ""}
                    </div>
                </header>

                <section class="rudi-newspaper-main">
                    <figure class="rudi-newspaper-figure">
                        <img 
                            src="${imageSrc}" 
                            alt="${item.title}"
                            onerror="this.src='${PROFILE_IMAGES.placeholder}';"
                        >

                        <figcaption>
                            ${item.newspaperImageDate || ""}
                        </figcaption>
                    </figure>

                    <div class="rudi-newspaper-divider"></div>

                    <section class="rudi-newspaper-body">
                        <h2>Hunter of the Arctic Returns to Tromsø</h2>

                        <div class="rudi-newspaper-text">
                            ${item.newspaperText || item.description || ""}
                        </div>
                    </section>
                </section>
            </article>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector("#closeRudiNewspaper").addEventListener("click", () => {
            overlay.remove();
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    };

    window.addRudiProfileToInventory = function () {
        addInventoryItem({
            id: "profile-rudi",
            title: "Henry Rudi",
            type: "dossier",
            fileAction: "rudiNewspaper",

            birthDate: "26 February 1889",
            achievements: [
                "Norwegian Arctic hunter",
                "Known as the Polar Bear King",
                "Spent many years on Svalbard",
                "Connected with Tromsø and Ølhallen"
            ],

            fileTitle: "Henry Rudi – Arctic Profile",
            fileImage: PROFILE_IMAGES.rudi,

            newspaperTitle: "The Arctic Hunter Henry Rudi",
            newspaperDate: "Tromsø Historical Archive",
            newspaperImage: PROFILE_IMAGES.rudi,
            newspaperImageDate: "Photograph taken during Henry Rudi's Arctic years.",

            newspaperText: `
                <p>
                    Henry Rudi became known as one of the most experienced hunters of the Arctic.
                    He travelled through cold and dangerous landscapes, learning how to read weather,
                    tracks in the snow, shifting ice, and the movement of animals.
                </p>

                <p>
                    In Tromsø, Rudi was remembered not only for his Arctic knowledge,
                    but also for his connection to Ølhallen, one of the city’s famous old pubs.
                    After long journeys, it was said to be one of his favourite places to return to.
                </p>

                <p>
                    The old pub became a meeting place for stories, warnings, rumours, and memories
                    from the north. For this mission, Henry Rudi may know where to look next.
                    His memory of Tromsø and the Arctic could help the rescue team find the missing clue.
                </p>
            `
        });
    };

    /* =========================================================
       ROALD AMUNDSEN FILE PLACEHOLDER
       ========================================================= */

    window.INVENTORY_FILES.amundsenFile = function (item) {
        openPlaceholderFile(item, "The Amundsen file design will be added later.");
    };

    window.addAmundsenProfileToInventory = function () {
        addInventoryItem({
            id: "profile-amundsen",
            title: "Roald Amundsen",
            type: "dossier",
            fileAction: "amundsenFile",

            birthDate: "16 July 1872",
            achievements: [
                "First to reach the South Pole",
                "First to navigate the Northwest Passage",
                "Used the Fram for polar expeditions",
                "Important Norwegian polar explorer"
            ],

            fileTitle: "Roald Amundsen – Explorer File",
            fileImage: PROFILE_IMAGES.amundsen
        });
    };

    /* =========================================================
       FRIDTJOF NANSEN FILE PLACEHOLDER
       ========================================================= */

    window.INVENTORY_FILES.nansenFile = function (item) {
        openPlaceholderFile(item, "The Nansen file design will be added later.");
    };

    window.addNansenProfileToInventory = function () {
        addInventoryItem({
            id: "profile-nansen",
            title: "Fridtjof Nansen",
            type: "dossier",
            fileAction: "nansenFile",

            birthDate: "10 October 1861",
            achievements: [
                "Crossed Greenland in 1888",
                "Led the Fram expedition",
                "Scientist, explorer and diplomat",
                "Received the Nobel Peace Prize"
            ],

            fileTitle: "Fridtjof Nansen – Explorer File",
            fileImage: PROFILE_IMAGES.nansen
        });
    };

    /* =========================================================
       WANNY WOLDSTAD FILE PLACEHOLDER
       ========================================================= */

    window.INVENTORY_FILES.wannyFile = function (item) {
        openPlaceholderFile(item, "The Wanny Woldstad file design will be added later.");
    };

    window.addWannyProfileToInventory = function () {
        addInventoryItem({
            id: "profile-wanny",
            title: "Wanny Woldstad",
            type: "dossier",
            fileAction: "wannyFile",

            birthDate: "15 January 1893",
            achievements: [
                "First female trapper on Svalbard",
                "Worked as a taxi driver in Tromsø",
                "Spent several seasons in the Arctic",
                "Published memories from her trapping life"
            ],

            fileTitle: "Wanny Woldstad – Explorer File",
            fileImage: PROFILE_IMAGES.wanny
        });
    };
})();