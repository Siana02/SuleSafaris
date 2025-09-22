// ======= THEME LOGIC WITH HERO IMAGE PRELOADING & FADE-IN =======
const themes = ['safari-theme', 'vacation-theme'];
const themeNames = {
  'safari-theme': 'Safari theme',
  'vacation-theme': 'Vacation theme'
};
const body = document.body;
const heroBg = document.getElementById('hero-bg');
const themeSwitcher = document.getElementById('theme-switcher');
const themeSwitcherMobile = document.getElementById('theme-switcher-mobile');
const themeMsg = document.getElementById('theme-message');
const themeMsgText = document.getElementById('theme-message-text');
const themeYesBtn = document.getElementById('theme-yes');
const themeNoBtn = document.getElementById('theme-no');

let currentTheme = null;

// Helper to extract the hero image URL from the CSS variable
function getHeroImgUrl() {
  let url = getComputedStyle(body).getPropertyValue('--hero-img').trim();
  // Remove url("...") or url('...') wrapper
  url = url.replace(/^url\((['"]?)/, '').replace(/(['"]?)\)$/, '');
  return url;
}

// Preload an image and call the callback when done (or on error)
function preloadHeroImage(url, callback) {
  const img = new Image();
  img.onload = callback;
  img.onerror = callback; // fallback: always call
  img.src = url;
}

// 1. Pick random theme on page load
function pickRandomTheme() {
  const idx = Math.floor(Math.random() * themes.length);
  setTheme(themes[idx]);
}

// 2. Set theme (add class to <body>, fade in hero BG after image loads)
function setTheme(theme) {
  themes.forEach(t => body.classList.remove(t));
  body.classList.add(theme);
  currentTheme = theme;

  // Fade out hero bg until image is loaded
  heroBg.style.opacity = 0;
  const imgUrl = getHeroImgUrl();

  preloadHeroImage(imgUrl, () => {
    heroBg.style.opacity = 1;
    fadeInHero();
  });
}

// 3. Theme toggle button logic
function toggleTheme() {
  const newTheme = (currentTheme === themes[0]) ? themes[1] : themes[0];
  setTheme(newTheme);
}

// 4. Show theme message after 5 seconds
function showThemeMessage() {
  themeMsgText.textContent =
    `You are currently viewing the ${themeNames[currentTheme]}. Would you like to try the ${themeNames[getOtherTheme()]}?`;
  themeMsg.style.display = 'flex';
  themeMsg.classList.add('fadein');
}

// Helper
function getOtherTheme() {
  return (currentTheme === themes[0]) ? themes[1] : themes[0];
}

// 5. Theme message buttons
themeYesBtn.addEventListener('click', () => {
  setTheme(getOtherTheme());
  themeMsg.style.display = 'none';
});
themeNoBtn.addEventListener('click', () => {
  themeMsg.style.display = 'none';
});

// 6. Theme switcher buttons
themeSwitcher.addEventListener('click', toggleTheme);
themeSwitcherMobile.addEventListener('click', () => {
  toggleTheme();
  closeMobileNav();
});

// 7. Fadein animation for hero content
function fadeInHero() {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.classList.remove('fadein');
    // force reflow
    void heroContent.offsetWidth;
    heroContent.classList.add('fadein');
  }
}

// 8. Hamburger/mobile nav
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
function openMobileNav() {
  mobileNav.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  mobileNav.classList.remove('active');
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', openMobileNav);
// close mobile nav when clicking outside or on link
mobileNav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') closeMobileNav();
});
document.addEventListener('click', (e) => {
  if (mobileNav.classList.contains('active')
    && !mobileNav.contains(e.target)
    && !hamburger.contains(e.target)
  ) {
    closeMobileNav();
  }
});

// 9. On load, preload both hero images for instant switch and pick random theme
window.addEventListener('DOMContentLoaded', () => {
  // Preload both hero images (adjust filenames if needed)
  ['Safari-hero.jpg', 'Vacation-hero.jpg..jpg'].forEach(url => {
    const img = new Image();
    img.src = url;
  });
  pickRandomTheme();
  setTimeout(showThemeMessage, 5000);
});
// ...previous theme and nav logic...

// ===== BEST OFFERS MODAL LOGIC =====

const offerModal = document.getElementById('offer-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const modalDetails = document.getElementById('modal-details');

const offerDetails = {
  mara: {
    title: "Masai Mara Adventure – 50% OFF",
    image: "assets/masai-mara.jpg",
    description: "Experience the iconic Masai Mara at half price this month only. Witness the Big 5 on guided drives and enjoy luxury tented camps.",
    highlights: [
      "3 days, 2 nights in luxury tented camp",
      "Multiple game drives (Big 5 guaranteed)",
      "Visit to local Maasai village",
      "Sundowner picnic at Mara River"
    ],
    meals: "Full board (breakfast, lunch, dinner)",
    bookLink: "#booking-mara"
  },
  coast: {
    title: "Kenyan Coast Escape – 30% OFF",
    image: "assets/kenyan-coast.jpg",
    description: "Unwind on the pristine beaches from Malindi to Diani with exclusive discounts. Perfect for couples, families, and solo travelers.",
    highlights: [
      "4 days, 3 nights beachfront resort",
      "Day trip to Wasini Island",
      "Dhow sunset cruise",
      "Snorkeling coral gardens"
    ],
    meals: "Bed & breakfast included",
    bookLink: "#booking-coast"
  }
};

function openOfferModal(offerKey) {
  const offer = offerDetails[offerKey];
  if (!offer) return;
  modalDetails.innerHTML = `
    <img src="${offer.image}" alt="${offer.title}" />
    <h3>${offer.title}</h3>
    <p>${offer.description}</p>
    <strong>Itinerary Highlights:</strong>
    <ul>
      ${offer.highlights.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <p><strong>Meals:</strong> ${offer.meals}</p>
    <a href="${offer.bookLink}" class="book-now-btn">Book Now</a>
  `;
  offerModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeOfferModal() {
  offerModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Attach event listeners for Learn More buttons
document.querySelectorAll('.learn-more-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    openOfferModal(this.dataset.offer);
  });
});
// Modal close button
modalClose.addEventListener('click', closeOfferModal);

// Close modal on background click or Escape key
offerModal.addEventListener('click', function(e) {
  if (e.target === offerModal) closeOfferModal();
});
document.addEventListener('keydown', function(e) {
  if (offerModal.classList.contains('active') && (e.key === "Escape" || e.key === "Esc")) 
  });
});
// --- Packages Cards: Slide-up Animation, Scroll Snap, Active Shadow ---
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector('.packages-wrapper');
  if (!wrapper) return;
  const cards = Array.from(wrapper.querySelectorAll('.package-card'));
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  // Helper: activate card in viewport
  function activateCardsOnScroll() {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      // Card is in viewport (top at or above 0, bottom at or below window height)
      if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Initial activation (if cards already visible)
  activateCardsOnScroll();

  // Listen for scroll and resize to trigger activation
  wrapper.addEventListener('scroll', activateCardsOnScroll);
  window.addEventListener('resize', activateCardsOnScroll);
  // For page scroll (if wrapper isn't scrolled, but cards are in viewport)
  window.addEventListener('scroll', activateCardsOnScroll);
});
