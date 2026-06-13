const watchModels = {
  // Apple Watch
  "Apple Watch Series 10": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-10.avif", base: 30000 },
  "Apple Watch Series 9": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-9.avif", base: 22000 },
  "Apple Watch Ultra": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-ultra.avif", base: 35000 },
  "Apple Watch Series 8": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-8.avif", base: 17000 },
  "Apple Watch Series 7": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-7.avif", base: 13000 },
  "Apple Watch SE": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-se.avif", base: 10000 },
  "Apple Watch Series 6": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-6.avif", base: 9000 },
  "Apple Watch Series 5": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-5.avif", base: 6000 },
  "Apple Watch Series 4": { brand: "Apple Watch", image: "assets/images/watch_img/apple-watch-4.avif", base: 4500 },

  // Samsung Galaxy Watch
  "Galaxy Watch Ultra": { brand: "Samsung Galaxy Watch", image: "assets/images/watch_img/galaxy-watch-ultra.avif", base: 28000 },
  "Galaxy Watch 7": { brand: "Samsung Galaxy Watch", image: "assets/images/watch_img/galaxy-watch-7.avif", base: 18000 },
  "Galaxy Watch 6": { brand: "Samsung Galaxy Watch", image: "assets/images/watch_img/galaxy-watch-6.avif", base: 15000 },
  "Galaxy Watch 5": { brand: "Samsung Galaxy Watch", image: "assets/images/watch_img/galaxy-watch-5.avif", base: 10000 },
  "Galaxy Watch 4": { brand: "Samsung Galaxy Watch", image: "assets/images/watch_img/galaxy-watch-4.avif", base: 6500 },

  // Noise
  "Noise ColorFit Series": { brand: "Noise", image: "assets/images/watch_img/noise-colorfit.avif", base: 4500 },
  "Noise Halo Series": { brand: "Noise", image: "assets/images/watch_img/noise-halo.avif", base: 8000 },
  "Noise Calling Watches": { brand: "Noise", image: "assets/images/watch_img/noise-calling.avif", base: 3000 },

  // boAt
  "boAt Lunar Series": { brand: "boAt", image: "assets/images/watch_img/boat-lunar.avif", base: 7000 },
  "boAt Xtend & Enigma": { brand: "boAt", image: "assets/images/watch_img/boat-xtend.avif", base: 5000 },
  "boAt Storm Series": { brand: "boAt", image: "assets/images/watch_img/boat-storm.avif", base: 2500 },
  "boAt Wave Series": { brand: "boAt", image: "assets/images/watch_img/boat-wave.avif", base: 2000 },

  // Fire-Boltt
  "Fire-Boltt Visionary": { brand: "Fire-Boltt", image: "assets/images/watch_img/fireboltt-visionary.avif", base: 7000 },
  "Fire-Boltt Invincible": { brand: "Fire-Boltt", image: "assets/images/watch_img/fireboltt-invincible.avif", base: 5000 },
  "Fire-Boltt Phoenix": { brand: "Fire-Boltt", image: "assets/images/watch_img/fireboltt-phoenix.avif", base: 3000 },
  "Fire-Boltt Ninja": { brand: "Fire-Boltt", image: "assets/images/watch_img/fireboltt-ninja.avif", base: 2000 },

  // Amazfit
  "Amazfit GTR Series": { brand: "Amazfit", image: "assets/images/watch_img/amazfit-gtr.avif", base: 12000 },
  "Amazfit T-Rex Series": { brand: "Amazfit", image: "assets/images/watch_img/amazfit-trex.avif", base: 10000 },
  "Amazfit GTS Series": { brand: "Amazfit", image: "assets/images/watch_img/amazfit-gts.avif", base: 9000 },
  "Amazfit Bip Series": { brand: "Amazfit", image: "assets/images/watch_img/amazfit-bip.avif", base: 3500 },

  // Fallback
  "Other Smartwatch": { brand: "Smartwatch", image: "assets/images/home-page-img/brand-img/whatch.webp", base: 3000 }
};

const watchPage = document.body.dataset.page;
const watchParams = new URLSearchParams(window.location.search);
const fallbackWatchModel = watchParams.get("model") || watchParams.get("series") || "Other Smartwatch";

function getWatchSelection() {
  const stored = sessionStorage.getItem("cashygoWatchSelection");
  if (stored) return JSON.parse(stored);

  const modelData = watchModels[fallbackWatchModel] || watchModels["Other Smartwatch"];
  return {
    model: fallbackWatchModel,
    brand: modelData.brand,
    image: modelData.image,
    basePrice: modelData.base
  };
}

function saveWatchSelection(next) {
  const current = getWatchSelection();
  const merged = { ...current, ...next };
  sessionStorage.setItem("cashygoWatchSelection", JSON.stringify(merged));
  renderWatchSelection(merged);
  return merged;
}

function watchPrice(value) {
  return "₹" + Math.max(0, value || 0).toLocaleString("en-IN");
}

function calculateWatchPrice(selection) {
  let price = selection.basePrice || 0;

  // Variant adjustments
  if (selection.size === "Ultra / Pro") price += 3000;
  if (selection.size === "40mm / 41mm / Small") price -= 500;
  if (selection.connectivity === "GPS + Cellular") price += 2500;
  if (selection.band === "Third-party band") price -= 800;
  if (selection.band === "No band") price -= 1500;
  if (selection.age === "Under 1 year") price += 2500;
  if (selection.age === "3 years+") price -= 2000;

  // Condition adjustments
  if (selection.condition === "Excellent") price += 1500;
  if (selection.condition === "Average") price -= 1200;
  if (selection.condition === "Damaged") price -= 4000;
  if (selection.battery === "Weak backup") price -= 1500;
  if (selection.battery === "Needs replacement") price -= 3500;
  if (selection.accessories === "Charger missing") price -= 1000;
  if (selection.accessories === "No charger or box") price -= 2000;

  // Question adjustments
  if (selection.lock === "Account lock active") price -= 3000;

  // Issue deductions
  if (Array.isArray(selection.issues)) price -= selection.issues.length * 1500;

  return Math.round(price / 100) * 100;
}

function renderWatchSelection(selection = getWatchSelection()) {
  document.querySelectorAll("[data-model-name]").forEach(el => {
    el.textContent = selection.model || "Smartwatch";
  });
  document.querySelectorAll("[data-brand-name]").forEach(el => {
    el.textContent = selection.brand || "Smartwatch";
  });
  document.querySelectorAll("[data-watch-image]").forEach(img => {
    img.src = selection.image || watchModels["Other Smartwatch"].image;
    img.alt = selection.model || "Smartwatch";
  });
  document.querySelectorAll("[data-summary]").forEach(el => {
    const value = selection[el.dataset.summary];
    el.textContent = Array.isArray(value) ? (value.length ? value.join(", ") : "None selected") : (value || "-");
  });
  document.querySelectorAll("[data-summary-price]").forEach(el => {
    el.textContent = watchPrice(calculateWatchPrice(selection));
  });
}

function setupWatchOptions(groupName) {
  document.querySelectorAll(`[data-group="${groupName}"]`).forEach(option => {
    if (option.tagName === "SELECT") {
      option.addEventListener("change", () => {
        saveWatchSelection({ [groupName]: option.value });
      });
      return;
    }

    option.addEventListener("click", () => {
      document.querySelectorAll(`[data-group="${groupName}"]`).forEach(item => item.classList.remove("is-selected"));
      option.classList.add("is-selected");
      saveWatchSelection({ [groupName]: option.dataset.value });
    });
  });
}

function enableWatchButtonWhen(groups, button) {
  const check = () => {
    const selection = getWatchSelection();
    button.disabled = groups.some(group => !selection[group]);
  };
  document.addEventListener("click", check);
  check();
}

renderWatchSelection();

if (watchPage === "watch-variant") {
  const modelData = watchModels[fallbackWatchModel] || watchModels["Other Smartwatch"];
  saveWatchSelection({
    model: fallbackWatchModel,
    brand: modelData.brand,
    image: modelData.image,
    basePrice: modelData.base
  });
  ["size", "connectivity", "band", "age"].forEach(setupWatchOptions);
  const next = document.getElementById("continueBtn");
  enableWatchButtonWhen(["size", "connectivity", "band", "age"], next);
  next.addEventListener("click", () => {
    window.location.href = "watch_Device_condation.html";
  });
}

if (watchPage === "watch-condition") {
  ["condition", "battery", "accessories"].forEach(setupWatchOptions);
  const next = document.getElementById("continueBtn");
  enableWatchButtonWhen(["condition", "battery", "accessories"], next);
  next.addEventListener("click", () => {
    window.location.href = "Watch_Questions.html";
  });
}

if (watchPage === "watch-question") {
  ["bill", "lock", "reset"].forEach(setupWatchOptions);
  const next = document.getElementById("continueBtn");
  enableWatchButtonWhen(["bill", "lock", "reset"], next);
  next.addEventListener("click", () => {
    window.location.href = "Watch_Issues.html";
  });
}

if (watchPage === "watch-issue") {
  const selectedIssues = new Set(getWatchSelection().issues || []);
  document.querySelectorAll("[data-issue]").forEach(card => {
    if (selectedIssues.has(card.dataset.issue)) card.classList.add("is-selected");
    card.addEventListener("click", () => {
      card.classList.toggle("is-selected");
      if (card.classList.contains("is-selected")) {
        selectedIssues.add(card.dataset.issue);
      } else {
        selectedIssues.delete(card.dataset.issue);
      }
      saveWatchSelection({ issues: Array.from(selectedIssues) });
    });
  });
  document.getElementById("finishBtn").addEventListener("click", () => {
    document.getElementById("finishMsg").classList.add("is-visible");
  });
}
