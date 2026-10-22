/* Field filters enhance a complete, readable catalogue. */
(function () {
  'use strict';
  var buttons = document.querySelectorAll('[data-field-filter]');
  var records = document.querySelectorAll('[data-field]');
  if (!buttons.length || !records.length) return;
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var field = button.dataset.fieldFilter;
      var count = 0, lessons = 0, briefs = 0;
      buttons.forEach(function (other) { other.setAttribute('aria-pressed', String(other === button)); });
      records.forEach(function (record) {
        var visible = field === 'all' || record.dataset.field.split(' ').indexOf(field) !== -1;
        record.hidden = !visible;
        if (visible) {
          count++;
          if (record.classList.contains('featured-result')) lessons++; else briefs++;
        }
      });
      document.getElementById('guided-lessons').hidden = !lessons;
      document.getElementById('briefs-heading').hidden = !briefs;
      document.getElementById('filter-status').textContent = count + ' discoveries · ' + lessons + ' guided lesson' + (lessons === 1 ? '' : 's');
    });
  });
})();
