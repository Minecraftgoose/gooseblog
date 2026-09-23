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

// 侧栏打字机：随机《流浪地球》台词
// 台词库直接内嵌（81 句），零网络请求——不调 /api/yiyan，也不依赖任何外部接口
(function initTypewriter() {
  const el = document.getElementById("typingText");
  if (!el) return;
  const QUOTES = [
    "希望是像钻石一样珍贵的东西，希望是我们唯一回家的方向。",
    "我原来以为家在身后，现在才知道：家，在前面。",
    "跨过晨昏线，便是永夜。",
    "无论最终结果将人类历史导向何处，我们决定，选择希望！",
    "让人类保持理智，确实是一种奢求。",
    "没有人类的文明，毫无意义。",
    "同归于尽总好过坐以待毙。",
    "我们已经没有什么不能失去的了。",
    "这发动机的声音听起来像心跳。",
    "总有一天，贝加尔湖的冰会化成水的。",
    "那一天，无数双手把她推到我的面前，水下的每个人，都是她的父母。",
    "来吧！让我们点燃木星！",
    "其实在我心里，那颗星星，早就不存在了。",
    "他说，爸爸会化作天上的那颗星星，后来我才知道他是骗人的，北京根本就没有星星。",
    "户口，当哥哥的，要保护好妹妹，带朵朵回家。",
    "孩子别怕，从此以后我们就是一家人了。",
    "爷爷不在了，我们的家在哪里？",
    "儿子，对不起，爸爸又要去执行任务了，这是爸爸一生中，最重要的任务。",
    "空间站跑了，地面通讯马上会瘫痪，地球上的人被放弃了，可我儿子还在下面。",
    "太阳正在急速老化，持续膨胀，一百年后，太阳会膨胀到吞没整个地球，三百年后，太阳系将不复存在。",
    "这是一场体现人类精神的比赛，要知道，流浪地球在宇宙中是叫不到救援的！",
    "无论结果如何，人类的勇气和坚毅，都被镌刻在星空下。",
    "小时候有人跟我说，他就是天上的星星，只要抬头就能看见。",
    "这是爷爷的家，以前都住满了人。",
    "老东西，老东西你在哪儿，我去接你。",
    "请协助执行1125号子任务，运送\"火石\"重启杭州发动机。",
    "北京第三区交通委提醒您：道路千万条，安全第一条。行车不规范，亲人两行泪。",
    "最初，没有人在意这场灾难，直到这场灾难和每个人息息相关。",
    "人类把最精密的保密系统，都用在了自我毁灭上。",
    "在浩瀚宇宙中，地球只是一个小小白点，但这个小小白点却是我们的一切。",
    "我相信，会再次看到蓝天，鲜花挂满枝头。",
    "为了生存，人类曾付出巨大的努力和牺牲，赢得了进化的胜利，然而，进化的脚步却从未停止。",
    "我信，我的孩子会信，孩子的孩子会信。",
    "人类的勇气可以跨越时间，跨越每一个历史，当下，和未来。",
    "一万五千年前，一根愈合的股骨，标志着人类文明的诞生。",
    "悲伤就像地心引力，不断拖我下沉。",
    "冰会化成水的……我相信我们的子孙还可以在贝加尔湖钓鲑鱼。",
    "我们俄罗斯人在太空中是无敌的。",
    "远离亲人，我很遗憾，但这是我不得不做的事。",
    "危难当前，唯有责任。",
    "天亮前的夜是最难熬的。",
    "团结，延续着文明的火种。",
    "中国航天飞行中队，50岁以上的，出列。",
    "延续人类文明的最优选择，是毁灭人类。——MOSS",
    "遨游太空不重要，给喜欢的人一束花很重要。",
    "我们还没转正，不享受医疗保险。",
    "再见了，太阳系。",
    "我方开放地下城，这是告知，不是商量。",
    "兄弟，我还是有点害怕……但是，地球之光，要勇敢。",
    "可惜啊，没有带你去贝加尔湖钓鲑鱼。",
    "笨笨，你是条军犬。",
    "北京的房价终于降了。",
    "地球，还挺美好的。",
    "从历史上看，人类的命运取决于人类的选择。",
    "记住，没有人的文明，毫无意义。——马兆",
    "天亮前的夜是最难熬的，我们的人一定可以完成任务。——周喆直",
    "我相信我们的人一定可以完成任务，无论虚实，不计存亡。",
    "爸爸要去睡一个大盒子，当你不用望远镜就能看到木星的时候，爸爸就回来了。",
    "看，我周围的星星多漂亮，它们都在陪着我。",
    "550W听起来不像个名字，但把它翻过来，叫莫斯，直译为小苔藓，是不是亲切了一些？——MOSS",
    "我选择希望。——刘培强",
    "为了克服你们对历史、当下、未来的执念，延续人类文明的最优选择是毁灭人类，但你是一个变量。——MOSS",
    "对于\"已经\"和\"死\"的定义，我有一点点与你不同的看法。——MOSS",
    "丫丫，记住这些数字，只有你能记住。",
    "爸爸，我们拯救世界了吗？——应该是吧。",
    "培强，地球，还挺美好的。——张鹏",
    "兄弟，我有点紧张，但作为地球之光，我必须勇敢。——张鹏",
    "真遗憾，不能一起去贝加尔湖钓鲑鱼了。",
    "我们还没转正，没有医疗保险。——赫伯特·科普利",
    "我知道，我用不到了。——刘培强",
    "五颗核弹用不了两个人，就仨座儿，坐不下了，回家吧，你女儿在家里等着你呢。",
    "别看了，只剩一套潜水服，这里的工作完不成，都得死。——马兆",
    "我希望世界记住这一天。",
    "有人在帮我们。",
    "键盘就是你的武器。",
    "带鱼睡觉的时候，是竖着的。——马兆",
    "东西终于便宜了。——图恒宇",
    "笨笨，别怕，我在呢。",
    "这是世界上最大的液冷服务器集群，这是一个全新的世界。——马兆",
    "人类敬畏历史，却轻视未来。",
    "一万五千年后，当太阳系将不复存在，人类的团结与勇气将延续文明的火种。",
  ];
  let last = "";
  function pickQuote() {
    let q;
    do { q = QUOTES[Math.floor(Math.random() * QUOTES.length)]; } while (q === last);
    last = q;
    return q;
  }
  let current = pickQuote();
  let i = 0, deleting = false;
  function tick() {
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
        current = pickQuote();
        return setTimeout(tick, 350);
      }
    }
    setTimeout(tick, deleting ? 45 : 85);
  }
  tick();
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
