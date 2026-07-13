(function () {
    const STORAGE_KEY = "inventoryItems";

    function injectInventoryStyles() {
        if (document.getElementById("inventory-dossier-styles")) return;

        const style = document.createElement("style");
        style.id = "inventory-dossier-styles";

        style.textContent = `
            .inventory-dossier {
                position: relative;
                width: 100%;
                min-height: 145px;
                background: linear-gradient(180deg, #c69a58 0%, #b78646 100%);
                border: 2px solid #8b6232;
                border-radius: 10px;
                box-shadow: 0 8px 18px rgba(0,0,0,0.18);
                overflow: hidden;
                padding: 14px;
                box-sizing: border-box;
            }

            .inventory-dossier::before {
                content: "";
                position: absolute;
                top: 0;
                left: 18px;
                width: 90px;
                height: 18px;
                background: #d3ab6a;
                border: 2px solid #8b6232;
                border-bottom: none;
                border-radius: 8px 8px 0 0;
            }

            .inventory-dossier-label {
                position: absolute;
                bottom: 12px;
                left: 14px;
                right: 14px;
                text-align: center;
                font-weight: bold;
                font-size: 14px;
                color: #3d2a15;
                letter-spacing: 0.5px;
            }

            .inventory-note {
                position: absolute;
                top: 20px;
                right: 12px;
                width: 92px;
                min-height: 95px;
                background: #f6edcc;
                border: 1px solid #b8a16a;
                box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                transform: rotate(4deg);
                padding: 8px;
                box-sizing: border-box;
                font-family: Georgia, "Times New Roman", serif;
            }

            .inventory-note::before {
                content: "";
                position: absolute;
                top: -8px;
                left: 50%;
                width: 12px;
                height: 12px;
                margin-left: -6px;
                background: #b53737;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }

            .inventory-note h4 {
                margin: 0 0 6px;
                font-size: 10px;
                text-transform: uppercase;
                color: #49301a;
                text-align: center;
            }

            .inventory-note .note-date {
                font-size: 10px;
                line-height: 1.2;
                margin-bottom: 6px;
                color: #3c2a1a;
            }

            .inventory-note ul {
                margin: 0;
                padding-left: 14px;
                font-size: 9px;
                line-height: 1.25;
                color: #3c2a1a;
            }

            .inventory-dossier-preview-overlay {
                position: fixed;
                inset: 0;
                z-index: 100001;
                background: rgba(0,0,0,0.82);
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .inventory-dossier-preview-box {
                background: #f4ead2;
                color: #2b2418;
                border-radius: 18px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.35);
                max-width: 950px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                padding: 24px;
                box-sizing: border-box;
            }

            .inventory-close-btn {
                position: absolute;
                top: 12px;
                right: 12px;
                z-index: 5;
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                background: #111;
                color: white;
                font-size: 22px;
                cursor: pointer;
            }

            .inventory-dossier.large {
                min-height: 320px;
                padding: 28px;
            }

            .inventory-dossier.large::before {
                left: 32px;
                width: 150px;
                height: 28px;
            }

            .inventory-dossier.large .inventory-dossier-label {
                font-size: 26px;
                bottom: 28px;
            }

            .inventory-dossier.large .inventory-note {
                width: 240px;
                min-height: 230px;
                top: 38px;
                right: 32px;
                padding: 18px 16px;
            }

            .inventory-dossier.large .inventory-note h4 {
                font-size: 17px;
                margin-bottom: 12px;
            }

            .inventory-dossier.large .inventory-note .note-date {
                font-size: 15px;
                margin-bottom: 12px;
            }

            .inventory-dossier.large .inventory-note ul {
                font-size: 14px;
                line-height: 1.4;
            }

            .inventory-preview-actions {
                margin-top: 20px;
                display: flex;
                justify-content: center;
            }

            .inventory-open-file-btn {
                border: none;
                border-radius: 999px;
                padding: 12px 22px;
                font-weight: bold;
                cursor: pointer;
                background: #7a4f24;
                color: white;
                font-size: 15px;
            }

            .inventory-open-file-btn:hover {
                background: #5f3d1b;
            }

            .inventory-file-overlay {
                position: fixed;
                inset: 0;
                z-index: 100002;
                background: rgba(0,0,0,0.88);
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .inventory-file-box {
                background: #f5efe0;
                color: #2b2418;
                border-radius: 18px;
                padding: 24px;
                max-width: 850px;
                width: 100%;
                max-height: 88vh;
                overflow-y: auto;
                position: relative;
                box-sizing: border-box;
            }

            @media (max-width: 650px) {
                .inventory-dossier.large .inventory-note {
                    position: static;
                    width: 100%;
                    min-height: auto;
                    transform: none;
                    margin-top: 30px;
                }

                .inventory-dossier.large .inventory-dossier-label {
                    position: static;
                    margin-top: 24px;
                    text-align: left;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function getInventoryItems() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveInventoryItems(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function addInventoryItem(item) {
        const items = getInventoryItems();

        const newItem = {
            id: item.id,
            title: item.title || "Untitled Item",
            type: item.type || "image",
            thumb: item.thumb || "",
            full: item.full || item.thumb || "",
            description: item.description || "",

            birthDate: item.birthDate || "",
            achievements: Array.isArray(item.achievements) ? item.achievements : [],

            fileAction: item.fileAction || "",
            fileTitle: item.fileTitle || item.title || "File",
            fileHtml: item.fileHtml || "",
            fileImage: item.fileImage || "",
            fileDescription: item.fileDescription || "",

            newspaperTitle: item.newspaperTitle || "",
            newspaperDate: item.newspaperDate || "",
            newspaperImage: item.newspaperImage || "",
            newspaperImageDate: item.newspaperImageDate || "",
            newspaperText: item.newspaperText || ""
        };

        const existingIndex = items.findIndex(existing => existing.id === item.id);

        if (existingIndex !== -1) {
            items[existingIndex] = newItem;
        } else {
            items.push(newItem);
        }

        saveInventoryItems(items);
    }

    function removeInventoryItem(id) {
        const items = getInventoryItems().filter(item => item.id !== id);
        saveInventoryItems(items);
    }

    function clearInventory() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function createAchievementList(item, limit = null) {
        const list = Array.isArray(item.achievements) ? item.achievements : [];
        const visible = limit ? list.slice(0, limit) : list;

        if (visible.length === 0) {
            return `<li>No notes yet</li>`;
        }

        return visible.map(entry => `<li>${entry}</li>`).join("");
    }

    function createDossierMarkup(item, large = false) {
        return `
            <div class="inventory-dossier ${large ? "large" : ""}">
                <div class="inventory-note">
                    <h4>Quick Facts</h4>

                    <div class="note-date">
                        <strong>Born:</strong><br>
                        ${item.birthDate || "Unknown"}
                    </div>

                    <ul>
                        ${createAchievementList(item, large ? null : 2)}
                    </ul>
                </div>

                <div class="inventory-dossier-label">
                    ${item.title}
                </div>
            </div>
        `;
    }

    function openInventory() {
        injectInventoryStyles();

        const items = getInventoryItems();

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.zIndex = "100000";
        overlay.style.background = "rgba(2, 8, 18, 0.94)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.padding = "20px";

        const card = document.createElement("div");
        card.style.background = "#f5efe0";
        card.style.color = "#2b2418";
        card.style.borderRadius = "18px";
        card.style.padding = "22px";
        card.style.maxWidth = "900px";
        card.style.width = "100%";
        card.style.maxHeight = "85vh";
        card.style.overflowY = "auto";
        card.style.boxShadow = "0 20px 50px rgba(0,0,0,0.35)";

        card.innerHTML = `
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:16px;
                margin-bottom:18px;
            ">
                <h2 style="margin:0;">🎒 Inventory</h2>

                <button id="closeInventory" style="
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    width:40px;
                    height:40px;
                    border:none;
                    border-radius:50%;
                    background:#111;
                    color:white;
                    font-size:22px;
                    cursor:pointer;
                ">×</button>
            </div>

            <div id="inventoryGrid" style="
                display:grid;
                grid-template-columns:repeat(3, 1fr);
                gap:16px;
            "></div>
        `;

        overlay.appendChild(card);
        document.body.appendChild(overlay);

        const grid = card.querySelector("#inventoryGrid");

        if (window.innerWidth <= 500) {
            grid.style.gridTemplateColumns = "repeat(2, 1fr)";
        }

        if (items.length === 0) {
            grid.innerHTML = `
                <p style="
                    grid-column:1 / -1;
                    text-align:center;
                    margin:30px 0;
                    font-size:18px;
                ">
                    No items collected yet.
                </p>
            `;
        } else {
            items.forEach(item => {
                const tile = document.createElement("button");
                tile.type = "button";
                tile.style.border = "none";
                tile.style.background = "white";
                tile.style.borderRadius = "14px";
                tile.style.padding = "12px";
                tile.style.cursor = "pointer";
                tile.style.textAlign = "center";
                tile.style.boxShadow = "0 8px 18px rgba(0,0,0,0.12)";
                tile.style.display = "flex";
                tile.style.flexDirection = "column";
                tile.style.alignItems = "center";
                tile.style.gap = "10px";

                if (item.type === "dossier") {
                    tile.innerHTML = createDossierMarkup(item, false);
                } else {
                    tile.innerHTML = `
                        <img src="${item.thumb}"
                             alt="${item.title}"
                             style="
                                width:100%;
                                max-width:100px;
                                height:100px;
                                object-fit:contain;
                                border-radius:10px;
                                background:#f4f4f4;
                             ">

                        <strong style="
                            font-size:14px;
                            color:#061927;
                        ">
                            ${item.title}
                        </strong>
                    `;
                }

                tile.addEventListener("click", () => {
                    openInventoryItem(item);
                });

                grid.appendChild(tile);
            });
        }

        card.querySelector("#closeInventory").addEventListener("click", () => {
            overlay.remove();
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    }

    function openInventoryItem(item) {
        injectInventoryStyles();

        if (item.type === "dossier") {
            openDossierPreview(item);
            return;
        }

        openDefaultInventoryItem(item);
    }

    function openDefaultInventoryItem(item) {
        const overlay = document.createElement("div");
        overlay.className = "inventory-file-overlay";

        const box = document.createElement("div");
        box.className = "inventory-file-box";
        box.style.textAlign = "center";

        box.innerHTML = `
            <button class="inventory-close-btn" id="closeInventoryItem">×</button>

            <h3 style="margin-top:0;">${item.title}</h3>

            <img src="${item.full}"
                 alt="${item.title}"
                 style="
                    width:100%;
                    max-width:700px;
                    height:auto;
                    border-radius:12px;
                    box-shadow:0 10px 25px rgba(0,0,0,0.18);
                 ">

            ${item.description ? `<p style="margin-top:16px; line-height:1.5;">${item.description}</p>` : ""}
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        box.querySelector("#closeInventoryItem").addEventListener("click", () => {
            overlay.remove();
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    }

    function openDossierPreview(item) {
        const overlay = document.createElement("div");
        overlay.className = "inventory-dossier-preview-overlay";

        const box = document.createElement("div");
        box.className = "inventory-dossier-preview-box";

        box.innerHTML = `
            <button class="inventory-close-btn" id="closeDossierPreview">×</button>

            ${createDossierMarkup(item, true)}

            <div class="inventory-preview-actions">
                <button class="inventory-open-file-btn" id="openDossierFileBtn">
                    Open file
                </button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        box.querySelector("#closeDossierPreview").addEventListener("click", () => {
            overlay.remove();
        });

        box.querySelector("#openDossierFileBtn").addEventListener("click", () => {
            overlay.remove();
            openDossierFile(item);
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    }

    function openDossierFile(item) {
        if (
            item.fileAction &&
            window.INVENTORY_FILES &&
            typeof window.INVENTORY_FILES[item.fileAction] === "function"
        ) {
            window.INVENTORY_FILES[item.fileAction](item);
            return;
        }

        openGenericDossierFile(item);
    }

    function openGenericDossierFile(item) {
        const overlay = document.createElement("div");
        overlay.className = "inventory-file-overlay";

        const box = document.createElement("div");
        box.className = "inventory-file-box";

        box.innerHTML = `
            <button class="inventory-close-btn" id="closeDossierFile">×</button>

            <h1>${item.fileTitle || item.title}</h1>

            ${item.fileImage ? `<img src="${item.fileImage}" alt="${item.title}" style="max-width:100%; border-radius:12px;">` : ""}

            ${item.fileHtml || ""}

            ${item.fileDescription ? `<p>${item.fileDescription}</p>` : ""}
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        box.querySelector("#closeDossierFile").addEventListener("click", () => {
            overlay.remove();
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    }

    injectInventoryStyles();

    window.getInventoryItems = getInventoryItems;
    window.addInventoryItem = addInventoryItem;
    window.removeInventoryItem = removeInventoryItem;
    window.clearInventory = clearInventory;
    window.openInventory = openInventory;
})();