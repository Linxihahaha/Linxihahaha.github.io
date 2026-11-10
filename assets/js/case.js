/* Case study interactions — loads after main.js */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  // Index 1 = surface (top) … 5 = strategy (bottom), matching the Figma "5Layers"
  // component (node 220:7314). Planes from the active one down are filled; planes
  // above it are outline only. Labels above are dimmed, labels below are hidden.
  // Gradient vectors are copied per plane from the Figma export.
  var en = !/^zh/i.test(document.documentElement.lang || '');
  var planes = [
    { name: en ? 'Surface' : '表现层', top: 35, mid: 48, line: 48, color: '#00C0E8',
      fill: ['#00C0E8', '#0E92AD', 0.16, '11.85 -8 4.85 23.5'], edge: ['#006C82', '-22.29 10.71 66.7 10.71'] },
    { name: en ? 'Skeleton' : '框架层', top: 59, mid: 72, line: 73, color: '#6155F5',
      fill: ['#6155F5', '#1F12B9', 0.14, '14.85 -5 26.85 24.5'], edge: ['#39328F', '22.21 21.43 22.21 0'] },
    { name: en ? 'Structure' : '结构层', top: 84, mid: 97, line: 97, color: '#CB30E0',
      fill: ['#CB30E0', '#8F05A1', 0.15, '34.21 0 10.2 21.43'], edge: ['#6F1A7A', '66.7 10.71 -22.29 10.71'] },
    { name: en ? 'Scope' : '范围层', top: 108, mid: 121, line: 121, color: '#34C759',
      fill: ['#34C759', '#00BD30', 0.16, '52.35 -6 -17.15 25'], edge: ['#19612B', '22.21 0 22.21 21.43'] },
    { name: en ? 'Strategy' : '战略层', top: 133, mid: 146, line: 146, color: '#FFCC00',
      fill: ['#FFCC00', '#FFD83B', 0.2, '-22.15 16.5 66.85 0'], edge: ['#997A00', '-22.29 10.71 66.7 10.71'] }
  ];
  var grad = function (id, xy, a, b) {
    var c = xy.split(' ');
    return '<linearGradient id="' + id + '" x1="' + c[0] + '" y1="' + c[1] + '" x2="' + c[2] + '" y2="' + c[3] +
      '" gradientUnits="userSpaceOnUse"><stop stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>';
  };
  // Inline vectors on whole-pixel coordinates with a 1px stroke on the half-pixel
  // grid (rounded corners as in Figma), so edges stay crisp at any zoom.
  var shape = 'M19.3 0.5H71.3Q73.3 0.5 72.01 2.03L57.79 18.97Q56.5 20.5 54.5 20.5H2.5Q0.5 20.5 1.79 18.97L16.01 2.03Q17.3 0.5 19.3 0.5Z';
  var plane = function (p, id, off) {
    return '<svg class="cs-layers__plane' + (off ? ' is-off' : '') + '" width="74" height="21" viewBox="0 0 74 21" aria-hidden="true" focusable="false" style="top:' + p.top + 'px">' +
      '<defs>' + grad(id + 'f', p.fill[3], p.fill[0], p.fill[1]) + grad(id + 's', p.edge[1], p.color, p.edge[0]) + '</defs>' +
      '<path d="' + shape + '" fill="' + (off ? 'none' : 'url(#' + id + 'f)') + '" fill-opacity="' + p.fill[2] + '" ' +
      'stroke="url(#' + id + 's)" stroke-width="1"' + (off ? ' stroke-opacity="0.4"' : '') + '/></svg>';
  };
  document.querySelectorAll('.cs-case[data-layer]').forEach(function (cs, ci) {
    var box = cs.querySelector('.cs-layers');
    if (!box) return;
    var on = parseInt(cs.getAttribute('data-layer'), 10);
    var html = '';
    planes.forEach(function (p, i) {
      html += plane(p, 'lp' + ci + '-' + i, i + 1 < on);
    });
    planes.forEach(function (p, i) {
      var state = i + 1 === on ? ' is-on' : i + 1 > on ? ' is-hidden' : '';
      html += '<span class="cs-layers__label' + state + '" style="top:' + p.mid + 'px">' + p.name + '</span>';
    });
    var a = planes[on - 1];
    html += '<span class="cs-layers__line" style="top:' + a.line + 'px;background:' + a.color + '"></span>' +
      '<span class="cs-layers__tick" style="top:' + (a.line - 5) + 'px;background:' + a.color + '"></span>';
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

    // Scroll share per scenario. The last one gets extra room: after it the
    // block un-pins and scrolls away, so it needs a longer hold to register.
    var weights = steps.map(function (_, k) { return k === n - 1 ? 1.6 : 1; });
    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var startOf = function (k) {
      var t = 0;
      for (var j = 0; j < k; j++) t += weights[j];
      return t / total;
    };

    var pinned = function () { return wide.matches && getComputedStyle(ai).position === 'sticky'; };

    // How far the pinned block has travelled through its track, 0 → 1
    var onScroll = function () {
      if (!pinned()) return;
      var top = parseFloat(getComputedStyle(ai).top) || 0;
      var rect = track.getBoundingClientRect();
      var span = rect.height - ai.offsetHeight;
      var f = span > 0 ? Math.max(0, Math.min(1, (top - rect.top) / span)) : 0;
      var i = 0;
      while (i < n - 1 && f >= startOf(i + 1)) i++;
      select(i);
      var local = (f - startOf(i)) / (weights[i] / total);
      ai.style.setProperty('--sp', Math.min(1, local).toFixed(3));
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
        var p = i === 0 ? 0 : startOf(i) + 0.04 / total;
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
