/**
 * GooseBlog —— 链接社交媒体卡片
 * 移植自原站 blog/src/js/link-card.js
 *
 * 两条数据来源，优先走本地：
 *   1. 站内链接 → window.__GOOSE_SELF_LINKS__（构建期生成，见 scripts/generate-self-links.js）
 *      零网络请求、必定命中，而且拿的是本地的标题/摘要/封面，比抓 og 标签还准。
 *      原站是靠 Worker 判断 origin 后绕开公网回环去查库的，现在直接本地解决。
 *   2. 外站链接 → 问链接预览代理（Cloudflare Worker，见 worker/link-preview/）
 *      拿 og:image / og:title / og:description / favicon
 *
 * 渲染策略：先把卡片画出来（域名 + 标识 + 链接文字），不等网络，卡片立刻可见；
 * 拿到数据再把缩略图和描述补上。代理挂了 / 站点没 og 图 → 保持初始样子，静默降级。
 *
 * ⚠️ 不要用 api.faviconkit.com 之类的第三方 favicon 服务：它们对没有 favicon 的
 *    站点会返回一个默认的蓝色圆点，卡片上就顶着一个莫名的小蓝点。
 *    现在 favicon 由 Worker 从目标站自己的 <link rel="icon"> 解析；
 *    拿不到就画域名首字母标，纯 CSS，零网络，永远不会出现怪东西。
 */
(function () {
  var API = (window.__GOOSE_LINK_PREVIEW__ || '/api/link-preview').replace(/\/$/, '');
  var SELF = window.__GOOSE_SELF_LINKS__ || {};
  var MAX_CONCURRENCY = 4;   // 别一口气把整页链接全发出去
  var TIMEOUT_MS = 8000;
  var processed = new WeakSet();
  var cache = Object.create(null);   // 同一链接在一页里出现多次只请求一次

  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
  }

  function isSelf(url) {
    try {
      return new URL(url).hostname === location.hostname;
    } catch (e) {
      return false;
    }
  }

  /** 自己站的 /posts/<slug>/ → slug，命中索引就返回那篇文章 */
  function selfPost(url) {
    try {
      var path = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
      var m = path.match(/^posts\/([^/]+)/);
      if (m && SELF[m[1]]) return SELF[m[1]];
    } catch (e) {}
    return null;
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

  /** 域名首字母标：favicon 拿不到时用，纯 CSS 无网络 */
  function initialMark(host) {
    var ch = (host || '?').replace(/^www\./, '').charAt(0).toUpperCase();
    if (!/[A-Z0-9]/.test(ch)) ch = '#';
    var el = document.createElement('span');
    el.className = 'goose-link-card-initial';
    el.textContent = ch;
    return el;
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
          '<span class="goose-link-card-mark"></span>' +
          '<span></span>' +
        '</div>' +
        '<div class="goose-link-card-title"></div>' +
        '<div class="goose-link-card-desc" hidden></div>' +
      '</div>' +
      '<div class="goose-link-card-thumb" hidden></div>';

    var mark = card.querySelector('.goose-link-card-mark');
    mark.appendChild(initialMark(host));
    card.querySelector('.goose-link-card-domain span:last-child').textContent = host;
    card.querySelector('.goose-link-card-title').textContent = fallbackTitle(a, host);
    return card;
  }

  /** 把真实 favicon 换进去；加载失败就退回首字母标（不会出现空白或怪图标） */
  function setFavicon(card, url) {
    if (!url) return;
    var mark = card.querySelector('.goose-link-card-mark');
    if (!mark) return;
    var img = new Image();
    img.className = 'goose-link-card-favicon';
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.onload = function () {
      // 有些站 favicon 是 1x1 透明占位图，宽高为 1 就别显示
      if (img.naturalWidth <= 1) return;
      mark.replaceChildren(img);
      mark.classList.add('has-favicon');
    };
    img.onerror = function () { /* 失败就保持首字母标 */ };
    img.src = url;
  }

  function applyData(card, data) {
    if (!data) return;
    var titleEl = card.querySelector('.goose-link-card-title');
    var descEl = card.querySelector('.goose-link-card-desc');
    var thumbEl = card.querySelector('.goose-link-card-thumb');

    if (data.title) titleEl.textContent = data.title;
    if (data.description) {
      descEl.textContent = data.description;
      descEl.hidden = false;
    }
    if (data.favicon) setFavicon(card, data.favicon);
    if (data.image) {
      var img = new Image();
      img.className = 'goose-link-card-image';
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.onerror = function () {
        thumbEl.hidden = true;
        card.classList.remove('has-thumb');
      };
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
    var links = scope.querySelectorAll('a[href^="http"], a[href^="/"]');

    links.forEach(function (a) {
      if (processed.has(a) || !isStandaloneLink(a)) return;
      processed.add(a);

      var card = build(a);
      processed.add(card);

      // 自己站的链接：直接查本地索引，不发任何请求
      var own = isSelf(a.href) ? selfPost(a.href) : null;
      if (own) {
        applyData(card, {
          title: own.title,
          description: own.excerpt,
          image: own.cover,
          favicon: '/images/avatar-256.webp'   // 自己站的图标就用站点图标
        });
      }

      a.replaceWith(card);
      if (!own) cards.push({ card: card, url: card.href });
    });

    if (!cards.length) return;

    runQueue(cards.map(function (item) {
      return function () {
        return fetchPreview(item.url).then(function (data) {
          applyData(item.card, data);
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
