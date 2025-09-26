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


document.addEventListener("DOMContentLoaded", function() {
  const section = document.querySelector(".packages-section");
  const cards = document.querySelectorAll(".package-card");
  const progressDots = document.querySelectorAll(".progress-dot");
  const aboutSection = document.querySelector(".about-section");
  let currentCard = 0;
  let ticking = false;
  let startY = 0;

  // Initialize: show first card, first dot, hide about section
  cards.forEach((card, idx) => {
    card.classList.remove("active", "outgoing");
    card.style.zIndex = idx === 0 ? 10 : 9;
    card.style.transform = "translateY(100px) scale(0.98)";
  });
  cards[0].classList.add("active");
  cards[0].style.transform = "translateY(0) scale(1)";
  
  progressDots.forEach(dot => dot.classList.remove("active"));
  if (progressDots[0]) progressDots[0].classList.add("active");
  if (aboutSection) aboutSection.classList.remove("revealed");

  function updateCards(newIndex) {
    if (newIndex < 0 || newIndex >= cards.length) return;

    // Animate outgoing card
    cards[currentCard].classList.remove("active");
    cards[currentCard].classList.add("outgoing");
    cards[currentCard].style.transform = "translateY(-20px) scale(0.98)";
    
    // Animate incoming card
    cards[newIndex].classList.remove("outgoing");
    cards[newIndex].classList.add("active");
    cards[newIndex].style.transform = "translateY(0) scale(1)";
    
    cards.forEach((card, idx) => card.style.zIndex = (idx === newIndex ? 10 : 9));
    currentCard = newIndex;

    // Update progress dots
    progressDots.forEach(dot => dot.classList.remove("active"));
    if (progressDots[currentCard]) progressDots[currentCard].classList.add("active");

    // Reveal about section only at the last card
    if (aboutSection) {
      if (currentCard === cards.length - 1) aboutSection.classList.add("revealed");
      else aboutSection.classList.remove("revealed");
    }
  }

  function handleScroll(deltaY) {
    if (!ticking) {
      ticking = true;
      if (deltaY > 0) updateCards(currentCard + 1);
      else if (deltaY < 0) updateCards(currentCard - 1);
      setTimeout(() => ticking = false, 700);
    }
  }

  // Prevent default page scroll while in package cards (except last card)
  function wheelHandler(e) {
    if (currentCard < cards.length - 1) {
      e.preventDefault();
      handleScroll(e.deltaY);
    } else {
      handleScroll(e.deltaY); // allow scroll if on last card
    }
  }

  // Scroll detection
  section.addEventListener("wheel", wheelHandler, { passive: false });

  // Arrow key support
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") handleScroll(1);
    else if (e.key === "ArrowUp") handleScroll(-1);
  });

  // Mobile swipe
  section.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
  }, { passive: true });

  section.addEventListener("touchend", e => {
    let endY = e.changedTouches[0].clientY;
    let diff = startY - endY;
    if (Math.abs(diff) > 50) {
      handleScroll(diff);
    }
  });
});


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
