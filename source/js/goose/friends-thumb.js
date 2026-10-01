(function () {
  var API = (window.__GOOSE_LINK_PREVIEW__ || '/api/link-preview').replace(/\/$/, '');
  var TIMEOUT_MS = 8000;
  var MAX_CONCURRENCY = 3;

  function fill() {
    var scope = document.querySelector('.friends-link-container');
    if (!scope) return;

    var imgs = scope.querySelectorAll('img[data-goose-thumb]');
    if (!imgs.length) return;

    var jobs = [];
    imgs.forEach(function (img) {
      if (img.dataset.gooseThumbDone) return;
      img.dataset.gooseThumbDone = '1';

      var link = img.closest('a');
      var box = img.closest('.thumbnail');
      if (!link || !link.href) return;

      jobs.push(function () {
        return fetchWithTimeout(link.href).then(function (data) {
          var src = data && data.image;
          if (!src) return;
          img.onload = function () {
            box.hidden = false;
            img.classList.add('is-loaded');
          };
          img.onerror = function () {
            box.hidden = true;
          };
          img.src = src;
        });
      });
    });

    runQueue(jobs);
  }

  function fetchWithTimeout(url) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIMEOUT_MS);
    return fetch(API + '?url=' + encodeURIComponent(url), {
      signal: ctrl ? ctrl.signal : undefined,
      headers: { Accept: 'application/json' }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        clearTimeout(timer);
        return d && !d.error ? d : null;
      })
      .catch(function () {
        clearTimeout(timer);
        return null;
      });
  }

  function runQueue(jobs) {
    var i = 0;
    function next() {
      if (i >= jobs.length) return;
      var job = jobs[i++];
      Promise.resolve(job()).then(next, next);
    }
    var n = Math.min(MAX_CONCURRENCY, jobs.length);
    while (n--) next();
  }

  function boot() {
    fill();
    if (window.swup && window.swup.hooks) {
      window.swup.hooks.on('page:view', function () { setTimeout(fill, 80); });
    } else {
      window.addEventListener('redefine:swup:ready', function (e) {
        var swup = e.detail && e.detail.swup;
        if (swup && swup.hooks) swup.hooks.on('page:view', function () { setTimeout(fill, 80); });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
