const tvModels = {
  "Samsung Smart TV Series": { brand: "Samsung TV", image: "assets/images/home-page-img/brand-img/Tv.webp", base: 45000 },
  "LG Smart TV Series": { brand: "LG TV", image: "assets/images/home-page-img/brand-img/Tv.webp", base: 42000 },
  "Sony Bravia TV Series": { brand: "Sony Bravia", image: "assets/images/home-page-img/brand-img/Tv.webp", base: 50000 },
  "Mi / Xiaomi TV Series": { brand: "Xiaomi TV", image: "assets/images/home-page-img/brand-img/Tv.webp", base: 25000 },
  "OnePlus TV Series": { brand: "OnePlus TV", image: "assets/images/home-page-img/brand-img/Tv.webp", base: 28000 },
  "TCL / Other TV Series": { brand: "Other TV", image: "assets/images/home-page-img/brand-img/Tv.webp", base: 18000 },
  "Other TV": { brand: "TV", image: "assets/images/home-page-img/brand-img/Tv.webp", base: 15000 }
};

const tvPage = document.body.dataset.page;
const tvParams = new URLSearchParams(window.location.search);
const fallbackTvModel = tvParams.get("model") || "Other TV";

function getTvSelection() {
  const stored = sessionStorage.getItem("cashygoTvSelection");
  if (stored) return JSON.parse(stored);

  const modelData = tvModels[fallbackTvModel] || tvModels["Other TV"];
  return {
    model: fallbackTvModel,
    brand: modelData.brand,
    image: modelData.image,
    basePrice: modelData.base
  };
}

function saveTvSelection(next) {
  const current = getTvSelection();
  const merged = { ...current, ...next };
  sessionStorage.setItem("cashygoTvSelection", JSON.stringify(merged));
  renderTvSelection(merged);
  return merged;
}

function tvPrice(value) {
  return "₹" + Math.max(0, value || 0).toLocaleString("en-IN");
}

function calculateTvPrice(selection) {
  let price = selection.basePrice || 0;

  // Size adjustments
  if (selection.size === "32 inch") price -= 8000;
  if (selection.size === "43 inch") price -= 3000;
  if (selection.size === "55 inch+") price += 10000;

  // Panel adjustments
  if (selection.panel === "HD / Full HD") price -= 5000;
  if (selection.panel === "QLED / OLED") price += 12000;

  // Smart TV adjustments
  if (selection.smart === "Non-smart TV") price -= 6000;

  // Age adjustments
  if (selection.age === "Under 1 year") price += 5000;
  if (selection.age === "3 years+") price -= 8000;

  // Condition adjustments
  if (selection.condition === "Excellent") price += 3000;
  if (selection.condition === "Average") price -= 3000;
  if (selection.condition === "Damaged") price -= 10000;

  // Display condition adjustments
  if (selection.display === "Minor display marks") price -= 5000;
  if (selection.display === "Major display issue") price -= 15000;

  // Accessories adjustments
  if (selection.accessories === "Remote missing") price -= 2000;
  if (selection.accessories === "No remote or stand") price -= 4000;

  // Question adjustments
  if (selection.mount === "Wall mounted") price -= 1000;
  if (selection.pickup === "Cannot power check") price -= 3000;

  // Issue deductions
  if (Array.isArray(selection.issues)) price -= selection.issues.length * 3000;

  return Math.round(price / 100) * 100;
}

function renderTvSelection(selection = getTvSelection()) {
  document.querySelectorAll("[data-model-name]").forEach(el => {
    el.textContent = selection.model || "TV";
  });
  document.querySelectorAll("[data-brand-name]").forEach(el => {
    el.textContent = selection.brand || "TV";
  });
  document.querySelectorAll("[data-tv-image]").forEach(img => {
    img.src = selection.image || tvModels["Other TV"].image;
    img.alt = selection.model || "TV";
  });
  document.querySelectorAll("[data-summary]").forEach(el => {
    const value = selection[el.dataset.summary];
    el.textContent = Array.isArray(value) ? (value.length ? value.join(", ") : "None selected") : (value || "-");
  });
  document.querySelectorAll("[data-summary-price]").forEach(el => {
    el.textContent = tvPrice(calculateTvPrice(selection));
  });
}

function setupTvOptions(groupName) {
  document.querySelectorAll(`[data-group="${groupName}"]`).forEach(option => {
    if (option.tagName === "SELECT") {
      option.addEventListener("change", () => {
        saveTvSelection({ [groupName]: option.value });
      });
      return;
    }

    option.addEventListener("click", () => {
      document.querySelectorAll(`[data-group="${groupName}"]`).forEach(item => item.classList.remove("is-selected"));
      option.classList.add("is-selected");
      saveTvSelection({ [groupName]: option.dataset.value });
    });
  });
}

function enableTvButtonWhen(groups, button) {
  const check = () => {
    const selection = getTvSelection();
    button.disabled = groups.some(group => !selection[group]);
  };
  document.addEventListener("click", check);
  check();
}

renderTvSelection();

if (tvPage === "tv-variant") {
  const modelData = tvModels[fallbackTvModel] || tvModels["Other TV"];
  saveTvSelection({
    model: fallbackTvModel,
    brand: modelData.brand,
    image: modelData.image,
    basePrice: modelData.base
  });
  ["size", "panel", "smart", "age"].forEach(setupTvOptions);
  const next = document.getElementById("continueBtn");
  enableTvButtonWhen(["size", "panel", "smart", "age"], next);
  next.addEventListener("click", () => {
    window.location.href = "tv_condition.html";
  });
}

if (tvPage === "tv-condition") {
  ["condition", "display", "accessories"].forEach(setupTvOptions);
  const next = document.getElementById("continueBtn");
  enableTvButtonWhen(["condition", "display", "accessories"], next);
  next.addEventListener("click", () => {
    window.location.href = "tv_Questions.html";
  });
}

if (tvPage === "tv-question") {
  ["bill", "mount", "pickup"].forEach(setupTvOptions);
  const next = document.getElementById("continueBtn");
  enableTvButtonWhen(["bill", "mount", "pickup"], next);
  next.addEventListener("click", () => {
    window.location.href = "tv_issu.html";
  });
}

if (tvPage === "tv-issue") {
  const selectedIssues = new Set(getTvSelection().issues || []);
  document.querySelectorAll("[data-issue]").forEach(card => {
    if (selectedIssues.has(card.dataset.issue)) card.classList.add("is-selected");
    card.addEventListener("click", () => {
      card.classList.toggle("is-selected");
      if (card.classList.contains("is-selected")) {
        selectedIssues.add(card.dataset.issue);
      } else {
        selectedIssues.delete(card.dataset.issue);
      }
      saveTvSelection({ issues: Array.from(selectedIssues) });
    });
  });
  document.getElementById("finishBtn").addEventListener("click", () => {
    document.getElementById("finishMsg").classList.add("is-visible");
  });
}
