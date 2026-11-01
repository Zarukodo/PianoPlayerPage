/**
 * Piano Player - Landing Page Vanilla JS Script
 * Dynamic Scenic Synthwave Background Transitions & Onstage Presentation Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScenicBackground();
  initSectionSpy();
  initMobileMenu();
  initCrtToggle();
});

/**
 * 1. Dynamic Scenic Synthwave Background Transition on Scroll
 * Automatically crossfades between 4 natural Synthwave scenes:
 * - Hero: Ocean (碧波海域 - 圖一 APP 風格)
 * - Vision & Showcase: Aurora & Mountains (霓虹極光與幾何山巒)
 * - Tech & AI Workflow: Cosmic Nebula (深邃星雲與量子深空)
 * - Synergy, Roadmap & CTA: Golden Dawn (金色黎明海平線)
 */
function initScenicBackground() {
  const sceneOcean = document.getElementById('scene-ocean');
  const sceneAurora = document.getElementById('scene-aurora');
  const sceneNebula = document.getElementById('scene-nebula');
  const sceneDawn = document.getElementById('scene-dawn');

  if (!sceneOcean || !sceneAurora || !sceneNebula || !sceneDawn) return;

  const scenes = {
    'hero': sceneOcean,
    'vision': sceneAurora,
    'showcase': sceneAurora,
    'tech': sceneNebula,
    'ai-workflow': sceneNebula,
    'synergy': sceneDawn,
    'roadmap': sceneDawn,
    'cta': sceneDawn
  };

  const sections = document.querySelectorAll('section[id]');
  let currentActiveScene = sceneOcean;
  sceneOcean.classList.add('active');

  const updateBackground = () => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.45;

    let activeSectionId = 'hero';
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSectionId = section.getAttribute('id');
      }
    });

    const targetScene = scenes[activeSectionId] || sceneOcean;
    if (targetScene !== currentActiveScene) {
      // Crossfade scene layers
      Object.values(scenes).forEach(s => s.classList.remove('active'));
      targetScene.classList.add('active');
      currentActiveScene = targetScene;
    }
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateBackground();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateBackground();
}

/**
 * 2. Navbar scroll state
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 3. Active navigation link spy
 */
function initSectionSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * 4. Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 5. CRT Scanline Toggle Hotkey (Alt + C)
 */
function initCrtToggle() {
  const crt = document.querySelector('.crt-scanlines');
  if (!crt) return;

  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'c' || e.key === 'C')) {
      if (crt.style.display === 'none') {
        crt.style.display = 'block';
        console.log('[Retro UI] CRT Scanlines Enabled');
      } else {
        crt.style.display = 'none';
        console.log('[Retro UI] CRT Scanlines Disabled');
      }
    }
  });
}

