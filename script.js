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
    const text = heroTitle.textContent.trim();
    heroTitle.textContent = ''; // Clear the text
    text.split(' ').forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word');
      word.split('').forEach((char, lIdx) => {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = char;
        letterSpan.classList.add('letter');
        letterSpan.style.animationDelay = `${(wIdx * 6 + lIdx) * 0.045}s`;
        wordSpan.appendChild(letterSpan);
      });
      heroTitle.appendChild(wordSpan);
      // Add space after word except last
      if (wIdx < text.split(' ').length - 1) {
        heroTitle.appendChild(document.createTextNode(' '));
      }
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


// Mobile Hamburger Menu Logic

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

// Only use the hamburger button that morphs to X
function toggleMenu() {
  const isOpen = mobileNav.classList.contains('open');
  hamburger.classList.toggle('open', !isOpen);
  mobileNav.classList.toggle('open', !isOpen);
  hamburger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
  document.body.style.overflow = !isOpen ? 'hidden' : '';
}

// Hamburger click toggles menu
hamburger.addEventListener('click', toggleMenu);

// Click outside to close
document.addEventListener('mousedown', function(e) {
  if (
    mobileNav.classList.contains('open') &&
    !mobileNav.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    toggleMenu();
  }
});

// Escape key closes menu
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
    toggleMenu();
  }
});

// Menu item click closes menu
document.querySelectorAll('.mobile-nav-list a, .mobile-nav-list button').forEach(item => {
  item.addEventListener('click', function() {
    if (mobileNav.classList.contains('open')) {
      toggleMenu();
    }
  });
});

// Accessibility: focus trap
mobileNav.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    const focusable = mobileNav.querySelectorAll('a,button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
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

function animateCounters() {
  document.querySelectorAll('.countdown-number').forEach((el) => {
    let target = +el.dataset.count;
    let suffix = '';
    if (target === 100) {
      suffix = '%';
    } else if (target === 20 || target === 5 || target === 50) {
      suffix = '+';
    }

    let displayed = 0;
    const duration = 1500; // ms
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    el.textContent = '0' + suffix; // Reset for each trigger

    function animate() {
      displayed += step;
      if (displayed >= target) {
        el.textContent = target + suffix;
      } else {
        el.textContent = displayed + suffix;
        requestAnimationFrame(animate);
      }
    }
    setTimeout(animate, 300); // delay for smoothness
  });
}

// Intersection Observer for retriggering animation
const countdownSection = document.querySelector('.success-countdown');
if (countdownSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
      }
    });
  }, { threshold: 0.3 }); // Adjust threshold as needed
  observer.observe(countdownSection);
}


// Accessible, animated package cards with scroll wheel, touch, and keyboard navigation (TWEAKED)
(function() {
  document.documentElement.classList.remove('no-js');

  const wrapper = document.querySelector('.packages-wrapper');
  if (!wrapper) return;

  const cards = Array.from(wrapper.querySelectorAll('.package-card'));
  const dots = Array.from(wrapper.querySelectorAll('.progress-dot'));
  const totalCards = cards.length;
  let activeIndex = 0;
  let isAnimating = false;
  let hasRevealedNextSection = false;

  // Ensure wrapper can receive keyboard focus
  wrapper.setAttribute('tabindex', '0');

  // Helper: fade in the next section when allowed
  function revealNextSection() {
    if (hasRevealedNextSection) return;
    const nextSection = document.querySelector('.next-section');
    if (nextSection) {
      nextSection.style.opacity = 0;
      nextSection.style.pointerEvents = "none";
      nextSection.style.transition = "opacity 0.8s cubic-bezier(.21,.7,.51,1.01)";
      setTimeout(() => {
        nextSection.style.opacity = 1;
        nextSection.style.pointerEvents = "auto";
      }, 200);
      hasRevealedNextSection = true;
    }
  }

  function setActiveCard(index, direction) {
    // Prevent movement if already animating
    if (isAnimating || index < 0 || index >= totalCards) return;

    // Lock out navigation until current card is fully in view
    isAnimating = true;
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

    // If last card, fade in next section
    if (activeIndex === totalCards - 1) {
      revealNextSection();
    }

    // Unlock animation after transition
    setTimeout(() => { isAnimating = false; }, 620);
  }

  setActiveCard(0, null);

  let lastScroll = 0;
  const SCROLL_DELAY = 700;

  // Strict scroll: only when 100% card is in view, prevent fast skip
  function onWheel(e) {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScroll < SCROLL_DELAY) return;
    lastScroll = now;

    const delta = e.deltaY || e.detail || e.wheelDelta;
    if (delta === 0) return;

    // Prevent skipping before current card is 100% revealed
    if (delta > 0 && activeIndex < totalCards - 1) {
      setActiveCard(activeIndex + 1, 'down');
      e.preventDefault();
    } else if (delta < 0 && activeIndex > 0) {
      setActiveCard(activeIndex - 1, 'up');
      e.preventDefault();
    }
    // If last card, allow scroll to next section only after all cards are cycled
    else if (delta > 0 && activeIndex === totalCards - 1 && hasRevealedNextSection) {
      const nextSection = document.querySelector('.next-section');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
      e.preventDefault();
    } else {
      // If not allowed, snap back to current card
      setActiveCard(activeIndex, null);
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
    const SWIPE_THRESHOLD = 40;

    if (!isAnimating && Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (deltaY > 0 && activeIndex < totalCards - 1) {
        setActiveCard(activeIndex + 1, 'down');
      } else if (deltaY < 0 && activeIndex > 0) {
        setActiveCard(activeIndex - 1, 'up');
      }
      // Snap back if not allowed
      else {
        setActiveCard(activeIndex, null);
      }
    }
    touchStartY = null;
  }, { passive: true });

  // --- Keyboard support (strict lock) ---
  wrapper.addEventListener('keydown', function(e) {
    if (isAnimating) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (activeIndex < totalCards - 1) {
        setActiveCard(activeIndex + 1, 'down');
        e.preventDefault();
      } else if (activeIndex === totalCards - 1 && hasRevealedNextSection) {
        const nextSection = document.querySelector('.next-section');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
        e.preventDefault();
      } else {
        setActiveCard(activeIndex, null);
        e.preventDefault();
      }
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (activeIndex > 0) {
        setActiveCard(activeIndex - 1, 'up');
        e.preventDefault();
      } else {
        setActiveCard(activeIndex, null);
        e.preventDefault();
      }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      const ctaPrimary = cards[activeIndex].querySelector('.package-cta-primary');
      if (ctaPrimary) ctaPrimary.click();
      e.preventDefault();
    }
  });

  // On load, keep next section hidden until reveal
  window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.remove('no-js');
    const nextSection = document.querySelector('.next-section');
    if (nextSection) {
      nextSection.style.opacity = 0;
      nextSection.style.pointerEvents = "none";
    }
  });
})();
// On page load, hide about section strictly
window.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    aboutSection.classList.remove('revealed');
  }
});

// In your package card navigation JS, reveal about section only after last card
function revealAboutSection() {
  if (hasRevealedNextSection) return;
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    aboutSection.classList.add('revealed');
    hasRevealedNextSection = true;
  }
}

// Replace all references to .next-section in your JS with .about-section
// Example: in your setActiveCard function
if (activeIndex === totalCards - 1) {
  revealAboutSection();
}

// Expand/hide About details on Learn More button click
document.querySelector('.about-learn-more-cta').addEventListener('click', function() {
  const expanded = document.querySelector('.about-expanded-content');
  if (expanded.style.display === "none" || expanded.style.display === "") {
    expanded.style.display = "block";
    expanded.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    expanded.style.display = "none";
  }
});

// Expand About section if "About" in nav is clicked
// This requires your nav About link to have href="#about" or a data attribute
document.querySelectorAll('a[href="#about"], .nav-about-link').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    // Scroll to section and show expanded content
    const aboutSection = document.getElementById('about');
    aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    const expanded = aboutSection.querySelector('.about-expanded-content');
    expanded.style.display = "block";
  });
});
