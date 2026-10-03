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
 *
 * ⚠️ 自己站但索引里查不到的链接（/about/、/friends/、/archives/……）不要丢给代理。
 *    代理是给外站用的，让它回头抓自己站等于绕公网跑一圈回环，又慢又容易失败，
 *    拿回来的还是自己站的 og 图，纯属白跑。这类链接直接渲染成站内卡片，零请求。
 */
(function () {
  var API = (window.__GOOSE_LINK_PREVIEW__ || '/api/link-preview').replace(/\/$/, '');
  var SELF = window.__GOOSE_SELF_LINKS__ || {};
  var SELF_FAVICON = '/images/avatar-256.webp';
  var MAX_CONCURRENCY = 4;   // 别一口气把整页链接全发出去
  var TIMEOUT_MS = 8000;
  var processed = new WeakSet();
  var cache = Object.create(null);   // 同一链接在一页里出现多次只请求一次

  /** pathname → 站内文章，按路径查，permalink 改成什么样都能命中 */
  var BY_PATH = Object.create(null);

  function normPath(s) {
    return String(s || '').replace(/^\/+|\/+$/g, '');
  }

  /**
   * ⚠️ new URL() 必须带第二个参数当 base。
   * 文章里写站内链接几乎都写成相对路径 /posts/ghg2-log/，
   * 不带 base 的话 new URL('/posts/x') 直接抛 SyntaxError，
   * 于是 pathname 取不到、hostname 也取不到 ——
   * 自己站的链接被当成外站，跑去问 /api/link-preview?url=/posts/xxx，
   * 代理拿个相对地址必然失败，卡片永远停在"域名+裸路径"的骨架上。
   * 这就是"自己站的链接卡片解析不出来"的根源。
   */
  function absUrl(url) {
    try { return new URL(url, location.href); } catch (e) { return null; }
  }

  function pathnameOf(url) {
    var u = absUrl(url);
    return u ? normPath(u.pathname) : '';
  }

  (function buildIndex() {
    Object.keys(SELF).forEach(function (slug) {
      var e = SELF[slug];
      if (!e) return;
      var keys = [];
      if (e.path) keys.push(normPath(e.path), decodeURIComponent(normPath(e.path)));
      if (e.url) keys.push(pathnameOf(e.url), decodeURIComponent(pathnameOf(e.url)));
      keys.push(slug);
      keys.forEach(function (k) {
        if (k && !BY_PATH[k]) BY_PATH[k] = e;
      });
    });
  })();

  function hostOf(url) {
    var u = absUrl(url);
    return u ? u.hostname.replace(/^www\./, '') : '';
  }

  function isSelf(url) {
    var u = absUrl(url);
    return !!u && u.hostname === location.hostname;
  }

  /** 自己站的链接 → 索引里的那篇文章；查不到返回 null */
  function selfPost(url) {
    var raw = pathnameOf(url);
    if (!raw) return null;
    return (
      BY_PATH[raw] ||
      BY_PATH[decodeURIComponent(raw)] ||
      BY_PATH[normPath(raw).split('/').pop()] ||
      null
    );
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
      var seg = normPath(pathnameOf(a.href)).split('/').filter(Boolean).pop();
      title = seg ? decodeURIComponent(seg) : host;
    }
    return title;
  }

  /**
   * 索引万一还是带了标签/星号（比如以后换主题、excerpt 行为变了），这里兜一层底。
   * 只做最保守的剥离，正常情况下 generate-self-links.js 已经洗干净了。
   */
  function plain(s) {
    return String(s == null ? '' : s)
      .replace(/<[^>]+>/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
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
          // ⚠️ 这个域名位必须有自己的 class。
          // 之前用 '.goose-link-card-domain span:last-child' 选它，结果选中了
          // mark 里那个首字母标（它也是 span、也是它爹的 last-child，而且文档顺序在前）——
          // 域名被写进了 14px 的小圆圈里，真正的域名位反倒是空的。
          '<span class="goose-link-card-host"></span>' +
        '</div>' +
        '<div class="goose-link-card-title"></div>' +
        '<div class="goose-link-card-desc" hidden></div>' +
      '</div>' +
      '<div class="goose-link-card-thumb" hidden></div>';

    var mark = card.querySelector('.goose-link-card-mark');
    mark.appendChild(initialMark(host));
    card.querySelector('.goose-link-card-host').textContent = host;
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

    var title = plain(data.title);
    if (title) titleEl.textContent = title;

    var desc = plain(data.description);
    if (desc) {
      descEl.textContent = desc;
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
    // 页面里可能有多个 .markdown-body（正文、过期提示框、首页摘要、独立页面），
    // 只取第一个的话，正文里的链接会一个都不转换
    var scopes = root
      ? (root.classList && root.classList.contains('markdown-body') ? [root] : [].slice.call(root.querySelectorAll('.markdown-body')))
      : [].slice.call(document.querySelectorAll('.markdown-body'));
    if (!scopes.length) return;

    var cards = [];

    scopes.forEach(function (scope) {
      // 提示框 / 引用块里的链接保持原样，不做卡片
      if (scope.closest('.callout, blockquote, .note, .tip')) return;
      var links = scope.querySelectorAll('a[href^="http"], a[href^="/"]');

      links.forEach(function (a) {
        // 标题、图片、已有卡片里的链接不转换
        if (a.closest('h1,h2,h3,h4,h5,h6,figure,figcaption,.goose-link-card')) return;
        if (processed.has(a) || !isStandaloneLink(a)) return;
        processed.add(a);

        var card = build(a);
        processed.add(card);

        var self = isSelf(a.href);
        var own = self ? selfPost(a.href) : null;

        if (own) {
          // 自己站的文章：直接查本地索引，不发任何请求
          applyData(card, {
            title: own.title,
            description: own.excerpt,
            image: own.cover,
            favicon: SELF_FAVICON
          });
          card.classList.add('is-self');
          // 站内就别新开标签了，走 swup 站内跳转
          card.target = '_self';
          card.removeAttribute('rel');
        } else if (self) {
          // 自己站但索引里没有（/about/、/friends/、/archives/……）：
          // 标题已经是链接文字或路径末段，换个自己站的图标就够了，
          // 不去问外链代理 —— 那等于让代理绕公网回来抓自己站。
          setFavicon(card, SELF_FAVICON);
          card.classList.add('is-self');
          card.target = '_self';
          card.removeAttribute('rel');
        }

        a.replaceWith(card);
        if (!self) cards.push({ card: card, url: card.href });
      });
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
    // swup 换页 / 图片懒加载会在一瞬间塞进几十个节点，不节流的话
    // 每次变动都全量扫一遍整页 DOM，长文页能明显感到卡
    var pending = null;
    var schedule = function () {
      if (pending) return;
      pending = setTimeout(function () { pending = null; scan(); }, 120);
    };
    if (window.MutationObserver) {
      var mo = new MutationObserver(schedule);
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
