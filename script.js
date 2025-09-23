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
  url = url.replace(/^url\((['"]?)/, '').replace(/(['"]?)\)$/, '');
  return url;
}

// Preload an image and call the callback when done (or on error)
function preloadHeroImage(url, callback) {
  const img = new Image();
  img.onload = callback;
  img.onerror = callback;
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

  if (heroBg) {
    heroBg.style.opacity = 0;
    const imgUrl = getHeroImgUrl();
    preloadHeroImage(imgUrl, () => {
      heroBg.style.opacity = 1;
      fadeInHero();
    });
  }
}

// 3. Theme toggle button logic
function toggleTheme() {
  const newTheme = (currentTheme === themes[0]) ? themes[1] : themes[0];
  setTheme(newTheme);
}

// 4. Show theme message after 5 seconds
function showThemeMessage() {
  if (themeMsgText && themeMsg && currentTheme) {
    themeMsgText.textContent =
      `You are currently viewing the ${themeNames[currentTheme]}. Would you like to try the ${themeNames[getOtherTheme()]}?`;
    themeMsg.style.display = 'flex';
    themeMsg.classList.add('fadein');
  }
}

// Helper
function getOtherTheme() {
  return (currentTheme === themes[0]) ? themes[1] : themes[0];
}

// 5. Theme message buttons
if (themeYesBtn) {
  themeYesBtn.addEventListener('click', () => {
    setTheme(getOtherTheme());
    if (themeMsg) themeMsg.style.display = 'none';
  });
}
if (themeNoBtn) {
  themeNoBtn.addEventListener('click', () => {
    if (themeMsg) themeMsg.style.display = 'none';
  });
}

// 6. Theme switcher buttons
if (themeSwitcher) themeSwitcher.addEventListener('click', toggleTheme);
if (themeSwitcherMobile) {
  themeSwitcherMobile.addEventListener('click', () => {
    toggleTheme();
    closeMobileNav();
  });
}

// Letter-by-letter pop-in for hero-title
document.addEventListener("DOMContentLoaded", function() {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = ''; // Clear the text
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.innerHTML = char === ' ' ? '&nbsp;' : char; // <-- fix: preserve space
      span.classList.add('letter');
      span.style.animationDelay = `${i * 0.045}s`;
      heroTitle.appendChild(span);
    });
  }
});

// 7. Fadein animation for hero content
function fadeInHero() {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.classList.remove('fadein');
    void heroContent.offsetWidth;
    heroContent.classList.add('fadein');
  }
}

// 8. Hamburger/mobile nav
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
function openMobileNav() {
  if (mobileNav) {
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeMobileNav() {
  if (mobileNav) {
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }
}
if (hamburger) hamburger.addEventListener('click', openMobileNav);
if (mobileNav) {
  mobileNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') closeMobileNav();
  });
}
document.addEventListener('click', (e) => {
  if (
    mobileNav &&
    mobileNav.classList.contains('active') &&
    !mobileNav.contains(e.target) &&
    (!hamburger || !hamburger.contains(e.target))
  ) {
    closeMobileNav();
  }
});

// 9. On load, preload both hero images for instant switch and pick random theme
window.addEventListener('DOMContentLoaded', () => {
  ['Safari-hero.jpg', 'Vacation-hero.jpg..jpg'].forEach(url => {
    const img = new Image();
    img.src = url;
  });
  pickRandomTheme();
  setTimeout(showThemeMessage, 5000);
});

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
  if (modalDetails && offerModal && modalClose) {
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
}

function closeOfferModal() {
  if (offerModal) offerModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Attach event listeners for Learn More buttons
document.querySelectorAll('.learn-more-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    openOfferModal(this.dataset.offer);
  });
});
// Modal close button
if (modalClose) modalClose.addEventListener('click', closeOfferModal);

// Close modal on background click or Escape key
if (offerModal) {
  offerModal.addEventListener('click', function(e) {
    if (e.target === offerModal) closeOfferModal();
  });
}
document.addEventListener('keydown', function(e) {
  if (
    offerModal &&
    offerModal.classList.contains('active') &&
    (e.key === "Escape" || e.key === "Esc")
  ) {
    closeOfferModal();
  }
});
// Accessible, animated package cards with scroll wheel, touch, and keyboard navigation
(function() {
  document.documentElement.classList.remove('no-js');

  const wrapper = document.querySelector('.packages-wrapper');
  if (!wrapper) return; // Defensive: do nothing if packages section missing

  const cards = Array.from(wrapper.querySelectorAll('.package-card'));
  const dots = Array.from(wrapper.querySelectorAll('.progress-dot'));
  const totalCards = cards.length;
  let activeIndex = 0;
  let isAnimating = false;

  // Ensure wrapper can receive keyboard focus
  wrapper.setAttribute('tabindex', '0');

  function setActiveCard(index, direction) {
    cards.forEach((card, i) => {
      card.classList.remove('active', 'outgoing');
      card.setAttribute('aria-hidden', i !== index);
      card.style.zIndex = i === index ? 10 : 1;
      card.style.pointerEvents = i === index ? 'auto' : 'none';
      card.setAttribute('tabindex', '-1');
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    if (direction !== undefined && direction !== null) {
      const prev = cards[activeIndex];
      if (prev && prev !== cards[index]) {
        prev.classList.add('outgoing');
        setTimeout(() => prev.classList.remove('outgoing'), 620);
      }
    }

    cards[index].classList.add('active');
    activeIndex = index;

    wrapper.setAttribute('aria-activedescendant', `package-card-${index}`);
    cards[index].setAttribute('tabindex', '0');
  }

  setActiveCard(0, null);

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
      const nextSection = document.querySelector('#next-section');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
      e.preventDefault();
    }
  }
  wrapper.addEventListener('wheel', onWheel, { passive: false });

  // --- Touch support for mobile devices ---
  let touchStartY = null;

  wrapper.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  wrapper.addEventListener('touchend', function(e) {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    const SWIPE_THRESHOLD = 40; // Minimum swipe distance in px

    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (deltaY > 0 && activeIndex < totalCards - 1) {
        setActiveCard(activeIndex + 1, 'down');
      } else if (deltaY < 0 && activeIndex > 0) {
        setActiveCard(activeIndex - 1, 'up');
      }
    }
    touchStartY = null;
  }, { passive: true });

  // --- Keyboard support ---
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
      const ctaPrimary = cards[activeIndex].querySelector('.package-cta-primary');
      if (ctaPrimary) ctaPrimary.click();
      e.preventDefault();
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.remove('no-js');
  });
})();
