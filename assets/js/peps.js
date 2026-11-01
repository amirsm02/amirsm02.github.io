/* Dependency-free, schematic figures for the PEPS reading path. */
(function () {
  'use strict';

  function init() {
    var byId = function (id) { return document.getElementById(id); };
    if (!byId('state-grid') || !byId('peps-network-diagram')) return;

    var NS = 'http://www.w3.org/2000/svg';
    var colors = {
      ink: 'var(--plot-ink, #1b302d)',
      muted: 'var(--plot-muted, #66756f)',
      grid: 'var(--plot-grid, #d6ded8)',
      accent: 'var(--plot-accent, #16705e)',
      secondary: 'var(--plot-secondary, #7b63a1)',
      warm: 'var(--near, #b87c28)',
      paper: 'var(--surface, #ffffff)'
    };
    var state = {
      size: inputNumber('state-size', 4),
      gapSize: inputNumber('gap-size', 8),
      gapMode: 'uniform',
      bond: inputNumber('bond-dimension', 2),
      pair: 'product',
      theoremSize: inputNumber('theorem-size', 8),
      proofStep: 0
    };
    var redrawFrame = 0;

    function inputNumber(id, fallback) {
      var value = byId(id) ? Number(byId(id).value) : NaN;
      return Number.isFinite(value) ? value : fallback;
    }
    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
    function setText(id, text) { if (byId(id)) byId(id).textContent = text; }
    function comma(value) { return value.toLocaleString('en-US'); }
    function exactAmplitudes(side) { return 2n ** BigInt(side * side); }
    function networkEntries(bond) { return 2 * (4 * bond * bond + 4 * Math.pow(bond, 3) + Math.pow(bond, 4)); }
    function element(tag, attributes, text) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attributes || {}).forEach(function (name) { node.setAttribute(name, attributes[name]); });
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function add(parent, tag, attributes, text) {
      var node = element(tag, attributes, text);
      parent.appendChild(node);
      return node;
    }
    function label(parent, x, y, text, attributes) {
      return add(parent, 'text', Object.assign({ x: x, y: y, fill: colors.muted,
        'font-size': 12, 'font-family': 'inherit' }, attributes || {}), text);
    }
    function line(parent, x1, y1, x2, y2, attributes) {
      return add(parent, 'line', Object.assign({ x1: x1, y1: y1, x2: x2, y2: y2,
        stroke: colors.grid, 'stroke-width': 1.3 }, attributes || {}));
    }
    function chart(id, height, title, description) {
      var container = byId(id);
      if (!container) return null;
      var width = Math.max(240, Math.round(container.getBoundingClientRect().width || 600));
      var svg = element('svg', { viewBox: '0 0 ' + width + ' ' + height,
        width: '100%', height: height, role: 'img',
        'aria-labelledby': id + '-title ' + id + '-desc',
        style: 'display:block;max-width:100%;height:auto;overflow:hidden' });
      add(svg, 'title', { id: id + '-title' }, title);
      add(svg, 'desc', { id: id + '-desc' }, description);
      container.replaceChildren(svg);
      return { svg: svg, width: width, height: height };
    }
    function selectButtons(selector, key, value) {
      document.querySelectorAll(selector).forEach(function (button) {
        var selected = String(button.dataset[key]) === String(value);
        button.setAttribute('aria-pressed', String(selected));
        button.classList.toggle('is-active', selected);
      });
    }
    function grid(svg, side, x, y, span, options) {
      options = options || {};
      var step = span / (side - 1);
      var radius = options.radius || Math.min(6, step * 0.19);
      for (var row = 0; row < side; row++) {
        for (var column = 0; column < side; column++) {
          var px = x + column * step, py = y + row * step;
          if (options.links && column < side - 1) line(svg, px, py, px + step, py, { stroke: options.linkColor || colors.grid });
          if (options.links && row < side - 1) line(svg, px, py, px, py + step, { stroke: options.linkColor || colors.grid });
          add(svg, 'circle', { cx: px, cy: py, r: radius, fill: options.color || colors.accent });
        }
      }
    }

    function drawSize() {
      var side = state.size, count = exactAmplitudes(side), sites = side * side;
      setText('state-size-value', side);
      setText('site-count', comma(sites));
      setText('amplitude-count', comma(count));
      var exactOutput = byId('amplitude-count');
      if (exactOutput) exactOutput.style.overflowWrap = 'anywhere';
      var shortCount = count >= 1000000000000n
        ? 'about ' + Number(count).toExponential(2).replace('e+', ' × 10^')
        : comma(count);
      setText('size-observation', side + ' × ' + side + ' gives ' + sites + ' two-state sites. A general pure state has one amplitude for each configuration: 2^' + sites + ' = ' + shortCount + ' amplitudes. The dots show sites, not a particular quantum state.');
      selectButtons('[data-state-size]', 'stateSize', side);
      var figure = chart('state-grid', 264, side + ' by ' + side + ' sites',
        'A schematic square grid of ' + sites + ' two-state sites. A general pure state assigns an amplitude to each of the ' + comma(count) + ' configurations. The figure does not depict any specific state.');
      var span = Math.min(184, figure.width - 72), left = (figure.width - span) / 2;
      grid(figure.svg, side, left, 30, span, { radius: Math.min(6, span / (side - 1) * 0.19) });
      label(figure.svg, figure.width / 2, 242, '2 choices per site · 2^' + sites + ' configurations', { 'text-anchor': 'middle', fill: colors.ink, 'font-size': figure.width < 300 ? 11 : 13 });
    }

    function drawGap() {
      var gap = state.gapMode === 'uniform' ? 1 : 1 / state.gapSize;
      setText('gap-size-value', state.gapSize);
      setText('gap-value', state.gapMode === 'uniform' ? '1' : '1/' + state.gapSize + ' ≈ ' + gap.toFixed(4));
      setText('gap-observation', state.gapMode === 'uniform'
        ? 'The gap stays at 1 as the system grows. This schematic family keeps a positive lower bound independent of L, matching the kind of gap assumption in the theorem.'
        : 'The gap is 1/L: positive at every size shown, but tending toward zero as L grows. This family has no positive lower bound independent of L, so the same fixed-gap guarantee does not apply across all sizes.');
      selectButtons('[data-gap-mode]', 'gapMode', state.gapMode);
      var figure = chart('gap-diagram', 278, 'A schematic ' + (state.gapMode === 'uniform' ? 'uniform' : 'closing') + ' spectral gap',
        'The ground energy is set to zero. The first excited energy is ' + gap + ' in arbitrary units. This is a schematic family of energy levels, not a calculation for a specified Hamiltonian.');
      if (!figure) return;
      var svg = figure.svg, left = 32, right = figure.width - 28, bottom = 213;
      var excitedY = bottom - 145 * gap;
      label(svg, left, 24, 'energy above the ground state', { 'font-size': 11 });
      line(svg, left, 40, left, bottom + 2);
      line(svg, left + 14, bottom, right, bottom, { stroke: colors.accent, 'stroke-width': 3 });
      line(svg, left + 14, excitedY, right, excitedY, { stroke: colors.secondary, 'stroke-width': 3 });
      label(svg, left + 15, bottom + 21, 'ground state · E₀ = 0', { fill: colors.accent });
      var labelY = Math.min(excitedY - 13, bottom - 54);
      label(svg, left + 15, labelY, 'first excited energy', { fill: colors.secondary });
      if (bottom - excitedY < 45) line(svg, left + 24, labelY + 6, left + 45, excitedY - 4, { stroke: colors.secondary, 'stroke-dasharray': '3 3' });
      var barX = right - 12;
      line(svg, barX, excitedY, barX, bottom, { stroke: colors.warm, 'stroke-width': 3 });
      line(svg, barX - 5, excitedY, barX + 5, excitedY, { stroke: colors.warm, 'stroke-width': 2 });
      line(svg, barX - 5, bottom, barX + 5, bottom, { stroke: colors.warm, 'stroke-width': 2 });
      label(svg, figure.width / 2, 264, 'Schematic levels · arbitrary energy units', { 'text-anchor': 'middle', 'font-size': 11 });
    }

    function drawNetwork() {
      var bond = state.bond;
      setText('bond-value', bond);
      setText('tensor-entries', comma(2 * Math.pow(bond, 4)));
      setText('network-entries', comma(networkEntries(bond)));
      setText('bond-observation', 'At D = ' + bond + ', an interior tensor has 2 × ' + bond + '⁴ = ' + (2 * Math.pow(bond, 4)) + ' entries. This open 3 × 3 network has ' + comma(networkEntries(bond)) + ' entries across its nine tensors, including smaller boundary tensors. ' + (bond === 1
        ? 'With D = 1, nonzero states represented this way are product states: the sites cannot be entangled.'
        : 'Larger bonds allow more expressive representations. Increasing D alone does not choose the tensor entries or guarantee an accurate state.'));
      var figure = chart('peps-network-diagram', 308, 'A three-by-three PEPS with bond dimension ' + bond,
        'Nine local tensors are connected to their nearest neighbors by virtual indices of dimension ' + bond + '. Each tensor has a physical leg of dimension 2. Interior, edge, and corner tensors have different numbers of virtual indices. Parallel lines only illustrate the selected bond dimension.');
      var svg = figure.svg, span = Math.min(172, figure.width - 92), step = span / 2;
      var left = (figure.width - span) / 2 - 4, top = 61;
      for (var row = 0; row < 3; row++) {
        for (var column = 0; column < 3; column++) {
          var x = left + column * step, y = top + row * step;
          for (var channel = 0; channel < bond; channel++) {
            var offset = (channel - (bond - 1) / 2) * 2.4;
            if (column < 2) line(svg, x + 10, y + offset, x + step - 10, y + offset, { stroke: colors.secondary, 'stroke-width': 1.6 });
            if (row < 2) line(svg, x + offset, y + 10, x + offset, y + step - 10, { stroke: colors.secondary, 'stroke-width': 1.6 });
          }
          line(svg, x + 6, y - 6, x + 22, y - 27, { stroke: colors.accent, 'stroke-width': 2.5 });
          add(svg, 'circle', { cx: x + 22, cy: y - 27, r: 3, fill: colors.accent });
          add(svg, 'rect', { x: x - 10, y: y - 10, width: 20, height: 20, rx: 4, fill: colors.accent });
        }
      }
      label(svg, figure.width / 2, 21, 'physical legs: two local states each', { 'text-anchor': 'middle', fill: colors.accent, 'font-size': 11 });
      line(svg, figure.width / 2 - 77, 274, figure.width / 2 - 54, 274, { stroke: colors.secondary, 'stroke-width': 3 });
      label(svg, figure.width / 2 - 46, 278, 'virtual links: D = ' + bond, { fill: colors.secondary });
      label(svg, figure.width / 2, 300, 'Schematic tensors, not fitted to a ground state', { 'text-anchor': 'middle', 'font-size': 10 });
    }

    function drawPair() {
      var entangled = state.pair === 'entangled';
      selectButtons('[data-pair-state]', 'pairState', state.pair);
      setText('pair-observation', entangled
        ? 'The diagonal amplitudes are 1/√2; the others are zero. These four amplitudes cannot be obtained by multiplying a separate pair of amplitudes for each site. The Bell state is entangled and needs D ≥ 2 across this two-site cut. Measurement probabilities are the squared amplitudes: 1/2 for 00 and 11.'
        : 'Give each site amplitudes (1/√2, 1/√2). Multiplying one amplitude from each site gives 1/2 for all four joint outcomes. This is a product state; a bond dimension of 1 is enough. Each configuration has measurement probability (1/2)² = 1/4.');
      var figure = chart('pair-matrix', 237, entangled ? 'Bell-state amplitude matrix of rank two' : 'Product-state amplitude matrix of rank one',
        entangled ? 'Rows label the first site as 0 or 1 and columns label the second. The 00 and 11 entries are 1 divided by square root of 2; the other entries are zero. These are amplitudes, not probabilities.'
          : 'Rows label the first site as 0 or 1 and columns label the second. All four entries are one half. These are amplitudes, not probabilities.');
      if (!figure) return;
      var svg = figure.svg, cell = 57, left = figure.width / 2 - cell, top = 66;
      label(svg, figure.width / 2, 21, entangled ? 'An entangled Bell pair' : 'A product of two local states', { 'text-anchor': 'middle', fill: colors.ink, 'font-size': 16 });
      label(svg, figure.width / 2, 44, 'second site', { 'text-anchor': 'middle', 'font-size': 10 });
      for (var row = 0; row < 2; row++) {
        label(svg, left - 13, top + row * cell + cell / 2 + 5, String(row), { 'text-anchor': 'end', fill: colors.ink });
        label(svg, left + row * cell + cell / 2, top - 6, String(row), { 'text-anchor': 'middle', fill: colors.ink });
        for (var column = 0; column < 2; column++) {
          var nonzero = !entangled || row === column;
          add(svg, 'rect', { x: left + column * cell, y: top + row * cell, width: cell - 3, height: cell - 3,
            rx: 5, fill: nonzero ? colors.accent : colors.grid, 'fill-opacity': nonzero ? 0.12 : 0.2,
            stroke: nonzero ? colors.accent : colors.grid, 'stroke-width': 1 });
          label(svg, left + column * cell + (cell - 3) / 2, top + row * cell + cell / 2 + 5,
            entangled ? (nonzero ? '1/√2' : '0') : '1/2', { 'text-anchor': 'middle', fill: nonzero ? colors.accent : colors.muted, 'font-size': 16 });
        }
      }
      label(svg, left - 36, top + cell, 'first site', { 'text-anchor': 'middle', transform: 'rotate(-90 ' + (left - 36) + ' ' + (top + cell) + ')', 'font-size': 10 });
      label(svg, figure.width / 2, 205, 'minimum bond dimension D = ' + (entangled ? 2 : 1), { 'text-anchor': 'middle', fill: colors.ink });
      label(svg, figure.width / 2, 228, 'Amplitudes, not measurement probabilities', { 'text-anchor': 'middle', 'font-size': 10 });
    }

    function drawGuarantee() {
      var size = state.theoremSize, bound = 1 / size;
      setText('theorem-size-value', size);
      setText('theorem-sites', comma(size * size));
      setText('error-bound', '1/' + size);
      setText('guarantee-observation', 'For L = ' + size + ', the theorem guarantees a normalized approximation within Euclidean distance 1/' + size + ' (about ' + Number(bound.toFixed(6)) + ') of the whole ground-state vector, after choosing its overall phase. It guarantees D ≤ C·' + size + '^c, with C and c depending on the fixed local dimension, interaction bound, and gap. This is an existence statement, not an efficient procedure for finding or contracting the tensors.');
      var figure = chart('guarantee-diagram', 274, 'The PEPS guarantee for an L by L grid, L equals ' + size,
        'The schematic grid represents ' + size * size + ' sites. The maximum bond dimension is at most C times L to the c, where the constants depend on the theorem assumptions and are not numerical inputs to this demonstration. Whole-state Euclidean error after normalization and phase alignment is at most 1 divided by L.');
      if (!figure) return;
      var svg = figure.svg, narrow = figure.width < 390, span = narrow ? 94 : 134;
      var gridX = narrow ? figure.width / 2 - span / 2 : figure.width * 0.27 - span / 2;
      var gridY = narrow ? 32 : 46, drawnSize = Math.min(size, 8);
      grid(svg, drawnSize, gridX, gridY, span, { links: true, radius: Math.min(4, span / (drawnSize - 1) * 0.2) });
      label(svg, gridX + span / 2, gridY + span + 22, size + ' × ' + size + ' sites' + (size > drawnSize ? ' (schematic)' : ''), { 'text-anchor': 'middle', 'font-size': 11 });
      var textX = narrow ? figure.width / 2 : figure.width * 0.75;
      label(svg, textX, narrow ? 181 : 90, 'D ≤ C·Lᶜ', { 'text-anchor': 'middle', fill: colors.secondary, 'font-size': 23 });
      label(svg, textX, narrow ? 202 : 113, 'C and c are not specified here', { 'text-anchor': 'middle', 'font-size': 10 });
      label(svg, textX, narrow ? 231 : 154, 'whole-state error ≤ 1/' + size, { 'text-anchor': 'middle', fill: colors.accent, 'font-size': 13 });
      label(svg, figure.width / 2, 263, 'A norm distance, not a percentage of incorrect sites', { 'text-anchor': 'middle', 'font-size': figure.width < 300 ? 9 : 11 });
    }

    var proof = [
      { title: 'Control information across a buffer', description: 'Separation controls shared information. Carefully placed buffers let the argument approximately split the description of two regions.', caption: 'The shaded buffer illustrates separation, not absent interactions.' },
      { title: 'Distribute the description consistently', description: 'The state is redistributed across smaller regions. Extra copies and local encodings handle places where the separating buffers meet.', caption: 'The junction represents a place where special treatment is needed.' },
      { title: 'Compress the links and recover a vector', description: 'The proof compresses an operator representation to polynomial-size links, then extracts and normalizes a vector approximation.', caption: 'These are auxiliary proof objects, not physical particles.' },
      { title: 'Return the network to the original grid', description: 'Links are routed along the original grid without excessive overlap. Error estimates from every stage fit within the final 1/L budget.', caption: 'The outcome is a representation on the required nearest-neighbor edges.' }
    ];

    function drawProof() {
      var step = state.proofStep, content = proof[step];
      setText('proof-title', content.title);
      setText('proof-description', content.description);
      setText('proof-caption', content.caption + ' This is a conceptual sketch; it does not construct the state from a Hamiltonian.');
      selectButtons('[data-proof-step]', 'proofStep', step);
      var figure = chart('proof-diagram', 249, content.title,
        content.description + ' ' + content.caption + ' Schematic only; the artwork does not display the quantitative proof.');
      if (!figure) return;
      var svg = figure.svg, span = Math.min(180, figure.width - 64), x = (figure.width - span) / 2, y = 26;
      if (step === 0) {
        add(svg, 'rect', { x: x + span * 0.4, y: y - 8, width: span * 0.2, height: span + 16, rx: 4, fill: colors.warm, opacity: 0.16 });
        for (var row = 0; row < 5; row++) {
          for (var column = 0; column < 5; column++) {
            add(svg, 'circle', { cx: x + column * span / 4, cy: y + row * span / 4, r: 5,
              fill: column < 2 ? colors.accent : column > 2 ? colors.secondary : colors.warm });
          }
        }
        label(svg, x + span * 0.16, 233, 'region A', { 'text-anchor': 'middle', fill: colors.accent, 'font-size': 11 });
        label(svg, x + span * 0.5, 233, 'buffer', { 'text-anchor': 'middle', fill: colors.warm, 'font-size': 11 });
        label(svg, x + span * 0.84, 233, 'region B', { 'text-anchor': 'middle', fill: colors.secondary, 'font-size': 11 });
      } else if (step === 1) {
        var half = span / 2, palette = [colors.accent, colors.secondary, colors.secondary, colors.accent];
        for (var region = 0; region < 4; region++) {
          var rx = x + (region % 2) * half, ry = y + Math.floor(region / 2) * half;
          add(svg, 'rect', { x: rx + 5, y: ry + 5, width: half - 10, height: half - 10,
            rx: 8, fill: palette[region], 'fill-opacity': 0.13, stroke: palette[region], 'stroke-width': 1.5 });
          label(svg, rx + half / 2, ry + half / 2 + 4, 'region ' + (region + 1), { 'text-anchor': 'middle', fill: palette[region], 'font-size': 10 });
        }
        add(svg, 'rect', { x: x + half - 13, y: y + half - 13, width: 26, height: 26,
          rx: 5, fill: colors.warm });
        label(svg, figure.width / 2, 233, 'local encodings at the junctions', { 'text-anchor': 'middle', 'font-size': 11 });
      } else if (step === 2) {
        var positions = [[x + 20, y + 20], [x + span - 20, y + 20], [x + 20, y + span - 20], [x + span - 20, y + span - 20]];
        [[0, 1], [0, 2], [1, 3], [2, 3]].forEach(function (edge) {
          var a = positions[edge[0]], b = positions[edge[1]];
          line(svg, a[0], a[1], b[0], b[1], { stroke: colors.secondary, 'stroke-width': 4, 'stroke-dasharray': '6 5' });
        });
        positions.forEach(function (position, i) {
          add(svg, 'circle', { cx: position[0], cy: position[1], r: 16, fill: colors.accent });
          label(svg, position[0], position[1] + 4, String(i + 1), { 'text-anchor': 'middle', fill: colors.paper, 'font-size': 12 });
        });
        label(svg, figure.width / 2, 233, 'polynomial-size auxiliary links', { 'text-anchor': 'middle', 'font-size': 11 });
      } else {
        grid(svg, 5, x, y, span, { links: true, radius: 4 });
        var path = 'M' + x + ',' + y + ' L' + (x + span / 2) + ',' + y + ' L' + (x + span / 2) + ',' + (y + span) + ' L' + (x + span) + ',' + (y + span);
        add(svg, 'path', { d: path, fill: 'none', stroke: colors.secondary, 'stroke-width': 4, 'stroke-linejoin': 'round', opacity: 0.85 });
        label(svg, figure.width / 2, 233, 'route using existing grid edges', { 'text-anchor': 'middle', 'font-size': 11 });
      }
    }

    function bindRange(id, key, min, max, draw) {
      if (!byId(id)) return;
      byId(id).addEventListener('input', function (event) {
        state[key] = Math.round(clamp(Number(event.target.value), min, max));
        draw();
      });
    }
    bindRange('state-size', 'size', 2, 10, drawSize);
    bindRange('gap-size', 'gapSize', 2, 32, drawGap);
    bindRange('bond-dimension', 'bond', 1, 4, drawNetwork);
    bindRange('theorem-size', 'theoremSize', 2, 32, drawGuarantee);
    document.querySelectorAll('[data-state-size]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.size = Math.round(clamp(Number(button.dataset.stateSize), 2, 10));
        if (byId('state-size')) byId('state-size').value = state.size;
        drawSize();
      });
    });
    document.querySelectorAll('[data-gap-mode]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.dataset.gapMode !== 'uniform' && button.dataset.gapMode !== 'closing') return;
        state.gapMode = button.dataset.gapMode;
        drawGap();
      });
    });
    document.querySelectorAll('[data-pair-state]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.dataset.pairState !== 'product' && button.dataset.pairState !== 'entangled') return;
        state.pair = button.dataset.pairState;
        drawPair();
      });
    });
    document.querySelectorAll('[data-proof-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.proofStep = Math.round(clamp(Number(button.dataset.proofStep), 0, proof.length - 1));
        drawProof();
      });
    });

    function drawAll() {
      drawSize();
      drawGap();
      drawNetwork();
      drawPair();
      drawGuarantee();
      drawProof();
    }
    function scheduleDraw() {
      if (redrawFrame) cancelAnimationFrame(redrawFrame);
      redrawFrame = requestAnimationFrame(function () { redrawFrame = 0; drawAll(); });
    }
    if (typeof ResizeObserver !== 'undefined') {
      var observedWidth = new WeakMap();
      var observer = new ResizeObserver(function (entries) {
        var widthChanged = false;
        entries.forEach(function (entry) {
          var width = Math.round(entry.contentRect.width);
          if (observedWidth.get(entry.target) !== width) {
            observedWidth.set(entry.target, width);
            widthChanged = true;
          }
        });
        if (widthChanged) scheduleDraw();
      });
      ['state-grid', 'gap-diagram', 'peps-network-diagram', 'pair-matrix', 'guarantee-diagram', 'proof-diagram'].forEach(function (id) {
        if (byId(id)) observer.observe(byId(id));
      });
    } else window.addEventListener('resize', scheduleDraw);

    window.pepsLesson = Object.freeze({
      getState: function () {
        return {
          gridSide: state.size,
          siteCount: state.size * state.size,
          generalStateAmplitudes: exactAmplitudes(state.size).toString(),
          gapExample: state.gapMode,
          gapExampleSide: state.gapSize,
          schematicGap: state.gapMode === 'uniform' ? 1 : 1 / state.gapSize,
          bondDimension: state.bond,
          threeByThreeTensorEntries: networkEntries(state.bond),
          twoSiteExample: state.pair,
          theoremGridSide: state.theoremSize,
          theoremErrorBound: 1 / state.theoremSize,
          proofStep: state.proofStep + 1,
          caveat: 'All figures are educational schematics. The theorem is an existence claim, with fixed local dimension, bounded interactions, and a fixed positive full-system gap; it does not provide an efficient tensor-finding or contraction algorithm.'
        };
      }
    });
    drawAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
