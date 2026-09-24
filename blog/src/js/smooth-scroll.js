/**
 * GooseBlog — 滚轮 / 触控板平滑滚动
 *
 * 只接管「滚轮滚动」这一条路径，其余一切照旧：
 *   ✅ 鼠标滚轮、触控板双指滑动 → 缓动到目标位置
 *   ❌ 锚点跳转 / scrollIntoView / 键盘翻页 / 拖滚动条 → 保持浏览器原生行为
 *   ❌ 嵌套可滚动容器（代码块、textarea、弹窗内部）→ 优先交给原生滚动
 *   ❌ 触摸滑动、Ctrl+滚轮（缩放）、prefers-reduced-motion → 完全不介入
 *
 * 实现：wheel 事件只负责「累加目标位置」，渲染用 rAF 做指数衰减逼近，
 * 系数按 dt 归一化，所以 60Hz / 120Hz / 144Hz 屏手感一致。
 *
 * 关闭：localStorage.setItem('gooseblog_smooth_scroll', 'off')
 * 运行时：window.GooseSmoothScroll.disable() / enable() / isEnabled()
 */
(function () {
  'use strict';

  var CFG = {
    tau: 90,         // 时间常数(ms)：越小越跟手，越大越「滑」
    epsilon: 0.35,   // 距目标小于该值(px)即视为到达，收尾对齐
    wheelScale: 1,   // 滚动距离倍率：>1 更快，<1 更慢
    lineHeight: 16,  // deltaMode=1（按行滚动）时每行折算的像素
    maxStep: 50      // 单帧 dt 上限(ms)，切后台回来时不跳变
  };

  var el = document.getElementById('app');
  if (!el) return;

  var STORE_KEY = 'gooseblog_smooth_scroll';
  var raf = 0;          // rAF 句柄，非 0 表示动画进行中
  var target = 0;       // 目标 scrollTop
  var lastTime = 0;     // 上一帧时间
  var lastWritten = 0;  // 本脚本最后一次写入的 scrollTop

  // 防止被外部 CSS 的 scroll-behavior:smooth 二次平滑（会又慢又飘）
  el.style.scrollBehavior = 'auto';

  function readPref() {
    try { return localStorage.getItem(STORE_KEY) !== 'off'; } catch (e) { return true; }
  }
  function writePref(on) {
    try { localStorage.setItem(STORE_KEY, on ? 'on' : 'off'); } catch (e) {}
  }
  var enabled = readPref();
  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  function active() {
    return enabled && !(reduceMotion && reduceMotion.matches);
  }

  function maxScroll() {
    return Math.max(0, el.scrollHeight - el.clientHeight);
  }
  function clamp(v) {
    return v < 0 ? 0 : (v > maxScroll() ? maxScroll() : v);
  }

  // 外部（锚点 / 滚动条 / JS 直接赋值）改动了滚动位置：立刻同步，交还控制权
  function sync() {
    target = el.scrollTop;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  function frame(now) {
    var dt = Math.min(now - lastTime, CFG.maxStep);
    lastTime = now;

    var cur = el.scrollTop;
    var diff = target - cur;

    if (Math.abs(diff) <= CFG.epsilon) {
      el.scrollTop = target;
      lastWritten = el.scrollTop;
      raf = 0;
      return;
    }

    // 指数衰减：dt 归一化后不同刷新率下速度一致
    var k = 1 - Math.exp(-dt / CFG.tau);
    el.scrollTop = cur + diff * k;
    lastWritten = el.scrollTop;
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf) return;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  // 从事件源向上找「还能继续滚」的嵌套滚动容器，找到就让它原生滚
  function nestedScroller(node, dy) {
    var n = node;
    while (n && n !== el && n.nodeType === 1) {
      var overflow = n.scrollHeight - n.clientHeight;
      if (overflow > 1) {
        var oy = window.getComputedStyle(n).overflowY;
        if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') {
          var top = n.scrollTop;
          if ((dy > 0 && top < overflow - 1) || (dy < 0 && top > 1)) return n;
        }
      }
      n = n.parentElement;
    }
    return null;
  }

  function normalize(e) {
    var d = e.deltaY;
    if (e.deltaMode === 1) d *= CFG.lineHeight;       // 按行
    else if (e.deltaMode === 2) d *= el.clientHeight; // 按页
    return d * CFG.wheelScale;
  }

  function onWheel(e) {
    if (!active() || e.defaultPrevented) return;
    if (e.ctrlKey || e.metaKey) return;                      // 缩放 / 系统手势
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;      // 横向滚：原生处理

    var dy = normalize(e);
    if (!dy) return;
    if (maxScroll() <= 0) return;                             // 内容没超出，不劫持
    if (nestedScroller(e.target, dy)) return;                 // 嵌套容器优先

    e.preventDefault();
    // 动画未启动时以真实位置为基准；连续滚动时在目标上继续累加，不回拉
    target = clamp((raf ? target : el.scrollTop) + dy);
    start();
  }

  el.addEventListener('wheel', onWheel, { passive: false });

  // 外部滚动（scrollIntoView / 拖滚动条 / 路由恢复位置）→ 同步，避免与动画打架
  el.addEventListener('scroll', function () {
    if (Math.abs(el.scrollTop - lastWritten) > 1) sync();
  }, { passive: true });

  // 视口 / 内容高度变化后把目标位置收回合法范围
  window.addEventListener('resize', function () {
    target = clamp(target);
  });
  window.addEventListener('locationchange', sync);

  if (reduceMotion && reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', function () { if (!active()) sync(); });
  }

  window.GooseSmoothScroll = {
    enable: function () { enabled = true; writePref(true); },
    disable: function () { enabled = false; writePref(false); sync(); },
    isEnabled: active
  };
})();
