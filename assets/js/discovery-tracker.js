(function () {
  'use strict';
  var storageKey = 'discovery-saved-records-v1';
  var saved = new Set();
  try {
    var stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) stored.slice(0, 200).forEach(function (id) {
      if (typeof id === 'string' && /^[a-z0-9-]{1,80}$/.test(id)) saved.add(id);
    });
  } catch (_) { /* Saving also works for this visit when storage is blocked. */ }
  var notice = document.getElementById('save-notice');
  var saveButtons = Array.from(document.querySelectorAll('[data-save-record]'));
  var rows = Array.from(document.querySelectorAll('.result-row'));
  var updateList = function () {};
  function reflectSaved() {
    saveButtons.forEach(function (button) {
      var active = saved.has(button.dataset.saveRecord);
      button.textContent = active ? '✓ Saved' : '+ Save';
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', (active ? 'Unsave ' : 'Save ') + button.dataset.recordTitle);
    });
    var count = document.getElementById('saved-count');
    if (count) count.textContent = rows.filter(function (row) { return saved.has(row.id); }).length;
  }
  saveButtons.forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () {
      var id = button.dataset.saveRecord, added = !saved.has(id);
      if (added) saved.add(id); else saved.delete(id);
      var persisted = true;
      try { localStorage.setItem(storageKey, JSON.stringify(Array.from(saved))); } catch (_) { persisted = false; }
      reflectSaved(); updateList();
      if (notice) notice.textContent = (added ? 'Saved' : 'Removed from saved records') + (persisted ? ' on this device.' : ' for this visit. Your browser could not store the change.');
    });
  });
  reflectSaved();

  if (rows.length) {
    var search = document.getElementById('record-search');
    var evidence = document.getElementById('evidence-filter');
    var sort = document.getElementById('record-sort');
    var savedFilter = document.getElementById('saved-filter');
    var fields = Array.from(document.querySelectorAll('[data-field-filter]'));
    var list = document.getElementById('record-list');
    var activeField = 'all', onlySaved = false, appliedSort = 'research';
    var params = new URLSearchParams(location.search);
    if (fields.some(function (button) { return button.dataset.fieldFilter === params.get('field'); })) activeField = params.get('field');
    if (Array.from(evidence.options).some(function (option) { return option.value === params.get('evidence'); })) evidence.value = params.get('evidence');
    if (params.get('sort') === 'event') sort.value = 'event';
    search.value = (params.get('q') || '').slice(0, 250);
    onlySaved = params.get('saved') === '1';
    function normalize(value) { return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim(); }
    var searchable = new Map(rows.map(function (row) { return [row.id, normalize(row.textContent + ' ' + row.dataset.field + ' ' + row.dataset.search)]; }));
    updateList = function () {
      var focused = document.activeElement;
      var terms = normalize(search.value).split(/\s+/).filter(Boolean);
      var count = 0, visibleFields = new Set();
      fields.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.fieldFilter === activeField)); });
      savedFilter.setAttribute('aria-pressed', String(onlySaved));
      rows.forEach(function (row) {
        var rowFields = row.dataset.field.split(' ');
        row.hidden = !((activeField === 'all' || rowFields.indexOf(activeField) >= 0) &&
          (evidence.value === 'all' || row.dataset.evidence === evidence.value) &&
          (!onlySaved || saved.has(row.id)) && terms.every(function (term) { return searchable.get(row.id).includes(term); }));
        if (!row.hidden) { count++; rowFields.forEach(function (field) { visibleFields.add(field); }); }
      });
      if (appliedSort !== sort.value) {
        rows.slice().sort(function (a, b) {
          var key = sort.value === 'event' ? 'event' : 'date';
          return b.dataset[key].localeCompare(a.dataset[key]) || b.id.localeCompare(a.id);
        }).forEach(function (row) { list.appendChild(row); });
        appliedSort = sort.value;
      }
      if (focused && focused.closest('.result-row')) {
        if (focused.closest('.result-row').hidden) savedFilter.focus();
        else if (document.activeElement !== focused) focused.focus();
      }
      document.getElementById('filter-status').textContent = count + ' record' + (count === 1 ? '' : 's') + ' · ' + visibleFields.size + ' field' + (visibleFields.size === 1 ? '' : 's');
      document.getElementById('empty-results').hidden = count !== 0;
      var next = new URLSearchParams();
      if (activeField !== 'all') next.set('field', activeField);
      if (evidence.value !== 'all') next.set('evidence', evidence.value);
      if (search.value.trim()) next.set('q', search.value.trim());
      if (sort.value !== 'research') next.set('sort', sort.value);
      if (onlySaved) next.set('saved', '1');
      history.replaceState(null, '', location.pathname + (next.size ? '?' + next : '') + location.hash);
    };
    fields.forEach(function (button) { button.addEventListener('click', function () { activeField = button.dataset.fieldFilter; updateList(); }); });
    search.addEventListener('input', updateList);
    evidence.addEventListener('change', updateList); sort.addEventListener('change', updateList);
    savedFilter.addEventListener('click', function () { onlySaved = !onlySaved; updateList(); });
    document.getElementById('reset-filters').addEventListener('click', function () {
      activeField = 'all'; onlySaved = false; search.value = ''; evidence.value = 'all'; sort.value = 'research'; updateList(); search.focus();
    });
    document.querySelectorAll('[data-enhanced]').forEach(function (element) { element.hidden = false; });
    updateList();
  }

  window.addEventListener('storage', function (event) {
    if (event.key !== storageKey && event.key !== null) return;
    try {
      var value = JSON.parse(event.newValue || '[]');
      if (Array.isArray(value)) saved = new Set(value.filter(function (id) { return typeof id === 'string' && /^[a-z0-9-]{1,80}$/.test(id); }).slice(0, 200));
      else saved.clear();
    } catch (_) { saved.clear(); }
    reflectSaved(); updateList();
  });
  var copy = document.getElementById('copy-record-link');
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', async function () {
      var status = document.getElementById('copy-status');
      try { await navigator.clipboard.writeText(copy.dataset.url); status.textContent = 'Record link copied.'; }
      catch (_) { status.textContent = 'Copy this link: ' + copy.dataset.url; }
    });
  }
})();
