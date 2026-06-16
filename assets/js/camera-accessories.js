/**
 * Camera Accessories Page (Step 2 of 5)
 * Reads:  cashygoCameraSelection  -> device name / price in the sidebar
 * Writes: cashygoCameraCondition.accessories = [...]  (merged, never overwrites)
 * Next:   camera_conation.html
 */
document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".accessory-card");
    const continueBtn = document.getElementById("continueBtn");
    const summaryList = document.getElementById("summaryList");
    const quotePrice = document.getElementById("quotePrice");
    const deviceName = document.getElementById("deviceName");
    const deviceMeta = document.getElementById("deviceMeta");

    const rupee = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    });

    // ── SHARED STATE HELPERS ──
    function readState(key, fallback) {
        try {
            return { ...fallback, ...JSON.parse(sessionStorage.getItem(key) || "{}") };
        } catch (e) {
            return { ...fallback };
        }
    }

    function mergeCondition(patch) {
        let existing = {};
        try {
            existing = JSON.parse(sessionStorage.getItem("cashygoCameraCondition") || "{}");
        } catch (e) {
            existing = {};
        }
        sessionStorage.setItem(
            "cashygoCameraCondition",
            JSON.stringify({ ...existing, ...patch })
        );
    }

    // ── LOAD DEVICE SELECTION ──
    const selection = readState("cashygoCameraSelection", {
        brand: "Sony",
        model: "Sony Alpha A6500",
        type: "Mirrorless Camera",
        price: 35000
    });

    const basePrice = Number(selection.price) || 35000;

    if (deviceName) deviceName.textContent = selection.model;
    if (deviceMeta) deviceMeta.textContent = `${selection.brand} • ${selection.type}`;
    if (quotePrice) quotePrice.textContent = rupee.format(basePrice);

    // ── PRE-FILL FROM SAVED CONDITION (preserve on back-navigation) ──
    const savedCondition = readState("cashygoCameraCondition", {});
    const savedAccessories = Array.isArray(savedCondition.accessories)
        ? savedCondition.accessories
        : [];

    cards.forEach(card => {
        const name = card.querySelector("h4").textContent.trim();
        const checkbox = card.querySelector(".accessory-checkbox");
        if (savedAccessories.includes(name)) {
            checkbox.checked = true;
            card.classList.add("selected");
        }
    });

    // ── COLLECT + RENDER SELECTED ACCESSORIES ──
    function selectedAccessories() {
        const list = [];
        cards.forEach(card => {
            const checkbox = card.querySelector(".accessory-checkbox");
            if (checkbox.checked) {
                list.push(card.querySelector("h4").textContent.trim());
            }
        });
        return list;
    }

    function updateSummary() {
        const list = selectedAccessories();

        summaryList.innerHTML = list.map(name => `
            <div class="selected-row done">
                <div class="tick"><i class="bi bi-check-lg"></i></div>
                <div class="selected-label">${name}</div>
                <div class="selected-val"><i class="bi bi-check2"></i></div>
            </div>
        `).join("");

        // Persist immediately so the value survives back/forward navigation.
        mergeCondition({ accessories: list });
    }

    cards.forEach(card => {
        const checkbox = card.querySelector(".accessory-checkbox");
        // The label natively toggles the checkbox; react to its change event.
        checkbox.addEventListener("change", () => {
            card.classList.toggle("selected", checkbox.checked);
            updateSummary();
        });
    });

    updateSummary();

    // ── CONTINUE ──
    continueBtn.addEventListener("click", () => {
        mergeCondition({ accessories: selectedAccessories() });
        window.location.href = "camera_conation.html";
    });
});
