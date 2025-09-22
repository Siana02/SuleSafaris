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
// Accessible, animated package cards with scroll wheel navigation

(function() {
  // Add .no-js fallback class if JS disabled (for accessibility)
  document.documentElement.classList.remove('no-js');

  const wrapper = document.querySelector('.packages-wrapper');
  const cards = Array.from(wrapper.querySelectorAll('.package-card'));
  const dots = Array.from(wrapper.querySelectorAll('.progress-dot'));
  const totalCards = cards.length;
  let activeIndex = 0;
  let isAnimating = false;

  // Set initial states: first card active, others hidden
  function setActiveCard(index, direction) {
    cards.forEach((card, i) => {
      card.classList.remove('active', 'outgoing');
      card.setAttribute('aria-hidden', i !== index);
      card.style.zIndex = i === index ? 10 : 1;
      card.style.pointerEvents = i === index ? 'auto' : 'none';
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Animate outgoing card
    if (direction !== undefined && direction !== null) {
      const prev = cards[activeIndex];
      if (prev && prev !== cards[index]) {
        prev.classList.add('outgoing');
        setTimeout(() => prev.classList.remove('outgoing'), 620);
      }
    }

    // Animate incoming card
    cards[index].classList.add('active');
    activeIndex = index;

    // Focus for keyboard support
    wrapper.setAttribute('aria-activedescendant', `package-card-${index}`);
    cards[index].setAttribute('tabindex', 0);
    cards[index].focus();
  }

  // Initial setup
  setActiveCard(0, null);

  // Throttle scroll
  let lastScroll = 0;
  const SCROLL_DELAY = 700;

  function onWheel(e) {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScroll < SCROLL_DELAY) return;
    lastScroll = now;

    const delta = e.deltaY || e.detail || e.wheelDelta;
    if (delta === 0) return;

    if (delta > 0 && activeIndex < totalCards - 1) {
      isAnimating = true;
      setActiveCard(activeIndex + 1, 'down');
      setTimeout(() => { isAnimating = false; }, SCROLL_DELAY);
      e.preventDefault();
    } else if (delta < 0 && activeIndex > 0) {
      isAnimating = true;
      setActiveCard(activeIndex - 1, 'up');
      setTimeout(() => { isAnimating = false; }, SCROLL_DELAY);
      e.preventDefault();
    } else if (delta > 0 && activeIndex === totalCards - 1) {
      // End of cards: scroll to next section
      const nextSection = document.querySelector('#next-section');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
      e.preventDefault();
    }
  }
  wrapper.addEventListener('wheel', onWheel, { passive: false });

  // Keyboard support (Enter/Space for CTA, ArrowDown/ArrowUp for navigation)
  wrapper.addEventListener('keydown', function(e) {
    if (isAnimating) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (activeIndex < totalCards - 1) {
        setActiveCard(activeIndex + 1, 'down');
        e.preventDefault();
      }
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (activeIndex > 0) {
        setActiveCard(activeIndex - 1, 'up');
        e.preventDefault();
      }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      // Focused CTA button (only active card)
      const ctaPrimary = cards[activeIndex].querySelector('.package-cta-primary');
      if (ctaPrimary) ctaPrimary.click();
      e.preventDefault();
    }
  });

  // Accessibility: if JS fails, show all cards stacked vertically
  window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.remove('no-js');
  });
})();
