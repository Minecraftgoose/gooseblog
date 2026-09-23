/**
 * GooseBlog 鈥?链接绀句氦濯掍綋鍗＄墖
  * comment */
(function() {
  if (window._linkCardInit) return;
  window._linkCardInit = true;

  var API_BASE = '/api/link-preview?url=';
  var processed = new WeakSet();

  function isStandaloneLink(a) {
    // 宸茬粡鏄?崱鐗囦簡锛岃烦杩?
    if (a.classList.contains('link-card')) return false;
    // 链接文��灏辨槸 URL 鏈?韩锛屾垨鑰呴摼鎺ュ湪鐙?珛娈佃惤閲?
    var text = a.textContent.trim();
    var href = a.href;
    if (!text || text === href) return true;
    // ��独立 <p> 里，且 <p> 内只有这个 <a>
    var p = a.closest('p');
    if (p && p.textContent.trim() === text && p.children.length === 1 && p.children[0] === a) return true;
    return false;
  }

  function createCard(data) {
    var card = document.createElement('a');
    card.className = 'link-card';
    card.href = data.url || '';
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    var hasTitle = data.title && data.title.length > 0;
    var hasDesc = data.description && data.description.length > 0;
    var hasImage = data.image && data.image.length > 0;
    card.innerHTML =
      '<div class="link-card-body">' +
        '<div class="link-card-domain">' +
          (data.favicon ? '<img class="link-card-favicon" src="' + data.favicon + '" onerror="this.style.display=\'none\'" alt="">' : '') +
          '<span>' + (data.domain || '') + '</span>' +
        '</div>' +
        (hasTitle ? '<div class="link-card-title">' + data.title + '</div>' : '') +
        (hasDesc ? '<div class="link-card-desc">' + data.description + '</div>' : '') +
      '</div>' +
      (hasImage ? '<div class="link-card-img" style="background-image:url(' + data.image + ')"></div>' : '');
    return card;
  }

  function replaceLink(a) {
    if (processed.has(a)) return;
    processed.add(a);

    var href = a.href;
    fetch(API_BASE + encodeURIComponent(href))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) return;
        data.url = href;
        data.domain = data.domain || '';
        var card = createCard(data);
        processed.add(card);
        a.replaceWith(card);
      })
      .catch(function() {});
  }

  function scan() {
    var aiContent = document.querySelector('.post-content');
    if (!aiContent) return;

    var links = aiContent.querySelectorAll('a[href^="http"]');
    links.forEach(function(a) {
      if (isStandaloneLink(a)) replaceLink(a);
    });
  }

  // SPA 璺?敱切换鐩戝惉
  var rootEl = document.getElementById('root') || document.body;
  var mo = new MutationObserver(function() {
    if (document.querySelector('.post-content')) scan();
  });
  mo.observe(rootEl, { childList: true, subtree: true });

  // 棣栧睆
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
})();
