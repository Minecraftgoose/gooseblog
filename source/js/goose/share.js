/**
 * GooseBlog —— 分享悬浮球：复制链接 + 生成海报
 * 移植自原站 blog/src/js/share-bar.js + share-float.js
 *
 * 差别：
 *   - 原站海报按钮在文章底部（依赖 admin 渲染）
 *   - 早期移植做成了独立悬浮球（position: fixed + 写死 bottom/right），
 *     跟主题自带的右下角工具栏（齿轮那一列）叠在一起，很格格不入。
 *     现在改成挂进工具栏：layout/utils/side-tools.ejs 里加了一个
 *     #gooseShareTool 项，随齿轮展开，位置由主题统一管理。
 *   - html2canvas 仍走 CDN（原站同款），加载失败时只保留复制链接，不报错
 *   - 只在文章页显示该工具项（非文章页加 .hidden）
 */
(function () {
  var AVATAR = '/images/avatar.webp';
  var SITE = 'blog.goose.cc.cd';

  var ICON_SHARE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
  var ICON_COPY = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6.15 4.02C7.11 4.02 7.88 4.02 8.50 4.08C9.12 4.13 9.66 4.25 10.14 4.53C10.72 4.87 11.20 5.35 11.53 5.92C11.81 6.41 11.93 6.94 11.99 7.57C12.05 8.19 12.05 8.95 12.05 9.92C12.05 10.88 12.05 11.65 11.99 12.26C11.93 12.89 11.81 13.43 11.53 13.91C11.20 14.49 10.72 14.97 10.14 15.30C9.66 15.58 9.12 15.70 8.50 15.76C7.88 15.81 7.11 15.81 6.15 15.81C5.19 15.81 4.42 15.81 3.80 15.76C3.18 15.70 2.64 15.58 2.16 15.30C1.58 14.97 1.10 14.49 0.76 13.91C0.48 13.43 0.37 12.89 0.31 12.26C0.25 11.65 0.25 10.88 0.25 9.92C0.25 8.95 0.25 8.19 0.31 7.57C0.37 6.94 0.48 6.41 0.76 5.92C1.10 5.35 1.58 4.87 2.16 4.53C2.64 4.25 3.18 4.13 3.80 4.08C4.42 4.02 5.19 4.02 6.15 4.02ZM6.15 5.38C5.16 5.38 4.47 5.38 3.93 5.43C3.39 5.47 3.08 5.57 2.84 5.71C2.46 5.92 2.15 6.23 1.94 6.60C1.80 6.85 1.71 7.16 1.66 7.69C1.61 8.23 1.61 8.93 1.61 9.92C1.61 10.90 1.61 11.60 1.66 12.14C1.71 12.67 1.80 12.99 1.94 13.23C2.15 13.60 2.46 13.91 2.84 14.13C3.08 14.27 3.39 14.36 3.93 14.41C4.47 14.46 5.16 14.46 6.15 14.46C7.14 14.46 7.83 14.46 8.37 14.41C8.90 14.36 9.22 14.27 9.46 14.13C9.84 13.91 10.14 13.60 10.36 13.23C10.50 12.99 10.59 12.67 10.64 12.14C10.69 11.60 10.69 10.90 10.69 9.92C10.69 8.93 10.69 8.23 10.64 7.69C10.59 7.16 10.50 6.85 10.36 6.60C10.15 6.23 9.84 5.92 9.46 5.71C9.22 5.57 8.90 5.47 8.37 5.43C7.83 5.38 7.14 5.38 6.15 5.38ZM9.80 0.37C10.76 0.37 11.53 0.37 12.15 0.42C12.77 0.48 13.31 0.60 13.79 0.88C14.37 1.21 14.85 1.69 15.19 2.27C15.47 2.76 15.59 3.29 15.64 3.92C15.70 4.53 15.70 5.30 15.70 6.26V7.83C15.70 8.29 15.70 8.59 15.66 8.85C15.47 10.35 14.40 11.57 12.98 12.00V10.55C13.70 10.19 14.21 9.50 14.32 8.67C14.34 8.52 14.34 8.34 14.34 7.83V6.26C14.34 5.28 14.34 4.58 14.29 4.04C14.24 3.51 14.15 3.19 14.01 2.95C13.80 2.58 13.49 2.27 13.12 2.05C12.87 1.91 12.56 1.82 12.03 1.77C11.48 1.73 10.79 1.73 9.80 1.73H7.71C6.76 1.73 5.93 2.28 5.52 3.08H4.07C4.54 1.51 5.99 0.37 7.71 0.37H9.80Z" fill="currentColor"/></svg>';
  var ICON_POSTER = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

  function toast(msg) {
    var t = document.getElementById('gooseToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'gooseToast';
      t.className = 'goose-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('active');
    clearTimeout(t._tid);
    t._tid = setTimeout(function () { t.classList.remove('active'); }, 2000);
  }

  function copyLink() {
    var url = location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        toast('链接已复制');
      }).catch(function () { toast('复制失败，手动长按链接吧'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('链接已复制'); } catch (e) { toast('复制失败'); }
      document.body.removeChild(ta);
    }
  }

  function currentMeta() {
    var title = document.title.replace(/\s*\|\s*GooseBlog\s*$/, '') || document.title;
    var cover = '';
    var img = document.querySelector('.markdown-body img');
    if (img && img.getAttribute('src')) cover = img.getAttribute('src');
    if (!cover) {
      var og = document.querySelector('meta[property="og:image"]');
      if (og) cover = og.getAttribute('content') || '';
    }
    return { title: title, cover: cover };
  }

  function loadHtml2Canvas(cb) {
    if (window.html2canvas) return cb();
    var s = document.createElement('script');
    s.src = 'https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = function () { cb(); };
    s.onerror = function () { cb(new Error('load fail')); };
    document.head.appendChild(s);
  }

  function genPoster() {
    var meta = currentMeta();
    var qrSrc = 'https://quickchart.io/qr?size=200&text=' + encodeURIComponent(location.href);

    var poster = document.createElement('div');
    poster.className = 'goose-poster-html';
    poster.innerHTML =
      '<div class="goose-poster-html-bg">' +
        (meta.cover ? '<img class="goose-poster-html-cover" src="' + meta.cover + '" alt="">' : '') +
        '<div class="goose-poster-html-gradient"></div>' +
      '</div>' +
      '<div class="goose-poster-html-title">' + meta.title + '</div>' +
      '<div class="goose-poster-html-divider"></div>' +
      '<div class="goose-poster-html-footer">' +
        '<div class="goose-poster-html-user">' +
          '<img class="goose-poster-html-avatar" src="' + AVATAR + '" alt="">' +
          '<div class="goose-poster-html-meta">' +
            '<span class="goose-poster-html-domain">' + SITE + '</span>' +
            '<span class="goose-poster-html-hint">扫码阅读这篇文章</span>' +
          '</div>' +
        '</div>' +
        '<img class="goose-poster-html-qr" src="' + qrSrc + '" alt="QR">' +
      '</div>';

    var overlay = document.createElement('div');
    overlay.className = 'goose-poster-overlay';
    var wrap = document.createElement('div');
    wrap.className = 'goose-poster-box';
    var close = document.createElement('button');
    close.className = 'goose-poster-close';
    close.innerHTML = '&times;';
    var dl = document.createElement('a');
    dl.className = 'goose-poster-download';
    dl.href = '#';
    dl.textContent = '下载海报';

    dl.addEventListener('click', function (e) {
      e.preventDefault();
      loadHtml2Canvas(function (err) {
        if (err || !window.html2canvas) { toast('海报组件加载失败'); return; }
        dl.textContent = '生成中...';
        window.html2canvas(poster, { backgroundColor: '#15131f', scale: 2, useCORS: true })
          .then(function (c) {
            var a = document.createElement('a');
            a.href = c.toDataURL('image/png');
            a.download = 'gooseblog-poster.png';
            a.click();
            dl.textContent = '下载海报';
          })
          .catch(function () {
            dl.textContent = '下载海报';
            toast('生成失败');
          });
      });
    });

    wrap.appendChild(poster);
    wrap.appendChild(dl);
    wrap.appendChild(close);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('active'); });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === close) overlay.remove();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
    });
  }

  /** 面板贴着工具栏按钮的左侧弹出，跟着按钮走，不写死坐标 */
  function placePanel(ball, panel) {
    var r = ball.getBoundingClientRect();
    // 按钮不可见（父容器被主题 hide 掉）时 rect 全 0，跳过避免面板飞到屏幕外
    if (!r.width && !r.height) return;
    panel.style.right = (window.innerWidth - r.left + 10) + 'px';
    panel.style.bottom = (window.innerHeight - r.bottom) + 'px';
  }

  function build() {
    if (document.getElementById('gooseSharePanel')) return;

    // 分享按钮挂在主题自带的右下角工具栏里（layout/utils/side-tools.ejs）。
    // 找不到就说明主题结构变了，静默退出 —— 不回退去造独立悬浮球，
    // 那玩意儿位置写死，跟齿轮那一列挤在一起很难看。
    var ball = document.getElementById('gooseShareTool');
    if (!ball) return;

    var panel = document.createElement('div');
    panel.id = 'gooseSharePanel';
    panel.className = 'goose-share-panel';
    panel.innerHTML =
      '<button class="goose-share-item" id="gooseCopyLink">' + ICON_COPY + '<span>复制链接</span></button>' +
      '<button class="goose-share-item" id="gooseGenPoster">' + ICON_POSTER + '<span>生成海报</span></button>';

    document.body.appendChild(panel);

    var active = false;
    function setActive(v) {
      active = v;
      if (v) placePanel(ball, panel);
      panel.classList.toggle('active', v);
    }

    ball.addEventListener('click', function () { setActive(!active); });
    document.addEventListener('click', function (e) {
      if (active && !ball.contains(e.target) && !panel.contains(e.target)) setActive(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && active) setActive(false); });
    window.addEventListener('resize', function () { if (active) placePanel(ball, panel); });

    panel.querySelector('#gooseCopyLink').addEventListener('click', function () { copyLink(); setActive(false); });
    panel.querySelector('#gooseGenPoster').addEventListener('click', function () { genPoster(); setActive(false); });

    function check() {
      // 与 Goose 原逻辑一致：有正文（文章页）才显示
      var isPost = !!document.querySelector('.markdown-body') && !!document.querySelector('.article-title, .post-title, h1.article-title');
      if (!isPost) {
        var meta = document.querySelector('meta[property="og:type"]');
        isPost = !!meta && meta.getAttribute('content') === 'article';
      }
      ball.classList.toggle('hidden', !isPost);
      if (!isPost) setActive(false);
    }

    var root = document.getElementById('swup') || document.body;
    if (window.MutationObserver) {
      var mo = new MutationObserver(check);
      mo.observe(root, { childList: true, subtree: true });
    }
    check();

    if (window.swup && window.swup.hooks) {
      window.swup.hooks.on('page:view', function () { setTimeout(check, 80); });
    } else {
      window.addEventListener('redefine:swup:ready', function (e) {
        var swup = e.detail && e.detail.swup;
        if (swup && swup.hooks) swup.hooks.on('page:view', function () { setTimeout(check, 80); });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
