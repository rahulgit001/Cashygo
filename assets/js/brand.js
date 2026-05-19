document.querySelectorAll('.cashygo-faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('cashygo-open');
    document.querySelectorAll('.cashygo-faq__item').forEach(i => i.classList.remove('cashygo-open'));
    if (!isOpen) item.classList.add('cashygo-open');
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const modelPageURL = "model.html";
  let selectedBrand = "";

  function redirectToModel(locationValue) {
    const params = new URLSearchParams({
      brand: selectedBrand,
      location: locationValue
    });

    localStorage.setItem("selectedBrand", selectedBrand);
    localStorage.setItem("userLocation", locationValue);
    window.location.href = modelPageURL + "?" + params.toString();
  }

  window.handleBrandClick = function(event, brand) {
    if (event) event.preventDefault();

    selectedBrand = brand;
    document.getElementById("locationPopup").style.display = "flex";
    document.getElementById("selectedBrand").innerText = "Selected: " + brand;
    document.getElementById("userLocation").focus();
  };

  window.closePopup = function() {
    document.getElementById("locationPopup").style.display = "none";
  };

  window.submitLocation = function() {
    const location = document.getElementById("userLocation").value.trim();

    if (!/^\d{6}$/.test(location)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    redirectToModel(location);
  };

  window.useCurrentLocation = function() {
    if (!navigator.geolocation) {
      alert("Current location is not supported in this browser. Please enter your pincode.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const coords = position.coords.latitude.toFixed(5) + "," + position.coords.longitude.toFixed(5);
        redirectToModel(coords);
      },
      () => {
        alert("Unable to fetch your current location. Please enter your pincode.");
      }
    );
  };
});
