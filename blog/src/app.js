/**
 * GooseBlog — 主入口
 * 路由注册 + 侧栏导航高亮 + 顶栏标题同步
 */
import { route, initRouter, getCurrentPath, goBack, goForward, canGoBack, canGoForward, navigate } from './js/router.js';
import { initContextMenu } from './js/contextmenu.js';
import { renderHome, setRandomBg } from './pages/home.js';
import { renderPost } from './pages/post.js';
import { renderTag } from './pages/tag.js';
import { renderArchive } from './pages/archive.js';
import { renderAbout } from './pages/about.js';
import { renderProjects } from './pages/projects.js';
import { renderAdmin } from './pages/admin.js';
import { renderFriends } from './pages/friends.js';

// 引入国际化（自动执行侧栏/顶栏文字同步）
import './js/i18n.js';

const app = document.getElementById('app');
const topbarTitle = document.getElementById('topbar-title');
const backBtn = document.getElementById('headerBackBtn');
const fwdBtn = document.getElementById('headerForwardBtn');
const mobileBackBtn = document.getElementById('mobileBackBtn');
const mobileFwdBtn = document.getElementById('mobileForwardBtn');

if (backBtn) backBtn.addEventListener('click', goBack);
if (fwdBtn) fwdBtn.addEventListener('click', goForward);
if (mobileBackBtn) mobileBackBtn.addEventListener('click', goBack);
if (mobileFwdBtn) mobileFwdBtn.addEventListener('click', goForward);

// 路径 -> 顶栏标题
const TITLE_MAP = {
  '/': { icon: '#', text: null },
  '/about': { icon: '#', text: null },
  '/archive': { icon: '#', text: null },
  '/projects': { icon: '#', text: null },
  '/friends': { icon: '#', text: null },
  '/admin': { icon: '#', text: null },
};

// 路径 -> 侧栏 active 路由
const NAV_MAP = {
  '/': '/',
  '/about': '/about',
  '/archive': '/archive',
  '/projects': '/projects',
  '/friends': '/friends',
};

// 注册路由
route('/', () => renderHome(app));
route('/about', () => renderAbout(app));
route('/archive', () => renderArchive(app));
route('/projects', () => renderProjects(app));
route('/friends', () => renderFriends(app));
route('/admin', () => renderAdmin(app));
route('/tag/:tag', (path, params) => renderTag(app, params));
route('/post/:slug', (path, params) => renderPost(app, params));

// 404
route('/404', () => {
  app.innerHTML = `
    <div class="state-msg">
      <div class="empty-icon">404</div>
      <p>鹅没找到这个页面</p>
      <p style="font-size:12px;margin-top:6px;color:var(--text-muted)">迷路了就回首页吧</p>
    </div>
  `;
});

function updateChrome() {
  const path = getCurrentPath();

  // 顶栏标题
  // 兼容 /post/xxx, /tag/xxx 这类动态路径
  let title = TITLE_MAP[path];
  if (!title) {
    if (path.startsWith('/post/')) {
      title = { icon: '#', text: 'post' };
    } else if (path.startsWith('/tag/')) {
      title = { icon: '#', text: 'tag' };
    } else if (path.startsWith('/admin')) {
    title = { icon: '#', text: 'admin' };
  } else {
      title = { icon: '#', text: 'home' };
    }
  }
  // 用 i18n 渲染顶栏标题
  const titleKey = 'topbar.' + title.text;
  const titleText = title.text ? (window.__ ? window.__(titleKey) : title.text) : (window.__ ? window.__('topbar.home') : 'GooseBlog');
  // topbarTitle.innerHTML = `<span>${title.icon}</span> ${title.text}`;

  // 桌面操作栏：首页显示 logo，其余页面显示页标题
  const titleEl = document.getElementById('chatHeaderTitle');
  if (titleEl) {
    if (path === '/') {
      titleEl.innerHTML = '<img class="brand-logo brand-logo-top" src="/logo.svg" alt="GooseBlog">';
    } else {
      titleEl.textContent = titleText;
    }
  }

  // 侧栏 active
  let activePath;
  if (path.startsWith('/admin')) activePath = '/admin';
  else activePath = NAV_MAP[path] || '/';
  document.querySelectorAll('.nav-item').forEach(a => {
    a.classList.toggle('active', a.dataset.route === activePath);
  });

  // 前进/后退按钮可用态（桌面 + 移动端同步）
  if (backBtn) backBtn.disabled = !canGoBack();
  if (fwdBtn) fwdBtn.disabled = !canGoForward();
  if (mobileBackBtn) mobileBackBtn.disabled = !canGoBack();
  if (mobileFwdBtn) mobileFwdBtn.disabled = !canGoForward();
}

initRouter();
setRandomBg();  // 全站壁纸（不只是在首页加载）
window.addEventListener('locationchange', updateChrome);
updateChrome();

// 首次加载触发代码高亮
if (window.Prism) setTimeout(function() { Prism.highlightAll(); }, 150);

// 侧栏切换（gooseAI 方式）
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');

function toggleSidebar(show) {
  const open = show !== undefined ? show : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
}

if (menuBtn) menuBtn.addEventListener('click', () => toggleSidebar(true));
if (overlay) overlay.addEventListener('click', () => toggleSidebar(false));

// 导航项点击关侧栏
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => toggleSidebar(false));
});

// 切路由时自动关侧栏
window.addEventListener('locationchange', () => toggleSidebar(false));
// 路由切换后重新触发代码高亮
window.addEventListener('locationchange', () => {
  if (window.Prism) setTimeout(function() { Prism.highlightAll(); }, 50);
});

// ===== 桌面操作栏：侧栏折叠 + 主题切换 =====
const headerSidebarBtn = document.getElementById('headerSidebarBtn');
if (headerSidebarBtn) {
  headerSidebarBtn.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 768px)').matches) toggleSidebar();
    else sidebar.classList.toggle('collapsed');
  });
}

function updateThemeIcons(theme) {
  const isLight = theme === 'light';
  const cls = isLight ? 'fas fa-sun' : 'fas fa-moon';
  const sb = document.getElementById('headerThemeBtn');
  if (sb) { sb.querySelector('i').className = cls; }
  const mb = document.getElementById('mobileThemeBtn');
  if (mb) { mb.querySelector('i').className = cls; }
}

function applyTheme() {
  const theme = localStorage.getItem('gooseblog_theme') || 'dark';
  document.documentElement.dataset.theme = theme;
  updateThemeIcons(theme);
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('gooseblog_theme', next);
  updateThemeIcons(next);
}

// 主题按钮连点 4 次（2.5s 内）触发隐藏的"写文章"入口
let themeEggCount = 0;
let themeEggLast = 0;
function onThemeClick() {
  toggleTheme();
  const now = Date.now();
  if (now - themeEggLast > 2500) themeEggCount = 0;
  themeEggCount++;
  themeEggLast = now;
  if (themeEggCount >= 4) {
    themeEggCount = 0;
    navigate('/admin');
  }
}

const headerThemeBtn = document.getElementById('headerThemeBtn');
if (headerThemeBtn) headerThemeBtn.addEventListener('click', onThemeClick);
const mobileThemeBtn = document.getElementById('mobileThemeBtn');
if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', onThemeClick);

applyTheme();

// 自定义右键菜单
initContextMenu();

// 侧栏打字机：每日一言（循环：首句兜底即时打→删→拉下一句真实数据；数据来自 /api/yiyan 代理）
(async function initTypewriter() {
  const el = document.getElementById('typingText');
  if (!el) return;
  // 兜底语录（接口失败时使用，也用于首屏即时出字避免空白）
  const FALLBACK = [
    '今天的努力，是幸运的伏笔。',
    '保持热爱，奔赴山海。',
    '行稳致远，久久为功。',
    '星光不问赶路人，时光不负有心人。',
    '你只管努力，剩下的交给时间。',
    '所言是，虽盗跖之语不可为非；所言非，虽尧舜之语不可为是。',
  ];
  async function fetchQuote() {
    try {
      const r = await fetch('/api/yiyan?_=' + Date.now(), { cache: 'no-store' });
      if (r.ok) {
        const t = (await r.text()).trim();
        if (t) return t;
      }
    } catch (e) { /* 落到兜底 */ }
    return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
  }
  let current = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
  let i = 0, deleting = false;
  async function tick() {
    if (!deleting) {
      el.textContent = current.slice(0, ++i);
      if (i >= current.length) {
        deleting = true;
        return setTimeout(tick, 1600); // 打完停顿一下再删
      }
    } else {
      el.textContent = current.slice(0, --i);
      if (i <= 0) {
        deleting = false;
        current = await fetchQuote(); // 拉下一句真实数据
        return setTimeout(tick, 350);
      }
    }
    setTimeout(tick, deleting ? 45 : 85);
  }
  tick();
})();

// 落叶飘落特效开关（控制 fengye.js 的 stopp/startSakura，偏好存 localStorage）
(function initLeavesToggle() {
  const KEY = 'gooseblog_leaves';
  const toggle = document.getElementById('leavesToggle');
  if (!toggle) return;
  // 读取偏好（默认开启）
  const saved = localStorage.getItem(KEY);
  const enabled = saved !== 'false';
  toggle.checked = enabled;

  function setLeaves(on) {
    if (typeof window.startSakura !== 'function' && typeof window.stopp !== 'function') return;
    const running = window.staticx === true;
    if (on && !running) { if (window.startSakura) window.startSakura(); }
    else if (!on && running) { if (window.stopp) window.stopp(); }
  }

  toggle.addEventListener('change', () => {
    const on = toggle.checked;
    localStorage.setItem(KEY, on ? 'true' : 'false');
    setLeaves(on);
  });

  // fengye.js 自动启动（img.onload → startSakura），若偏好为关则等其起来后停掉
  if (!enabled) {
    let tries = 0;
    const iv = setInterval(() => {
      if (window.staticx === true) { setLeaves(false); clearInterval(iv); }
      else if (++tries > 25) clearInterval(iv);
    }, 200);
  }
})();

// 点击爆炸特效开关
(function initClickToggle() {
  const KEY = 'gooseblog_clickspark';
  const toggle = document.getElementById('clickToggle');
  if (!toggle) return;
  const saved = localStorage.getItem(KEY);
  const enabled = saved !== 'false';
  toggle.checked = enabled;

  function getCanvas() {
    return document.querySelector('canvas[style*="z-index: 99999"]');
  }

  function setClick(on) {
    const cvs = getCanvas();
    if (cvs) cvs.style.display = on ? '' : 'none';
  }

  toggle.addEventListener('change', () => {
    const on = toggle.checked;
    localStorage.setItem(KEY, on ? 'true' : 'false');
    setClick(on);
  });

  // 初始加载后 dianjibaozha.js 可能还没创建 canvas
  let tries = 0;
  const iv = setInterval(() => {
    if (getCanvas()) {
      setClick(enabled);
      clearInterval(iv);
    } else if (++tries > 30) clearInterval(iv);
  }, 200);
})();

// ===== 公告横幅（全站顶部，从 site_pages 加载；超宽自动跑马灯） =====
// 公告按纯文本展示，不渲染 markdown；动画作用在 track 上实现无缝循环
(function loadAnnouncement() {
  fetch('/api/pages/announcement')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var bar = document.getElementById('announcementBar');
      var textEl = document.getElementById('announcementText');
      var scrollEl = document.getElementById('announcementScroll');
      var trackEl = document.getElementById('announcementTrack');
      if (!bar || !textEl || !scrollEl || !trackEl) return;
      var raw = (data && data.content != null) ? String(data.content) : '';
      var txt = raw.trim();
      if (!txt) { bar.style.display = 'none'; return; }
      // 纯文本安全转义后塞入，不解析任何 HTML
      textEl.textContent = txt;
      bar.style.display = 'flex';
      // 内容比容器宽才滚动：克隆一份放进 track，-50% 位移即无缝循环
      if (textEl.scrollWidth > scrollEl.clientWidth + 4) {
        var clone = textEl.cloneNode(true);
        trackEl.appendChild(clone);
        trackEl.classList.add('scrolling');
        var duration = Math.max(8, Math.round(textEl.scrollWidth / 40));
        trackEl.style.setProperty('--ann-duration', duration + 's');
      }
    })
    .catch(function() {
      var bar = document.getElementById('announcementBar');
      if (bar) bar.style.display = 'none';
    });
})();
