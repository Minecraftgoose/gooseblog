/**
 * GooseBlog — 归档页
 */
import { fetchArchive } from '../js/api.js';
import { formatShortDate, escapeHtml, renderState } from '../js/utils.js';
import { navigate } from '../js/router.js';

// 页面级缓存：首次渲染后保留整块 DOM 节点，返回时直接复用，避免全刷新。
let archiveCache = null;
let archiveScroll = 0;

export function renderArchive(container) {
  // 已有缓存节点 -> 直接挂回，零重渲染、零重请求
  if (archiveCache) {
    container.innerHTML = '';
    container.appendChild(archiveCache);
    container.scrollTop = archiveScroll;
    return;
  }

  container.innerHTML = `
    <div class="archive-view">
      <section class="page-hero">
        <h1 class="page-title">${window.__ ? window.__('archive.title') : '归档'}</h1>
        <p>${window.__ ? window.__('archive.subtitle') : '按年整理鹅写过的所有东西'}</p>
      </section>
      <div id="archive-container"></div>
    </div>
  `;

  loadArchive();
  archiveCache = container.querySelector('.archive-view');
}

// 离开归档前保存滚动位置
window.addEventListener('locationchange', () => {
  if (archiveCache && !window.location.pathname.startsWith('/archive')) {
    const app = document.getElementById('app');
    archiveScroll = app ? app.scrollTop : 0;
  }
});

// 后台发布新文章后，归档缓存失效，下次进入重新拉取
window.addEventListener('home:invalidate', () => { archiveCache = null; });

async function loadArchive() {
  const container = document.getElementById('archive-container');
  renderState(container, 'loading', '加载中...');

  try {
    const archive = await fetchArchive();
    if (!archive || archive.length === 0) {
      renderState(container, 'empty', window.__ ? window.__('archive.empty') : '还没有文章');
      return;
    }
    renderArchiveContent(container, archive);
  } catch (err) {
    renderState(container, 'error', err.message, () => loadArchive());
  }
}

function renderArchiveContent(container, archive) {
  container.innerHTML = archive.map(yearGroup => {
    const posts = yearGroup.posts.map(post => {
      const date = formatShortDate(post.created_at);
      return `
        <div class="archive-item" data-slug="${escapeHtml(post.slug)}">
          <span class="archive-date">${date}</span>
          <span class="archive-title">${escapeHtml(post.title)}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="archive-year">
        <h2>${yearGroup.year}</h2>
        ${posts}
      </div>
    `;
  }).join('');

  container.querySelectorAll('.archive-item').forEach(item => {
    item.addEventListener('click', () => navigate(`/post/${item.dataset.slug}`));
  });
  if (window._springIn) window._springIn(container);
}
