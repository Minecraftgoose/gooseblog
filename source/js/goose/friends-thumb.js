/**
 * GooseBlog —— 友链页网站截图
 *
 * 主题（Redefine）的友链卡片带一个 thumbnail 位（h-32 / md:h-44 的横幅图），
 * 由 links 数据的 `has_thumbnail: true` 开启。但原站 friends 表里压根没有
 * 截图字段，导入后这个位就是空的 —— 页面上顶着几个空灰框，很难看。
 *
 * 这里复用已有的链接预览 Worker（worker/link-preview/）去抓每个友链的
 * og:image 填进去，抓不到就整块保持隐藏，卡片退回「头像 + 名字 + 简介」。
 *
 * 和原站的关系：原站友链页只有头像 + 名字 + 简介（blog/src/pages/friends.js），
 * 没有截图。截图位是主题多给的，既然位置在，就用 Worker 把它填上，比空着好看。
 */
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
      // 已经填过的跳过（swup 切回来时不要重复请求）
      if (img.dataset.gooseThumbDone) return;
      img.dataset.gooseThumbDone = '1';

      var link = img.closest('a');
      var box = img.closest('.thumbnail');
      if (!link || !link.href) return;

      jobs.push(function () {
        return fetchWithTimeout(link.href).then(function (data) {
          var src = data && data.image;
          // 抓不到图 / 站点没配 og:image → 保持隐藏，不留空框
          if (!src) return;
          img.onload = function () {
            box.hidden = false;
            img.classList.add('is-loaded');
          };
          // 图片本身加载失败（防盗链、404）也要保持隐藏
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
