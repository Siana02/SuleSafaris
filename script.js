// ======= THEME LOGIC =======
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

// 1. Pick random theme on page load
function pickRandomTheme() {
  const idx = Math.floor(Math.random() * themes.length);
  setTheme(themes[idx]);
}

// 2. Set theme (add class to <body>, change hero bg)
function setTheme(theme) {
  // Remove both theme classes first
  themes.forEach(t => body.classList.remove(t));
  body.classList.add(theme);
  currentTheme = theme;
  // Optionally, add fadein to hero
  fadeInHero();
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
  // Optionally close mobile nav after switch
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

// 9. On load
window.addEventListener('DOMContentLoaded', () => {
  pickRandomTheme();
  fadeInHero();
  setTimeout(showThemeMessage, 5000);
});
