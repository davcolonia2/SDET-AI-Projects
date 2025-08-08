// script.js

// --- MetaMask/web3 error guards (this app never calls web3) ---
window.addEventListener('error', function (e) {
  if (e && typeof e.message === 'string' && /metamask/i.test(e.message)) {
    e.preventDefault();
    console.warn('[Guarded] Ignored external error:', e.message);
  }
});
window.addEventListener('unhandledrejection', function (e) {
  var msg = e && (e.reason && (e.reason.message || e.reason) || '');
  msg = String(msg);
  if (/metamask/i.test(msg)) {
    e.preventDefault();
    console.warn('[Guarded] Ignored external rejection:', msg);
  }
});

// --- Utilities ---
const $ = (sel, ctx=document) => ctx.querySelector(sel);

// --- Footer year ---
const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// --- Theme toggle with persistence + system preference (default to current) ---
(function initTheme() {
  const root = document.documentElement;
  const key = 'theme';
  const saved = localStorage.getItem(key);
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  const themeBtn = $('#theme-toggle');
  const apply = (mode) => {
    root.setAttribute('data-theme', mode);
    localStorage.setItem(key, mode);
    themeBtn?.setAttribute('aria-pressed', String(mode === 'dark'));
  };
  themeBtn?.addEventListener('click', () => {
    const isDark =
      (root.getAttribute('data-theme') || '').toLowerCase() === 'dark' ||
      (!root.hasAttribute('data-theme') &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    apply(isDark ? 'light' : 'dark');
  });
})();

// --- Mobile menu toggle with proper aria-expanded ---
(function initMenu() {
  const btn = $('.menu-toggle');
  const nav = document.getElementById('primary-navigation');
  if (!btn || !nav) return;
  const setExpanded = (v) => btn.setAttribute('aria-expanded', String(v));
  setExpanded(false);
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('aria-expanded') !== 'true';
    setExpanded(next);
    nav.classList.toggle('active', next);
  });
})();

// --- Smooth scroll disable for reduced motion ---
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}

// --- CSS self-heal watchdog: reattach styles if a sleeping tab/preview lost them ---
// Runs indefinitely every 30s, plus on visibility/pageshow
(function cssWatchdog() {
  // Grab the stylesheet via <link rel="stylesheet" href="style.css">
  // We'll create a probe element to verify CSS variables exist.
  function stylesIntact() {
    try {
      const probe = document.body;
      const val = getComputedStyle(probe).getPropertyValue('--bg');
      return !!val && val.trim() !== '';
    } catch (_) {
      return true; // best-effort
    }
  }

  function healStyles(reason) {
    console.warn('[CSS-Heal] Attempting to reload CSS due to:', reason);
    // Bust cache by appending a query param to the link href
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    links.forEach(link => {
      const url = new URL(link.href, window.location.href);
      url.searchParams.set('v', String(Date.now()));
      link.href = url.toString();
    });
  }

  // Indefinite periodic check (every 30s)
  setInterval(() => {
    if (!stylesIntact()) healStyles('interval check');
  }, 30000);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !stylesIntact()) healStyles('visibilitychange');
  });
  window.addEventListener('pageshow', () => {
    if (!stylesIntact()) healStyles('pageshow');
  });
})();

// --- Minimal smoke tests (console only, do not alter app behavior) ---
(function runSmokeTests() {
  const results = [];
  const pass = (n) => results.push({ n, ok: true });
  const fail = (n, e) => results.push({ n, ok: false, e: String(e) });

  try {
    ['home','about','projects','contact'].forEach(id => { if (!document.getElementById(id)) throw new Error('Missing #' + id); });
    pass('Sections exist');
  } catch (e) { fail('Sections exist', e); }

  try {
    const btn = document.getElementById('theme-toggle');
    if (!btn) throw new Error('No theme button');
    const before = (document.documentElement.getAttribute('data-theme')||'');
    btn.click();
    const after = (document.documentElement.getAttribute('data-theme')||'');
    if (before === after) throw new Error('Theme did not toggle attribute');
    pass('Theme toggle attribute');
  } catch (e) { fail('Theme toggle attribute', e); }

  try {
    const btn = document.querySelector('.menu-toggle');
    const nav = document.getElementById('primary-navigation');
    if (!btn || !nav) throw new Error('No menu/nav');
    const before = btn.getAttribute('aria-expanded');
    btn.click();
    const after = btn.getAttribute('aria-expanded');
    if (before === after) throw new Error('aria-expanded unchanged');
    if (!nav.classList.contains('active')) throw new Error('nav not activated');
    pass('Mobile menu toggles');
  } catch (e) { fail('Mobile menu toggles', e); }

  try {
    // CSS present test via variable probe
    const val = getComputedStyle(document.body).getPropertyValue('--bg');
    if (!val || !val.trim()) throw new Error('CSS variables missing');
    pass('CSS attached');
  } catch (e) { fail('CSS attached', e); }

  setTimeout(() => {
    console.log('%cSmoke Test Results', 'font-weight:bold');
    results.forEach(r => console.log((r.ok?'PASS':'FAIL') + ' – ' + r.n + (r.e ? ' – ' + r.e : '')));
  }, 0);
})();
