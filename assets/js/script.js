// Toast helper
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// City picker
const cityPicker = document.getElementById('cityPicker');
const cityLabel = document.getElementById('cityLabel');

cityPicker.addEventListener('click', e => {
  e.stopPropagation();
  cityPicker.classList.toggle('open');
});

cityPicker.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', e => {
    e.stopPropagation();
    cityLabel.textContent = li.dataset.city;
    cityPicker.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!cityPicker.contains(e.target)) cityPicker.classList.remove('open');
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

// Dropdowns
document.querySelectorAll('.dropdown').forEach(dd => {
  dd.querySelector('.dropdown-btn').addEventListener('click', e => {
    e.stopPropagation();
    const wasOpen = dd.classList.contains('open');
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    if (!wasOpen) dd.classList.add('open');
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
});

// Brand slider arrows
const brandsScroll = document.getElementById('brandsScroll');
document.getElementById('brandsLeft').addEventListener('click', () => brandsScroll.scrollBy({ left: -280, behavior: 'smooth' }));
document.getElementById('brandsRight').addEventListener('click', () => brandsScroll.scrollBy({ left: 280, behavior: 'smooth' }));

// Reviews scroll
const reviewsScroll = document.getElementById('reviewsScroll');
document.getElementById('reviewsLeft').addEventListener('click', () => reviewsScroll.scrollBy({ left: -320, behavior: 'smooth' }));
document.getElementById('reviewsRight').addEventListener('click', () => reviewsScroll.scrollBy({ left: 320, behavior: 'smooth' }));

// Auto-scroll reviews
let reviewsAuto = setInterval(scrollReviews, 4000);

function scrollReviews() {
  if (reviewsScroll.scrollLeft + reviewsScroll.clientWidth >= reviewsScroll.scrollWidth) {
    reviewsScroll.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
    reviewsScroll.scrollBy({ left: 320, behavior: 'smooth' });
  }
}

reviewsScroll.addEventListener('mouseenter', () => clearInterval(reviewsAuto));
reviewsScroll.addEventListener('mouseleave', () => { reviewsAuto = setInterval(scrollReviews, 4000); });

// Counter animation
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    const text = counter.textContent.trim();
    const target = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');
    const increment = target / 80;
    let current = 0;

    counter.textContent = '0';

    function update() {
      current += increment;
      if (current < target) {
        counter.textContent = (target % 1 !== 0 ? current.toFixed(1) : Math.floor(current)) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    }

    update();
  });
}

window.addEventListener('load', animateCounters);

// Popup
const popupData = {
  popup1: { title: 'iPhone 15 Pro Details', items: ['Best resale after 6 months', 'High demand expected', 'Premium build quality', 'Strong resale market', 'Good battery performance', 'Top camera value', 'Stable pricing trend', 'Exchange bonus expected', 'Popular among buyers', 'Safe resale investment'] },
  popup2: { title: 'Galaxy S23 Ultra Details', items: ['High resale demand', 'Premium flagship', 'Camera strong', 'Good exchange value', 'Stable pricing', 'Popular model', 'Trusted brand', 'Fast selling', 'Heavy resale market', 'High value retention'] },
  popup3: { title: 'Pixel 8 Pro Details', items: ['AI features strong', 'Camera leader', 'Clean UI', 'Fast updates', 'Premium resale', 'Google trust', 'Stable demand', 'Good exchange', 'High resale', 'Future proof'] }
};

const popupOverlay = document.getElementById('popupOverlay');
const popupTitle = document.getElementById('popupTitle');
const popupList = document.getElementById('popupList');

document.querySelectorAll('.see-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const data = popupData[btn.dataset.popup] || popupData.popup1;
    popupTitle.textContent = data.title;
    popupList.innerHTML = data.items.map(i => `<li>${i}</li>`).join('');
    popupOverlay.classList.add('open');
  });
});

document.getElementById('popupClose').addEventListener('click', () => popupOverlay.classList.remove('open'));
popupOverlay.addEventListener('click', e => { if (e.target === popupOverlay) popupOverlay.classList.remove('open'); });

// Login modal
const modal = document.getElementById('loginModal');
const mobileStep = document.getElementById('mobileStep');
const otpStep = document.getElementById('otpStep');
let storedOtp = null, currMobile = '';

document.getElementById('openLoginBtn').addEventListener('click', () => modal.classList.add('open'));
document.getElementById('closeModalBtn').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

document.getElementById('sendOtpBtn').addEventListener('click', () => {
  const mobile = document.getElementById('mobileInput').value.trim();
  const terms = document.getElementById('termsCheck').checked;
  const err = document.getElementById('mobileErr');

  if (!terms) { err.textContent = 'Please accept terms'; return; }
  if (!/^\d{10}$/.test(mobile)) { err.textContent = 'Enter a valid 10-digit number'; return; }

  err.textContent = '';
  currMobile = mobile;
  storedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  showToast('OTP: ' + storedOtp);
  mobileStep.style.display = 'none';
  otpStep.style.display = 'block';
});

document.getElementById('verifyOtpBtn').addEventListener('click', () => {
  const otp = document.getElementById('otpInput').value.trim();
  const terms = document.getElementById('otpTerms').checked;
  const err = document.getElementById('otpErr');

  if (!terms) { err.textContent = 'Please accept T&C'; return; }
  if (otp !== storedOtp) { err.textContent = 'Incorrect OTP'; return; }

  showToast('Welcome back! ' + currMobile.slice(-4));
  document.querySelector('.nav-login span').textContent = '👤 ' + currMobile.slice(-4);
  modal.classList.remove('open');
  mobileStep.style.display = 'block';
  otpStep.style.display = 'none';
  document.getElementById('mobileInput').value = '';
  document.getElementById('otpInput').value = '';
});

document.getElementById('backBtn').addEventListener('click', () => {
  otpStep.style.display = 'none';
  mobileStep.style.display = 'block';
  storedOtp = null;
});