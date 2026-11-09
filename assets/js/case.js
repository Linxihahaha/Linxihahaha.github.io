/* Case study interactions — loads after main.js */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var base = '../../assets/img/ramp/';

  // Reading progress under the sticky header
  var bar = document.querySelector('.cs-progress span');
  if (bar) {
    var ticking = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--p', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Five planes of UX: built once, each case marks its own plane.
  // Index 1 = surface (top) … 5 = strategy (bottom), matching the Figma "5Layers" component.
  var planes = [
    { name: '表现层', svg: 'layer-5.svg', top: 35, mid: 48, color: '#00C0E8' },
    { name: '框架层', svg: 'layer-4.svg', top: 59, mid: 72, color: '#6155F5' },
    { name: '结构层', svg: 'layer-3.svg', top: 84, mid: 97, color: '#CB30E0' },
    { name: '范围层', svg: 'layer-2.svg', top: 108, mid: 121, color: '#34C759' },
    { name: '战略层', svg: 'layer-1.svg', top: 133, mid: 146, color: '#FFCC00' }
  ];
  document.querySelectorAll('.cs-case[data-layer]').forEach(function (cs) {
    var box = cs.querySelector('.cs-layers');
    if (!box) return;
    var on = parseInt(cs.getAttribute('data-layer'), 10);
    var html = '';
    planes.forEach(function (p, i) {
      html += '<img class="cs-layers__plane' + (i + 1 < on ? ' is-off' : '') + '" src="' + base + p.svg +
        '" alt="" width="74" height="21" style="top:' + p.top + 'px">';
    });
    planes.forEach(function (p, i) {
      html += '<span class="cs-layers__label' + (i + 1 === on ? ' is-on' : '') + '" style="top:' + p.mid + 'px">' + p.name + '</span>';
    });
    var a = planes[on - 1];
    html += '<span class="cs-layers__line" style="top:' + a.mid + 'px;background:' + a.color + '"></span>' +
      '<span class="cs-layers__tick" style="top:' + (a.mid - 5) + 'px;background:' + a.color + '"></span>';
    box.innerHTML = html;
  });

  // AI scenarios: on desktop the block pins while scrolling and the scroll
  // position swaps 01 → 02 → 03 in place. Narrow screens show all three stacked.
  var track = document.querySelector('[data-ai-track]');
  var ai = document.querySelector('[data-ai]');
  if (track && ai) {
    var steps = Array.prototype.slice.call(ai.querySelectorAll('.cs-ai__step'));
    var n = steps.length;
    var current = -1;
    var wide = window.matchMedia('(min-width: 901px)');

    track.classList.add('is-pinned');

    var select = function (i) {
      if (i === current) return;
      current = i;
      steps.forEach(function (s, k) {
        s.classList.toggle('is-active', k === i);
        s.classList.toggle('is-past', k < i);
      });
      ai.classList.toggle('is-last', i === n - 1);
    };

    var pinned = function () { return wide.matches && getComputedStyle(ai).position === 'sticky'; };

    // How far the pinned block has travelled through its track, 0 → 1
    var onScroll = function () {
      if (!pinned()) return;
      var top = parseFloat(getComputedStyle(ai).top) || 0;
      var rect = track.getBoundingClientRect();
      var span = rect.height - ai.offsetHeight;
      var p = (span > 0 ? Math.max(0, Math.min(1, (top - rect.top) / span)) : 0) * n;
      var i = Math.min(n - 1, Math.floor(p));
      select(i);
      ai.style.setProperty('--sp', Math.min(1, p - i).toFixed(3));
    };

    // Snap stops: a scroll gesture that ends near a scenario settles on it,
    // so one flick moves one scenario instead of racing past two.
    var root = document.documentElement;
    var stops = steps.map(function () {
      var s = document.createElement('span');
      s.className = 'cs-ai__stop';
      s.setAttribute('aria-hidden', 'true');
      track.appendChild(s);
      return s;
    });
    var placeStops = function () {
      var on = pinned() && !reduce;
      root.classList.toggle('cs-snap', on);
      if (!on) return;
      var top = parseFloat(getComputedStyle(ai).top) || 0;
      var pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      var span = track.offsetHeight - ai.offsetHeight;
      stops.forEach(function (s, i) {
        // land just inside each step (step 01 right where the block pins)
        var p = i === 0 ? 0 : (i + 0.04) / n;
        s.style.top = (span * p - top + pad) + 'px';
      });
    };

    var raf = false;
    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = true;
      requestAnimationFrame(function () { raf = false; onScroll(); });
    }, { passive: true });
    window.addEventListener('resize', function () { placeStops(); onScroll(); });
    window.addEventListener('load', placeStops);
    placeStops();
    select(0);
    onScroll();
  }

  // Screenshots open full-size in a dialog
  var box = document.querySelector('.cs-lightbox');
  if (box && typeof box.showModal === 'function') {
    var big = box.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var img = btn.querySelector('img');
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        box.showModal();
      });
    });
    // click anywhere (image or backdrop) closes
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === big) box.close();
    });
  }
})();
