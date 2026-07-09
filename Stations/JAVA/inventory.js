(function () {
    const STORAGE_KEY = "inventoryItems";

    function getInventoryItems() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function saveInventoryItems(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function addInventoryItem(item) {
        const items = getInventoryItems();

        const exists = items.some(existing => existing.id === item.id);
        if (exists) return;

        items.push({
            id: item.id,
            title: item.title || "Untitled Item",
            type: item.type || "image",
            thumb: item.thumb || "",
            full: item.full || item.thumb || "",
            description: item.description || ""
        });

        saveInventoryItems(items);
    }

    function removeInventoryItem(id) {
        const items = getInventoryItems().filter(item => item.id !== id);
        saveInventoryItems(items);
    }

    function clearInventory() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function openInventory() {
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
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.zIndex = "100001";
        overlay.style.background = "rgba(0,0,0,0.88)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.padding = "20px";

        const box = document.createElement("div");
        box.style.background = "#f5efe0";
        box.style.color = "#2b2418";
        box.style.borderRadius = "18px";
        box.style.padding = "20px";
        box.style.maxWidth = "850px";
        box.style.width = "100%";
        box.style.maxHeight = "88vh";
        box.style.overflowY = "auto";
        box.style.textAlign = "center";
        box.style.position = "relative";

        box.innerHTML = `
            <button id="closeInventoryItem" style="
                position:absolute;
                top:12px;
                right:12px;
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

    window.getInventoryItems = getInventoryItems;
    window.addInventoryItem = addInventoryItem;
    window.removeInventoryItem = removeInventoryItem;
    window.clearInventory = clearInventory;
    window.openInventory = openInventory;
})();