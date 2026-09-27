/**
 * GooseBlog —— 链接社交媒体卡片
 * 移植自原站 blog/src/js/link-card.js
 *
 * 差别（去后端后的必要降级）：
 *   - 原站靠 /api/link-preview 实时抓标题/描述/缩略图，静态站没有后端，
 *     这里改为「零请求」渲染：域名 + favicon + 链接文字，样式保持一致
 *   - 想恢复原效果，可在 front-matter 里手写 {% linkCard %} 或直接在 md 里贴 HTML
 */
(function () {
  var processed = new WeakSet();

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

  function build(a) {
    var host = hostOf(a.href);
    var title = (a.textContent || '').trim();
    // 链接文字就是 URL 时，标题用路径尾巴兜底
    if (!title || title === a.href) {
      try {
        var seg = new URL(a.href).pathname.split('/').filter(Boolean).pop();
        title = seg ? decodeURIComponent(seg) : host;
      } catch (e) { title = host; }
    }

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
          '<span>' + host + '</span>' +
        '</div>' +
        '<div class="goose-link-card-title"></div>' +
      '</div>';
    card.querySelector('.goose-link-card-title').textContent = title;
    return card;
  }

  function scan(root) {
    var scope = root || document.querySelector('.markdown-body');
    if (!scope) return;
    var links = scope.querySelectorAll('a[href^="http"]');
    links.forEach(function (a) {
      if (processed.has(a) || !isStandaloneLink(a)) return;
      processed.add(a);
      var card = build(a);
      processed.add(card);
      a.replaceWith(card);
    });
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
