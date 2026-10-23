(() => {
  const form = document.getElementById('correction-form');
  if (!form) return;
  form.hidden = false;
  const canonicalOrigin = 'https://amirshapourmohammadi.com';
  const lesson = document.getElementById('lesson-url');
  const section = document.getElementById('lesson-section');
  const quote = document.getElementById('quoted-claim');
  const correction = document.getElementById('proposed-change');
  const source = document.getElementById('primary-source');
  const rationale = document.getElementById('change-reason');
  const credit = document.getElementById('credit-name');
  const review = document.getElementById('draft-review');
  const draft = document.getElementById('suggestion-draft');
  const status = document.getElementById('form-status');
  const github = document.getElementById('github-draft');
  const email = document.getElementById('email-draft');

  function normalizedLesson(value) {
    if (!value.trim()) return null;
    try {
      const url = new URL(value.trim(), canonicalOrigin);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
      if (url.origin !== canonicalOrigin && url.origin !== window.location.origin) return null;
      return canonicalOrigin + url.pathname + url.search + url.hash;
    } catch { return null; }
  }

  function validSource(value) {
    if (!value.trim()) return !source.required;
    try {
      const url = new URL(value.trim());
      return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password;
    } catch { return false; }
  }

  function updateKind() {
    const factual = form.elements.kind.value === 'factual';
    source.required = factual;
    document.getElementById('source-required').hidden = !factual;
    document.getElementById('source-optional').hidden = factual;
  }

  const query = new URLSearchParams(window.location.search);
  const initialLesson = query.get('lesson');
  if (initialLesson) {
    const safeLesson = normalizedLesson(initialLesson.slice(0, 500));
    if (safeLesson) lesson.value = safeLesson;
    else status.textContent = 'The supplied lesson link was not a page on this website. Enter the lesson URL below.';
  }
  section.value = (query.get('section') || '').slice(0, 120);
  quote.value = (query.get('quote') || '').slice(0, 600);
  updateKind();

  form.addEventListener('input', () => {
    updateKind();
    for (const field of [lesson, quote, correction, source, rationale]) field.setCustomValidity('');
    review.hidden = true;
    github.removeAttribute('href');
    email.removeAttribute('href');
    status.textContent = '';
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const lessonURL = normalizedLesson(lesson.value);
    lesson.setCustomValidity(lessonURL ? '' : 'Enter a page URL from this website, such as /peps.html.');
    source.setCustomValidity(validSource(source.value) ? '' : 'Enter an http or https link to the original source.');
    for (const field of [quote, correction, rationale]) field.setCustomValidity(field.value.trim() ? '' : 'Please add a short description.');
    if (!form.reportValidity()) return;
    const kind = form.elements.kind.value === 'factual' ? 'Accuracy or missing qualification' : 'Explanation, example, or interaction';
    const title = `Lesson suggestion: ${new URL(lessonURL).pathname}${section.value.trim() ? ' — ' + section.value.trim() : ''}`.slice(0, 220);
    const body = [
      `## Lesson\n${lessonURL}`,
      `## Section\n${section.value.trim() || 'Not specified'}`,
      `## Type\n${kind}`,
      `## Passage or behavior\n${quote.value.trim()}`,
      `## Suggested change\n${correction.value.trim()}`,
      `## Primary source\n${source.value.trim() || 'Not supplied (teaching suggestion)'}`,
      `## Why it helps\n${rationale.value.trim()}`,
      `## Credit preference\n${credit.value.trim() || 'No name requested in the lesson revision note.'}`
    ].join('\n\n');
    draft.textContent = body;
    const issueURL = new URL('https://github.com/amirsm02/amirsm02.github.io/issues/new');
    issueURL.searchParams.set('title', title);
    issueURL.searchParams.set('body', body);
    const emailURL = `mailto:amirsm@berkeley.edu?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    const longIssue = issueURL.href.length > 7800;
    const longEmail = emailURL.length > 7000;
    github.hidden = longIssue;
    email.hidden = longEmail;
    if (longIssue) github.removeAttribute('href');
    else github.href = issueURL.href;
    if (longEmail) email.removeAttribute('href');
    else email.href = emailURL;
    document.getElementById('github-manual').hidden = !longIssue;
    document.getElementById('email-manual').hidden = !longEmail;
    const limitNote = document.getElementById('draft-limit-note');
    limitNote.hidden = !longIssue && !longEmail;
    limitNote.textContent = longIssue || longEmail
      ? `This draft is too long for a reliable ${longIssue && longEmail ? 'GitHub or email' : longIssue ? 'GitHub' : 'email'} link. Copy the full draft, then paste it into the ${longIssue && longEmail ? 'issue or email' : longIssue ? 'issue' : 'email'} you open. Nothing has been shortened.`
      : '';
    review.hidden = false;
    status.textContent = 'Draft prepared. Nothing has been sent.';
    document.getElementById('draft-heading').focus();
  });

  document.getElementById('copy-draft').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(draft.textContent);
      status.textContent = 'Draft copied. Paste it into an issue or email when you are ready.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(draft);
      selection.removeAllRanges();
      selection.addRange(range);
      draft.focus();
      status.textContent = 'Automatic copying is unavailable. The draft is selected; use your device’s Copy command.';
    }
  });
})();
