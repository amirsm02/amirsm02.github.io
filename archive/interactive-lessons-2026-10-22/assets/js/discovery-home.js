/* Search and field filters enhance a complete, readable research index. */
(function () {
  'use strict';
  var buttons = Array.from(document.querySelectorAll('[data-field-filter]'));
  var records = Array.from(document.querySelectorAll('.result-row[data-field]'));
  var input = document.getElementById('result-search');
  var status = document.getElementById('filter-status');
  var empty = document.getElementById('empty-results');
  var reset = document.getElementById('reset-filters');
  if (!buttons.length || !records.length || !input || !status) return;
  var activeField = 'all';
  function normalize(value) {
    return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim();
  }
  var searchable = records.map(function (record) {
    return normalize(record.textContent + ' ' + record.dataset.field + ' ' + record.id);
  });
  function update() {
    var query = normalize(input.value);
    var terms = query ? query.split(/\s+/) : [];
    var count = 0, lessons = 0;
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.fieldFilter === activeField));
    });
    records.forEach(function (record, index) {
      var fieldMatches = activeField === 'all' || record.dataset.field.split(' ').indexOf(activeField) !== -1;
      var textMatches = terms.every(function (term) { return searchable[index].indexOf(term) !== -1; });
      record.hidden = !(fieldMatches && textMatches);
      if (!record.hidden) {
        count++;
        if (record.dataset.kind === 'lesson') lessons++;
      }
    });
    status.textContent = count + ' result' + (count === 1 ? '' : 's') + ' · ' + lessons + ' interactive lesson' + (lessons === 1 ? '' : 's');
    if (empty) empty.hidden = count > 0;
  }
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeField = button.dataset.fieldFilter;
      update();
    });
  });
  input.addEventListener('input', update);
  if (reset) reset.addEventListener('click', function () {
    input.value = '';
    activeField = 'all';
    update();
    input.focus();
  });
  update();
})();
