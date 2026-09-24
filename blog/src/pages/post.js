import { fetchPost, fetchPosts } from '../js/api.js';
import { formatDate, escapeHtml, renderState } from '../js/utils.js';
import { navigate } from '../js/router.js';
import { highlightCode } from '../js/highlight.js';

export function renderPost(container, params) {
  let { slug } = params;
  try { slug = decodeURIComponent(slug); } catch {  }
  renderState(container, 'loading', window.__ ? window.__('post.loading') : '加载涓?..');
  loadPost(container, slug);
}

async function loadPost(container, slug) {
  try {
    const post = await fetchPost(slug);
    if (!post || !post.title) {
      renderState(container, 'error', window.__ ? window.__('post.notFound') : '找不到这篇文章');
      return;
    }
    renderPostContent(container, post, post.prev || null, post.next || null);
  } catch (err) {
    renderState(container, 'error', err.message, () => loadPost(container, slug));
  }
}

function renderPostContent(container, post, prev, next) {
  const date = formatDate(post.created_at);
  const rawContent = post.content || `<p>${escapeHtml(post.excerpt || '内容待补充。')}</p>`;

  // 社交预览 meta：服务端已注入，这里负责 SPA 内切换后的同步（分享/复制链接时读到当前文章）
  // og:image / og:url 必须是绝对 URL，否则微信、QQ、Telegram 这类解析器直接丢弃卡片
  const ORIGIN = location.origin;
  // 卡片图 = 这篇文章的封面，走 /og/<slug>.jpg 代理（同域 + .jpg 结尾 + 无 & ）
  // 没有封面的文章由该端点兜底到 /og-default.jpg
  const img = ORIGIN + '/og/' + encodeURIComponent(post.slug || '') + '.jpg';
  const desc = (post.excerpt || post.title || 'GooseBlog').replace(/\s+/g, ' ').trim();
  const postUrl = ORIGIN + '/post/' + encodeURIComponent(post.slug || '');
  setMeta('og:type', 'article');
  setMeta('og:site_name', 'GooseBlog');
  setMeta('og:locale', 'zh_CN');
  setMeta('og:title', post.title);
  setMeta('og:description', desc);
  setMeta('og:image', img);
  setMeta('og:image:alt', post.title);
  setMeta('og:url', postUrl);
  setMeta('twitter:card', 'summary_large_image', 'name');
  setMeta('twitter:title', post.title, 'name');
  setMeta('twitter:description', desc, 'name');
  setMeta('twitter:image', img, 'name');
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = postUrl;
  document.title = post.title + ' - GooseBlog';

  const isFullHtml = /^\s*(<!DOCTYPE html|<html)/i.test(rawContent);

  if (isFullHtml) {
    container.innerHTML = `
      <article class="post-view" style="padding:0">
        <h1 class="post-view-title">${escapeHtml(post.title)}</h1>
        <div class="post-view-meta" style="margin-bottom:12px">
          <span>${date}</span>
          ${post.tag ? `<span>${escapeHtml(post.tag)}</span>` : ''}
        </div>
        <div style="margin:0;padding:0;width:100%;line-height:0">
          <iframe id="full-html-iframe" style="width:100%;height:700px;border:none;margin:0;padding:0;display:block;vertical-align:top"></iframe>
        </div>
        ${prevNextHTML(prev, next)}
      </article>
    `;
    const blob = new Blob([rawContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    document.getElementById('full-html-iframe').src = url;
    return;
  }

  // comment
  const coverUrl = post.cover_url || '';
  const coverBlock = coverUrl
    ? `<div class="post-cover" style="background-image:url('${escapeHtml(coverUrl)}')">
        <div class="post-cover-overlay">
          <h1 class="post-cover-title">${escapeHtml(post.title)}</h1>
          <div class="post-cover-meta">
            <span>${date}</span>
            ${post.tag ? `<span>${escapeHtml(post.tag)}</span>` : ''}
          </div>
        </div>
      </div>`
    : `<h1 class="post-view-title">${escapeHtml(post.title)}</h1>
      <div class="post-view-meta">
        <span>${date}</span>
        ${post.tag ? `<span>${escapeHtml(post.tag)}</span>` : ''}
      </div>`;

  container.innerHTML = `
    <article class="post-view">
      ${coverBlock}
      <div class="post-content">${rawContent}</div>
      ${prevNextHTML(prev, next)}
      <button id="postGenPoster" style="display:none"></button>
    </article>
  `;

  // 探测无扩展名 URL 的媒体类型：扩展名正则匹配不到、但响应头是 audio/video 的链接，
  // 把 <img> 就地替换成原生播放器（后端同步渲染查不到 Content-Type，只能前端探测）
  probeMediaByContentType(container);

  // 文章正文是异步插入的，Prism 不会自动高亮它，这里手动触发一次
  highlightCode(container);

  // 给 .post-content 内带 id 的标题加锚点链接
  const targetHash = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
  let targetEl = null;
  const headings = container.querySelectorAll('.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id], .post-content h5[id], .post-content h6[id]');
  headings.forEach(h => {
    h.style.position = 'relative';
    h.classList.add('anchor-heading');
    const a = document.createElement('a');
    a.className = 'heading-anchor';
    a.href = '#' + h.id;
    a.textContent = '#';
    a.title = '鐐瑰嚮澶嶅埗锚点链接';
    a.addEventListener('click', e => {
      e.preventDefault();
      const url = location.origin + location.pathname + '#' + h.id;
      navigator.clipboard.writeText(url).catch(() => {});
      history.replaceState({}, '', url);
      h.scrollIntoView({ behavior: 'smooth' });
    });
    h.prepend(a);
    if (h.id === targetHash) targetEl = h;
  });

  // comment
  if (targetEl) {
    targetEl.scrollIntoView({ block: 'start' });
  }
}

// 已知图片扩展名（这些不用探测）
const KNOWN_IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico|heic|tiff?)([?#].*)?$/i;
// 已知音视频扩展名（Worker 已渲染成播放器，不用探测）
const KNOWN_MEDIA_EXT = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|mp4|webm|ogv|mov|m4v)([?#].*)?$/i;

// 探测无扩展名 URL：HEAD 请求看 Content-Type，audio/video 就把 <img> 换成播放器
function probeMediaByContentType(container) {
  const imgs = container.querySelectorAll('.post-content img');
  imgs.forEach(function(img) {
    const src = img.getAttribute('src') || '';
    if (!src || /^(data:|blob:|about:)/.test(src)) return;
    if (KNOWN_IMAGE_EXT.test(src) || KNOWN_MEDIA_EXT.test(src)) return;
    fetch(src, { method: 'HEAD', redirect: 'follow' })
      .then(function(r) {
        const ct = (r.headers.get('content-type') || '').toLowerCase();
        if (ct.startsWith('audio/')) {
          const audio = document.createElement('audio');
          audio.controls = true;
          audio.preload = 'metadata';
          audio.src = src;
          if (img.alt) audio.textContent = img.alt;
          img.replaceWith(audio);
        } else if (ct.startsWith('video/')) {
          const video = document.createElement('video');
          video.controls = true;
          video.preload = 'metadata';
          video.src = src;
          if (img.alt) video.textContent = img.alt;
          img.replaceWith(video);
        }
      })
      .catch(function() { /* 探测失败就当普通图片，不处理 */ });
  });
}

// 全局绑一次：拦截文章内的 #hash 目录链接，防 SPA 路由误触发
function onAiContentHashClick(e) {
  const content = document.querySelector('.post-content');
  if (!content || !content.contains(e.target)) return;
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const hash = a.getAttribute('href');
  if (!hash || hash === '#') return;
  // comment
  if (a.classList.contains('heading-anchor')) return;
  e.preventDefault();
  const id = decodeURIComponent(hash.slice(1));
  const el = document.getElementById(id);
  if (el) {
    history.replaceState({}, '', location.pathname + hash);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
// 鍙?粦涓€娆?
if (!window._aiContentHashBound) {
  document.addEventListener('click', onAiContentHashClick);
  window._aiContentHashBound = true;
}

function prevNextHTML(prev, next) {
  var html = '';
  if (next || prev) html += '<nav class="post-nav">';
  if (prev) html +=
    '<a class="post-nav-link post-nav-prev" data-route="/post/' + encodeURIComponent(prev.slug) + '">' +
      '<span class="post-nav-label">' + (window.__ ? window.__('post.prev') : '上一篇') + '</span>' +
      '<span class="post-nav-title">' + escapeHtml(prev.title || '') + '</span>' +
      (prev.excerpt ? '<span class="post-nav-excerpt">' + escapeHtml(prev.excerpt) + '</span>' : '') +
    '</a>';
  if (next) html +=
    '<a class="post-nav-link post-nav-next" data-route="/post/' + encodeURIComponent(next.slug) + '">' +
      '<span class="post-nav-label">' + (window.__ ? window.__('post.next') : '下一篇') + '</span>' +
      '<span class="post-nav-title">' + escapeHtml(next.title || '') + '</span>' +
      (next.excerpt ? '<span class="post-nav-excerpt">' + escapeHtml(next.excerpt) + '</span>' : '') +
    '</a>';
  if (next || prev) html += '</nav>';
  return html;
}

function setMeta(attr, content, attrType) {
  attrType = attrType || 'property';
  let el = document.querySelector(`meta[${attrType}="${attr}"]`);
  if (el) { el.setAttribute('content', content); return; }
  el = document.createElement('meta');
  el.setAttribute(attrType, attr);
  el.setAttribute('content', content);
  document.head.appendChild(el);
}
