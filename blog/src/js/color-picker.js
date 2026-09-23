/**
 * GooseBlog — 调色板（按钮+弹窗）
 */
(function() {
  if (window._colorPickerInit) return;
  window._colorPickerInit = true;

  var PRESETS = [
    { color: '#8b5cf6', name: '紫' },
    { color: '#3b82f6', name: '蓝' },
    { color: '#10b981', name: '绿' },
    { color: '#f59e0b', name: '橙' },
    { color: '#ec4899', name: '粉' },
    { color: '#14b8a6', name: '青' },
    { color: '#ef4444', name: '红' },
    { color: '#eab308', name: '黄' },
    { color: '#6366f1', name: '靛' },
    { color: '#6b7280', name: '灰' },
    { color: '#92400e', name: '棕' },
    { color: '#1e3a5f', name: '藏蓝' },
    { color: '#be185d', name: '玫' },
    { color: '#0f172a', name: '墨' }
  ];
  var STORAGE_KEY = 'gooseblog_brand';
  var root = document.documentElement;
  var currentColor = localStorage.getItem(STORAGE_KEY) || '#8b5cf6';

  function hexToRgb(h) {
    var r = parseInt(h.slice(1,3), 16);
    var g = parseInt(h.slice(3,5), 16);
    var b = parseInt(h.slice(5,7), 16);
    return [r, g, b];
  }

  function applyColor(hex) {
    var rgb = hexToRgb(hex);
    // 品牌主色
    root.style.setProperty('--brand', hex);
    root.style.setProperty('--brand-rgb', rgb.join(','));
    // 品牌淡色（透明底）
    root.style.setProperty('--brand-soft', 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.18)');
    // 品牌深色（用于渐变终点/hover等）
    var dr = Math.max(0, rgb[0] - 60);
    var dg = Math.max(0, rgb[1] - 60);
    var db = Math.max(0, rgb[2] - 60);
    root.style.setProperty('--brand-dark', 'rgb(' + dr + ',' + dg + ',' + db + ')');
    // 品牌 hover 色（微调亮度）
    var hr = Math.min(255, rgb[0] + 20);
    var hg = Math.min(255, rgb[1] + 20);
    var hb = Math.min(255, rgb[2] + 20);
    root.style.setProperty('--brand-hover', 'rgb(' + hr + ',' + hg + ',' + hb + ')');
    localStorage.setItem(STORAGE_KEY, hex);
    currentColor = hex;
    updateDot();
    updateActive();
  }

  function updateDot() {
    var dot = document.getElementById('colorDot');
    if (dot) dot.style.background = currentColor;
  }

  function updateActive() {
    var swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(function(s) {
      s.classList.remove('active');
      if (s.getAttribute('data-color') === currentColor) s.classList.add('active');
    });
  }

  // 构建弹窗面板
  var panel = document.createElement('div');
  panel.className = 'color-popover';
  var html = '';
  PRESETS.forEach(function(p) {
    html += '<button class="color-swatch" data-color="' + p.color + '" title="' + p.name + '" style="background:' + p.color + '"></button>';
  });
  html += '<label class="color-swatch color-swatch-custom" title="自定义"><span>+</span><input type="color" class="custom-color-input" value="' + currentColor + '"></label>';
  panel.innerHTML = html;
  document.body.appendChild(panel);

  // 事件
  var btn = document.getElementById('colorToggle');
  var active = false;
  function toggle() {
    active = !active;
    panel.classList.toggle('active', active);
    if (btn) btn.classList.toggle('active', active);
  }

  if (btn) btn.addEventListener('click', function(e) { e.stopPropagation(); toggle(); });

  document.addEventListener('click', function(e) {
    if (active && !panel.contains(e.target) && btn && !btn.contains(e.target)) toggle();
  });

  // 选色事件
  panel.addEventListener('click', function(e) {
    var sw = e.target.closest('.color-swatch');
    if (!sw) return;
    var c = sw.getAttribute('data-color');
    if (c) { applyColor(c); toggle(); }
  });
  panel.addEventListener('input', function(e) {
    if (e.target.classList.contains('custom-color-input')) applyColor(e.target.value);
  });

  applyColor(currentColor);
  updateDot();
  updateActive();
})();
