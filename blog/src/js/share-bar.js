/**
 * GooseBlog — 分享栏：复制链接 + HTML 海报
 */
(function() {
  if (window._postActionsInit) return;
  window._postActionsInit = true;

  var AVATAR = '/avatar.webp';
  var SITE = 'blog.goose.cc.cd';

  // ---- 复制链接 ----
  function onCopyClick() {
    var url = location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function() {
        showToast(window.__ ? window.__('share.copied') : '链接已复制');
      }).catch(function() {
        showToast(window.__ ? window.__('share.copyFailMsg') : '复制失败，手动长按链接吧');
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      showToast(window.__ ? window.__('share.copied') : '链接已复制');
    }
  }

  // ---- Toast ----
  function showToast(msg) {
    var t = document.getElementById('postToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'postToast';
      t.className = 'post-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('active');
    clearTimeout(t._tid);
    t._tid = setTimeout(function() { t.classList.remove('active'); }, 2000);
  }

  // ---- HTML 海报 ----
  function onPosterClick() {
    var article = document.querySelector('.post-view');
    if (!article) return;
    var titleEl = article.querySelector('.post-cover-title') || article.querySelector('.post-view-title');
    var title = titleEl ? titleEl.textContent.trim() : '';
    var coverEl = article.querySelector('.post-cover');
    var coverBg = coverEl ? (coverEl.style.backgroundImage || '') : '';
    var coverUrl = coverBg.replace(/url\(["']?([^"')]+)["']?\)/, '$1');
    var qrSrc = 'https://quickchart.io/qr?size=200&text=' + encodeURIComponent(location.href);

    var poster = document.createElement('div');
    poster.className = 'poster-html';
    poster.innerHTML =
      '<div class="poster-html-bg">' +
        (coverUrl ? '<img class="poster-html-cover" src="' + coverUrl + '" alt="">' : '') +
        '<div class="poster-html-gradient"></div>' +
      '</div>' +
      '<div class="poster-html-title">' + (title || '') + '</div>' +
      '<div class="poster-html-divider"></div>' +
      '<div class="poster-html-footer">' +
        '<div class="poster-html-user">' +
          '<img class="poster-html-avatar" src="' + AVATAR + '" alt="">' +
          '<div class="poster-html-meta">' +
            '<span class="poster-html-domain">' + SITE + '</span>' +
            '<span class="poster-html-hint">' + (window.__ ? window.__('share.readQR') : '扫码阅读这篇文章') + '</span>' +
          '</div>' +
        '</div>' +
        '<img class="poster-html-qr" src="' + qrSrc + '" alt="QR">' +
      '</div>';

    showPosterOverlay(poster);
  }

  function showPosterOverlay(poster) {
    var overlay = document.createElement('div');
    overlay.className = 'poster-overlay';
    var wrap = document.createElement('div');
    wrap.className = 'poster-box';
    var close = document.createElement('button');
    close.className = 'poster-close';
    close.innerHTML = '&times;';

    // 下载按钮：在新窗口打开纯海报，方便右键存图
    var dl = document.createElement('a');
    dl.className = 'poster-download';
    dl.href = '#';
    dl.textContent = (window.__ ? window.__('share.download') : '下载海报');
    dl.addEventListener('click', function(e) {
      e.preventDefault();
      dl.textContent = (window.__ ? window.__('share.generating') : '生成中...');
      html2canvas(poster, {
        backgroundColor: '#15131f',
        scale: 2,
        useCORS: true
      }).then(function(c) {
        var a = document.createElement('a');
        a.href = c.toDataURL('image/png');
        a.download = 'gooseblog-poster.png';
        a.click(); dl.textContent = (window.__ ? window.__('share.download') : '下载海报');
      }).catch(function() {
        dl.textContent = (window.__ ? window.__('share.download') : '下载海报');
        showToast(window.__ ? window.__('share.genFail') : '生成失败');
      });
    });

    wrap.appendChild(poster);
    wrap.appendChild(dl);
    wrap.appendChild(close);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay || e.target === close) overlay.remove();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
    });
    overlay.classList.add('active');
  }

  // ---- 事件委托 ----
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('#postCopyLink');
    if (btn) onCopyClick();
    btn = e.target.closest('#postGenPoster');
    if (btn) onPosterClick();
  });
})();
