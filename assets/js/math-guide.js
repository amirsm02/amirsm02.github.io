/* Contextual reading help. Authored notes are local; ChatGPT opens only on request. */
(function () {
  'use strict';

  function startGuide() {
    if (document.getElementById('math-guide-dialog')) return;
    var main = document.querySelector('main');
    var scanRoot = main || document.body;
    var sourceURLs = [
      'https://github.com/openai/math/blob/main/lean/docs/003.md',
      'https://dlmf.nist.gov/25.16'
    ];
    var notes = {
      primes: {
        title: 'From counting primes to zeta',
        intro: 'The question begins with ordinary counting: how many primes are at most x? The exact count makes a staircase. The smooth x / log x curve is an approximation, and their difference leads to deeper questions about how primes are distributed.',
        simpler: 'A prime has no positive divisors except 1 and itself. Instead of predicting the next prime, we first ask how many primes appear before a chosen stopping point. A smooth formula gives a rough expectation for that count.',
        example: 'The primes at most 10 are 2, 3, 5, and 7: four primes. The rough approximation 10 / log(10) is about 4.34. An estimate can capture a pattern without matching every small example exactly.',
        why: 'Unique prime factorization connects a sum over all positive integers to a product over primes: the Euler product for zeta, valid to the right of 1. This is one route from prime counting to a complex function. The introductory x / log x chart is not an RH error-bound chart.',
        question: 'How does counting primes lead to studying the zeta function?'
      },
      zeros: {
        title: 'Reading the zero diagram',
        intro: 'A zero is an input where a function returns zero. A complex input has two coordinates: β across and t up. The small dots are computed examples. The movable ring is a hypothetical input, so moving it never creates or discovers a zero.',
        simpler: 'Think of the diagram as a map of possible inputs. A zero is a special address on that map. Quasi-Riemann says no nontrivial zero can have an address to the right of 7/8; full Riemann says every nontrivial zero sits exactly on the 1/2 line.',
        example: 'A hypothetical point at β = 0.90 is to the right of 7/8 = 0.875, so the displayed quasi statement excludes it as a nontrivial zero. A point at β = 0.80 is not excluded by that one-sided bound alone. Neither example says that a zero actually exists there.',
        why: 'The statement covers all heights, including heights we will never plot. That is why a proof is stronger than checking many individual zeros. The strict inequality excludes β > 7/8; it does not itself exclude the boundary β = 7/8.',
        question: 'What do the coordinates and shaded regions in the zero diagram mean?'
      },
      meaning: {
        title: 'What the shrinking curves mean',
        intro: 'The curves isolate one scale factor: x^(β−1). Since β is less than 1, this factor shrinks as x grows. Moving β farther left makes it shrink faster. This is a toy model for intuition, not a measured prime-counting error.',
        simpler: 'Divide a contribution of size x^β by the overall scale x. You get x^(β−1). A smaller β gives a more negative exponent, which makes the relative contribution fade more quickly.',
        example: 'At x = one million, β = 1/2 gives x^(−1/2) = 0.001, or 0.1%. With β = 7/8, the toy factor is about 17.8%. These are values of the model; they are not percentages of missing primes or percentages of the Riemann hypothesis proved.',
        why: 'Zeta zeros enter formulas for weighted prime counts. Their horizontal positions affect the scale of oscillating contributions. A real error analysis must account for the full formula, the collection of zeros, coefficients, and other terms; the three curves omit those details.',
        question: 'Why plot x^(beta−1), and what does this toy scale model leave out?'
      },
      takeaway: {
        title: 'Separate three different claims',
        intro: 'A finite computation checks the zeros it reaches. The quasi-Riemann statement excludes every nontrivial zero with β > 7/8. Full Riemann places every nontrivial zero exactly at β = 1/2. These are different levels of information.',
        simpler: 'Checking many examples is evidence. Proving that a whole region has no zeros is an infinite claim. Proving that every zero lies on one line is stronger still.',
        example: 'Imagine a height larger than any computer has checked. A proof of the displayed quasi statement would still exclude zeros to the right of 7/8 there. It would not, by itself, force the zeros at that height onto the 1/2 line.',
        why: 'This distinction lets you read a research headline precisely. Ask which statement was established, what assumptions it uses, and how that exact statement was checked. An interactive picture helps explain the claim; it does not verify the proof.',
        question: 'What did the quasi-Riemann result gain, and what remains different from full Riemann?'
      },
      sources: {
        title: 'How to read the evidence',
        intro: 'Keep the paper’s claim, the exact formal statement, and the checking record separate. A proof assistant checks a precisely written statement. Readers still need to confirm that the statement and its definitions express the mathematical claim they care about.',
        simpler: 'A checked proof answers “Does this argument prove this exact sentence?” A separate question is “Is that sentence the result described in the headline?” Both questions matter.',
        example: 'The released scope note describes the 7/8 zero-free region and names the functions covered. It also identifies applications outside that formalization. Checking the zero-free statement does not automatically check every later application in the paper.',
        why: 'An explanation should preserve credit, assumptions, and uncertainty. This page has not independently rerun or audited the released proof. Its plots and reading notes teach the statement; source documents and independent checking establish its evidence status.',
        question: 'What does the released formalization cover, and what would independent review still need to establish?'
      },
      results: {
        title: 'Finding a way into a result',
        intro: 'Start with the question a result answers. Then identify the mathematical objects, the assumptions, and the exact conclusion. A short example can make the question approachable before you attempt the proof.',
        simpler: 'A theorem says that objects meeting certain conditions must have a particular property. Each entry here names the objects, describes what was established, and links the evidence. A construction shows that an example exists; a bound limits how large or small something can be.',
        example: 'For quasi-Riemann, the objects are nontrivial zeros of zeta, a complex-valued function. The displayed conclusion is that none has a horizontal coordinate greater than 7/8. Understanding that sentence comes before following the proof.',
        why: 'A collection becomes useful when you can compare what each result claims and what has been checked. AI involvement, a published manuscript, a formalization, and independent review describe different parts of that record.',
        question: 'Help me understand the problem statement and why this result matters.'
      }
    };
    var recordNotes = {
      'quasi-riemann': {
        intro: 'The zeta function turns questions about primes into questions about a landscape of complex inputs. The released result places a permanent boundary in that landscape: no nontrivial zero can be to the right of 7/8. Full Riemann would narrow the possibilities to the 1/2 line.',
        simpler: 'The nontrivial zeros of zeta are special inputs of a complex function. Their horizontal coordinate is called β. The released quasi-Riemann statement says no such zero has β greater than 7/8. Full Riemann would put every one exactly at β = 1/2, a stronger claim.',
        example: 'Since 7/8 = 0.875, a hypothetical zero at β = 0.90 would violate the released statement. A hypothetical zero at β = 0.80 would not violate that one-sided bound alone, but would violate full Riemann. These invented locations illustrate the claims; they are not zeros we found.',
        why: 'Zeta links to primes through its Euler product and through formulas for weighted prime counts. A region that excludes zeros at every height controls possibilities beyond any finite computation. The picture explains that statement; the released proof and its exact formalization scope are separate evidence.'
      },
      'prime-sums': {
        intro: 'Could two fixed sets of numbers generate almost exactly the primes, just by adding every possible pair? The released result rules out this recipe when both sets have at least two elements. “Almost exactly” allows only finitely many exceptions.',
        simpler: 'Take two fixed lists A and B, each with at least two nonnegative integers. Form every sum a + b, using one number from each list. The question is whether the resulting set can match the primes except for finitely many mistakes. The released result says this is impossible.',
        example: 'With A = {0, 2} and B = {3, 5}, the pairwise sums are 3, 5, 5, and 7, so A + B = {3, 5, 7}. All these answers are prime. This tiny success does not settle the problem: the theorem concerns fixed sets producing exactly the primes beyond some finite threshold, not a short finite list.',
        why: 'It rules out one simple additive structure for the primes: two fixed ingredient sets cannot generate almost exactly the prime set by taking all pairwise sums. This differs from ordinary Goldbach, which asks whether each even integer greater than 2 is a sum of two primes.'
      },
      'zeros-on-line': {
        intro: 'Riemann predicts that every nontrivial zeta zero lies on one vertical line. This work establishes an asymptotic lower bound of about 67.25% for zeros that are both on that line and simple. It does not establish the exact proportion or place the remaining zeros off the line.',
        simpler: 'A simple zero is a zero of multiplicity one: it does not repeat. The reported result gives an asymptotic lower bound of about 67.25% for zeros that are both simple and on the critical line β = 1/2. It does not say the proportion is exactly 67.25%, or that the remaining zeros are off the line.',
        example: 'In a toy list of 100 objects, certifying that 68 have a property establishes a lower bound of 68%; the other 32 may have it too. That illustrates the logic of a lower bound. The zeta theorem is asymptotic as the height grows, so it does not guarantee 68 such zeros in every batch of 100.',
        why: 'It strengthens a quantitative guarantee about how many zeros have the desired properties. It leaves room for all zeros to be simple and on the line. A proportion bound and a zero-free region are different kinds of progress, and neither is the full Riemann hypothesis.'
      },
      'network-choices': {
        intro: 'Imagine choosing points in a network while avoiding every connected pair. This paper studies how many choices are possible when different points carry different weights. A three-point path is enough to see how the counting works.',
        simpler: 'A network consists of points joined by edges. An independent set is a choice of points with no edge connecting two chosen points. Give each point a nonnegative weight; each allowed choice contributes the product of its points’ weights. Adding those products gives the weighted count studied here.',
        example: 'For three points in a path A—B—C, the allowed choices are {}, {A}, {B}, {C}, and {A,C}: five choices. With weights a, b, c, their weighted count is 1 + a + b + c + ac. Weights 2, 3, 5 give 1 + 2 + 3 + 5 + 10 = 21. The empty choice contributes 1.',
        why: 'Bounds on this count describe how many compatible configurations a network permits, including models where neighboring sites cannot both hold a particle. Individual weights let different sites matter differently. This counting problem is distinct from finding a largest independent set; the reported formalization covers Theorem 1.4 only.'
      },
      'matrix-multiplication': {
        intro: 'The same matrix product can be calculated by different formulas. AlphaEvolve found a formula for two 4 × 4 complex matrices using 48 complex scalar multiplications instead of a previous construction’s 49. The result improves an operation count, not necessarily every program’s running time.',
        simpler: 'Multiplying two matrices combines rows from the first with columns from the second. Different formulas can produce exactly the same answer using different numbers of scalar multiplications. AlphaEvolve found a formula using 48 complex scalar multiplications for two 4 × 4 complex matrices, improving a 49-multiplication construction.',
        example: 'Multiply [[1,2],[3,4]] by [[5,6],[7,8]]. The top-left entry is 1×5 + 2×7 = 19; the full answer is [[19,22],[43,50]]. The ordinary method uses eight scalar multiplications for these four entries. This 2 × 2 example explains what is being counted; the released improvement concerns 4 × 4 complex matrices.',
        why: 'An exact formula shows that an arithmetic task needs fewer multiplications than a previous construction used. Addition costs, numerical behavior, and hardware still affect running time. The number 48 counts complex scalar multiplications; it is neither a claim of 48 real multiplications nor a proof of optimality.'
      },
      'kissing-spheres': {
        intro: 'How many equal spheres can touch one central sphere without overlapping? A May 2025 construction fits 593 neighbors in eleven dimensions, improving an earlier arrangement of 592. Finding that arrangement proves a lower bound; it does not prove that more are impossible.',
        simpler: 'Keep one sphere fixed and surround it with equal-sized spheres. Every neighbor must touch the central sphere, and no two neighbors may overlap. An explicit arrangement with 593 neighbors in eleven dimensions proves that at least 593 fit; it does not prove that 593 is the maximum.',
        example: 'In two dimensions, put six equal circles around a seventh, with their centers at the corners of a regular hexagon. Each outer circle touches the central circle and its two neighbors without overlap. This supplies a configuration with six neighbors. Proving that no larger arrangement exists would require a separate upper-bound argument.',
        why: 'A concrete configuration improves a lower bound: it raises the number we know can fit. High-dimensional arrangements can be checked through coordinates and distances without being pictured directly. The 593-neighbor construction is a dated May 2025 improvement over 592, not a claim about today’s record.'
      }
    };
    var aliases = { check: 'takeaway', 'why-zeta': 'primes', 'why-not-proof': 'takeaway', growth: 'meaning', proof: 'sources' };
    var visibleContext = main && main.querySelector('#primes') ? 'primes' : 'results';
    var current = null;
    var selected = null;
    var returnFocus = null;
    var scrollFrame = 0;
    var userDraft = '';

    function element(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function button(text, className) {
      var node = element('button', className, text);
      node.type = 'button';
      return node;
    }
    function limit(text, maximum) {
      return Array.from(String(text || '')).slice(0, maximum).map(function (character) {
        var code = character.codePointAt(0);
        return code >= 0xd800 && code <= 0xdfff ? '�' : character;
      }).join('');
    }
    function keyFor(node) {
      if (!node || !node.closest) return visibleContext;
      var enclosing = node.closest('[data-guide-context], #primes, #zeros, #meaning, #takeaway, #check, #sources, #results');
      return enclosing ? (enclosing.dataset.guideContext || aliases[enclosing.id] || enclosing.id) : visibleContext;
    }
    function recordFor(key) {
      return Array.from(scanRoot.querySelectorAll('[data-guide-context]')).find(function (node) {
        return node.dataset.guideContext === key;
      });
    }
    function contextFor(requested) {
      var key = typeof requested === 'string' ? requested : visibleContext;
      key = aliases[key] || key;
      if (notes[key]) return Object.assign({ key: key, sources: key === 'results' ? ['https://github.com/openai/math'] : sourceURLs.slice(), isLesson: key !== 'results' }, notes[key]);
      var record = recordFor(key);
      if (!record) return Object.assign({ key: 'results', sources: ['https://github.com/openai/math'], isLesson: false }, notes.results);
      var title = limit(record.dataset.guideTitle || record.querySelector('h2, h3, h4')?.textContent || key, 180);
      var summary = limit(record.dataset.guideSummary || '', 900);
      var links = Array.from(record.querySelectorAll('a[href]')).map(function (link) { return link.href; }).filter(function (href) {
        return /^https?:\/\//.test(href) && href.length <= 500 && !href.startsWith(location.origin) && !href.includes('chatgpt.com');
      }).slice(0, 3);
      return Object.assign({
        key: key, title: title, summary: summary, isLesson: false,
        intro: summary || 'This entry needs a precise reading: identify the objects, assumptions, and conclusion before treating the title as a full statement.',
        simpler: 'Start with the entry’s stated question. Separate the objects it talks about from the property it claims they have. The summary above is the supplied description; this general reading note does not independently verify or reinterpret the result.',
        example: 'To unpack a theorem, ask for one object that meets its assumptions and one that does not. Then ask what its conclusion predicts for the first example. A source-grounded tutor can help construct an example for this particular result.',
        why: 'To judge significance, compare this precise conclusion with the previous result, then check what remains open. The label “AI-produced” explains part of the discovery process; it does not, by itself, establish correctness or importance.',
        question: 'Explain the problem statement for “' + title + '” with a small example and only the necessary prerequisites.',
        sources: links.length ? links : ['https://github.com/openai/math']
      }, recordNotes[key] || {});
    }

    var launcher = button('Help me understand', 'math-guide-launcher');
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.setAttribute('aria-controls', 'math-guide-dialog');
    var dialog = element('dialog', 'math-guide-dialog');
    dialog.id = 'math-guide-dialog';
    dialog.setAttribute('aria-labelledby', 'math-guide-title');
    dialog.setAttribute('aria-describedby', 'math-guide-description');
    var head = element('div', 'math-guide-head');
    var headingGroup = element('div');
    headingGroup.appendChild(element('p', 'math-guide-kicker', 'A reading companion'));
    var title = element('h2', 'math-guide-title');
    title.id = 'math-guide-title';
    title.tabIndex = -1;
    headingGroup.appendChild(title);
    var close = button('×', 'math-guide-close');
    close.setAttribute('aria-label', 'Close reading help');
    head.append(headingGroup, close);
    var content = element('div', 'math-guide-content');
    var description = element('p', 'math-guide-description', 'These are prepared reading notes, not a live AI conversation.');
    description.id = 'math-guide-description';
    var selectionBox = element('div', 'math-guide-selection');
    selectionBox.hidden = true;
    selectionBox.appendChild(element('p', 'math-guide-label', 'Your selected passage'));
    var quote = element('blockquote');
    var selectionNote = element('p', 'math-guide-note', 'The notes below explain the surrounding topic. For this exact passage, add a question and continue in ChatGPT.');
    var clearSelection = button('Use the section instead', 'math-guide-link');
    selectionBox.append(quote, selectionNote, clearSelection);
    var intro = element('p', 'math-guide-intro');
    var suggestionGroup = element('div', 'math-guide-suggestions');
    suggestionGroup.setAttribute('role', 'group');
    suggestionGroup.setAttribute('aria-label', 'Choose a prepared explanation');
    var suggestionButtons = [];
    [['simpler', 'Simpler'], ['example', 'Concrete example'], ['why', 'Why it matters']].forEach(function (pair) {
      var choice = button(pair[1], 'math-guide-choice');
      choice.dataset.guideView = pair[0];
      choice.setAttribute('aria-pressed', 'false');
      choice.addEventListener('click', function () {
        suggestionButtons.forEach(function (other) { other.setAttribute('aria-pressed', String(other === choice)); });
        explanation.textContent = current[pair[0]];
        explanation.hidden = false;
      });
      suggestionButtons.push(choice);
      suggestionGroup.appendChild(choice);
    });
    var explanation = element('p', 'math-guide-explanation');
    explanation.hidden = true;
    explanation.setAttribute('aria-live', 'polite');
    var divider = element('div', 'math-guide-followup');
    var form = element('form', 'math-guide-form');
    var fieldLabel = element('label', 'math-guide-label', 'Your next question (optional)');
    fieldLabel.htmlFor = 'math-guide-question';
    var field = element('textarea', 'math-guide-question');
    field.id = 'math-guide-question';
    field.rows = 3;
    field.maxLength = 1200;
    field.addEventListener('input', function () { userDraft = field.value; });
    var actionRow = element('div', 'math-guide-actions');
    var continueButton = button('Continue in ChatGPT ↗', 'math-guide-primary');
    continueButton.type = 'submit';
    var copyButton = button('Copy prompt', 'math-guide-copy');
    actionRow.append(continueButton, copyButton);
    var handoffNote = element('p', 'math-guide-note', 'Opens ChatGPT with this passage and your diagram settings. Nothing is sent until you choose to continue.');
    var status = element('p', 'math-guide-status');
    status.setAttribute('role', 'status');
    var manualCopy = element('textarea', 'math-guide-manual-copy');
    manualCopy.hidden = true;
    manualCopy.readOnly = true;
    manualCopy.rows = 6;
    manualCopy.setAttribute('aria-label', 'Prepared prompt to select and copy');
    form.append(fieldLabel, field, actionRow, handoffNote, status, manualCopy);
    divider.appendChild(form);
    content.append(description, selectionBox, intro, suggestionGroup, explanation, divider);
    dialog.append(head, content);
    var spacer = element('div', 'math-guide-spacer');
    spacer.setAttribute('aria-hidden', 'true');
    document.body.append(launcher, dialog, spacer);

    function captureSelection() {
      if (dialog.open || !main) return;
      var selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) return;
      var range = selection.getRangeAt(0);
      var anchor = range.commonAncestorContainer;
      if (anchor.nodeType !== 1) anchor = anchor.parentElement;
      if (!anchor || !main.contains(anchor)) return;
      var text = selection.toString().trim();
      if (!text) return;
      selected = { text: limit(text, 800), key: keyFor(anchor) };
      launcher.textContent = 'Explain selection';
    }
    document.addEventListener('selectionchange', captureSelection);

    function updateVisibleContext() {
      scrollFrame = 0;
      if (dialog.open) return;
      var readingLine = Math.min(200, window.innerHeight * 0.28);
      var candidates = Array.from(scanRoot.querySelectorAll('[data-guide-context], #primes, #zeros, #meaning, #takeaway, #check, #sources, #results'));
      var best = null, distance = Infinity;
      candidates.forEach(function (node) {
        var rect = node.getBoundingClientRect();
        if (rect.height <= 0 || rect.bottom < 0 || rect.top > window.innerHeight) return;
        var score = rect.top <= readingLine && rect.bottom > readingLine ? 0 : Math.abs(rect.top - readingLine);
        // Later nested records win when both contain the reading position.
        if (score <= distance) { best = node; distance = score; }
      });
      if (best) visibleContext = best.dataset.guideContext || aliases[best.id] || best.id;
    }
    function scheduleContext() {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateVisibleContext);
    }
    window.addEventListener('scroll', scheduleContext, { passive: true });
    window.addEventListener('resize', scheduleContext, { passive: true });
    updateVisibleContext();

    function openGuide(requested, trigger) {
      captureSelection();
      updateVisibleContext();
      current = contextFor(requested || (selected && selected.key) || visibleContext);
      // An explicit inline topic takes precedence over a selection from another topic.
      if (requested && selected && (aliases[requested] || requested) !== (aliases[selected.key] || selected.key)) selected = null;
      title.textContent = current.title;
      intro.textContent = current.intro;
      quote.textContent = selected ? selected.text : '';
      selectionBox.hidden = !selected;
      launcher.textContent = selected ? 'Explain selection' : 'Help me understand';
      explanation.hidden = true;
      explanation.textContent = '';
      suggestionButtons.forEach(function (choice) { choice.setAttribute('aria-pressed', 'false'); });
      field.placeholder = selected ? 'What does this passage mean?' : current.question;
      field.value = userDraft;
      status.textContent = '';
      manualCopy.hidden = true;
      if (!dialog.open) {
        returnFocus = trigger || document.activeElement || launcher;
        dialog.showModal();
        dialog.scrollTop = 0;
        document.documentElement.classList.add('math-guide-modal-open');
        title.focus({ preventScroll: true });
      }
    }
    launcher.addEventListener('click', function () { openGuide(null, launcher); });
    close.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('close', function () {
      document.documentElement.classList.remove('math-guide-modal-open');
      if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
      else launcher.focus({ preventScroll: true });
      scheduleContext();
    });
    clearSelection.addEventListener('click', function () {
      selected = null;
      var browserSelection = window.getSelection();
      if (browserSelection) browserSelection.removeAllRanges();
      selectionBox.hidden = true;
      quote.textContent = '';
      launcher.textContent = 'Help me understand';
      field.placeholder = current.question;
      // The control being hidden should not leave keyboard focus behind.
      suggestionButtons[0].focus();
    });
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest && event.target.closest('[data-guide]');
      if (!trigger) return;
      event.preventDefault();
      openGuide(trigger.dataset.guide || keyFor(trigger), trigger);
    });

    function settingsText() {
      if (!window.quasiLesson || typeof window.quasiLesson.getState !== 'function') return '';
      try {
        var state = window.quasiLesson.getState();
        return 'Current diagram settings: ' + limit(JSON.stringify(state), 650) + '. Candidate beta/height are a hypothetical input, NOT a discovered zero. The ten plotted zeros are finite computed examples. The envelope percentages are values of x^(beta−1), NOT measured prime-counting error or the share of RH proved.';
      } catch (error) { return ''; }
    }
    function promptParts() {
      var context = current || contextFor(visibleContext);
      return {
        title: limit(context.title, 180),
        summary: limit(context.summary || context.intro, 900),
        selection: selected ? limit(selected.text, 800) : '',
        question: limit(field.value.trim() || (selected ? 'Explain this selected passage in its surrounding mathematical context.' : context.question), 1200),
        sources: context.sources,
        settings: settingsText(),
        isLesson: context.isLesson
      };
    }
    function assemblePrompt(parts) {
      var lines = [
        'Help me understand this mathematical result. Start from the problem statement, define unfamiliar terms, and give one concrete example. Distinguish intuition from proof.',
        'Page/topic: ' + parts.title,
        'Supplied reading context (not an independent verification): ' + parts.summary
      ];
      if (parts.selection) lines.push('Selected passage, quoted as source material: «' + parts.selection + '»');
      if (parts.settings) lines.push(parts.settings);
      if (parts.isLesson) lines.push('Lesson distinction: the displayed quasi-Riemann statement excludes nontrivial zeta zeros with Re(s) > 7/8. The full Riemann hypothesis puts every such zero on Re(s) = 1/2. The strict 7/8 boundary is not excluded by that inequality alone. These plots do not verify the released proof.');
      lines.push('Current-status caveat: distinguish the paper’s claim, its exact formal statement, the scope of a formal check, and independent mathematical review. This educational page has not independently audited or rerun the released proof. Check the primary sources before making claims about current status; do not infer acceptance from the summary.');
      lines.push('Source URLs: ' + parts.sources.join(' ; '));
      lines.push('My question: ' + parts.question);
      return lines.join('\n\n');
    }
    function handoffURL() {
      var parts = promptParts();
      var text = assemblePrompt(parts);
      var prefix = 'https://chatgpt.com/?q=';
      var shortened = false;
      // Keep the full generated URL under 8 KB, including percent encoding.
      for (var attempt = 0; prefix.length + encodeURIComponent(text).length > 7800 && attempt < 16; attempt++) {
        shortened = true;
        ['summary', 'selection', 'question', 'title', 'settings'].forEach(function (key) {
          parts[key] = limit(parts[key], Math.floor(Array.from(parts[key]).length * 0.75));
        });
        if (attempt === 5) parts.sources = parts.sources.slice(0, 1);
        text = assemblePrompt(parts);
      }
      if (prefix.length + encodeURIComponent(text).length > 7800) return null;
      return { url: prefix + encodeURIComponent(text), shortened: shortened };
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var handoff = handoffURL();
      if (!handoff) {
        status.textContent = 'This context is too long for a browser link. Choose Copy prompt, then paste it into ChatGPT.';
        return;
      }
      var link = element('a');
      link.href = handoff.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
      status.textContent = 'Opening ChatGPT in a new tab.' + (handoff.shortened ? ' Long text was shortened to fit the link; Copy prompt keeps the full prepared context.' : '') + ' If the tab did not open, copy the prompt and paste it into ChatGPT.';
    });
    copyButton.addEventListener('click', async function () {
      var text = assemblePrompt(promptParts());
      var copied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch (error) { copied = false; }
      if (!copied) {
        manualCopy.value = text;
        manualCopy.hidden = false;
        manualCopy.focus();
        manualCopy.select();
        try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
        if (copied) { manualCopy.hidden = true; copyButton.focus(); }
      }
      status.textContent = copied ? 'Prompt copied. Paste it into ChatGPT or another assistant.' : 'Clipboard access is unavailable. The complete prompt is selected below; copy it manually.';
    });

    window.mathGuide = Object.freeze({
      open: function (context) { openGuide(context); },
      getContext: function () { return { key: (current || contextFor(visibleContext)).key, selectedPassage: selected ? selected.text : '' }; },
      makePrompt: function () { return assemblePrompt(promptParts()); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startGuide);
  else startGuide();
})();
