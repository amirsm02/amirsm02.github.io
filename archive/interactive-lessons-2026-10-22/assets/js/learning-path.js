/* Small, optional teaching aids shared by the three research lessons. */
(function () {
  'use strict';

  function init() {
    var terms = Array.from(document.querySelectorAll('.inline-term'));
    function closeTerm(button) {
      var definition = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', 'false');
      if (definition) definition.hidden = true;
    }
    terms.forEach(function (button) {
      var definition = document.getElementById(button.getAttribute('aria-controls'));
      if (!definition) return;
      button.disabled = false;
      var paragraph = button.closest('p');
      if (paragraph) paragraph.after(definition);
      var label = document.createElement('strong');
      label.textContent = button.textContent + ': ';
      definition.prepend(label);
      button.addEventListener('click', function () {
        var open = button.getAttribute('aria-expanded') !== 'true';
        terms.forEach(function (other) { if (other !== button) closeTerm(other); });
        button.setAttribute('aria-expanded', String(open));
        definition.hidden = !open;
      });
      button.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { closeTerm(button); event.stopPropagation(); }
      });
    });

    function range(id, value) {
      var input = document.getElementById(id);
      if (!input) return;
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function choose(selector) {
      var button = document.querySelector(selector);
      if (button) button.click();
    }

    // These examples operate the lesson's existing controls and calculation code.
    // Captions distinguish a toy illustration from a theorem or measurement.
    var examples = [
      {
        chapter: 'zeros', label: 'See what the new boundary changes',
        steps: [
          { title: 'Start with the strip.', text: 'The ring at β = 0.900 lies inside the strip. That starting fact alone does not rule it out. The ring is a hypothetical input, not a computed zero.', apply: function () { range('zero-beta', .9); range('zero-height', 12); choose('[data-zero-mode="strip"]'); } },
          { title: 'Now use the released bound.', text: 'Keep the very same point. Quasi-Riemann excludes it because 0.900 is greater than 7/8 = 0.875. The shaded region is the extra territory the statement rules out.', apply: function () { range('zero-beta', .9); range('zero-height', 12); choose('[data-zero-mode="quasi"]'); } },
          { title: 'Stand exactly on the boundary.', text: 'Move the ring to β = 0.875. The strict inequality “greater than 7/8” does not exclude the boundary itself. Not excluded does not mean a zero exists here.', apply: function () { choose('[data-zero-mode="quasi"]'); range('zero-beta', .875); range('zero-height', 12); } },
          { title: 'Compare the still-open conjecture.', text: 'Full Riemann would restrict all nontrivial zeros to β = 1/2, excluding this point too. This final view is the conjecture, not what the new result proved.', apply: function () { range('zero-beta', .875); range('zero-height', 12); choose('[data-zero-mode="rh"]'); } }
        ]
      },
      {
        chapter: 'meaning', label: 'Follow one comparison across scales',
        steps: [
          { title: 'Begin at one hundred.', text: 'The three curves use the same rule, x^(β − 1), with different β values. Smaller β already makes this factor smaller. These are illustrative factors, not measured prime-counting errors.', apply: function () { range('growth-power', 2); } },
          { title: 'Move to one million.', text: 'At x = 10⁶, the 7/8 factor is about 17.8%, while the 1/2 factor is 0.1%. Changing the exponent has a growing effect on this comparison.', apply: function () { range('growth-power', 6); } },
          { title: 'Now look at one trillion.', text: 'The 7/8 factor has fallen to about 3.16%. A fixed boundary below 1 makes this toy factor tend toward zero. The full prime-counting argument needs more than this one factor.', apply: function () { range('growth-power', 12); } }
        ]
      },
      {
        chapter: 'peps-state', label: 'Watch the list outgrow the grid',
        steps: [
          { title: 'Four sites. Sixteen configurations.', text: 'A 2 × 2 grid has four two-state sites. Each extra site doubles the number of joint configurations, so the direct description has 2⁴ = 16 amplitudes.', apply: function () { range('state-size', 2); } },
          { title: 'Sixteen sites. Already 65,536 amplitudes.', text: 'Doubling the grid width quadruples the number of sites. The list grows from 2⁴ to 2¹⁶. The grid still looks small; the full table is already much larger.', apply: function () { range('state-size', 4); } },
          { title: 'One hundred sites. About 10³⁰ amplitudes.', text: 'The direct table has 2¹⁰⁰ entries. This motivates looking for structure we can describe compactly. It does not show that every quantum state has such a description.', apply: function () { range('state-size', 10); } }
        ]
      },
      {
        chapter: 'peps-energy', label: 'See why “a gap” is not enough',
        steps: [
          { title: 'A gap that stays open.', text: 'In this schematic family the gap is 1, even at L = 32. The same positive lower bound works however large the grid becomes.', apply: function () { range('gap-size', 32); choose('[data-gap-mode="uniform"]'); } },
          { title: 'A different family also has a gap here.', text: 'Now use Δ = 1/L and start at L = 2. The gap is 1/2, clearly positive. Looking at a single small system would miss the important difference.', apply: function () { range('gap-size', 2); choose('[data-gap-mode="closing"]'); } },
          { title: 'The lower bound disappears as we grow.', text: 'At L = 32 the gap is 1/32, and it keeps shrinking. This family falls outside the uniform-gap assumption. That means this theorem gives no guarantee here; it does not prove compression impossible.', apply: function () { range('gap-size', 32); choose('[data-gap-mode="closing"]'); } }
        ]
      },
      {
        chapter: 'esm3-search', label: 'Build the search space one step at a time',
        steps: [
          { title: 'Two positions give 400 strings.', text: 'There are 20 choices for the first position and 20 for the second. Multiplying gives 400 possible sequences. This counts strings, whether or not they form working proteins.', apply: function () { range('protein-length', 2); } },
          { title: 'One more position gives 8,000.', text: 'Adding one position multiplies the total by 20. It does not merely add 20 possibilities. Repeating that multiplication is what the exponent records.', apply: function () { range('protein-length', 3); } },
          { title: 'At 229 positions, the count has 298 digits.', text: 'Exhaustive enumeration becomes an enormous task. A learned model proposes promising regions to explore; laboratory tests still have to establish which proposals work.', apply: function () { range('protein-length', 229); } }
        ]
      },
      {
        chapter: 'esm3-evidence', label: 'Read the two percentages correctly',
        steps: [
          { title: 'First, compare with the closest reported match.', text: '58% identity means matching letters at about 58 of every 100 aligned positions. The tiles illustrate the fraction; they are not the measured alignment.', apply: function () { range('identity-percent', 58); } },
          { title: 'Change the reference, not the designed protein.', text: 'Against the original jellyfish GFP, the reported identity is 36%. Both comparisons concern esmGFP. A different reference can change the percentage substantially.', apply: function () { range('identity-percent', 36); } },
          { title: 'Come back to what this number measures.', text: '58% is sequence resemblance. It is not brightness, a success rate, or a universal novelty score. The claim that the molecule fluoresces comes from a separate laboratory test.', apply: function () { range('identity-percent', 58); } }
        ]
      }
    ];

    examples.forEach(function (example) {
      var chapter = document.getElementById(example.chapter);
      var experiment = chapter && chapter.querySelector('.experiment');
      var top = experiment && experiment.querySelector('.experiment-top');
      if (!top) return;
      var shell = document.createElement('div');
      shell.className = 'worked-path';
      var toggle = document.createElement('button');
      toggle.className = 'worked-path-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', example.chapter + '-worked-path');
      toggle.textContent = example.label + ' →';
      var panel = document.createElement('div');
      panel.className = 'worked-path-panel';
      panel.id = example.chapter + '-worked-path';
      panel.hidden = true;
      var copy = document.createElement('div');
      copy.className = 'worked-path-copy';
      copy.setAttribute('role', 'status');
      copy.setAttribute('aria-atomic', 'true');
      var count = document.createElement('span');
      count.className = 'worked-path-count';
      var title = document.createElement('strong');
      var text = document.createElement('p');
      copy.append(count, title, text);
      var controls = document.createElement('div');
      controls.className = 'worked-path-controls';
      function control(label) {
        var button = document.createElement('button');
        button.type = 'button'; button.textContent = label;
        controls.appendChild(button); return button;
      }
      var previous = control('← Back');
      var next = control('Next →');
      panel.append(copy, controls); shell.append(toggle, panel); top.after(shell);
      var index = 0, applying = false, custom = false;
      function showStep() {
        custom = false;
        var step = example.steps[index];
        applying = true;
        try { step.apply(); } finally { applying = false; }
        count.textContent = 'Worked example · ' + (index + 1) + ' / ' + example.steps.length;
        title.textContent = step.title;
        text.textContent = step.text;
        previous.disabled = index === 0;
        next.textContent = index === example.steps.length - 1 ? 'Replay ↺' : 'Next →';
      }
      toggle.addEventListener('click', function () {
        var open = panel.hidden;
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Close worked example ↑' : example.label + ' →';
        if (open) { index = 0; showStep(); }
      });
      previous.addEventListener('click', function () { if (!custom) index = Math.max(0, index - 1); showStep(); });
      next.addEventListener('click', function () { if (custom) index = 0; else index = (index + 1) % example.steps.length; showStep(); });
      function freeExplore(event) {
        if (applying || panel.hidden || shell.contains(event.target)) return;
        if (event.type === 'click' && !event.target.closest('button:not([data-guide])')) return;
        custom = true;
        count.textContent = 'Your own exploration';
        title.textContent = 'You changed the example.';
        text.textContent = 'The figure now follows your settings. Its caption explains what you are seeing. Restart the worked example whenever you like.';
        previous.disabled = true;
        next.textContent = 'Restart example ↺';
      }
      experiment.addEventListener('input', freeExplore);
      experiment.addEventListener('click', freeExplore);
      if (example.chapter === 'zeros') {
        var plot = document.getElementById('zero-chart');
        var dragStart = null;
        function pointValue() { return document.getElementById('zero-beta').value + ':' + document.getElementById('zero-height').value; }
        plot.addEventListener('pointerdown', function (event) {
          if (event.target.closest('[data-candidate]')) dragStart = pointValue();
        });
        plot.addEventListener('pointermove', function (event) {
          if (dragStart !== null && pointValue() !== dragStart) { freeExplore(event); dragStart = null; }
        });
        ['pointerup', 'pointercancel'].forEach(function (name) {
          plot.addEventListener(name, function () { dragStart = null; });
        });
        plot.addEventListener('keydown', function (event) {
          if (event.target.closest('[data-candidate]') && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(event.key) >= 0) freeExplore(event);
        });
      }
    });

    // Mark the chapter in view; the indicator describes location, not mastery.
    var nav = document.querySelector('.chapter-nav');
    if (!nav) return;
    var links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    var destinations = links.map(function (link) { return document.getElementById(link.hash.slice(1)); });
    var pending = false;
    function updateLocation() {
      pending = false;
      var position = nav.getBoundingClientRect().height + 100, active = -1;
      destinations.forEach(function (section, i) {
        if (section && section.getBoundingClientRect().top <= position) active = i;
      });
      links.forEach(function (link, i) {
        if (i === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function scheduleLocation() {
      if (!pending) { pending = true; requestAnimationFrame(updateLocation); }
    }
    window.addEventListener('scroll', scheduleLocation, { passive: true });
    window.addEventListener('resize', scheduleLocation);
    updateLocation();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
