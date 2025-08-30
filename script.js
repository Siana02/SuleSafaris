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
