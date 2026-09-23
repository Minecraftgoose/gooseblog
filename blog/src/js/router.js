/**
 * GooseBlog — 前端路由（History API，干净 URL，无 #）
 * 监听 popstate + 拦截站内 <a> 点击，统一走 pushState。
 * 额外维护一个 SPA 内部历史栈，支撑前进/后退按钮的可用态判断。
 */

const routes = {};

// SPA 内部历史栈：记录 navigate 过的路径，用于判断能否前进/后退
let navStack = [];
let navIdx = -1;

function recordNav(path) {
  const existing = navStack.indexOf(path);
  if (existing !== -1) { navIdx = existing; return; }
  // 若当前不在栈顶，截断"将来"分支（新的导航丢弃旧的将来）
  if (navIdx < navStack.length - 1) navStack = navStack.slice(0, navIdx + 1);
  navStack.push(path);
  navIdx = navStack.length - 1;
}
recordNav(getCurrentPath());

export function route(path, handler) {
  routes[path] = handler;
}

export function getCurrentPath() {
  return window.location.pathname || '/';
}

/** 跳转到站内路径（干净 URL，无刷新） */
export function navigate(path) {
  if (path === getCurrentPath()) return;
  window.history.pushState({}, '', path);
  recordNav(path);
  fadeRender();
  window.dispatchEvent(new Event('locationchange'));
}

function renderRoute() {
  const path = getCurrentPath();
  // 精确匹配
  const handler = routes[path];
  if (handler) { handler(path); return; }
  // 参数匹配（如 /post/some-slug）
  for (const [pattern, h] of Object.entries(routes)) {
    if (pattern.includes(':')) {
      const regex = new RegExp('^' + pattern.replace(/:[\w-]+/g, '(.+)') + '$');
      const match = path.match(regex);
      if (match) {
        const params = {};
        const keys = pattern.match(/:([\w-]+)/g) || [];
        keys.forEach((key, i) => { params[key.slice(1)] = match[i + 1]; });
        h(path, params);
        return;
      }
    }
  }
  // 404
  const fallback = routes['/404'];
  if (fallback) fallback(path);
}

// 带淡入淡出过渡的页面切换（非上浮）
let fadeToken = 0;
function fadeRender() {
  const app = document.getElementById('app');
  if (!app) { renderRoute(); return; }
  const token = ++fadeToken;
  app.classList.add('is-leaving'); // 淡出
  const run = () => {
    if (token !== fadeToken) return; // 被更新的导航取代，丢弃
    renderRoute();
    // 双 rAF 确保新内容已上屏后再淡入
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (token === fadeToken) app.classList.remove('is-leaving');
    }));
  };
  let fired = false;
  const onEnd = () => {
    if (fired) return; fired = true;
    app.removeEventListener('transitionend', onEnd);
    run();
  };
  app.addEventListener('transitionend', onEnd);
  // 兜底：若无 transition 事件（如 reduced-motion），到点强制执行
  setTimeout(() => { if (!fired) { fired = true; app.removeEventListener('transitionend', onEnd); run(); } }, 240);
}

/** 后退 */
export function goBack() {
  if (navIdx <= 0) return;
  window.history.back();
}

/** 前进 */
export function goForward() {
  if (navIdx >= navStack.length - 1) return;
  window.history.forward();
}

export function canGoBack() { return navIdx > 0; }
export function canGoForward() { return navIdx < navStack.length - 1; }

export function initRouter() {
  let lastPath = getCurrentPath();
  let lastHash = location.hash;
  // 浏览器前进/后退（同步内部栈）
  window.addEventListener('popstate', () => {
    const curPath = getCurrentPath();
    const curHash = location.hash;
    // 只有 hash 变化时忽略（文章内锚点跳转，不触发 SPA 重渲染）
    if (curPath === lastPath && curHash !== lastHash) {
      lastHash = curHash;
      return;
    }
    lastPath = curPath;
    lastHash = curHash;
    // 同步内部栈索引
    var idx = navStack.indexOf(curPath);
    if (idx !== -1) navIdx = idx;
    else { navStack.push(curPath); navIdx = navStack.length - 1; }
    fadeRender();
    window.dispatchEvent(new Event('locationchange'));
  });

  // 全局拦截站内链接点击（data-route 或 href 以 / 开头且非外链）
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-route], a[href^="/"]');
    if (!a) return;
    const target = a.dataset.route || a.getAttribute('href');
    if (!target || !target.startsWith('/')) return;
    // 外链 / 新标签 / 下载等交给浏览器
    if (a.target === '_blank' || a.hasAttribute('download') || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    navigate(target);
  });

  renderRoute(); // 初始加载（不走淡出）
}
