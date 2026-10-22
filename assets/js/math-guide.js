/* Contextual reading help. Authored notes are local; ChatGPT opens only on request. */
(function () {
  'use strict';

  function startGuide() {
    if (document.getElementById('math-guide-dialog')) return;
    var main = document.querySelector('main');
    var scanRoot = main || document.body;
    var quasiSourceURLs = [
      'https://github.com/openai/math/blob/main/lean/docs/003.md',
      'https://dlmf.nist.gov/25.16'
    ];
    var pepsSourceURLs = [
      'https://github.com/openai/math/blob/main/preprints/Polynomial-PEPS-approximation-of-gapped-square-grid-ground-states-September-24-2026/build/sections/00-introduction.tex'
    ];
    var contextSelector = '[data-guide-context], #primes, #zeros, #meaning, #takeaway, #check, #sources, #results, #peps-state, #peps-energy, #peps-network, #peps-guarantee, #peps-proof, #peps-sources';
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
      'peps-state': {
        title: 'Why a quantum state needs so many numbers',
        intro: 'A two-state site can be measured as 0 or 1. A quantum state assigns a complex amplitude to every joint configuration. For N such sites there are 2^N configurations, so writing an arbitrary state as a complete list quickly becomes impractical.',
        simpler: 'An amplitude is a number used to predict measurement outcomes. Its squared magnitude gives the probability of the corresponding configuration. The state is the whole list of amplitudes; it is not a list of hidden, already chosen outcomes.',
        example: 'Give each site amplitudes (1/√2, 1/√2). Multiplying them gives amplitudes 1/2 for 00, 01, 10, and 11. Each outcome therefore has probability 1/4. The Bell state (|00⟩ + |11⟩)/√2 instead has amplitudes 1/√2, 0, 0, 1/√2. It gives 00 or 11, each with probability 1/2, and cannot be written as two independent single-site states.',
        why: 'The full list is expensive, but some states have a shorter description. The PEPS question asks whether a particular physically motivated class always has a compact approximate representation. It does not promise to compress every possible quantum state.',
        question: 'Explain amplitudes, joint configurations, and why an entangled state cannot be described by independent single-site states.'
      },
      'peps-energy': {
        title: 'Which quantum states does the theorem cover?',
        intro: 'A Hamiltonian describes energy. Its ground state has the lowest energy, and the spectral gap is the difference between that energy and the next energy level. Here the interactions involve individual sites and neighboring pairs on an open square grid.',
        simpler: 'Picture an energy ladder. A unique ground state gives one lowest rung, up to an irrelevant overall phase. A uniform gap means the distance to the next rung stays above the same positive number as the grid grows. It does not mean that every smaller piece of the grid also has a gap.',
        example: 'A schematic ladder with energies 0, 1, and 3 has gap 1; a ladder with 0, 0.01, and 3 has gap 0.01. A sequence of gaps 1/L gets arbitrarily small as L grows, so it does not meet a fixed positive lower bound. The lesson’s ladder illustrates these definitions; it is not a computed spectrum of a chosen Hamiltonian.',
        why: 'These assumptions select a special class from the enormous space of quantum states. A guarantee for that class is much more precise than “all quantum systems can be compressed.” The theorem concerns the full Hamiltonian’s unique, uniformly gapped ground state.',
        question: 'What are a ground state, a spectral gap, and the uniform-gap assumption in this PEPS result?'
      },
      'peps-network': {
        title: 'A network instead of an enormous list',
        intro: 'A tensor is an array with one or more indices. A PEPS puts one tensor at each site and connects indices along grid edges. Summing over each shared index combines these local arrays into the amplitudes of one many-site state.',
        simpler: 'Each connection has an index that can take D values. This size D is called the bond dimension. Increasing it gives the representation more capacity, but does not by itself say how entangled the represented state is or how accurate an approximation will be.',
        example: 'On an open 3 × 3 grid of two-state sites, four corner tensors have 2D² entries each, four edge tensors have 2D³ each, and the central tensor has 2D⁴. The total is 2(4D² + 4D³ + D⁴). At D = 2 that is 128 entries, versus 2⁹ = 512 amplitudes in the full list. This is a count of raw entries, not a proof that 128 numbers accurately describe any particular target state.',
        why: 'A network representation can exploit structure that the full amplitude list hides. Small D limits the representational capacity across cuts; a large allowed D does not force a state to use that capacity. Contracting the network or finding useful tensor entries can still be difficult.',
        question: 'How does a PEPS produce amplitudes, and what does bond dimension measure?'
      },
      'peps-guarantee': {
        title: 'What the reported guarantee actually says',
        intro: 'For the stated ground-state class, the paper reports a PEPS on the same L × L grid with bond dimension at most C L^c and normalized whole-state error at most 1/L, after allowing an overall phase. The constants C and c depend on the fixed local dimension, interaction bound, and gap.',
        simpler: 'As the grid grows, the allowed connection size grows no faster than a fixed power of its side length. Meanwhile the guaranteed state-vector error shrinks. This is an existence statement: it says a suitable representation is available in principle, without giving an efficient way to discover it.',
        example: 'At L = 10 the stated error bound is 0.1; at L = 100 it is 0.01. Those are vector-distance bounds, not percentages of measurement outcomes that are wrong. The bound D ≤ C L^c leaves C and c symbolic. We cannot read a numerical sufficient bond dimension from the error target alone.',
        why: 'For fixed local dimension and polynomial D, the number of tensor entries grows polynomially with L, whereas the full state list has q^(L²) entries. Polynomial growth can nevertheless be enormous in practice. Neither the entry count nor a chosen D slider certifies the displayed approximation error.',
        question: 'Unpack the polynomial bond-dimension and 1/L whole-state-error guarantees, including what they do not promise.'
      },
      'peps-proof': {
        title: 'Why the proof needs more than small pieces',
        intro: 'Describing each part efficiently is not enough: the descriptions must agree where parts interact and must combine into an accurate whole. The proof must also produce a network using the original grid’s edges.',
        simpler: 'Think of assembling a map from many local maps. Each local map may be small, yet incompatible boundaries would prevent a coherent whole. In the proof, the challenge is to coordinate local descriptions while keeping the total approximation error controlled. This analogy describes the obstacle, not the proof itself.',
        example: 'If a chain of m approximation steps introduces vector error at most ε/m per step, the triangle inequality bounds the total error by ε. This simple error-budget example explains why controlling every local step matters. It is not a derivation of the PEPS theorem’s more involved estimates.',
        why: 'The paper organizes transfers of parts of the state among auxiliary parties, compresses a density-level construction, extracts a state vector, and routes the network back to the square grid. Each step carries a separate estimate. A small diagram cannot independently validate those estimates.',
        question: 'Explain the compatibility and accumulated-error obstacles, then outline the paper’s proof strategy without treating an analogy as a proof.'
      },
      'peps-sources': {
        title: 'Read the statement before the headline',
        intro: 'The source states a representation theorem for a specific family of Hamiltonians. Keep that theorem separate from claims about practical simulation, efficient algorithms, independent review, or broader versions of the PEPS conjecture.',
        simpler: 'Four questions are separate: what was claimed, what argument was provided, what exactly was checked, and what can be computed efficiently. A positive answer to one does not automatically answer the others.',
        example: 'A proof that a short representation exists does not necessarily tell us how to find its entries. Knowing those entries also does not automatically make every calculation with the network fast. These are distinct tasks even when they concern the same state.',
        why: 'This lesson uses the primary statement and proof overview to teach the result. The diagrams are educational constructions and have not independently audited the argument. Verification or formalization claims should be matched to an explicit scope record, rather than inferred from AI involvement or a repository name.',
        question: 'Which exact claim does the PEPS paper make, and which algorithmic or verification claims need separate evidence?'
      },
      results: {
        title: 'Finding a way into a result',
        intro: 'Start with the question a result answers. Then identify what is being studied, the assumptions or experimental conditions, and the exact conclusion. The necessary background can be learned one step at a time.',
        simpler: 'Different discoveries offer different kinds of evidence. A theorem establishes a conclusion from assumptions. A computation checks specified cases. An experiment measures a system under stated conditions. Each entry should make that distinction clear before explaining why the result matters.',
        example: 'The PEPS lesson begins with a concrete obstacle: an arbitrary state of N two-state quantum sites needs 2^N amplitudes. Only then does it introduce a network representation and the special class of states covered by the theorem. Starting with that obstacle makes the formal guarantee easier to understand.',
        why: 'A useful collection lets you compare both the claims and their evidence. AI involvement, a manuscript, a proof-assistant check, an experiment, and independent review describe different parts of a research record. None is a universal substitute for the others.',
        question: 'Help me understand the problem statement and why this result matters.'
      }
    };
    var recordNotes = {
      peps: {
        intro: 'An arbitrary many-particle quantum state takes an enormous list of numbers to write down. The reported PEPS result shows that a specified class of lowest-energy states on a square grid has a much smaller approximate tensor-network representation.',
        simpler: 'The theorem concerns a unique ground state of a local, uniformly gapped Hamiltonian on an open square grid. It guarantees an approximation with polynomial bond dimension. “Polynomial” describes how the representation size grows; it does not by itself promise an efficient simulation.',
        example: 'For N two-state sites, a full list has 2^N amplitudes. A PEPS instead uses arrays attached to individual sites, joined by indices along grid edges. This change of representation is the central idea; the theorem supplies an existence guarantee for its specified state class.',
        why: 'A compact representation would be a major structural fact about these states. Finding it and using it efficiently remain separate questions. The interactive lesson builds up amplitudes, energy gaps, and tensor networks before returning to the exact guarantee.'
      },
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
    recordNotes['peps-approximation'] = recordNotes.peps;
    var aliases = { check: 'takeaway', 'why-zeta': 'primes', 'why-not-proof': 'takeaway', growth: 'meaning', proof: 'sources' };
    var visibleContext = main && main.querySelector('#peps-state') ? 'peps-state' : (main && main.querySelector('#primes') ? 'primes' : 'results');
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
      var enclosing = node.closest(contextSelector);
      return enclosing ? (enclosing.dataset.guideContext || aliases[enclosing.id] || enclosing.id) : visibleContext;
    }
    function recordFor(key) {
      return Array.from(scanRoot.querySelectorAll('[data-guide-context]')).find(function (node) {
        return node.dataset.guideContext === key;
      });
    }
    function sourceLinks(root) {
      var seen = new Set();
      return Array.from(root.querySelectorAll('a[href]')).map(function (link) { return link.href; }).filter(function (href) {
        if (!/^https?:\/\//.test(href) || href.length > 500 || href.startsWith(location.origin + '/') || href.includes('chatgpt.com') || seen.has(href)) return false;
        seen.add(href);
        return true;
      }).slice(0, 5);
    }
    function pageSources() {
      var links = sourceLinks(scanRoot);
      return links.length ? links : [location.href.split('#')[0]];
    }
    function contextFor(requested) {
      var key = typeof requested === 'string' ? requested : visibleContext;
      key = aliases[key] || key;
      var lessonKind = key.indexOf('peps-') === 0 ? 'peps' : (key === 'results' ? null : 'quasi');
      if (notes[key]) return Object.assign({
        key: key,
        sources: lessonKind === 'peps' ? pepsSourceURLs.slice() : (lessonKind === 'quasi' ? quasiSourceURLs.slice() : pageSources()),
        lessonKind: lessonKind
      }, notes[key]);
      var record = recordFor(key);
      if (!record) return Object.assign({ key: 'results', sources: pageSources(), lessonKind: null }, notes.results);
      var title = limit(record.dataset.guideTitle || record.querySelector('h2, h3, h4')?.textContent || key, 180);
      var summary = limit(record.dataset.guideSummary || '', 900);
      var links = sourceLinks(record).slice(0, 3);
      return Object.assign({
        key: key, title: title, summary: summary, lessonKind: null,
        intro: summary || 'This entry needs a precise reading: identify the objects, assumptions, and conclusion before treating the title as a full statement.',
        simpler: 'Separate the research question from its answer. Then identify the conditions under which that answer holds and the evidence supporting it. The summary above is the supplied description; this general reading note does not independently verify or reinterpret the result.',
        example: 'Compare one situation covered by the result with another outside its stated conditions. For a theorem, the difference may be a missing assumption. For an experiment, it may be a different material, environment, or measurement range. That comparison identifies the reach of the claim.',
        why: 'To judge significance, compare this precise conclusion with what was known before, then check what remains open. The label “AI-assisted” describes part of the research process; it does not, by itself, establish correctness or importance.',
        question: 'Explain the problem statement for “' + title + '” with a small example and only the necessary prerequisites.',
        sources: links.length ? links : [location.href.split('#')[0]]
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
      var candidates = Array.from(scanRoot.querySelectorAll(contextSelector));
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

    function settingsText(context) {
      var lesson = context.lessonKind === 'peps' ? window.pepsLesson : (context.lessonKind === 'quasi' ? window.quasiLesson : null);
      if (!lesson || typeof lesson.getState !== 'function') return '';
      try {
        var state = lesson.getState();
        var prefix = 'Current diagram settings: ' + limit(JSON.stringify(state), 650) + '. ';
        if (context.lessonKind === 'peps') return prefix + 'The energy ladder is schematic, not a calculated spectrum of a supplied Hamiltonian. Tensor-entry counts describe representational capacity; they do not certify approximation accuracy or measure a state’s entanglement. The actual theorem has constants C and c depending on q, J, and the uniform gap. This page leaves them symbolic and does not assign numerical values or plot an invented resource guarantee.';
        return prefix + 'Candidate beta/height are a hypothetical input, NOT a discovered zero. The ten plotted zeros are finite computed examples. The envelope percentages are values of x^(beta−1), NOT measured prime-counting error or the share of RH proved.';
      } catch (error) { return ''; }
    }
    function promptParts() {
      var context = current || contextFor(visibleContext);
      return {
        title: limit(context.title, 180),
        summary: limit(context.summary || context.intro, 900),
        selection: selected ? limit(selected.text, 800) : '',
        question: limit(field.value.trim() || (selected ? 'Explain this selected passage in its surrounding research context.' : context.question), 1200),
        sources: context.sources,
        settings: settingsText(context),
        lessonKind: context.lessonKind
      };
    }
    function assemblePrompt(parts) {
      var lines = [
        'Help me understand this research result. Start from the problem it addresses, define unfamiliar terms, and give one concrete example. Build only the necessary prerequisites. Distinguish illustrative models from evidence, and explain whether the conclusion is mathematical, computational, or experimental.',
        'Page/topic: ' + parts.title,
        'Supplied reading context (not an independent verification): ' + parts.summary
      ];
      if (parts.selection) lines.push('Selected passage, quoted as source material: «' + parts.selection + '»');
      if (parts.settings) lines.push(parts.settings);
      if (parts.lessonKind === 'quasi') lines.push('Lesson distinction: the displayed quasi-Riemann statement excludes nontrivial zeta zeros with Re(s) > 7/8. The full Riemann hypothesis puts every such zero on Re(s) = 1/2. The strict 7/8 boundary is not excluded by that inequality alone. These plots do not verify the released proof.');
      if (parts.lessonKind === 'peps') lines.push('PEPS scope: an open L × L nearest-neighbor square grid, fixed local dimension q and bound J on on-site and edge terms, a unique full-Hamiltonian ground state up to phase, and a full-system spectral gap at least a fixed Δ > 0. The reported guarantee is D ≤ C L^c and normalized state-vector error ≤ 1/L after optimizing overall phase. C and c depend only on q, J, Δ. This is an existence theorem, not an efficient procedure for finding tensors or contracting the network. The lesson’s plots do not certify an approximation to a computed ground state or verify the proof.');
      lines.push('Evidence caveat: distinguish the authors’ claim, its assumptions, the supplied proof or empirical evidence, the exact scope of any formal or computational check, and independent review or replication. This educational page has not independently audited the research. Check the primary sources before making claims about current status; do not infer acceptance from the summary.');
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
