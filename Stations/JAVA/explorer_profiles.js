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
                        style="left: 48%; top: 32%;"
                    >
                        &#128205;
                    </button>

                    <button
                        class="amundsen-map-pin"
                        type="button"
                        data-target-map="maudMap"
                        aria-label="View the Maud expedition"
                        style="left: 66%; top: 56%;"
                    >
                        &#128205;
                    </button>
                </div>

                <!-- Northwest Passage -->
                <div
                    class="amundsen-map"
                    data-map-id="gjoaMap"
                >
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
                            Gjøa
                        </p>

                        <p>
                            Amundsen and his crew completed the first
                            successful navigation of the passage.
                        </p>
                    </div>

                    <button
                        class="amundsen-map-back"
                        type="button"
                    >
                        &larr; Back
                    </button>
                </div>

                <!-- South Pole / Fram -->
                <div
                    class="amundsen-map"
                    data-map-id="framMap"
                >
                    <img
                        src="${framMapImage}"
                        alt="Map of Amundsen's Fram and South Pole expedition"
                    >

                    <div class="amundsen-map-note">
                        <h2>1910�1912</h2>

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
                            in December 1911.
                        </p>
                    </div>

                    <button
                        class="amundsen-map-back"
                        type="button"
                    >
                        &larr; Back
                    </button>
                </div>

                <!-- Maud expedition -->
                <div
                    class="amundsen-map"
                    data-map-id="maudMap"
                >
                    <img
                        src="${maudMapImage}"
                        alt="Map of Amundsen's Maud expedition"
                    >

                    <div class="amundsen-map-note">
                        <h2>1918�1925</h2>

                        <p>
                            <strong>Goal:</strong>
                            Explore the Northeast Passage
                        </p>

                        <p>
                            <strong>Vessel:</strong>
                            Maud
                        </p>

                        <p>
                            The expedition gathered scientific
                            information about the Arctic.
                        </p>
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
     

    window.INVENTORY_FILES.amundsenFile = function (item) {openAmundsenExpeditionMap(item);};
    window.addAmundsenProfileToInventory =
        function () {
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

                fileTitle: "Roald Amundsen � Expedition Map",
                fileImage: PROFILE_IMAGES.amundsen,
                mapTitle: "Amundsen's Expeditions",
                worldMapImage: explorerAsset("../../assets/images/Amundsen/worldmap.jpg"),
                gjoaMapImage: explorerAsset("../../assets/images/Amundsen/northwest-passage-large.jpg"),
                framMapImage: explorerAsset("../../assets/images/Amundsen/fram.jpg"),
                maudMapImage: explorerAsset("../../assets/images/Amundsen/fram.jpg")
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
                    <div class="nansen-diary-photo" data-watermark="C">
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
                    <div class="nansen-diary-photo" data-watermark="K">
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
                        data-watermark="A"
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
                        data-watermark="O"
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
                        data-watermark="L"
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
    window.INVENTORY_FILES.nansenDiary = function (item){openNansenDiary(item);};

    /*
     * Compatibility with an old saved Nansen item
     * that still uses fileAction: "nansenFile".
     */
    window.INVENTORY_FILES.nansenFile =  window.INVENTORY_FILES.nansenDiary;
    window.addNansenProfileToInventory =
        function () {
            addExplorerItem({
                id: "profile-nansen",
                title: "Fridtjof Nansen",
                type: "dossier",
                fileAction: "nansenDiary",
                birthDate: "10 October 1861",
                achievements: [
                    "Crossed Greenland in 1888",
                    "Led the Fram expedition",
                    "Scientist, explorer and diplomat",
                    "Received the Nobel Peace Prize"
                ],
                fileTitle: "Fridtjof Nansen - Expedition Diary",
                fileImage:  PROFILE_IMAGES.nansen
            });
        };

   /* =========================================================
        WANNY WOLDSTAD - ARCTIC TRAPPER CASE
   ========================================================= */

    function openWannyTrapperCase(item) {
        const overlay =
            document.createElement("div");

        overlay.className =
            "wanny-case-overlay";


        overlay.innerHTML = `
        <section class="wanny-case-shell">
            <button class="wanny-case-close" type="button"
                aria-label="Close Wanny Woldstad file">
                &#215;
            </button>

            <h1 class="wanny-case-heading">
                ${item.fileTitle || "Wanny Woldstad - Arctic Trapper Case"}
            </h1>

            <p class="wanny-case-introduction">
                Examine the objects inside Wanny's
                field case. Each object reveals part
                of her life and one hidden letter.
            </p>

            <div class="wanny-case-trunk">
                <div class="wanny-case-lid" aria-hidden="true"></div>
                <div class="wanny-case-inside">
                    <!-- TAXI FARE CARD -->
                    <button class="wanny-case-artifact wanny-case-artifact--taxi"
                        type="button"
                        data-artifact="taxi"
                        data-letter="F"
                    >
                        <span class="wanny-case-object-icon">
                            TAXI
                        </span>

                        <span class="wanny-case-object-name">
                            Fare Card
                        </span>

                        <span
                            class="wanny-case-object-description"
                        >
                            A reminder of Wanny's life
                            in Troms\u00F8 before Svalbard.
                        </span>
                    </button>


                    <!-- CABIN LEDGER -->
                    <button
                        class="
                            wanny-case-artifact
                            wanny-case-artifact--ledger
                        "
                        type="button"
                        data-artifact="ledger"
                        data-letter="O"
                    >
                        <span class="wanny-case-object-icon">
                            LEDGER
                        </span>

                        <span class="wanny-case-object-name">
                            Cabin Ledger
                        </span>

                        <span
                            class="wanny-case-object-description"
                        >
                            A record of the many kinds
                            of work needed to survive.
                        </span>
                    </button>


                    <!-- TRAPLINE MAP -->
                    <button
                        class="
                            wanny-case-artifact
                            wanny-case-artifact--map
                        "
                        type="button"
                        data-artifact="map"
                        data-letter="X"
                    >
                        <span class="wanny-case-object-icon">
                            MAP
                        </span>

                        <span class="wanny-case-object-name">
                            Trapline Map
                        </span>

                        <span
                            class="wanny-case-object-description"
                        >
                            Routes, tracks, cabins,
                            weather, and dangerous ice.
                        </span>
                    </button>


                    <div
                        class="wanny-case-letter-board"
                        aria-live="polite"
                    >
                        <span class="wanny-case-letter-label">
                            Letters discovered:
                        </span>

                        <span
                            class="wanny-case-letter-slot"
                            data-letter-slot="taxi"
                        >
                            ?
                        </span>

                        <span
                            class="wanny-case-letter-slot"
                            data-letter-slot="ledger"
                        >
                            ?
                        </span>

                        <span
                            class="wanny-case-letter-slot"
                            data-letter-slot="map"
                        >
                            ?
                        </span>
                    </div>
                </div>
            </div>


            <!-- OBJECT INFORMATION -->
            <section
                class="wanny-case-detail"
                hidden
            >
                <button class="wanny-case-detail-back"
                    type="button">
                    Back to trunk
                </button>
                <div class="wanny-case-detail-object"></div>
                <h2 class="wanny-case-detail-title">
                </h2>

                <div class="wanny-case-detail-body">
                </div>

                <div class="wanny-case-detail-letter">
                </div>
            </section>


            <!-- FINAL MESSAGE -->
            <section class="wanny-case-complete" aria-live="polite" hidden>
                <h2> FOX </h2>
                <p>
                    The Arctic fox was part of the
                    trapping landscape Wanny learned
                    to understand.

                    But the objects in her case reveal
                    more than trapping alone.
                </p>

                <p>
                    Arctic survival depended on travel,
                    planning, food, repairs, clothing,
                    equipment, observation, and the
                    daily maintenance of the cabin.
                </p>

                <blockquote class="wanny-case-reflection">
                    Which parts of Wanny's Arctic work
                    are remembered as heroic, and which
                    parts are too easily treated as
                    ordinary?
                </blockquote>
            </section>
        </section>
    `;


        document.body.appendChild(
            overlay
        );


        /*
         * Information connected to each object.
         */
        const artifacts = {
            taxi: {
                title:
                    "Taxi Fare Card",

                objectLabel:
                    "TAXI",

                letter:
                    "F",

                body: `
                <p>
                    Before travelling to Svalbard,
                    Wanny worked as a taxi driver
                    in Troms\u00F8.
                </p>

                <p>
                    Her work connected her with many
                    different people, including men
                    returning from life and work in
                    the Arctic.
                </p>

                <p>
                    The fare card represents the
                    beginning of an unexpected journey:
                    an ordinary working life becoming
                    connected to the polar world.
                </p>

                <p>
                    The first letter is taken from
                    <strong>FARE</strong>.
                </p>
            `
            },

            ledger: {
                title:
                    "Cabin Work Ledger",

                objectLabel:
                    "LEDGER",

                letter:
                    "O",

                body: `
                <p>
                    Life in a trapping cabin required
                    much more than checking traps.
                </p>

                <p>
                    Food had to be prepared. Clothing
                    and equipment had to be repaired.
                    The cabin had to be kept usable,
                    fuel had to be managed, and routes
                    had to be planned.
                </p>

                <p>
                    Wanny participated in trapping work
                    while also carrying out the daily
                    work that made survival possible.
                </p>

                <p>
                    The second letter is connected to
                    the cabin <strong>OVEN</strong>.
                </p>
            `
            },

            map: {
                title:
                    "Trapline Map",

                objectLabel:
                    "MAP",

                letter:
                    "X",

                body: `
                <p>
                    The map represents Wanny's seasons
                    in Svalbard.
                </p>

                <p>
                    A trapper needed to understand
                    routes between cabins, changing
                    weather, snow conditions, animal
                    tracks, dangerous ice, and the
                    distance to supplies.
                </p>

                <p>
                    Arctic fox tracks were part of the
                    landscape she had to observe and
                    interpret.
                </p>

                <p>
                    The final letter is found at the
                    route marked with an
                    <strong>X</strong>.
                </p>
            `
            }
        };


        const foundArtifacts =
            new Set();


        const artifactButtons =
            Array.from(
                overlay.querySelectorAll(
                    ".wanny-case-artifact"
                )
            );


        const detailPanel = overlay.querySelector(".wanny-case-detail");


        const detailObject =
            overlay.querySelector(
                ".wanny-case-detail-object"
            );


        const detailTitle =
            overlay.querySelector(
                ".wanny-case-detail-title"
            );


        const detailBody =
            overlay.querySelector(
                ".wanny-case-detail-body"
            );


        const detailLetter =
            overlay.querySelector(
                ".wanny-case-detail-letter"
            );


        const detailBackButton =
            overlay.querySelector(
                ".wanny-case-detail-back"
            );


        const completionPanel =
            overlay.querySelector(
                ".wanny-case-complete"
            );


        /*
         * Refresh the F, O, X display.
         */
        function updateLetters() {
            Object.keys(
                artifacts
            ).forEach(key => {
                const slot =
                    overlay.querySelector(
                        `[data-letter-slot="${key}"]`
                    );

                slot.textContent =
                    foundArtifacts.has(key)
                        ? artifacts[key].letter
                        : "?";
            });


            if (
                foundArtifacts.size ===
                Object.keys(artifacts).length
            ) {
                completionPanel.hidden =
                    false;
            }
        }


        /*
         * Open information about one object.
         */
        function openArtifact(
            artifactKey,
            button
        ) {
            const artifact =
                artifacts[artifactKey];


            if (!artifact) {
                return;
            }


            foundArtifacts.add(
                artifactKey
            );


            button.classList.add(
                "found"
            );


            detailObject.textContent =
                artifact.objectLabel;


            detailTitle.textContent =
                artifact.title;


            detailBody.innerHTML =
                artifact.body;


            detailLetter.textContent =
                `Letter discovered: ${artifact.letter}`;


            detailPanel.hidden =
                false;


            updateLetters();
        }


        artifactButtons.forEach(
            button => {
                button.addEventListener(
                    "click",
                    () => {
                        openArtifact(
                            button.dataset.artifact,
                            button
                        );
                    }
                );
            }
        );


        detailBackButton.addEventListener(
            "click",
            () => {
                detailPanel.hidden =
                    true;
            }
        );


        updateLetters();


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
    window.INVENTORY_FILES.wannyCase =
        function (item) {
            openWannyTrapperCase(
                item
            );
        };


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