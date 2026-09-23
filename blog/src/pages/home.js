/**
 * GooseBlog — 首页 (v5-svg-pin)
 */
import { fetchPosts, fetchTags, fetchHeatmap } from '../js/api.js';
import { formatDate, escapeHtml, renderState } from '../js/utils.js';
import { navigate } from '../js/router.js';
import { createHeatmap } from '../js/heatmap.js';
const _ = function(k) { return window.__ ? window.__(k) : k; };

// 首页页面级缓存：首次渲染后保留整块 DOM 节点，返回时直接复用。
// 避免每次进入首页都重新拉取全部文章 + 整页重绘（"返回就全刷新一遍"的根因）。
let homeCache = null;   // 缓存的首页根节点
let homeScroll = 0;     // 离开首页时的滚动位置

let lastPosts = null;   // 最近一次加载的文章（缓存，便于返回时即时重渲）
let aiExcluded = false; // 是否排除 AI 生成文章

// 视图模式：卡片网格 / 列表 / 阅读（沉浸）
const VIEW_MODES = [
  { mode: 'grid', labelKey: 'view.grid' },
  { mode: 'list', labelKey: 'view.list' },
  { mode: 'reading', labelKey: 'view.reading' },
];
let viewMode = localStorage.getItem('gooseblog_viewmode') || 'grid';

// 分页：每页条数 + 当前页码（前端切片，避免一次性渲染大量封面图）
const PAGE_SIZE = 6;
let currentPage = 1;

export function renderHome(container) {
  // 首次访问显示开屏动画（仅在首页）
  if (!window._splashShown && window._showSplash) {
    window._splashShown = true;
    window._showSplash();
  }

  // 已有缓存节点 -> 直接挂回，零重渲染、零重请求
  if (homeCache) {
    container.innerHTML = '';
    container.appendChild(homeCache);
    container.scrollTop = homeScroll;
    loadHeatmap();   // 返回时重渲染热力图（轻量，确保不空白）
    return;
  }

  container.innerHTML = `
    <div class="home-view">
      <div id="heatmap-container"></div>
      <div id="tags-bar"></div>
      <div id="viewmode-bar" class="view-mode-bar"></div>
      <div id="posts-container"></div>
    </div>
  `;

  loadHeatmap();
  loadTags();
  loadViewModeBar();
  loadPosts();
  setRandomBg();   // 应用本站背景图

  // 首次渲染完成，缓存整块首页节点（含异步加载后的内容）
  homeCache = container.querySelector('.home-view');
}

// 离开首页前（路由切走时）保存滚动位置
window.addEventListener('locationchange', () => {
  if (homeCache && window.location.pathname !== '/') {
    const app = document.getElementById('app');
    homeScroll = app ? app.scrollTop : 0;
  }
});

// 后台发布新文章后，让首页缓存失效，下次进入重新拉取
window.addEventListener('home:invalidate', () => {
  homeCache = null;
});

// 本站固定背景图（Static Assets，随 Pages 一起部署）
// 三个尺寸与 src/css/core.css 的断点保持一致：
//   >1440px → 3008 / 901~1440px → 1920 / ≤900px → 1280
export const BG_URL = '/background.webp';
export const BG_URL_MD = '/background-1920.webp';
export const BG_URL_SM = '/background-1280.webp';

export function pickBgUrl() {
  const w = window.innerWidth;
  if (w <= 900) return BG_URL_SM;
  if (w <= 1440) return BG_URL_MD;
  return BG_URL;
}

export function setRandomBg() {
  // 内联 style 优先级高于样式表，所以这里必须自己判断点，
  // 否则 CSS 的响应式规则会被这一行覆盖掉
  document.documentElement.style.setProperty('--bg-image', `url(${pickBgUrl()})`);
}

// 视口跨过断点时换档（例如平板横竖屏切换）
window.addEventListener('resize', () => {
  const target = `url(${pickBgUrl()})`;
  if (document.documentElement.style.getPropertyValue('--bg-image') !== target) {
    document.documentElement.style.setProperty('--bg-image', target);
  }
});

async function loadHeatmap() {
  const wrap = document.getElementById('heatmap-container');
  if (!wrap) return;
  // 先立即渲染 demo 占位，不等 API（杜绝空白）
  wrap.innerHTML = `<div class="heatmap-wrap" id="heatmap-wrap"></div>`;
  createHeatmap(document.getElementById('heatmap-wrap'), {});
  // 再异步拉真实数据覆盖
  try {
    const data = await fetchHeatmap();
    if (data && Object.keys(data).length > 0) {
      createHeatmap(document.getElementById('heatmap-wrap'), data);
    }
  } catch (e) {
    console.warn('[GooseBlog] 热力图数据加载失败，显示 demo', e);
    // 保留 demo，不清空
  }
}

async function loadTags() {
  const bar = document.getElementById('tags-bar');
  try {
    const data = await fetchTags();
    const tags = data.tags || data;
    const total = data.total || tags.reduce((s, t) => s + t.count, 0);
    if (!tags || tags.length === 0) { bar.innerHTML = ''; return; }
  bar.innerHTML = `
      <div class="tag-bar">
        <span class="tag-pill active" data-tag="">
          ${_('tag.all')} <span class="tag-pill-count">${total}</span>
        </span>
        <span class="tag-pill tag-ai-toggle ${aiExcluded ? 'active' : ''}" id="aiToggle" style="border-color:${aiExcluded ? 'var(--danger)' : 'var(--border)'};color:${aiExcluded ? 'var(--danger)' : 'var(--text-secondary)'}">
          <i class="fas fa-robot"></i> ${aiExcluded ? _('ai.excluded') : _('ai.exclude')}
        </span>
        ${tags.map((t, i) => `
          <span class="tag-pill ${i >= 4 ? 'tag-pill-collapsed' : ''}" data-tag="${escapeHtml(t.tag)}">
            ${escapeHtml(t.tag)} <span class="tag-pill-count">${t.count}</span>
          </span>
        `).join('')}
        ${tags.length > 4 ? `<button class="tag-expand-btn" type="button">${_('tag.expand')}</button>` : ''}
      </div>
    `;
    // 折叠展开逻辑
    const expandBtn = bar.querySelector('.tag-expand-btn');
    if (expandBtn) {
      // 默认折叠
      bar.querySelectorAll('.tag-pill-collapsed').forEach(el => el.style.display = 'none');
      expandBtn.addEventListener('click', () => {
        const collapsed = bar.querySelectorAll('.tag-pill-collapsed');
        const isHidden = collapsed[0]?.style.display === 'none';
        collapsed.forEach(el => el.style.display = isHidden ? 'inline' : 'none');
        expandBtn.textContent = isHidden ? _('tag.collapse') : _('tag.expand');
      });
    }
    bar.querySelectorAll('.tag-pill').forEach(el => {
      el.addEventListener('click', () => {
        const tag = el.dataset.tag;
        if (tag) navigate(`/tag/${tag}`);
        else navigate('/');
      });
    });
    const aiToggle = document.getElementById('aiToggle');
    if (aiToggle) {
      aiToggle.addEventListener('click', () => {
        aiExcluded = !aiExcluded;
        loadTags();
        loadPosts();
      });
    }
  } catch (e) { bar.innerHTML = ''; }
}

async function loadPosts() {
  const container = document.getElementById('posts-container');
  renderState(container, 'loading', window.__ ? window.__('home.loading') : '加载中...');

  // 超过 3s 还没返回，换提示让用户知道没死
  const slowTimer = setTimeout(() => {
    if (container.querySelector('.state-msg')) {
      const p = container.querySelector('.state-msg p');
      if (p) p.textContent = window.__ ? window.__('home.slow') : '服务器响应较慢，请稍候...';
    }
  }, 3000);

  try {
    const exclude = aiExcluded ? 'AI生成' : null;
    const posts = await fetchPosts(null, exclude);
    clearTimeout(slowTimer);
    if (!posts || posts.length === 0) {
      renderState(container, 'empty', window.__ ? window.__('home.noPosts') : '还没有文章');
      return;
    }
    currentPage = 1; // 重新加载时回到第一页
    renderPosts(container, posts);
  } catch (err) {
    clearTimeout(slowTimer);
    renderState(container, 'error', err.message, () => loadPosts());
  }
}

function renderPosts(container, posts) {
  lastPosts = posts;
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const slice = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  let html;
  if (viewMode === 'list') {
    html = `<div class="post-list">${slice.map(postListItem).join('')}</div>`;
  } else if (viewMode === 'reading') {
    html = `<div class="post-reading">${slice.map(postReadingItem).join('')}</div>`;
  } else {
    html = `<div class="post-grid">${slice.map(postCard).join('')}</div>`;
  }
  // 多页时底部加分页条
  if (totalPages > 1) {
    html += paginationHTML(currentPage, totalPages);
  }
  container.innerHTML = html;
  // 首次加载：关闭开屏 + 弹簧入场
  if (window._hideSplash) { window._hideSplash(function() { if (window._springIn) window._springIn(container); }); }
  else { if (window._springIn) window._springIn(container); }
  // 点击跳转文章（三种视图统一用 data-slug）
  container.querySelectorAll('[data-slug]').forEach(el => {
    el.addEventListener('click', () => navigate(`/post/${el.dataset.slug}`));
  });
  // 分页按钮
  bindPagination(container, posts);
}

function paginationHTML(page, totalPages) {
  let btns = '';
  // 上一页
  btns += `<button class="page-btn page-prev" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>&laquo;</button>`;
  // 页码：最多显示 7 个（含省略）
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (totalPages <= 7 || i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  pages.forEach(p => {
    if (p === '...') { btns += '<span class="page-ellipsis">…</span>'; return; }
    btns += `<button class="page-btn ${p === page ? 'page-active' : ''}" data-page="${p}">${p}</button>`;
  });
  // 下一页
  btns += `<button class="page-btn page-next" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>&raquo;</button>`;
  return `<div class="page-bar">${btns}</div>`;
}

function bindPagination(container, posts) {
  container.querySelectorAll('.page-bar .page-btn').forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page, 10);
      if (!p || p === currentPage) return;
      currentPage = p;
      renderPosts(container, posts);
      // 回到顶部
      const app = document.getElementById('app');
      if (app) app.scrollTop = 0;
    });
  });
}

function postListItem(post) {
  const date = formatDate(post.created_at);
  return `
    <div class="post-list-item" data-slug="${escapeHtml(post.slug)}">
      <span class="post-list-date">${date}</span>
      <span class="post-list-title">${post.pinned ? '<svg class="pin-icon" viewBox="0 0 24 24" width="14" height="14" title="置顶"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" fill="#ef4444"/></svg> ' : ''}${escapeHtml(post.title)}</span>
      ${post.tag ? `<span class="post-list-tag">${escapeHtml(post.tag)}</span>` : ''}
    </div>
  `;
}

function postReadingItem(post) {
  return `
    <div class="post-reading-item" data-slug="${escapeHtml(post.slug)}">
      <div class="post-reading-title">${post.pinned ? '<svg class="pin-icon" viewBox="0 0 24 24" width="14" height="14" title="置顶"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" fill="#ef4444"/></svg> ' : ''}${escapeHtml(post.title)}</div>
      <div class="post-reading-excerpt">${escapeHtml(post.excerpt || '')}</div>
    </div>
  `;
}

// 渲染视图模式切换条
function loadViewModeBar() {
  const bar = document.getElementById('viewmode-bar');
  if (!bar) return;
  bar.innerHTML = VIEW_MODES.map(v => `
    <button class="tool-chip ${v.mode === viewMode ? 'active' : ''}" data-mode="${v.mode}">
      ${_(v.labelKey)}
    </button>
  `).join('');
  bar.querySelectorAll('.tool-chip').forEach(el => {
    el.addEventListener('click', () => setViewMode(el.dataset.mode));
  });
}

// 语言切换时刷新
window.addEventListener('langchange', function() {
  loadViewModeBar();
  var tagsBar = document.getElementById('tags-bar');
  if (tagsBar) loadTags();
});

function setViewMode(mode) {
  if (!mode || mode === viewMode || !VIEW_MODES.some(v => v.mode === mode)) return;
  viewMode = mode;
  localStorage.setItem('gooseblog_viewmode', mode);
  const bar = document.getElementById('viewmode-bar');
  if (bar) bar.querySelectorAll('.tool-chip').forEach(el => {
    el.classList.toggle('active', el.dataset.mode === viewMode);
  });
  const container = document.getElementById('posts-container');
  if (container && lastPosts) {
    // 切视图保留当前已加载的条数，避免重复翻页
    renderPosts(container, lastPosts);
  }
}

function postCard(post) {
  const date = formatDate(post.created_at);
  const tags = (post.tag || '').split(',').map(t => t.trim()).filter(Boolean);
  const tagsHtml = tags.map(t => `<span class="post-card-tag">${escapeHtml(t)}</span>`).join('');
  const coverStyle = post.cover_url
    ? `background-image:url('${post.cover_url}');background-size:cover;background-position:center;`
    : '';
  return `
    <article class="post-card" data-slug="${escapeHtml(post.slug)}">
      <div class="post-card-cover" style="${coverStyle}">
        ${post.cover_url ? '' : 'G'}
      </div>
      <div class="post-card-body">
        <h3>${post.pinned ? '<svg class="pin-icon" viewBox="0 0 24 24" width="14" height="14" title="置顶"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" fill="#ef4444"/></svg> ' : ''}${escapeHtml(post.title)}</h3>
        <div class="post-card-meta">
          <span class="post-card-meta-item">${date}</span>
          ${post.tag ? `<span class="post-card-meta-item">${escapeHtml(post.tag)}</span>` : ''}
        </div>
        <p class="post-card-excerpt">${escapeHtml(post.excerpt || '')}</p>
        <div class="post-card-tags">${tagsHtml}</div>
      </div>
    </article>
  `;
}


