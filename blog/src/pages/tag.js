/**
 * GooseBlog — 标签筛选页
 * 支持排除其他标签：点标签 = 排除，再点 = 恢复
 */
import { fetchPosts, fetchTags } from '../js/api.js';
import { formatDate, escapeHtml, renderState } from '../js/utils.js';
import { navigate } from '../js/router.js';

let tagCache = null;
let tagCacheKey = null;
let tagScroll = 0;
let excluded = [];  // 当前排除了哪些标签

export function renderTag(container, params) {
  let currentTag = params.tag;
  try { currentTag = decodeURIComponent(params.tag); } catch { /* 保留原值 */ }

  if (tagCache && tagCacheKey === currentTag) {
    container.innerHTML = '';
    container.appendChild(tagCache);
    container.scrollTop = tagScroll;
    return;
  }

  excluded = [];

  container.innerHTML = `
    <div class="tag-view">
      <section class="page-hero">
        <h1 class="page-title">标签 / ${escapeHtml(currentTag)}</h1>
      </section>
      <div id="tag-exclude-bar" class="tag-bar"></div>
      <div id="tag-posts-container"></div>
    </div>
  `;

  loadExcludeBar(currentTag);
  loadPostsByTag(currentTag);
  tagCacheKey = currentTag;
  tagCache = container.querySelector('.tag-view');
}

window.addEventListener('locationchange', () => {
  if (tagCache && !window.location.pathname.startsWith('/tag/')) {
    const app = document.getElementById('app');
    tagScroll = app ? app.scrollTop : 0;
  }
});
window.addEventListener('home:invalidate', () => { tagCache = null; tagCacheKey = null; });

async function loadExcludeBar(currentTag) {
  const bar = document.getElementById('tag-exclude-bar');
  try {
    const data = await fetchTags();
    const allTags = data.tags || data;
    // 只显示其他标签（排除当前标签自身）
    const others = allTags.filter(t => t.tag !== currentTag);
    if (others.length === 0) { bar.style.display = 'none'; return; }
    bar.innerHTML = others.map((t, i) => `
      <span class="tag-pill tag-exclude-pill ${i >= 4 ? 'tag-pill-collapsed' : ''}" data-tag="${escapeHtml(t.tag)}">
        ${escapeHtml(t.tag)}
      </span>
    `).join('') +
    (others.length > 4 ? `<button class="tag-expand-btn" type="button">${window.__ ? window.__('tag.expandAll') : '展开'}</button>` : '');
    // 折叠展开
    const expandBtn = bar.querySelector('.tag-expand-btn');
    if (expandBtn) {
      bar.querySelectorAll('.tag-pill-collapsed').forEach(el => el.style.display = 'none');
      expandBtn.addEventListener('click', () => {
        const collapsed = bar.querySelectorAll('.tag-pill-collapsed');
        const isHidden = collapsed[0]?.style.display === 'none';
        collapsed.forEach(el => el.style.display = isHidden ? 'inline' : 'none');
        expandBtn.textContent = isHidden ? (window.__ ? window.__('tag.collapseAll') : '收起') : (window.__ ? window.__('tag.expandAll') : '展开');
      });
    }
    bar.querySelectorAll('.tag-exclude-pill').forEach(el => {
      el.addEventListener('click', () => {
        const tag = el.dataset.tag;
        const idx = excluded.indexOf(tag);
        if (idx > -1) {
          excluded.splice(idx, 1);
          el.classList.remove('excluded');
        } else {
          excluded.push(tag);
          el.classList.add('excluded');
        }
        loadPostsByTag(currentTag);
      });
    });
  } catch { bar.style.display = 'none'; }
}

async function loadPostsByTag(tag) {
  const container = document.getElementById('tag-posts-container');
  renderState(container, 'loading', '加载中...');

  try {
    const posts = await fetchPosts(tag, excluded.length ? excluded.join(',') : null);
    if (!posts || posts.length === 0) {
      renderState(container, 'empty', window.__ ? window.__('tag.noPosts') : `没有匹配的文章${excluded.length ? '（试试去掉排除标签）' : ''}`);
      return;
    }
    container.innerHTML = `
      <div class="post-grid">
        ${posts.map(p => {
          const date = formatDate(p.created_at);
          const coverStyle = p.cover_url
            ? `background-image:url('${p.cover_url}');background-size:cover;background-position:center;`
            : '';
          return `
            <article class="post-card" data-slug="${escapeHtml(p.slug)}">
              <div class="post-card-cover" style="${coverStyle}">
                ${p.cover_url ? '' : 'G'}
              </div>
              <div class="post-card-body">
                <h3>${p.pinned ? '<svg class="pin-icon" viewBox="0 0 24 24" width="14" height="14" title="置顶"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" fill="#ef4444"/></svg> ' : ''}${escapeHtml(p.title)}</h3>
                <div class="post-card-meta">
                  <span class="post-card-meta-item">${date}</span>
                </div>
                <p class="post-card-excerpt">${escapeHtml(p.excerpt || '')}</p>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
    container.querySelectorAll('.post-card').forEach(card => {
      card.addEventListener('click', () => navigate(`/post/${card.dataset.slug}`));
    });
    if (window._springIn) window._springIn(container);
  } catch (err) {
    renderState(container, 'error', err.message, () => loadPostsByTag(tag));
  }
}
