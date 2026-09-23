/**
 * GooseBlog — 国际化核心（同步加载，早于所有 defer 脚本）
 * 定义全局 __() 供所有脚本使用。
 */
(function() {
  if (window.__) return;

  var _locale = localStorage.getItem('gooseblog_lang');
  if (_locale !== 'zh' && _locale !== 'en') {
    _locale = (navigator.language || '').startsWith('zh') ? 'zh' : 'en';
  }
  window.__lang = _locale;

  var _dict = {
    'nav.home':       {zh:'首页', en:'Home'},
    'nav.about':      {zh:'关于', en:'About'},
    'nav.archive':    {zh:'归档', en:'Archive'},
    'nav.projects':   {zh:'项目', en:'Projects'},
    'nav.friends':    {zh:'友链', en:'Friends'},
    'nav.admin':      {zh:'写文章', en:'Write'},
    'topbar.home':    {zh:'GooseBlog', en:'GooseBlog'},
    'topbar.about':   {zh:'关于', en:'About'},
    'topbar.archive': {zh:'归档', en:'Archive'},
    'topbar.projects':{zh:'项目', en:'Projects'},
    'topbar.friends': {zh:'友链', en:'Friends'},
    'topbar.admin':   {zh:'后台', en:'Admin'},
    'topbar.post':    {zh:'文章', en:'Post'},
    'topbar.tag':     {zh:'标签', en:'Tag'},
    'share.copyLink': {zh:'分享', en:'Share'},
    'share.copyText': {zh:'复制链接', en:'Copy Link'},
    'share.genPoster':{zh:'生成海报', en:'Generate Poster'},
    'share.copied':   {zh:'链接已复制', en:'Link copied'},
    'share.copyFail': {zh:'复制失败', en:'Copy failed'},
    'share.genFail':  {zh:'生成失败', en:'Generation failed'},
    'share.download': {zh:'下载海报', en:'Download Poster'},
    'share.posterHint':{zh:'长按或右键保存海报', en:'Long press or right-click to save'},
    'post.prev':      {zh:'上一篇', en:'Previous'},
    'post.next':      {zh:'下一篇', en:'Next'},
    'post.readQR':    {zh:'扫码阅读这篇文章', en:'Scan to read this article'},
    'post.loading':   {zh:'加载中...', en:'Loading...'},
    'post.notFound':  {zh:'找不到这篇文章', en:'Post not found'},
    'post.loadErr':   {zh:'加载失败', en:'Load failed'},
    'home.loading':   {zh:'加载中...', en:'Loading...'},
    'home.noPosts':   {zh:'暂无文章', en:'No posts yet'},
    'home.viewMore':  {zh:'阅读全文', en:'Read more'},
    'home.loadMore':  {zh:'加载更多', en:'Load more'},
    'friends.empty':  {zh:'暂无友链', en:'No friends yet'},
    'archive.title':  {zh:'归档', en:'Archive'},
    'archive.empty':  {zh:'暂无归档', en:'No archives yet'},
    'friends.subtitle':{zh:'朋友们的好东西', en:'Great stuff from friends'},
    'tag.noPosts':    {zh:'暂无该标签的文章', en:'No posts with this tag'},
    'code.copy':      {zh:'复制代码', en:'Copy code'},
    'code.copied':    {zh:'已复制', en:'Copied'},
    'context.openTab':{zh:'新标签页打开', en:'Open in new tab'},
    'context.copyUrl':{zh:'复制链接地址', en:'Copy link address'},
    'lang.toggle':    {zh:'English', en:'中文'},
    'toast.copied':   {zh:'已复制', en:'Copied'},
    'toast.postCopied':{zh:'链接已复制', en:'Link copied'},
    'side.leaves':    {zh:'落叶飘落', en:'Falling Leaves'},
    'side.clickFx':   {zh:'点击特效', en:'Click Effects'},
    'side.palette':   {zh:'调色板', en:'Palette'},
    'ai.exclude':     {zh:'屏蔽AI', en:'Hide AI'},
    'ai.excluded':    {zh:'已屏蔽AI', en:'AI Hidden'},
    'tag.all':        {zh:'全部', en:'All'},
    'view.grid':      {zh:'卡片', en:'Grid'},
    'view.list':      {zh:'列表', en:'List'},
    'view.reading':   {zh:'阅读', en:'Reading'},
    'tag.expand':     {zh:'展开', en:'Expand'},
    'tag.collapse':   {zh:'收起', en:'Collapse'},
    'post.pinned':    {zh:'置顶', en:'Pinned'},
    'heatmap.title':  {zh:'贡献热力图', en:'Activity Heatmap'},
    'heatmap.empty':  {zh:'没发东西', en:'Nothing posted'},
    'toc.label':      {zh:'目录', en:'Table of Contents'},
    'viewer.close':   {zh:'关闭', en:'Close'},
    'share.download': {zh:'下载海报', en:'Download Poster'},
    'share.generating':{zh:'生成中...', en:'Generating...'},
    'share.genFail':  {zh:'生成失败', en:'Failed'},
    'share.readQR':   {zh:'扫码阅读这篇文章', en:'Scan to read'},
    'share.copyFailMsg':{zh:'复制失败，手动长按链接吧', en:'Copy failed, long press the link'},
    'context.back':   {zh:'后退', en:'Back'},
    'context.forward':{zh:'前进', en:'Forward'},
    'context.home':   {zh:'首页', en:'Home'},
    'context.archive':{zh:'归档', en:'Archive'},
    'context.about':  {zh:'关于', en:'About'},
    'archive.subtitle':{zh:'按年整理鹅写过的所有东西', en:'All posts organized by year'},
    'about.empty':    {zh:'鹅没想好', en:'Nothing here yet'},
    'about.emptyDesc':{zh:'鹅还没想好关于页面要写什么。', en:'Waiting for inspiration.'},
    'about.tech':     {zh:'这个博客用 Cloudflare Pages + Worker + Supabase 搭的，紫色亚克力玻璃风。', en:'Built with Cloudflare Pages + Worker + Supabase, purple acrylic glass style.'},
    'projects.title': {zh:'项目', en:'Projects'},
    'projects.subtitle':{zh:'Minecraft_goose 正在跑的项目', en:'Projects by Minecraft_goose'},
    'projects.series':{zh:'Goose 系列', en:'Goose Series'},
    'projects.other': {zh:'其他项目', en:'Other Projects'},
    'projects.loading':{zh:'加载项目中...', en:'Loading projects...'},
    'projects.viewDetail':{zh:'查看详情', en:'View Details'},
    'projects.retry':  {zh:'重试', en:'Retry'},
    'home.slow':      {zh:'服务器响应较慢，请稍候...', en:'Server seems slow, please wait...'},
    'home.noPosts':   {zh:'还没有文章', en:'No posts yet'},
    'error.loading':  {zh:'加载中...', en:'Loading...'},
    'error.failed':   {zh:'加载失败', en:'Failed'},
    'error.empty':    {zh:'暂无内容', en:'No content'},
    'tag.expandAll':  {zh:'展开', en:'Show All'},
    'tag.collapseAll':{zh:'收起', en:'Collapse'},
    'tag.title':      {zh:'标签', en:'Tag'},
    'api.timeout':    {zh:'请求超时，请检查网络后重试', en:'Request timed out. Check your network.'},
  };

  function t(key) {
    var entry = _dict[key];
    if (!entry) return key;
    return entry[_locale] || entry.en || key;
  }

  function setLocale(loc) {
    if (loc !== 'zh' && loc !== 'en') return;
    _locale = loc;
    localStorage.setItem('gooseblog_lang', loc);
    syncNav();
    window.dispatchEvent(new Event('langchange'));
    // 重新加载页面让所有内容使用新语言渲染
    location.reload();
  }

  function syncNav() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (el.tagName === 'INPUT') el.placeholder = t(key);
      else el.textContent = t(key);
    });
  }

  window.__ = t;
  window.__setLocale = setLocale;
  window.__syncNav = syncNav;

  // 首次同步
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncNav);
  } else {
    syncNav();
  }

  // 语言切换按钮（顶栏）
  document.addEventListener('DOMContentLoaded', function() {
    var btns = ['headerLangBtn', 'mobileLangBtn'];
    btns.forEach(function(id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      updateLangTitle(btn);
      btn.addEventListener('click', function() {
        setLocale(_locale === 'zh' ? 'en' : 'zh');
        btns.forEach(function(i) { updateLangTitle(document.getElementById(i)); });
      });
    });
  });

  function updateLangTitle(btn) {
    if (!btn) return;
    var next = _locale === 'zh' ? 'en' : 'zh';
    btn.title = next === 'en' ? 'English' : '中文';
  }
})();

/* ---------- 开屏动画 ---------- */
var _splashTimer = null;
var _splashStart = 0;
var _splashMinMs = 2800; // 最短展示时长

function showSplash() {
  var el = document.getElementById('splash');
  if (!el) return;
  _splashStart = Date.now();
  el.style.display = 'flex';
  requestAnimationFrame(function() { el.classList.add('active'); });
}

function hideSplash(cb) {
  var el = document.getElementById('splash');
  if (!el || !el.classList.contains('active')) { if (cb) cb(); return; }
  var elapsed = Date.now() - _splashStart;
  var delay = Math.max(0, _splashMinMs - elapsed);
  var doHide = function() {
    el.classList.remove('active');
    // 淡出过程中提前 0.2 秒触发入场（弹簧动画和淡出叠加）
    if (cb) setTimeout(cb, 50);
    var done = false;
    function onDone() { if (done) return; done = true; el.style.display = 'none'; }
    el.addEventListener('transitionend', onDone, { once: true });
    setTimeout(onDone, 500);
  };
  if (delay > 0) { setTimeout(doHide, delay); }
  else { doHide(); }
}

function springInArticles(container) {
  if (!container) container = document.querySelector('.content-area');
  if (!container) return;
  var cards = container.querySelectorAll(
    '.post-card, .post-list-item, .post-reading-item, .friend-card, .project-card, .archive-item'
  );
  cards.forEach(function(c, i) {
    c.classList.add('spring-in');
    c.style.animationDelay = (0.05 * i) + 's';
  });
}

window._showSplash = showSplash;
window._hideSplash = hideSplash;
window._springIn = springInArticles;
