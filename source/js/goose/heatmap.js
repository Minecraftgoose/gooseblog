/**
 * GooseBlog —— 贡献热力图（纯 SVG，零依赖）
 * 移植自原站 blog/src/js/heatmap.js
 *
 * 差别：
 *   - 原站运行时 fetch('/api/heatmap')，现在由 scripts/generate-heatmap.js
 *     在 hexo g 时把全站文章日期写成 window.__GOOSE_HEATMAP__，零请求
 *   - 只在首页显示（原站也是首页顶部）
 *   - 适配 swup：切回首页时脚本会被重新执行，这里做幂等插入
 *   - 配色读主题的 --primary-color（出厂 #A31F34 深红，现改紫），不写死色值
 */
(function () {
  // 【Goose】热力图配色跟随主题主色 --primary-color，不再写死色值。
  // 出厂主色是 #A31F34（深红），全站改紫后这里自动跟着变紫；
  // 以后再换主色（蓝 / 绿…）也不用动这个文件。
  var FALLBACK_RGB = [139, 92, 246];        // #8B5CF6 violet-500，读不到变量时兜底
  var LEVEL_ALPHA = [0.10, 0.30, 0.50, 0.72, 1];

  /** 把 --primary-color 解析成 [r,g,b]，支持 #rgb / #rrggbb / rgb() / rgba() */
  function primaryRgb() {
    var raw = '';
    try {
      raw = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '';
    } catch (e) {}
    raw = String(raw).trim();

    var hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      var h = hex[1];
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16)
      ];
    }
    var rgb = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
    return FALLBACK_RGB;
  }

  var CELL = 11;
  var GAP = 3;
  var MONTH_LABEL_H = 16;
  var WEEKDAY_LABEL_W = 28;

  function monthShort(m) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m];
  }

  var _rgb = null;   // 主色只解析一次
  function getColor(count, max) {
    if (_rgb === null) _rgb = primaryRgb();
    var a = LEVEL_ALPHA[0];
    if (count) {
      var ratio = count / max;
      a = ratio <= 0.25 ? LEVEL_ALPHA[1]
        : ratio <= 0.5 ? LEVEL_ALPHA[2]
        : ratio <= 0.75 ? LEVEL_ALPHA[3]
        : LEVEL_ALPHA[4];
    }
    return 'rgba(' + _rgb[0] + ', ' + _rgb[1] + ', ' + _rgb[2] + ', ' + a + ')';
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
    // 【Goose】宽度用 viewBox 的自然宽度，不再写 width="100%"。
    // 原因：53 周的 viewBox 只有 ~770px 宽，撑满 1200px 容器会被放大 1.5 倍，
    // 格子从 11px 变 17px，整块图顶到容器边缘、右边一点留白都没有。
    // 现在按自然尺寸渲染（CSS 里 max-width:100% 负责窄屏缩放），
    // 宽屏下靠左、右侧自然留白，跟 GitHub 那种紧凑热力图一致。
    var naturalW = WEEKDAY_LABEL_W + gridW;
    container.innerHTML =
      '<svg class="goose-heatmap" viewBox="0 0 ' + naturalW + ' ' + (MONTH_LABEL_H + gridH) +
      '" width="' + naturalW + '" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">' +
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
