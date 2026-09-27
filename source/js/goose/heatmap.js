/**
 * GooseBlog —— 贡献热力图（纯 SVG，零依赖）
 * 移植自原站 blog/src/js/heatmap.js
 *
 * 差别：
 *   - 原站运行时 fetch('/api/heatmap')，现在由 scripts/generate-heatmap.js
 *     在 hexo g 时把全站文章日期写成 window.__GOOSE_HEATMAP__，零请求
 *   - 只在首页显示（原站也是首页顶部）
 *   - 适配 swup：切回首页时脚本会被重新执行，这里做幂等插入
 */
(function () {
  var COLOR_RANGE = [
    'rgba(163, 31, 52, 0.10)',
    'rgba(163, 31, 52, 0.30)',
    'rgba(163, 31, 52, 0.50)',
    'rgba(163, 31, 52, 0.72)',
    'rgba(163, 31, 52, 1)'
  ];
  var CELL = 11;
  var GAP = 3;
  var MONTH_LABEL_H = 16;
  var WEEKDAY_LABEL_W = 28;

  function monthShort(m) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m];
  }

  function getColor(count, max) {
    if (!count) return COLOR_RANGE[0];
    var ratio = count / max;
    if (ratio <= 0.25) return COLOR_RANGE[1];
    if (ratio <= 0.5) return COLOR_RANGE[2];
    if (ratio <= 0.75) return COLOR_RANGE[3];
    return COLOR_RANGE[4];
  }

  function render(container, data) {
    data = data || {};
    var vw = window.innerWidth || 1200;
    var weeks = vw < 540 ? 18 : (vw < 900 ? 32 : 53);

    var counts = Object.keys(data).map(function (k) { return Number(data[k]); });
    var max = Math.max.apply(null, counts.concat([1]));

    var today = new Date();
    var endSunday = new Date(today);
    endSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7));
    var startDay = new Date(endSunday);
    startDay.setDate(endSunday.getDate() - (weeks * 7 - 1));

    var rects = [];
    var monthLabels = [];
    var lastMonth = -1;

    for (var w = 0; w < weeks; w++) {
      for (var d = 0; d < 7; d++) {
        var date = new Date(startDay);
        date.setDate(startDay.getDate() + w * 7 + d);
        var x = WEEKDAY_LABEL_W + w * (CELL + GAP);
        var y = MONTH_LABEL_H + d * (CELL + GAP);

        if (d === 0) {
          var m = date.getMonth();
          if (m !== lastMonth) {
            monthLabels.push('<text x="' + x + '" y="11" class="goose-heatmap-month">' + monthShort(m) + '</text>');
            lastMonth = m;
          }
        }

        var key = date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0');

        if (date > today) {
          rects.push('<rect x="' + x + '" y="' + y + '" width="' + CELL + '" height="' + CELL +
            '" rx="2" class="goose-heatmap-cell-future"/>');
        } else {
          var count = data[key] || 0;
          var tip = count > 0 ? (key + ' — ' + count + ' 篇文章') : (key + ' — 没发东西');
          rects.push('<rect x="' + x + '" y="' + y + '" width="' + CELL + '" height="' + CELL +
            '" rx="2" fill="' + getColor(count, max) + '" class="goose-heatmap-cell"><title>' + tip + '</title></rect>');
        }
      }
    }

    var weekdayLabels = ['Mon', 'Wed', 'Fri', 'Sun'];
    var weekdayEls = [0, 2, 4, 6].map(function (d, i) {
      return '<text x="0" y="' + (MONTH_LABEL_H + d * (CELL + GAP) + CELL - 2) +
        '" class="goose-heatmap-weekday">' + weekdayLabels[i] + '</text>';
    }).join('');

    var gridW = weeks * (CELL + GAP) - GAP;
    var gridH = 7 * (CELL + GAP) - GAP;
    container.innerHTML =
      '<svg class="goose-heatmap" viewBox="0 0 ' + (WEEKDAY_LABEL_W + gridW) + ' ' + (MONTH_LABEL_H + gridH) +
      '" width="100%" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">' +
      monthLabels.join('') + weekdayEls + rects.join('') + '</svg>';
  }

  function mount() {
    // 只认首页：内容容器 + 站点首页路径
    var list = document.querySelector('.home-content-container');
    if (!list) return;
    if (location.pathname !== '/' && location.pathname !== '/index.html') return;
    if (document.getElementById('goose-heatmap')) return;

    var wrap = document.createElement('div');
    wrap.className = 'goose-heatmap-wrap';
    wrap.id = 'goose-heatmap';
    wrap.innerHTML = '<div class="goose-heatmap-title">发文热力图</div><div id="goose-heatmap-svg"></div>';

    // 插在文章列表之前（原站也是列表上方）
    list.parentNode.insertBefore(wrap, list);
    try {
      render(document.getElementById('goose-heatmap-svg'), window.__GOOSE_HEATMAP__ || {});
    } catch (e) {
      document.getElementById('goose-heatmap-svg').innerHTML = '';
    }
  }

  function boot() {
    mount();
    // swup 单页切换后重新挂载
    if (window.swup && window.swup.hooks) {
      window.swup.hooks.on('page:view', function () { setTimeout(mount, 60); });
    } else {
      window.addEventListener('redefine:swup:ready', function (e) {
        var swup = e.detail && e.detail.swup;
        if (swup && swup.hooks) swup.hooks.on('page:view', function () { setTimeout(mount, 60); });
      });
    }
    var t = null;
    window.addEventListener('resize', function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        var box = document.getElementById('goose-heatmap-svg');
        if (box) render(box, window.__GOOSE_HEATMAP__ || {});
      }, 200);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
