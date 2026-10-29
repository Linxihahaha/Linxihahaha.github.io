(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky header: compact once the page scrolls
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Logo: spin counter-clockwise ("back") before heading home
  var logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      var home = logo.href;
      var onHome = location.pathname.replace(/index\.html$/, '') === new URL(home).pathname;
      if (onHome) {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
      logo.classList.add('is-leaving');
      setTimeout(function () { location.href = home; }, reduce ? 0 : 420);
    });
  }

  // Fig. 1 keeps its Figma proportions: scale the whole diagram to fit
  var flow = document.querySelector('.flow');
  function fitFlow() {
    if (!flow) return;
    flow.style.zoom = '';
    var avail = flow.parentElement.clientWidth;
    var natural = flow.offsetWidth;
    flow.style.zoom = avail < natural ? String(avail / natural) : '';
  }
  fitFlow();
  window.addEventListener('resize', fitFlow);

  // Count-up for numeric stats
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduce || !target) return;
    var start = null;
    var dur = 1200;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    el.textContent = '0';
    requestAnimationFrame(tick);
  }

  // Scroll reveal
  var targets = document.querySelectorAll('[data-reveal], .flow');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // "Coming soon" toast for case studies that aren't online yet
  var toast = document.querySelector('.toast');
  var toastHTML = toast ? toast.innerHTML : '';
  var toastTimer;
  // The live region starts empty: screen readers announce the message when it's inserted
  if (toast) toast.innerHTML = '';
  function hideToast() {
    clearTimeout(toastTimer);
    if (toast) toast.classList.remove('is-open');
  }
  function showToast() {
    if (!toast) return;
    clearTimeout(toastTimer);
    if (!toast.classList.contains('is-open')) {
      toast.innerHTML = toastHTML;
      void toast.offsetWidth; // start the slide-in from the closed state
      toast.classList.add('is-open');
    }
    toastTimer = setTimeout(hideToast, 2000);
  }
  document.querySelectorAll('[data-soon]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showToast();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      showToast();
    });
  });
  if (toast) toast.addEventListener('click', hideToast);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideToast();
  });

  // Highlight the nav item for the section in view
  var links = document.querySelectorAll('.nav__link[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) navIo.observe(sec);
    });
  }
})();
