/**
 * GooseBlog —— 链接社交媒体卡片
 * 移植自原站 blog/src/js/link-card.js
 *
 * 数据流：
 *   1. 先把卡片渲染出来（域名 + favicon + 链接文字），不等网络，卡片立刻可见
 *   2. 再异步去问链接预览代理（Cloudflare Worker，见 worker/link-preview/）
 *      拿到 og:image / og:title / og:description 就把缩略图和描述补上
 *   3. 代理挂了 / 站点没配 og 图 → 保持第 1 步的样子，静默降级
 *
 * 代理地址写在 window.__GOOSE_LINK_PREVIEW__（主题配置 inject.head 注入），
 * 没配就退回同域的 /api/link-preview。
 */
(function () {
  var API = (window.__GOOSE_LINK_PREVIEW__ || '/api/link-preview').replace(/\/$/, '');
  var MAX_CONCURRENCY = 4;   // 别一口气把整页链接全发出去
  var TIMEOUT_MS = 8000;
  var processed = new WeakSet();
  var cache = Object.create(null);   // 同一链接在一页里出现多次只请求一次

  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
  }

  function isStandaloneLink(a) {
    if (a.classList.contains('goose-link-card')) return false;
    var text = (a.textContent || '').trim();
    var href = a.href;
    if (!text || text === href) return true;
    var p = a.closest('p');
    if (p && p.textContent.trim() === text && p.children.length === 1 && p.children[0] === a) return true;
    return false;
  }

  function fallbackTitle(a, host) {
    var title = (a.textContent || '').trim();
    if (!title || title === a.href) {
      try {
        var seg = new URL(a.href).pathname.split('/').filter(Boolean).pop();
        title = seg ? decodeURIComponent(seg) : host;
      } catch (e) { title = host; }
    }
    return title;
  }

  function build(a) {
    var host = hostOf(a.href);
    var card = document.createElement('a');
    card.className = 'goose-link-card';
    card.href = a.href;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.innerHTML =
      '<div class="goose-link-card-body">' +
        '<div class="goose-link-card-domain">' +
          '<img class="goose-link-card-favicon" src="https://api.faviconkit.com/' + host + '/32" alt="" ' +
            'onerror="this.style.display=\'none\'">' +
          '<span></span>' +
        '</div>' +
        '<div class="goose-link-card-title"></div>' +
        '<div class="goose-link-card-desc" hidden></div>' +
      '</div>' +
      '<div class="goose-link-card-thumb" hidden></div>';
    card.querySelector('.goose-link-card-domain span').textContent = host;
    card.querySelector('.goose-link-card-title').textContent = fallbackTitle(a, host);
    return card;
  }

  function applyPreview(card, data) {
    if (!data) return;
    var titleEl = card.querySelector('.goose-link-card-title');
    var descEl = card.querySelector('.goose-link-card-desc');
    var thumbEl = card.querySelector('.goose-link-card-thumb');

    if (data.title) titleEl.textContent = data.title;
    if (data.description) {
      descEl.textContent = data.description;
      descEl.hidden = false;
    }
    if (data.image) {
      var img = new Image();
      img.className = 'goose-link-card-image';
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.onerror = function () { thumbEl.hidden = true; };
      img.src = data.image;
      thumbEl.appendChild(img);
      thumbEl.hidden = false;
      card.classList.add('has-thumb');
    }
  }

  function fetchPreview(url) {
    if (cache[url]) return cache[url];
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIMEOUT_MS);

    var p = fetch(API + '?url=' + encodeURIComponent(url), {
      signal: ctrl ? ctrl.signal : undefined,
      headers: { Accept: 'application/json' }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        clearTimeout(timer);
        // 代理接了但目标站没 og 图，也算失败，保持降级外观
        return data && !data.error ? data : null;
      })
      .catch(function () {
        clearTimeout(timer);
        return null;
      });

    cache[url] = p;
    return p;
  }

  /** 限量并发，避免整页链接一次性打爆代理 */
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

  function scan(root) {
    var scope = root || document.querySelector('.markdown-body');
    if (!scope) return;

    var cards = [];
    var links = scope.querySelectorAll('a[href^="http"]');

    links.forEach(function (a) {
      if (processed.has(a) || !isStandaloneLink(a)) return;
      processed.add(a);
      var card = build(a);
      processed.add(card);
      a.replaceWith(card);
      cards.push({ card: card, url: card.href });
    });

    if (!cards.length) return;

    runQueue(cards.map(function (item) {
      return function () {
        return fetchPreview(item.url).then(function (data) {
          applyPreview(item.card, data);
        });
      };
    }));
  }

  function boot() {
    scan();
    var root = document.getElementById('swup') || document.body;
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () { scan(); });
      mo.observe(root, { childList: true, subtree: true });
    }
    if (window.swup && window.swup.hooks) {
      window.swup.hooks.on('page:view', function () { setTimeout(function () { scan(); }, 80); });
    } else {
      window.addEventListener('redefine:swup:ready', function (e) {
        var swup = e.detail && e.detail.swup;
        if (swup && swup.hooks) swup.hooks.on('page:view', function () { setTimeout(function () { scan(); }, 80); });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
