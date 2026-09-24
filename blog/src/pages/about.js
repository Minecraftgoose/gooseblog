/**
 * GooseBlog — 关于页
 */
import { highlightCode } from '../js/highlight.js';

export function renderAbout(container) {
  container.innerHTML = '<div id="about-content"></div>';
  loadAbout(container);
}

async function loadAbout(container) {
  let html = '', md = '';
  try {
    const res = await fetch('/api/pages/about');
    if (res.ok) {
      const data = await res.json();
      html = data.html || '';
      md = data.content || '';
    }
  } catch (err) {
    // ignore, fall through to default
  }

  const contentHtml = html || md;
  container.innerHTML = `
    <article class="post-view">
      <h1 class="post-view-title">关于</h1>
      <div class="post-content">${contentHtml || '<p>鹅还没想好关于页面要写什么。</p>'}</div>
    </article>
  `;

  // 关于页正文也可能有代码块，渲染完立刻高亮
  highlightCode(container);

  // 标题锚点链接
  const headings = container.querySelectorAll('.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id], .post-content h5[id], .post-content h6[id]');
  headings.forEach(function(h) {
    h.style.position = 'relative';
    h.classList.add('anchor-heading');
    var a = document.createElement('a');
    a.className = 'heading-anchor';
    a.href = '#' + h.id;
    a.textContent = '#';
    a.title = '点击复制锚点链接';
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var url = location.origin + location.pathname + '#' + h.id;
      navigator.clipboard.writeText(url).catch(function() {});
      history.replaceState({}, '', url);
      h.scrollIntoView({ behavior: 'smooth' });
    });
    h.prepend(a);
  });
}
