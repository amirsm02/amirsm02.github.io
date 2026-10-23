/* Standalone, dependency-free interactive figures for the quasi-Riemann lesson. */
(function () {
  'use strict';

  function init() {
    var byId = function (id) { return document.getElementById(id); };
    if (!byId('prime-chart') || !byId('zero-chart') || !byId('growth-chart')) return;

    var NS = 'http://www.w3.org/2000/svg';
    var colors = {
      ink: 'var(--plot-ink, #1b302d)',
      muted: 'var(--plot-muted, #66756f)',
      grid: 'var(--plot-grid, #d6ded8)',
      accent: 'var(--plot-accent, #16705e)',
      secondary: 'var(--plot-secondary, #7b63a1)',
      near: 'var(--near, #b87c28)',
      excluded: 'var(--plot-excluded, #dd997b)',
      candidate: 'var(--plot-candidate, #9b4c80)'
    };
    var firstZeros = [14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
      37.586178, 40.918719, 43.327073, 48.005151, 49.773832];
    var state = {
      primeLimit: numberValue('prime-limit', 200),
      mode: 'quasi',
      beta: numberValue('zero-beta', 0.9),
      height: numberValue('zero-height', 12),
      power: numberValue('growth-power', 6)
    };
    var drag = false;
    var redrawFrame = 0;

    function numberValue(id, fallback) {
      var value = byId(id) ? Number(byId(id).value) : NaN;
      return Number.isFinite(value) ? value : fallback;
    }

    function setText(id, text) { if (byId(id)) byId(id).textContent = text; }
    function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
    function svgNode(tag, attrs, text) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function add(parent, tag, attrs, text) {
      var node = svgNode(tag, attrs, text);
      parent.appendChild(node);
      return node;
    }
    function label(parent, x, y, text, attrs) {
      return add(parent, 'text', Object.assign({ x: x, y: y, fill: colors.muted,
        'font-size': 11, 'font-family': 'inherit' }, attrs || {}), text);
    }
    function line(parent, x1, y1, x2, y2, attrs) {
      return add(parent, 'line', Object.assign({ x1: x1, y1: y1, x2: x2, y2: y2,
        stroke: colors.grid, 'stroke-width': 1 }, attrs || {}));
    }
    function createChart(id, height, title, description) {
      var container = byId(id);
      var width = Math.max(280, Math.round(container.getBoundingClientRect().width || 600));
      var svg = svgNode('svg', { viewBox: '0 0 ' + width + ' ' + height,
        width: '100%', height: height, role: 'img', 'aria-labelledby': id + '-title ' + id + '-desc',
        style: 'display:block;max-width:100%;overflow:visible' });
      add(svg, 'title', { id: id + '-title' }, title);
      add(svg, 'desc', { id: id + '-desc' }, description);
      container.replaceChildren(svg);
      return { svg: svg, width: width, height: height };
    }
    function path(points) {
      return points.map(function (point, i) { return (i ? 'L' : 'M') + point[0].toFixed(2) + ',' + point[1].toFixed(2); }).join(' ');
    }
    function series(parent, points, color, dash, width) {
      return add(parent, 'path', { d: path(points), fill: 'none', stroke: color,
        'stroke-width': width || 2.2, 'stroke-linejoin': 'round',
        'stroke-linecap': 'round', 'stroke-dasharray': dash || '' });
    }
    function legend(parent, x, y, color, text, dash) {
      line(parent, x, y - 3, x + 18, y - 3, { stroke: color, 'stroke-width': 2.5,
        'stroke-dasharray': dash || '' });
      label(parent, x + 25, y, text);
    }

    function sieve(limit) {
      var composite = new Uint8Array(limit + 1);
      var counts = new Uint16Array(limit + 1);
      for (var p = 2; p * p <= limit; p++) {
        if (!composite[p]) for (var multiple = p * p; multiple <= limit; multiple += p) composite[multiple] = 1;
      }
      var count = 0;
      for (var n = 0; n <= limit; n++) {
        if (n >= 2 && !composite[n]) count++;
        counts[n] = count;
      }
      return counts;
    }

    function drawPrimes() {
      var limit = Math.round(clamp(state.primeLimit, 50, 1000));
      var counts = sieve(limit);
      var estimate = limit / Math.log(limit);
      setText('prime-limit-value', limit.toLocaleString('en-US'));
      setText('prime-count', counts[limit].toLocaleString('en-US'));
      setText('prime-estimate', estimate.toFixed(1));
      setText('prime-observation', 'Up to ' + limit.toLocaleString('en-US') + ', there are ' + counts[limit] + ' primes. The smooth curve estimates ' + estimate.toFixed(1) + '. It follows the broad trend while missing the individual steps.');
      document.querySelectorAll('[data-prime-preset]').forEach(function (button) {
        button.setAttribute('aria-pressed', String(Number(button.dataset.primePreset) === limit));
      });
      var chart = createChart('prime-chart', 285, 'Counting primes up to ' + limit,
        'The solid staircase is the exact prime count, pi of x. The dashed curve is x divided by the natural logarithm of x, an introductory approximation. At ' + limit + ', there are ' + counts[limit] + ' primes; the approximation is ' + estimate.toFixed(1) + '. This is not a graph of a Riemann-hypothesis error bound.');
      var svg = chart.svg;
      var left = 44, right = chart.width - 17, top = 24, bottom = 215;
      var ymax = Math.ceil(Math.max(counts[limit], estimate) / 10) * 10;
      var sx = function (x) { return left + x / limit * (right - left); };
      var sy = function (y) { return bottom - y / ymax * (bottom - top); };
      for (var yi = 0; yi <= 4; yi++) {
        var y = ymax * yi / 4;
        line(svg, left, sy(y), right, sy(y));
        label(svg, left - 9, sy(y) + 4, Number(y.toFixed(1)).toString(), { 'text-anchor': 'end' });
      }
      var steps = chart.width < 400 ? 2 : 4;
      for (var xi = 0; xi <= steps; xi++) {
        var tick = Math.round(limit * xi / steps);
        label(svg, sx(tick), bottom + 19, tick, { 'text-anchor': 'middle' });
      }
      label(svg, left, 13, 'number of primes');
      label(svg, right, bottom + 35, 'x', { 'text-anchor': 'end', fill: colors.ink });
      var actual = [[sx(0), sy(0)]], approx = [];
      for (var n = 1; n <= limit; n++) {
        actual.push([sx(n), sy(counts[n - 1])]);
        actual.push([sx(n), sy(counts[n])]);
        if (n >= 2) approx.push([sx(n), sy(n / Math.log(n))]);
      }
      series(svg, approx, colors.secondary, '5 4', 2);
      series(svg, actual, colors.accent);
      legend(svg, left, 270, colors.accent, 'Exact count π(x)');
      legend(svg, Math.max(left + 140, chart.width * 0.52), 270, colors.secondary, 'x / log x', '5 4');
    }

    function zeroGeometry(chart) {
      return { left: 42, right: chart.width - 20, top: 25, bottom: 278 };
    }

    function zeroMeaning() {
      if (state.mode === 'rh') {
        return Math.abs(state.beta - 0.5) < 0.0001
          ? 'On the critical line: this location is consistent with the Riemann hypothesis. The ring is a hypothetical point, not a discovered zero.'
          : 'Off the critical line: if this were a nontrivial zero, it would contradict the Riemann hypothesis. Moving the ring does not produce a zero.';
      }
      if (state.mode === 'quasi') {
        if (state.beta > 0.875 + 0.00001) return 'Beyond 7/8: the quasi-Riemann statement rules out nontrivial zeros here. This ring is only a hypothetical location.';
        if (Math.abs(state.beta - 0.875) < 0.00001) return 'Exactly at 7/8: the displayed strict bound rules out β > 7/8, so the boundary itself is not excluded by that statement alone. This is a hypothetical point.';
        return 'Not excluded by the displayed β > 7/8 bound alone. That does not mean a zero exists here. The ring is a hypothetical point.';
      }
      return 'Inside the critical strip: the classical containment 0 < β < 1 permits this location, but does not assert that there is a zero here. The ring is hypothetical.';
    }

    function drawZeros() {
      setText('zero-beta-value', state.beta.toFixed(3));
      setText('zero-height-value', state.height.toFixed(1));
      setText('zero-verdict', zeroMeaning());
      var descriptions = {
        strip: 'Classical starting point: every nontrivial zeta zero lies inside 0 < β < 1. No region inside the strip is excluded by this statement alone; it does not claim that every point is a zero.',
        quasi: 'The displayed quasi-Riemann statement excludes β > 7/8 = 0.875. The right-hand shaded band is excluded; its dashed boundary is strict. This view shows that one-sided statement only.',
        rh: 'The full Riemann hypothesis says all nontrivial zeta zeros have β = 1/2. Off-line shading is what the conjecture would exclude; it is not an established zero-free region.'
      };
      setText('zero-mode-description', descriptions[state.mode]);
      document.querySelectorAll('[data-zero-mode]').forEach(function (button) {
        var selected = button.dataset.zeroMode === state.mode;
        button.setAttribute('aria-pressed', String(selected));
        button.classList.toggle('is-active', selected);
      });
      var chart = createChart('zero-chart', 320, 'The critical strip and a hypothetical candidate point',
        'Horizontal coordinate beta runs from 0 to 1; vertical coordinate t runs from 0 to 60. Ten dots show the first ten computed nontrivial zeros at beta one half. The separate ring, beta ' + state.beta.toFixed(3) + ', height ' + state.height.toFixed(1) + ', is a hypothetical input. ' + descriptions[state.mode]);
      var svg = chart.svg, g = zeroGeometry(chart);
      var sx = function (beta) { return g.left + beta * (g.right - g.left); };
      var sy = function (t) { return g.bottom - t / 60 * (g.bottom - g.top); };
      if (state.mode === 'quasi') {
        add(svg, 'rect', { x: sx(0.875), y: g.top, width: sx(1) - sx(0.875), height: g.bottom - g.top,
          fill: colors.excluded, opacity: 0.9 });
      } else if (state.mode === 'rh') {
        add(svg, 'rect', { x: g.left, y: g.top, width: g.right - g.left, height: g.bottom - g.top,
          fill: colors.excluded, opacity: 0.7 });
        line(svg, sx(0.5), g.top, sx(0.5), g.bottom, { stroke: colors.accent, 'stroke-width': 4, opacity: 0.45 });
      }
      [0, 15, 30, 45, 60].forEach(function (t) {
        line(svg, g.left, sy(t), g.right, sy(t));
        label(svg, g.left - 9, sy(t) + 4, t, { 'text-anchor': 'end' });
      });
      [0, 0.5, 1].forEach(function (beta) {
        line(svg, sx(beta), g.top, sx(beta), g.bottom, { 'stroke-dasharray': beta === 0.5 ? '3 4' : '' });
        label(svg, sx(beta), g.bottom + 18, beta === 0.5 ? '1/2' : beta, { 'text-anchor': 'middle' });
      });
      if (state.mode === 'quasi') {
        line(svg, sx(0.875), g.top, sx(0.875), g.bottom, { stroke: colors.secondary, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
        label(svg, sx(0.875) - 3, g.top - 7, '7/8', { 'text-anchor': 'end', fill: colors.secondary });
      }
      label(svg, g.left, 13, 'height t');
      label(svg, g.right, g.bottom + 35, 'real part β', { 'text-anchor': 'end', fill: colors.ink });
      firstZeros.forEach(function (t) {
        var marker = add(svg, 'circle', { cx: sx(0.5), cy: sy(t), r: 3.5, fill: colors.accent });
        add(marker, 'title', {}, 'Computed zero: β = 0.5, t ≈ ' + t.toFixed(6));
      });
      var point = add(svg, 'g', { 'data-candidate': '', tabindex: 0, role: 'button',
        'aria-label': 'Hypothetical point, beta ' + state.beta.toFixed(3) + ', height ' + state.height.toFixed(1) + '. Drag, or use left and right arrows for beta and up and down for height.',
        style: 'cursor:grab;touch-action:none;outline-offset:4px' });
      add(point, 'circle', { cx: sx(state.beta), cy: sy(state.height), r: 17, fill: 'transparent' });
      add(point, 'circle', { cx: sx(state.beta), cy: sy(state.height), r: 8.5,
        fill: 'none', stroke: colors.candidate, 'stroke-width': 2.6 });
      add(point, 'circle', { cx: sx(state.beta), cy: sy(state.height), r: 2.2, fill: colors.candidate });
      point.addEventListener('keydown', function (event) {
        var deltaBeta = 0, deltaHeight = 0;
        if (event.key === 'ArrowLeft') deltaBeta = -0.005;
        else if (event.key === 'ArrowRight') deltaBeta = 0.005;
        else if (event.key === 'ArrowUp') deltaHeight = 0.1;
        else if (event.key === 'ArrowDown') deltaHeight = -0.1;
        else return;
        event.preventDefault();
        updateCandidate(state.beta + deltaBeta, state.height + deltaHeight);
        var replacement = byId('zero-chart').querySelector('[data-candidate]');
        if (replacement) replacement.focus({ preventScroll: true });
      });
    }

    function updateCandidate(beta, height) {
      state.beta = Math.round(clamp(beta, 0.05, 0.95) * 200) / 200;
      state.height = Math.round(clamp(height, 1, 60) * 10) / 10;
      if (byId('zero-beta')) byId('zero-beta').value = state.beta;
      if (byId('zero-height')) byId('zero-height').value = state.height;
      drawZeros();
    }

    function percent(beta) {
      var value = 100 * Math.pow(10, state.power * (beta - 1));
      if (value >= 10) return value.toFixed(1) + '%';
      if (value >= 1) return value.toFixed(2) + '%';
      if (value >= 0.01) return value.toFixed(3) + '%';
      return value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '') + '%';
    }

    function drawGrowth() {
      setText('growth-power-value', state.power);
      setText('envelope-near', percent(0.99));
      setText('envelope-quasi', percent(0.875));
      setText('envelope-rh', percent(0.5));
      setText('growth-observation', 'At x = 10' + superscript(state.power) + ', the green factor is ' + percent(0.875) + '; the purple one is ' + percent(0.5) + '. The smaller horizontal coordinate makes this toy factor much smaller. These are model values, not measured errors.');
      document.querySelectorAll('[data-growth-preset]').forEach(function (button) {
        button.setAttribute('aria-pressed', String(Number(button.dataset.growthPreset) === state.power));
      });
      var chart = createChart('growth-chart', 295, 'A toy envelope: x to the power beta minus one',
        'Both axes are logarithmic. The three curves compare x^(beta−1) for beta 0.99, 7/8, and 1/2, from x=1 to x=10^12. At x=10^' + state.power + ', their values as percentages are ' + percent(0.99) + ', ' + percent(0.875) + ', and ' + percent(0.5) + '. This toy envelope is not a proved bound on prime-counting error.');
      var svg = chart.svg, left = 57, right = chart.width - 17, top = 24, bottom = 211;
      var sx = function (power) { return left + power / 12 * (right - left); };
      var sy = function (logValue) { return top + -logValue / 6 * (bottom - top); };
      [0, -2, -4, -6].forEach(function (logValue) {
        line(svg, left, sy(logValue), right, sy(logValue));
        label(svg, left - 9, sy(logValue) + 4, ['100%', '1%', '0.01%', '0.0001%'][(-logValue) / 2], { 'text-anchor': 'end' });
      });
      [0, 3, 6, 9, 12].forEach(function (power) {
        label(svg, sx(power), bottom + 20, power === 0 ? '1' : '10' + superscript(power), { 'text-anchor': 'middle' });
      });
      label(svg, left, 13, 'toy relative envelope');
      label(svg, right, bottom + 37, 'x (log scale)', { 'text-anchor': 'end', fill: colors.ink });
      var curves = [
        { beta: 0.99, color: colors.near, dash: '6 4' },
        { beta: 0.875, color: colors.accent, dash: '' },
        { beta: 0.5, color: colors.secondary, dash: '2 4' }
      ];
      curves.forEach(function (curve) {
        series(svg, [[sx(0), sy(0)], [sx(12), sy(12 * (curve.beta - 1))]], curve.color, curve.dash);
        add(svg, 'circle', { cx: sx(state.power), cy: sy(state.power * (curve.beta - 1)), r: 4, fill: curve.color });
      });
      line(svg, sx(state.power), top, sx(state.power), bottom, { stroke: colors.muted, 'stroke-dasharray': '3 4', opacity: 0.65 });
      var available = right - left;
      legend(svg, left, 266, colors.near, 'β = 0.99', '6 4');
      legend(svg, left + available * 0.51, 266, colors.accent, 'β = 7/8');
      legend(svg, left, 288, colors.secondary, 'β = 1/2', '2 4');
    }

    function superscript(number) {
      var digits = '⁰¹²³⁴⁵⁶⁷⁸⁹';
      return String(number).split('').map(function (digit) { return digits[Number(digit)]; }).join('');
    }

    function context() {
      var count = sieve(Math.round(state.primeLimit))[Math.round(state.primeLimit)];
      return {
        primeLimit: state.primeLimit,
        primeCount: count,
        primeEstimate: state.primeLimit / Math.log(state.primeLimit),
        zeroMode: state.mode,
        candidateBeta: state.beta,
        candidateHeight: state.height,
        growthPower: state.power,
        envelopes: { near: percent(0.99), quasi: percent(0.875), rh: percent(0.5) }
      };
    }

    function bindInput(id, callback) {
      if (byId(id)) byId(id).addEventListener('input', callback);
    }
    bindInput('prime-limit', function () { state.primeLimit = numberValue('prime-limit', 200); drawPrimes(); });
    bindInput('zero-beta', function () { updateCandidate(numberValue('zero-beta', 0.9), state.height); });
    bindInput('zero-height', function () { updateCandidate(state.beta, numberValue('zero-height', 12)); });
    bindInput('growth-power', function () { state.power = numberValue('growth-power', 6); drawGrowth(); });
    document.querySelectorAll('[data-zero-mode]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (['strip', 'quasi', 'rh'].indexOf(button.dataset.zeroMode) < 0) return;
        state.mode = button.dataset.zeroMode;
        drawZeros();
      });
    });
    document.querySelectorAll('[data-prime-preset]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.primeLimit = Number(button.dataset.primePreset);
        byId('prime-limit').value = state.primeLimit;
        drawPrimes();
      });
    });
    document.querySelectorAll('[data-growth-preset]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.power = Number(button.dataset.growthPreset);
        byId('growth-power').value = state.power;
        drawGrowth();
      });
    });
    var zeroContainer = byId('zero-chart');
    zeroContainer.addEventListener('pointerdown', function (event) {
      if (!event.target.closest('[data-candidate]')) return;
      event.preventDefault();
      drag = true;
      zeroContainer.setPointerCapture(event.pointerId);
    });
    zeroContainer.addEventListener('pointermove', function (event) {
      if (!drag) return;
      var svg = zeroContainer.querySelector('svg');
      var rect = svg.getBoundingClientRect();
      var width = svg.viewBox.baseVal.width;
      var height = svg.viewBox.baseVal.height;
      var geom = zeroGeometry({ width: width });
      var localX = (event.clientX - rect.left) / rect.width * width;
      var localY = (event.clientY - rect.top) / rect.height * height;
      updateCandidate((localX - geom.left) / (geom.right - geom.left),
        (geom.bottom - localY) / (geom.bottom - geom.top) * 60);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (name) {
      zeroContainer.addEventListener(name, function () { drag = false; });
    });

    function drawAll() { drawPrimes(); drawZeros(); drawGrowth(); }
    drawAll();
    if ('ResizeObserver' in window) {
      var lastWidths = new WeakMap();
      var observer = new ResizeObserver(function (entries) {
        var changed = false;
        entries.forEach(function (entry) {
          var next = Math.round(entry.contentRect.width);
          var previous = lastWidths.get(entry.target);
          lastWidths.set(entry.target, next);
          if (previous !== next) changed = true;
        });
        if (!changed) return;
        window.cancelAnimationFrame(redrawFrame);
        redrawFrame = window.requestAnimationFrame(drawAll);
      });
      ['prime-chart', 'zero-chart', 'growth-chart'].forEach(function (id) { observer.observe(byId(id)); });
    } else window.addEventListener('resize', drawAll);

    // Read-only snapshots are useful for an explainer handoff and browser QA.
    window.quasiLesson = Object.freeze({ getState: context });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
