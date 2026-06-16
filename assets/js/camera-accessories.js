document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".accessory-card");
    const continueBtn = document.getElementById("continueBtn");
    const summaryList = document.getElementById("summaryList");
    const quotePrice = document.getElementById("quotePrice");

    let basePrice = Number(localStorage.getItem("cameraPrice")) || 35000;

    function updateQuote() {

        let totalBonus = 0;
        let selectedAccessories = [];

        cards.forEach(card => {

            const checkbox = card.querySelector(".accessory-checkbox");

            if (checkbox.checked) {

                const name = card.querySelector("h4").textContent;

                const priceText = card.querySelector(".accessory-price")
                    .textContent
                    .replace(/[^\d]/g, "");

                const bonus = Number(priceText);

                totalBonus += bonus;

                selectedAccessories.push({
                    name,
                    bonus
                });
            }
        });

        const finalPrice = basePrice + totalBonus;

        quotePrice.innerHTML =
            `₹${finalPrice.toLocaleString("en-IN")}`;

        summaryList.innerHTML = "";

        selectedAccessories.forEach(item => {

            summaryList.innerHTML += `
                <div class="selected-row done">
                    <div class="tick">
                        <i class="bi bi-check-lg"></i>
                    </div>

                    <div class="selected-label">
                        ${item.name}
                    </div>

                    <div class="selected-val">
                        +₹${item.bonus.toLocaleString("en-IN")}
                    </div>
                </div>
            `;
        });

        continueBtn.disabled = false;

        localStorage.setItem(
            "cameraAccessories",
            JSON.stringify(selectedAccessories)
        );

        localStorage.setItem(
            "cameraQuote",
            finalPrice
        );
    }

    cards.forEach(card => {

        card.addEventListener("click", function(e) {

            const checkbox =
                this.querySelector(".accessory-checkbox");

            checkbox.checked = !checkbox.checked;

            this.classList.toggle(
                "selected",
                checkbox.checked
            );

            updateQuote();
        });

    });

    continueBtn.addEventListener("click", () => {

        window.location.href =
            "camera_condition.html";

    });

    quotePrice.innerHTML =
        `₹${basePrice.toLocaleString("en-IN")}`;

});