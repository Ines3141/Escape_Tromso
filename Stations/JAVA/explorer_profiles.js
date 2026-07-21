(function () {
    window.INVENTORY_FILES = window.INVENTORY_FILES || {};

    const PROFILE_IMAGES = {
        rudi: "../../../../assets/images/rudi.jpg",
        amundsen: "../../../../assets/images/amundsen.jpg",
        nansen: "../../../../assets/images/nansen.jpg",
        wanny: "../../../../assets/images/wanny.jpg",
        placeholder: "../../../../assets/images/file_placeholder.png"
    };

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
        const overlay = document.createElement("div");
        overlay.className = "rudi-newspaper-overlay";

        const imageSrc = item.newspaperImage || item.fileImage || PROFILE_IMAGES.rudi;

        overlay.innerHTML = `
            <article class="rudi-newspaper-paper">
                <button class="rudi-newspaper-close" id="closeRudiNewspaper"  type="button"
                    aria-label="Close newspaper">
                        &#215;
                </button>

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
                        <h2>Hunter of the Arctic Returns to Troms\u00F8</h2>

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
                "Connected with Troms\u00F8 and \u00F8lhallen"
            ],

            fileTitle: "Henry Rudi – Arctic Profile",
            fileImage: PROFILE_IMAGES.rudi,

            newspaperTitle: "The Arctic Hunter Henry Rudi",
            newspaperDate: "Troms\u00F8 Historical Archive",
            newspaperImage: PROFILE_IMAGES.rudi,
            newspaperImageDate: "Photograph taken in June.",

            newspaperText: `
                <p>
                    Henry Rudi became known as one of the most experienced hunters of the Arctic.
                    He travelled through cold and dangerous landscapes, learning how to read weather,
                    tracks in the snow, shifting ice, and the movement of animals.
                </p>

                <p>
                    In Troms\u00F8, Rudi was remembered not only for his Arctic knowledge,
                    but also for his connection to \u00F8lhallen, one of the city's famous old pubs.
                    After long journeys, it was said to be one of his favourite places to return to.
                </p>

                <p>
                    The old pub became a meeting place for stories, warnings, rumours, and memories
                    from the north. For this mission, Henry Rudi may know where to look next.
                    His memory of Troms\u00F8 and the Arctic could help the rescue team find the missing clue.
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