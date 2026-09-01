/*
QUESTIONS:
- addImageFallbacks(container) Do I need this?

CONNECTIONS:
- Needs inventory.js 

*/
(function () {
    "use strict";
    window.INVENTORY_FILES = window.INVENTORY_FILES || {};

    /* =========================================================
       ASSET PATHS
       ========================================================= */

    const explorerScriptElement =
        document.querySelector('script[data-loader="explorerProfilesScriptLoaded"]') || document.currentScript;

    const explorerScriptUrl = explorerScriptElement?.src || window.location.href;

    /* All path to FILES are realtie to this explorer.js file */
    function explorerAsset(path) {
        return new URL(path, explorerScriptUrl).href;
    }

    const PROFILE_IMAGES = {
        rudi: explorerAsset("../../assets/images/rudi.jpg"),
        amundsen: explorerAsset("../../assets/images/Amundsen.jpg"),
        nansen: explorerAsset("../../assets/images/nansen.jpg"),
        wanny: explorerAsset("../../assets/images/wanny.jpg"),
        placeholder: explorerAsset("../../assets/images/file_placeholder.png")
    };

    /* =========================================================
       SHARED HELPERS
       ========================================================= */

    function addExplorerItem(item) {
        if (typeof window.addInventoryItem !== "function") {
            console.error("addInventoryItem() is not available.", item);
            return;
        }
        window.addInventoryItem(item);
    }

    /* Replaces broken images with the shared placeholder plus print URL in console */
    function addImageFallbacks(container) {
        container
            .querySelectorAll("img")
            .forEach(image => {
                image.addEventListener(
                    "error",
                    () => {
                        console.error("IMAGE COULD NOT LOAD:", image.src);
                        if (image.src !== PROFILE_IMAGES.placeholder) {
                            image.src = PROFILE_IMAGES.placeholder;
                        }
                    },
                    { once: true }
                );
            });
    }

    /* Adds two closing methods: Close button, Clicking outside the file */
    function addOverlayClosing(overlay, closeButton) {
        function closeOverlay() {
            overlay.remove();
        }
        closeButton?.addEventListener("click", closeOverlay);
        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                closeOverlay();
            }
        }
        );
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
                            alt="${item.title}">

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
        addImageFallbacks(overlay);
        addOverlayClosing(overlay, overlay.querySelector(".rudi-newspaper-close"));
    };

    window.addRudiProfileToInventory = function () {
        addInventoryItem({
            id: "profile-rudi",
            title: "Henry Rudi",
            type: "dossier",
            thumb: PROFILE_IMAGES.placeholder,
            fileAction: "rudiNewspaper",

            birthDate: "26 February 1889",
            achievements: [
                "Norwegian Arctic hunter",
                "Known as the Polar Bear King",
                "Spent many years on Svalbard",
                "Connected with Troms\u00F8 and \u00F8lhallen"
            ],

            fileTitle: "Henry Rudi � Arctic Profile",
            fileImage: PROFILE_IMAGES.rudi,

            newspaperTitle: "The Arctic Hunter Henry Rudi",
            newspaperDate: "Troms\u00F8 Historical Archive",
            newspaperImage: PROFILE_IMAGES.rudi,
            newspaperImageDate: "Rudi shot this polar bear. Photograph taken in June.",

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
       ROALD AMUNDSEN FILE 
       ========================================================= */
    function openAmundsenExpeditionMap(item) {
        /* Can be removed later */
        console.log("AMUNDSEN INVENTORY ITEM:", item);
        const ZOOM_DURATION = 520;
        const overlay = document.createElement("div");
        overlay.className = "amundsen-map-overlay";

        const worldMapImage = item.worldMapImage || PROFILE_IMAGES.placeholder;
        const gjoaMapImage = item.gjoaMapImage || PROFILE_IMAGES.placeholder;
        const framMapImage = item.framMapImage || PROFILE_IMAGES.placeholder;
        const maudMapImage = item.maudMapImage || PROFILE_IMAGES.placeholder;
        const northPoleMapImage = item.northPoleMapImage || PROFILE_IMAGES.placeholder;


        overlay.innerHTML = `
            <section class="amundsen-map-file">
                <button
                    class="amundsen-map-close"
                    type="button"
                    aria-label="Close expedition map">
                &#215;
            </button>

            <h1 class="amundsen-map-title">
                    ${item.mapTitle || "Amundsen's Expeditions"}
                </h1>

            <p class="amundsen-map-subtitle">
                Select a location to inspect an expedition.
            </p>

            <div class="amundsen-map-viewer">
                <!-- Main map -->
                <div
                    class="amundsen-map active"
                    data-map-id="worldMap">
                    <img
                        src="${worldMapImage}"
                        alt="World map showing Roald Amundsen's expeditions">

                    <button
                        class="amundsen-map-pin"
                        type="button"
                        data-target-map="gjoaMap"
                        aria-label="View the Gjoa expedition"
                        style="left: 20%; top: 25%;" >
                        &#128205;
                    </button>

                    <button
                        class="amundsen-map-pin"
                        type="button"
                        data-target-map="framMap"
                        aria-label="View the Fram expedition"
                        style="left: 50%; top: 95%;"
                    >
                        &#128205;
                    </button>

                    <button
                        class="amundsen-map-pin"
                        type="button"
                        data-target-map="maudMap"
                        aria-label="View the Maud expedition"
                        style="left: 85%; top: 20%;"
                    >
                        &#128205;
                    </button>
                    <button
                        class="amundsen-map-pin"
                        type="button"
                        data-target-map="northPoleMap"
                        aria-label="View the North Pole expedition"
                        style="left: 50%; top: 5%;">
                        &#128205;
                    </button>
                </div>
                <!====================
                   North Pole expedition 
                  ==================== -->

                <div class="amundsen-map" data-map-id="northPoleMap">
                    <img
                        src="${northPoleMapImage}"
                        alt="Map of Amundsen's North Pole expedition"
                    >

                    <div class="amundsen-map-note">
                        <h2>1926</h2>

                        <p>
                            <strong>Goal:</strong>
                            Fly across the North Pole.
                        </p>

                        <p>
                            <strong>Airship:</strong>
                            Norge
                        </p>

                        <p>
                            Together with Lincoln Ellsworth and Umberto Nobile, Amundsen was 
                            the first to cross the the Arctic Ocean and pass over the North Pole.
                        </p>
                    </div>
                    <button
                        class="amundsen-map-back"
                        type="button"
                    >
                        &larr; Back
                    </button>
                </div>

                <!-- Northwest Passage -->
                <div
                    class="amundsen-map"
                    data-map-id="gjoaMap">
                    <img
                        src="${gjoaMapImage}"
                        alt="Map of Amundsen's Northwest Passage expedition"
                    >

                    <div class="amundsen-map-note">
                        <h2>1903-1906</h2>

                        <p>
                            <strong>Goal:</strong>
                            Navigate the Northwest Passage
                        </p>

                        <p>
                            <strong>Vessel:</strong>
                            Gj\u00F8a
                        </p>

                        <p>
                            Amundsen became the first to sail
                            the entire Northwest Passage.
                            He spent two winters with the Inuit,
                            learning Arctic survival, dog sledding,
                            and fur clothing.
                        </p>
                    </div>

                    <button
                        class="amundsen-map-back"
                        type="button"
                    >
                        &larr; Back
                    </button>
                </div>

                <!-- =================
                     South Pole / Fram 
                     ================= -->
                <div class="amundsen-map" data-map-id="framMap">
                    <img src="${framMapImage}" alt="Map of Amundsen's Fram and South Pole expedition">
                    <div class="amundsen-map-note">
                        <h2>1910-1912</h2>

                        <p>
                            <strong>Goal:</strong>
                            Reach the South Pole
                        </p>

                        <p>
                            <strong>Vessel:</strong>
                            Fram
                        </p>

                        <p>
                            Amundsen's team reached the South Pole
                            in December 1911. Robert Falcon Scott's British 
                            expedition arrived about five weeks later.
                        </p>
                    </div>

                    <button
                        class="amundsen-map-back"
                        type="button"
                    >
                        &larr; Back
                    </button>
                </div>

                <!-- =========================
                     Maud expedition 
                     ========================= -->
                <div
                    class="amundsen-map"
                    data-map-id="maudMap"
                >
                    <img
                        src="${maudMapImage}"
                        alt="Map of Amundsen's Maud expedition"
                    >

                    <div class="amundsen-map-note">
                        <h2>1918-1925</h2>

                        <p>
                            <strong>Goal:</strong>
                            Drift across the Arctic Ocean toward the North Pole.
                        </p>

                        <p>
                            <strong>Vessel:</strong>
                            Maud
                        </p>

                        <p>
                            Inspired by Nansen's Fram expedition,
                            Amundsen hoped the drifting sea ice
                            would carry Maud toward the North Pole.
                            After completing the Northeast Passage,
                            he abandoned the planned drift to the pole.
                        </p>
                    </div>
                    <div class="amundsen-fact">
                        <button
                            class="amundsen-fact-button"
                            type="button"
                            aria-expanded="false"
                            aria-label="Show a surprising fact"
                        >
                            ?
                            <span class="amundsen-fact-label">Did you know?</span>
                        </button>

                        <div
                            class="amundsen-fact-content"
                            role="note"
                            hidden
                        >
                            <strong>Did you know?</strong>

                            <p>
                                The Maud expedition recorded weather,
                                sea-ice conditions, ocean currents,
                                and changes in the Earth's magnetic field.
                            </p>
                        </div>
                    </div>
                    <button
                        class="amundsen-map-back"
                        type="button"
                    >
                        &larr; Back
                    </button>
                </div>
            </div>

            <p class="amundsen-map-instruction">
                Click a map pin to explore the expedition.
            </p>
        </section>`;
        document.body.appendChild(overlay);
        overlay
            .querySelectorAll(".amundsen-fact-button")
            .forEach(button => {
                button.addEventListener("click", event => {
                    event.stopPropagation();

                    const factBox =
                        button.closest(".amundsen-fact");

                    const factContent =
                        factBox?.querySelector(
                            ".amundsen-fact-content"
                        );

                    if (!factContent) {
                        console.error(
                            "No fact content found for this button."
                        );
                        return;
                    }

                    const willOpen = factContent.hidden;

                    factContent.hidden = !willOpen;

                    button.setAttribute(
                        "aria-expanded",
                        String(willOpen)
                    );

                    button.classList.toggle(
                        "is-open",
                        willOpen
                    );
                });
            });

        addImageFallbacks(overlay);

        const worldMap = overlay.querySelector('[data-map-id="worldMap"]');

        function changeMap(targetMap) {
            const activeMap = overlay.querySelector(".amundsen-map.active");
            if (!activeMap || !targetMap || activeMap === targetMap) {
                return;
            }
            activeMap.classList.add("zooming");
            window.setTimeout(
                () => {
                    activeMap.classList.remove("zooming");
                    activeMap.classList.remove("active");
                    targetMap.classList.add("active");
                },
                ZOOM_DURATION
            );
        }

        /*  Open a detail map.  */
        overlay.querySelectorAll(".amundsen-map-pin").forEach(pin => {
            pin.addEventListener("click", () => {
                const mapName = pin.dataset.targetMap;
                const targetMap = overlay.querySelector(`[data-map-id="${mapName}"]`);
                changeMap(targetMap);
            });
        });

        /* Return to the world map. */
        overlay.querySelectorAll(".amundsen-map-back").forEach(button => {
            button.addEventListener("click", () => { changeMap(worldMap); });
        });

        addOverlayClosing(overlay, overlay.querySelector(".amundsen-map-close"));
    }


    window.INVENTORY_FILES.amundsenFile = function (item) { openAmundsenExpeditionMap(item); };
    window.addAmundsenProfileToInventory =
        function () {
            addInventoryItem({
                id: "profile-amundsen",
                title: "Roald Amundsen",
                type: "dossier",
                thumb: PROFILE_IMAGES.placeholder,
                fileAction: "amundsenFile",
                birthDate: "16 July 1872",
                achievements:
                    [
                        "First through the Northwest Passage",
                        "First to reach the South Pole",
                        "First verified flight across the North Pole",
                        "Learned Arctic survival from the Inuit"
                    ],

                fileTitle: "Roald Amundsen � Expedition Map",
                fileImage: PROFILE_IMAGES.amundsen,
                mapTitle: "Amundsen's Expeditions",
                worldMapImage: explorerAsset("../../assets/images/Amundsen/worldmap.jpg"),
                gjoaMapImage: explorerAsset("../../assets/images/Amundsen/northwest-passage-large.jpg"),
                framMapImage: explorerAsset("../../assets/images/Amundsen/fram.jpg"),
                maudMapImage: explorerAsset("../../assets/images/Amundsen/Maud_Amundsen.jfif"),
                northPoleMapImage: explorerAsset("../../assets/images/Amundsen/northpole_norge_amundsen.jfif")
            });
        };



    /* =========================================================
   FRIDTJOF NANSEN DIARY
   ========================================================= */

    function openNansenDiary(item) {
        const oldPaperImage = explorerAsset("../../assets/images/Nansen/old_paper.jpg");
        const photo1 = explorerAsset("../../assets/images/Nansen/photo1.jpg");
        const photo2 = explorerAsset("../../assets/images/Nansen/photo2.jpg");
        const photo3 = explorerAsset("../../assets/images/Nansen/photo3.jpg");
        const photo4 = explorerAsset("../../assets/images/Nansen/photo4.jpg");
        const photo5 = explorerAsset("../../assets/images/Nansen/photo5.jpg");
        const photo6 = explorerAsset("../../assets/images/Nansen/photo6.jpg");

        const overlay = document.createElement("div");
        overlay.className = "nansen-diary-overlay";

        /* Pass the old-paper image to CSS: avoids unreliable relative paths inside inventory.css. */
        overlay.style.setProperty("--nansen-paper-image", `url("${oldPaperImage}")`);

        overlay.innerHTML = `
            <section class="nansen-diary-shell">
            <button  class="nansen-diary-close"
                type="button"
                aria-label="Close Nansen diary">
                &#215;
            </button>

            <h1 class="nansen-diary-title">
                ${item.fileTitle || "Nansen's Diary"}
            </h1>

            <div class="nansen-diary-book">
                <!-- PAGE 1 -->
                <article class="nansen-diary-page">
                    <h2> July 2, 1893 </h2>
                    <div class="nansen-diary-photo" data-watermark="S">
                        <img src="${photo1}" alt="Fram expedition photograph">
                    </div>
                    <p>
                        After months of preparation,
                        we are finally on our way.

                        Today the Fram sets sail to
                        the Geographic North Pole.

                        The crew is full of excitement,
                        but we all know it will be a
                        long and challenging journey.
                    </p>
                </article>

                <!-- PAGE 2 -->
                <article class="nansen-diary-page">
                    <h2> September 18, 1893 </h2>
                    <div class="nansen-diary-photo" data-watermark="L">
                        <img src="${photo2}" alt="Fram expedition photograph">
                    </div>
                    <p>
                        We have been trapped in the ice
                        for several weeks now.

                        The Fram is drifting northward,
                        and we are making slow progress.

                        The cold is intense, but the crew
                        remains determined and hopeful.
                    </p>
                </article>

                <!-- PAGE 3 -->
                <article class="nansen-diary-page">
                    <h2>
                        March 14, 1895
                    </h2>

                    <div
                        class="nansen-diary-photo"
                        data-watermark="E"
                    >
                        <img
                            src="${photo3}"
                            alt="Fram expedition photograph"
                        >
                    </div>

                    <p>
                        Our progress has been slow, we
                        will not reach the North Pole.

                        I have decided we must try by foot.

                        We have prepared sledges and
                        supplies for the journey.

                        I am thinking of taking Johansen
                        with me, as he is an experienced
                        Arctic traveler.

                        The journey will be perilous,
                        but we must try.
                    </p>
                </article>


                <!-- PAGE 4 -->
                <article class="nansen-diary-page">
                    <h2>
                        April 7, 1895
                    </h2>

                    <div
                        class="nansen-diary-photo"
                        data-watermark="I"
                    >
                        <img
                            src="${photo4}"
                            alt="Fram expedition photograph"
                        >
                    </div>

                    <p>
                        After days of traveling over the
                        ice, we encountered a series
                        of ice ridges.

                        The terrain is treacherous, some
                        days we are drifting further south
                        than we can advance north.

                        Moreover, the ice becoming unstable,
                        and we are constantly at risk of
                        falling into the freezing waters
                        below.
                    </p>
                </article>


                <!-- PAGE 5 -->
                <article class="nansen-diary-page">
                    <h2>
                        August 17, 1895
                    </h2>

                    <div
                        class="nansen-diary-photo"
                        data-watermark="G"
                    >
                        <img
                            src="${photo5}"
                            alt="Fram expedition photograph"
                        >
                    </div>

                    <p>
                        Its months since we began our
                        return journey.

                        With no dogs left, we managed to
                        reach Jozefland.

                        It is too late however, to attemt
                        to reach the mainland and we have
                        to overwinter here.
                    </p>
                </article>


                <!-- PAGE 6 -->
                <article class="nansen-diary-page">
                    <h2>
                        September 9, 1896
                    </h2>

                    <div
                        class="nansen-diary-photo"
                        data-watermark="H"
                    >
                        <img
                            src="${photo6}"
                            alt="Fram expedition photograph"
                        >
                    </div>

                    <p>
                        The Fram returned in triumph to
                        Oslo (then Christiania), bringing
                        back a wealth of oceanographic and
                        meteorological data.
                    </p>
                </article>


                <button
                    class="nansen-diary-previous"
                    type="button"
                    aria-label="Previous diary page"
                >
                    &#8249;
                </button>

                <button
                    class="nansen-diary-next"
                    type="button"
                    aria-label="Next diary page"
                >
                    &#8250;
                </button>
            </div>

            <p class="nansen-diary-help">
                Use the page corners or swipe to turn pages.
            </p>
        </section>
    `;


        document.body.appendChild(
            overlay
        );


        /*
         * Replace diary photographs when a file
         * cannot be loaded.
         */
        addImageFallbacks(
            overlay
        );


        const pages =
            Array.from(
                overlay.querySelectorAll(
                    ".nansen-diary-page"
                )
            );

        const book =
            overlay.querySelector(
                ".nansen-diary-book"
            );

        const nextButton =
            overlay.querySelector(
                ".nansen-diary-next"
            );

        const previousButton =
            overlay.querySelector(
                ".nansen-diary-previous"
            );




        let currentPage =
            0;

        let canTurnPage =
            true;


        function updatePages() {
            pages.forEach(
                (page, index) => {
                    const isFlipped =
                        index < currentPage;

                    page.classList.toggle(
                        "flipped",
                        isFlipped
                    );


                    /*
                     * Keep the current page above all
                     * pages that come after it.
                     */
                    page.style.zIndex =
                        isFlipped
                            ? String(index)
                            : String(
                                pages.length -
                                index
                            );
                }
            );


            previousButton.disabled =
                !canTurnPage ||
                currentPage === 0;


            nextButton.disabled =
                !canTurnPage ||
                currentPage ===
                pages.length - 1;
        }


        function showNextPage() {
            if (!canTurnPage) {
                return;
            }

            if (
                currentPage <
                pages.length - 1
            ) {
                currentPage++;

                updatePages();
            }
        }


        function showPreviousPage() {
            if (!canTurnPage) {
                return;
            }

            if (currentPage > 0) {
                currentPage--;

                updatePages();
            }
        }


        nextButton.addEventListener(
            "click",
            showNextPage
        );


        previousButton.addEventListener(
            "click",
            showPreviousPage
        );





        /*
         * Swipe support.
         */
        let touchStartX =
            0;


        book.addEventListener(
            "touchstart",
            event => {
                touchStartX =
                    event.changedTouches[0]
                        .clientX;
            },
            {
                passive: true
            }
        );


        book.addEventListener(
            "touchend",
            event => {
                if (!canTurnPage) {
                    return;
                }

                const touchEndX =
                    event.changedTouches[0]
                        .clientX;

                const distance =
                    touchStartX -
                    touchEndX;


                if (distance > 60) {
                    showNextPage();
                }

                if (distance < -60) {
                    showPreviousPage();
                }
            },
            {
                passive: true
            }
        );


        updatePages();


        addOverlayClosing(
            overlay,
            overlay.querySelector(
                ".nansen-diary-close"
            )
        );
    }


    /* New action name. */
    window.INVENTORY_FILES.nansenDiary = function (item) { openNansenDiary(item); };

    /*
     * Compatibility with an old saved Nansen item
     * that still uses fileAction: "nansenFile".
     */
    window.INVENTORY_FILES.nansenFile = window.INVENTORY_FILES.nansenDiary;
    window.addNansenProfileToInventory =
        function () {
            addExplorerItem({
                id: "profile-nansen",
                title: "Fridtjof Nansen",
                type: "dossier",
                thumb: PROFILE_IMAGES.placeholder,
                fileAction: "nansenDiary",
                birthDate: "10 October 1861",
                achievements: [
                    "Crossed Greenland in 1888",
                    "Led the Fram expedition",
                    "Scientist, explorer and diplomat",
                    "Received the Nobel Peace Prize"
                ],
                fileTitle: "Fridtjof Nansen - Expedition Diary",
                fileImage: PROFILE_IMAGES.nansen
            });
        };

    /* =========================================================
         WANNY WOLDSTAD - ARCTIC TRAPPER CASE
    ========================================================= */

    function openWannyTrapperCase(item) {
        const overlay = document.createElement("div");
        overlay.className = "wanny-case-overlay";

        /*
         * Change these filenames when your actual image
         * names are different.
         */
        const wannyPortraitImage = explorerAsset("../../assets/images/Wanny/Wanny.jpg");
        const wannyDogsImage = explorerAsset("../../assets/images/Wanny/Wanny_Dogs.jpg");

        overlay.innerHTML = `
        <section
            class="wanny-case-shell"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wannyCaseTitle"
        >
            <button
                class="wanny-case-close"
                type="button"
                aria-label="Close Wanny Woldstad file"
            >
                &#215;
            </button>

            <header class="wanny-case-header">
                <p class="wanny-case-kicker">
                    Personal belongings from Svalbard
                </p>

                <h1
                    class="wanny-case-heading"
                    id="wannyCaseTitle"
                >
                    ${item.fileTitle ||
            "Wanny Woldstad"
            }
                </h1>

                <p class="wanny-case-introduction">
                    Explore three parts of Wanny's life.
                    Look carefully when examining each object.
                </p>
            </header>

            <div
                class="wanny-case-progress"
                aria-live="polite"
            >
                <span
                    class="wanny-case-letter-slot"
                    data-letter-slot="licence"
                >
                    ?
                </span>

                <span
                    class="wanny-case-letter-slot"
                    data-letter-slot="dogs"
                >
                    ?
                </span>

                <span
                    class="wanny-case-letter-slot"
                    data-letter-slot="book"
                >
                    ?
                </span>
            </div>

            <!-- CASE -->
            <section class="wanny-case-trunk">
                <div
                    class="wanny-case-lid"
                    aria-hidden="true"
                ></div>

                <div class="wanny-case-inside">
                    <button
                        class="
                            wanny-case-artifact
                            wanny-case-artifact--licence
                        "
                        type="button"
                        data-artifact="licence"
                    >
                        <span
                            class="wanny-case-artifact-symbol"
                            aria-hidden="true"
                        >
                            ID
                        </span>

                        <span class="wanny-case-object-name">
                            Wanny's Licence
                        </span>

                        <span class="wanny-case-object-description">
                            How taxi driving opened the road
                            toward Svalbard.
                        </span>
                    </button>

                    <button
                        class="
                            wanny-case-artifact
                            wanny-case-artifact--dogs
                        "
                        type="button"
                        data-artifact="dogs"
                    >
                        <span
                            class="wanny-case-artifact-symbol"
                            aria-hidden="true"
                        >
                            K + S
                        </span>

                        <span class="wanny-case-object-name">
                            Wanny's Dogs
                        </span>

                        <span class="wanny-case-object-description">
                            Karo and Strøm were trusted
                            Arctic companions.
                        </span>
                    </button>

                    <button
                        class="
                            wanny-case-artifact
                            wanny-case-artifact--book
                        "
                        type="button"
                        data-artifact="book"
                    >
                        <span
                            class="wanny-case-artifact-symbol"
                            aria-hidden="true"
                        >
                            WW
                        </span>

                        <span class="wanny-case-object-name">
                            Wanny's Book
                        </span>

                        <span class="wanny-case-object-description">
                            Memories of food, hunting,
                            darkness and courage.
                        </span>
                    </button>
                </div>
            </section>

            <!-- STORY VIEW -->
            <section
                class="wanny-case-detail"
                hidden
            >
                <button
                    class="wanny-case-detail-back"
                    type="button"
                    aria-label="Return to the case"
                >
                    &#8592;
                </button>

                <p class="wanny-case-detail-number"></p>

                <h2 class="wanny-case-detail-title"></h2>

                <div class="wanny-case-detail-body"></div>

                <button
                    class="wanny-case-magnifier"
                    type="button"
                    aria-label="Examine the object"
                    title="Examine object"
                >
                    &#128269;
                </button>
            </section>

            <!-- OBJECT ZOOM -->
            <section
                class="wanny-case-object-view"
                hidden
            >
                <button
                    class="wanny-case-object-back"
                    type="button"
                    aria-label="Return from the object"
                >
                    &#8592;
                </button>

                <p class="wanny-case-object-instruction">
                    Look carefully. One capital letter is
                    hidden somewhere in the object.
                </p>

                <div class="wanny-case-detail-object"></div>
            </section>

            <!-- LETTER QUESTION -->
            <section
                class="wanny-case-question"
                hidden
                aria-live="polite"
            >
                <p class="wanny-case-question-kicker">
                    Observation test
                </p>

                <h2>
                    Which letter did you find?
                </h2>

                <div
                    class="wanny-case-answer-options"
                    role="group"
                    aria-label="Choose the hidden letter"
                ></div>

                <p
                    class="wanny-case-answer-feedback"
                    aria-live="polite"
                ></p>

                <button
                    class="wanny-case-question-continue"
                    type="button"
                    hidden
                >
                    Return to the case
                </button>

                <button
                    class="wanny-case-question-look-again"
                    type="button"
                >
                    Look again
                </button>
            </section>

            <!-- COMPLETION -->
            <section
                class="wanny-case-complete"
                hidden
                aria-live="polite"
            >
                <div
                    class="wanny-case-fox-symbol"
                    aria-hidden="true"
                >
                    🦊
                </div>

                <p class="wanny-case-complete-kicker">
                    Word discovered
                </p>

                <div class="wanny-case-final-word">
                    <span>F</span>
                    <span>O</span>
                    <span>X</span>
                </div>

                <h2>The Arctic Fox</h2>

                <p>
                    The Arctic fox survives intense cold,
                    darkness and scarce food by adapting to
                    its surroundings.
                </p>

                <p>
                    Wanny also adapted to isolation, difficult
                    work, dangerous hunting and the long
                    darkness of an Arctic winter.
                </p>

                <blockquote class="wanny-case-reflection">
                    Which required more courage: hunting in
                    the Arctic, or continuing through months
                    of darkness and isolation?
                </blockquote>

                <button
                    class="wanny-case-complete-return"
                    type="button"
                >
                    Return to the case
                </button>
            </section>
        </section>
    `;

        /*
         * Append exactly as the other explorer profiles do.
         */
        document.body.appendChild(overlay);

        /*
         * Add fallbacks after the HTML containing the images
         * has been inserted.
         */
        addImageFallbacks(overlay);

        const artifacts = {
            licence: {
                number: "Object 1 of 3",
                title: "Wanny's Driver's Licence",
                letter: "F",
                choices: ["E", "F", "T"],

                body: `
                <p>
                    After becoming a widow, Wanny needed an
                    income to support her family. She began
                    driving a taxi in Tromsø.
                </p>

                <p>
                    Through her passengers she met people
                    connected to Arctic hunting and trapping.
                    Among them was Anders Sæterdal, who later
                    invited her to overwinter on Svalbard.
                </p>
            `,

                visual: `
                <article class="wanny-licence">
                    <header class="wanny-licence-heading">
                        <div>
                            <small>KONGERIKET NORGE</small>
                            <strong>FØRERKORT</strong>
                        </div>

                        <span>TROMSØ</span>
                    </header>

                    <div class="wanny-licence-main">
                        <figure class="wanny-licence-photo">
                            <img
                                src="${wannyPortraitImage}"
                                alt="Portrait of Wanny Woldstad"
                            >
                        </figure>

                        <dl class="wanny-licence-information">
                            <div>
                                <dt>Navn</dt>
                                <dd>Wanny Woldstad</dd>
                            </div>

                            <div>
                                <dt>Yrke</dt>
                                <dd>Drosjesjåfør</dd>
                            </div>

                            <div>
                                <dt>Utstedt</dt>
                                <dd>Tromsø</dd>
                            </div>

                            <div>
                                <dt>Registrering</dt>
                                <dd>TROMS-F-06</dd>
                            </div>
                        </dl>
                    </div>

                    <div class="wanny-licence-signature">
                        Wanny Woldstad
                    </div>
                </article>
            `
            },

            dogs: {
                number: "Object 2 of 3",
                title: "Karo and Strøm",
                letter: "O",
                choices: ["C", "O", "Q"],

                body: `
                <p>
                    Karo and Strøm were working companions,
                    not simply pets. They helped during
                    journeys and dangerous hunts.
                </p>

                <p>
                    The dogs could locate polar-bear dens
                    beneath the snow. Their courage sometimes
                    made hunting more difficult because Wanny
                    and Anders had to avoid shooting them.
                </p>
            `,

                visual: `
                <article class="wanny-photo-object">
                    <figure class="wanny-historical-photo">
                        <img
                            src="${wannyDogsImage}"
                            alt="Wanny Woldstad with her dogs"
                        >

                        <figcaption>
                            Wanny with her Arctic companions,
                            Karo and Strøm.
                        </figcaption>
                    </figure>

                    <span
                        class="wanny-photo-reference"
                        aria-hidden="true"
                    >
                        PHOTO O - 15 
                    </span>
                </article>
            `
            },

            book: {
                number: "Object 3 of 3",
                title: "A Page from Wanny's Book",
                letter: "X",
                choices: ["K", "X", "Y"],

                body: `
                <p>
                    Wanny later wrote about the difficult and
                    sometimes monotonous parts of Arctic life.
                </p>

                <p>
                    Food, weather and isolation could weaken
                    motivation. A successful hunt or an
                    unexpected bird could become an important
                    source of courage.
                </p>
            `,

                visual: `
                <article class="wanny-book">
                    <div class="wanny-book-page">
                        <p class="wanny-book-date">
                            A winter day on Svalbard
                        </p>

                        <p>
                            Bear steak, bear cakes and
                            bear-meat soup. Slowly, one
                            almost became a bear.
                        </p>

                        <p>
                            The snowy owl escaped, but four
                            ptarmigan were caught.
                        </p>

                        <span class="wanny-book-page-number">
                            27
                        </span>
                    </div>

                    <div class="wanny-book-page">
                        <p class="wanny-book-large-quote">
                            Small successes could return
                            courage to a difficult winter.
                        </p>

                        <span class="wanny-book-edition">
                            Appendix X
                        </span>
                    </div>
                </article>
            `
            }
        };

        const solvedArtifacts = new Set();

        const trunk =
            overlay.querySelector(
                ".wanny-case-trunk"
            );

        const artifactButtons =
            Array.from(
                overlay.querySelectorAll(
                    ".wanny-case-artifact"
                )
            );

        const detailPanel =
            overlay.querySelector(
                ".wanny-case-detail"
            );

        const detailNumber =
            overlay.querySelector(
                ".wanny-case-detail-number"
            );

        const detailTitle =
            overlay.querySelector(
                ".wanny-case-detail-title"
            );

        const detailBody =
            overlay.querySelector(
                ".wanny-case-detail-body"
            );

        const detailBackButton =
            overlay.querySelector(
                ".wanny-case-detail-back"
            );

        const magnifierButton =
            overlay.querySelector(
                ".wanny-case-magnifier"
            );

        const objectView =
            overlay.querySelector(
                ".wanny-case-object-view"
            );

        const objectBackButton =
            overlay.querySelector(
                ".wanny-case-object-back"
            );

        const detailObject =
            overlay.querySelector(
                ".wanny-case-detail-object"
            );

        const questionPanel =
            overlay.querySelector(
                ".wanny-case-question"
            );

        const answerOptions =
            overlay.querySelector(
                ".wanny-case-answer-options"
            );

        const answerFeedback =
            overlay.querySelector(
                ".wanny-case-answer-feedback"
            );

        const continueButton =
            overlay.querySelector(
                ".wanny-case-question-continue"
            );

        const lookAgainButton =
            overlay.querySelector(
                ".wanny-case-question-look-again"
            );

        const completionPanel =
            overlay.querySelector(
                ".wanny-case-complete"
            );

        const completionReturnButton =
            overlay.querySelector(
                ".wanny-case-complete-return"
            );

        let currentArtifactKey = null;

        function hideAllViews() {
            trunk.hidden = true;
            detailPanel.hidden = true;
            objectView.hidden = true;
            questionPanel.hidden = true;
            completionPanel.hidden = true;
        }

        function showCase() {
            hideAllViews();
            trunk.hidden = false;

            overlay
                .querySelector(".wanny-case-header")
                ?.scrollIntoView({
                    block: "start"
                });
        }

        function updateLetterBoard() {
            Object.entries(artifacts).forEach(
                ([key, artifact]) => {
                    const slot =
                        overlay.querySelector(
                            `[data-letter-slot="${key}"]`
                        );

                    const solved =
                        solvedArtifacts.has(key);

                    slot.textContent =
                        solved
                            ? artifact.letter
                            : "?";

                    slot.classList.toggle(
                        "discovered",
                        solved
                    );
                }
            );

            artifactButtons.forEach(button => {
                button.classList.toggle(
                    "found",
                    solvedArtifacts.has(
                        button.dataset.artifact
                    )
                );
            });
        }

        function openArtifact(artifactKey) {
            const artifact =
                artifacts[artifactKey];

            if (!artifact) {
                return;
            }

            currentArtifactKey =
                artifactKey;

            detailNumber.textContent =
                artifact.number;

            detailTitle.textContent =
                artifact.title;

            detailBody.innerHTML =
                artifact.body;

            detailObject.innerHTML =
                artifact.visual;

            hideAllViews();
            detailPanel.hidden = false;

            detailPanel.scrollIntoView({
                block: "start"
            });
        }

        function openObjectView() {
            if (!currentArtifactKey) {
                return;
            }

            hideAllViews();
            objectView.hidden = false;

            objectView.scrollIntoView({
                block: "start"
            });
        }

        function openLetterQuestion() {
            const artifact =
                artifacts[currentArtifactKey];

            if (!artifact) {
                showCase();
                return;
            }

            /*
             * Already solved objects return directly.
             */
            if (
                solvedArtifacts.has(
                    currentArtifactKey
                )
            ) {
                showCase();
                return;
            }

            answerOptions.innerHTML = "";
            answerFeedback.textContent = "";
            answerFeedback.className =
                "wanny-case-answer-feedback";

            continueButton.hidden = true;
            lookAgainButton.hidden = false;

            artifact.choices.forEach(letter => {
                const answerButton =
                    document.createElement("button");

                answerButton.type = "button";
                answerButton.className =
                    "wanny-case-answer-button";

                answerButton.textContent =
                    letter;

                answerButton.addEventListener(
                    "click",
                    () => {
                        checkAnswer(
                            letter,
                            answerButton
                        );
                    }
                );

                answerOptions.appendChild(
                    answerButton
                );
            });

            hideAllViews();
            questionPanel.hidden = false;
        }

        function checkAnswer(
            selectedLetter,
            selectedButton
        ) {
            const artifact =
                artifacts[currentArtifactKey];

            if (!artifact) {
                return;
            }

            if (
                selectedLetter ===
                artifact.letter
            ) {
                solvedArtifacts.add(
                    currentArtifactKey
                );

                answerOptions
                    .querySelectorAll("button")
                    .forEach(button => {
                        button.disabled = true;

                        button.classList.toggle(
                            "correct",
                            button.textContent ===
                            artifact.letter
                        );
                    });

                answerFeedback.textContent =
                    `Correct — you found ${artifact.letter}.`;

                answerFeedback.classList.add(
                    "correct"
                );

                continueButton.hidden = false;
                lookAgainButton.hidden = true;

                updateLetterBoard();
                return;
            }

            selectedButton.classList.add(
                "wrong"
            );

            answerFeedback.textContent =
                "Not quite. Examine the object again.";

            answerFeedback.classList.add(
                "wrong"
            );
        }

        function continueAfterQuestion() {
            if (
                solvedArtifacts.size ===
                Object.keys(artifacts).length
            ) {
                hideAllViews();
                completionPanel.hidden = false;
                return;
            }

            showCase();
        }

        artifactButtons.forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    openArtifact(
                        button.dataset.artifact
                    );
                }
            );
        });

        /*
         * Story arrow:
         * unsolved → question
         * solved → case
         */
        detailBackButton.addEventListener(
            "click",
            () => {
                if (
                    solvedArtifacts.has(
                        currentArtifactKey
                    )
                ) {
                    showCase();
                    return;
                }

                openLetterQuestion();
            }
        );

        magnifierButton.addEventListener(
            "click",
            openObjectView
        );

        /*
         * Leaving the enlarged object asks the question.
         */
        objectBackButton.addEventListener(
            "click",
            openLetterQuestion
        );

        lookAgainButton.addEventListener(
            "click",
            openObjectView
        );

        continueButton.addEventListener(
            "click",
            continueAfterQuestion
        );

        completionReturnButton.addEventListener(
            "click",
            showCase
        );

        updateLetterBoard();
        showCase();

        addOverlayClosing(
            overlay,
            overlay.querySelector(
                ".wanny-case-close"
            )
        );
    }


    /*
     * Inventory action for Wanny.
     */
    window.INVENTORY_FILES.wannyCase = function (item) { openWannyTrapperCase(item); };


    /*
     * Compatibility with an older saved profile.
     */
    window.INVENTORY_FILES.wannyFile =
        window.INVENTORY_FILES.wannyCase;


    window.addWannyProfileToInventory =
        function () {
            addExplorerItem({
                id:
                    "profile-wanny",

                title:
                    "Wanny Woldstad",

                type:
                    "dossier",

                thumb: PROFILE_IMAGES.placeholder,

                fileAction:
                    "wannyCase",

                birthDate:
                    "15 January 1893",

                achievements: [
                    "Worked as a taxi driver in Troms\u00F8",
                    "Spent several trapping seasons on Svalbard",
                    "Participated in Arctic trapping work",
                    "Wrote about her experiences"
                ],

                fileTitle:
                    "Wanny Woldstad - Arctic Trapper Case",

                fileImage:
                    PROFILE_IMAGES.wanny
            });
        };
})();