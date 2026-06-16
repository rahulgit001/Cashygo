/**
 * Camera Condition Page (Step 3 of 5)
 * Reads:  cashygoCameraSelection, cashygoCameraCondition (preserves accessories)
 * Writes: cashygoCameraCondition.shutter, cashygoCameraCondition.body  (merged)
 * Flow:   shutter (one question) -> reveal body -> enable Continue
 * Next:   camera_question.html
 */
document.addEventListener("DOMContentLoaded", () => {

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

    // ── LOAD SHARED STATE ──
    const selection = readState("cashygoCameraSelection", {
        brand: "Sony",
        model: "Sony Alpha A7 III",
        type: "Mirrorless Camera",
        price: 45000
    });

    const condition = readState("cashygoCameraCondition", { accessories: [] });
    const basePrice = Number(selection.price) || 45000;

    const answers = {
        shutter: condition.shutter || null,
        body: condition.body || null,
        accessories: Array.isArray(condition.accessories) ? condition.accessories : []
    };

    // ── PAINT DEVICE INFO ──
    document.getElementById("panelBrand").textContent = selection.brand;
    document.getElementById("panelModel").textContent = selection.model;
    document.getElementById("panelSpec").textContent = selection.type;

    document.getElementById("summaryBrand").textContent = selection.brand;
    document.getElementById("summaryModel").textContent = selection.model;
    document.getElementById("summaryType").textContent = selection.type;

    const shutterSection = document.getElementById("shutterSection");
    const bodySection = document.getElementById("bodySection");
    const conditionContinue = document.getElementById("conditionContinue");
    const accessoriesRow = document.getElementById("accessoriesRow");

    // Accessories were chosen on the previous step — show them as already done.
    function paintAccessories() {
        const count = answers.accessories.length;
        document.getElementById("accessoriesVal").textContent =
            count > 0 ? `${count} Selected` : "None";
        if (count > 0 && accessoriesRow) accessoriesRow.classList.add("done");
    }

    // ── OPTION SELECTION (shutter + body) ──
    document.querySelectorAll(".cashygo-option-card").forEach(card => {
        card.addEventListener("click", () => {
            const question = card.dataset.question;
            const value = card.dataset.value;

            document
                .querySelectorAll(`.cashygo-option-card[data-question="${question}"]`)
                .forEach(btn => btn.classList.remove("selected"));
            card.classList.add("selected");

            answers[question] = value;

            if (question === "shutter") {
                document.getElementById("shutterVal").textContent = value;
                document.getElementById("shutterRow").classList.add("done");
                revealBody();
            }

            if (question === "body") {
                document.getElementById("bodyVal").textContent = value;
                document.getElementById("bodyRow").classList.add("done");
                conditionContinue.disabled = !(answers.shutter && answers.body);
            }

            updatePrice();
            updateProgress();
        });
    });

    function revealBody() {
        bodySection.classList.remove("is-hidden");
        // One question visible at a time: collapse the shutter question.
        shutterSection.classList.add("is-hidden");
        bodySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // ── CONTINUE ──
    conditionContinue.addEventListener("click", () => {
        if (conditionContinue.disabled) return;
        // Merge — never overwrite accessories / issues / functionalIssues.
        mergeCondition({ shutter: answers.shutter, body: answers.body });
        window.location.href = "camera_question.html";
    });

    // ── PRICE ──
    function updatePrice() {
        let price = basePrice;

        switch (answers.shutter) {
            case "Below 10,000 clicks": price += 5000; break;
            case "10,000 to 30,000 clicks": price += 3000; break;
            case "30,000 to 60,000 clicks": price += 1000; break;
            case "More than 60,000 clicks": price -= 3000; break;
        }

        switch (answers.body) {
            case "Excellent body condition": price += 4000; break;
            case "Minor usage marks": price += 1500; break;
            case "Visible scratches or dents": price -= 2500; break;
            case "Faulty buttons, screen or ports": price -= 7000; break;
        }

        price += answers.accessories.length * 1000;

        document.getElementById("estimatedPrice").textContent =
            rupee.format(Math.max(price, 0));
    }

    // ── PROGRESS ──
    function updateProgress() {
        let done = 0;
        if (answers.shutter) done++;
        if (answers.body) done++;
        if (answers.accessories.length > 0) done++;
        document.getElementById("progressPill").textContent = `${done} / 3 Done`;
    }

    // ── RESTORE ON BACK-NAVIGATION ──
    function restore() {
        paintAccessories();

        if (answers.shutter) {
            const shutterBtn = document.querySelector(
                `.cashygo-option-card[data-question="shutter"][data-value="${answers.shutter}"]`
            );
            if (shutterBtn) shutterBtn.classList.add("selected");
            document.getElementById("shutterVal").textContent = answers.shutter;
            document.getElementById("shutterRow").classList.add("done");
            bodySection.classList.remove("is-hidden");
            shutterSection.classList.add("is-hidden");
        }

        if (answers.body) {
            const bodyBtn = document.querySelector(
                `.cashygo-option-card[data-question="body"][data-value="${answers.body}"]`
            );
            if (bodyBtn) bodyBtn.classList.add("selected");
            document.getElementById("bodyVal").textContent = answers.body;
            document.getElementById("bodyRow").classList.add("done");
            conditionContinue.disabled = false;
        }

        updatePrice();
        updateProgress();
    }

    restore();
});
