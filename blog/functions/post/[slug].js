/**
 * GooseBlog — 文章页社交卡片注入  /post/<slug>
 *
 * 为什么单独做一个路由函数，而不是全塞进 _middleware.js：
 *   路由函数（如 og/[slug].js）部署稳定生效，而改动 _middleware.js 有时不会进部署产物。
 *   这里只负责 /post/* 的 og 注入，/api/* 代理仍由 _middleware.js 处理。
 *
 * 关键细节：注入后会把 <!-- OG_MARK --> / <!-- /OG_MARK --> 这对标记一起删掉。
 *   旧版 _middleware.js 里也有注入逻辑，靠匹配这对标记做替换；标记没了它就匹配不上，
 *   不会用旧的（封面原链接、无 x-og-inject）结果覆盖这里的输出。两套代码并存也安全。
 *
 * 排查：curl -sI https://blog.goose.cc.cd/post/<slug> | findstr /i x-og-inject
 *   post:cover   = 用了文章自己的封面
 *   post:nocover = 文章没填封面，用站级默认图
 *   fallback     = 没拿到文章数据
 */

const SITE_NAME = 'GooseBlog';
const FALLBACK_DESC = '紫色玻璃风博客 · 网页开发 · 工具折腾 · 偶尔写点有用的东西';
const API_TIMEOUT_MS = 4000;

// 卡片图是否走本站代理（true = /og/<slug>.jpg；false = 直接用封面原链接）
const USE_OG_PROXY = true;
const DEFAULT_OG_IMAGE = '/og-default.jpg';   // 仅在文章没填封面时使用

export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const ORIGIN = url.origin;

  let slug = String((params && params.slug) || '');
  try { slug = decodeURIComponent(slug); } catch { /* 保留原值 */ }
  slug = slug.replace(/\/+$/, '');

  // 1) 取静态 index.html
  const htmlRes = await env.ASSETS.fetch(new Request(new URL('/index.html', ORIGIN).toString()));
  let html = await htmlRes.text();

  // 2) 取文章数据
  let post = null;
  if (slug && env.ROOM) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT_MS);
      const res = await env.ROOM.fetch(
        new Request(`https://internal/api/posts/${encodeURIComponent(slug)}`),
        { signal: ctrl.signal }
      );
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) post = data;
      }
    } catch { /* 拿不到就用 index.html 的通用标签 */ }
  }

  const inject = post
    ? (String(post.cover_url || '').trim() ? 'post:cover' : 'post:nocover')
    : 'fallback';

  // 3) 注入标签
  if (post) {
    const postUrl = `${ORIGIN}/post/${encodeURI(slug)}`;

    // 卡片图 = 这篇文章的封面；只有在没填封面时才退到站级默认图
    const cover = String(post.cover_url || '').trim();
    const img = cover
      ? (USE_OG_PROXY ? `${ORIGIN}/og/${encodeURIComponent(slug)}.jpg` : absUrl(cover, ORIGIN))
      : absUrl(DEFAULT_OG_IMAGE, ORIGIN);

    const desc = cleanText(post.excerpt || post.content || post.title, 160) || FALLBACK_DESC;
    const title = cleanText(post.title, 120) || SITE_NAME;
    const published = post.created_at || post.updated_at || '';
    const tag = cleanText(post.tag || '', 60);

    const tags = [
      `<meta name="description" content="${esc(desc)}">`,
      `<meta property="og:type" content="article">`,
      `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
      `<meta property="og:locale" content="zh_CN">`,
      `<meta property="og:title" content="${esc(title)}">`,
      `<meta property="og:description" content="${esc(desc)}">`,
      `<meta property="og:image" content="${esc(img)}">`,
      `<meta property="og:image:alt" content="${esc(title)}">`,
      `<meta property="og:url" content="${esc(postUrl)}">`,
      published ? `<meta property="article:published_time" content="${esc(published)}">` : '',
      tag ? `<meta property="article:tag" content="${esc(tag)}">` : '',
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${esc(title)}">`,
      `<meta name="twitter:description" content="${esc(desc)}">`,
      `<meta name="twitter:image" content="${esc(img)}">`,
    ].filter(Boolean).join('\n  ');

    // 注意：替换结果里不保留 OG_MARK 标记，防止旧版 _middleware.js 二次覆盖
    html = html.replace(
      /[ \t]*<!-- OG_MARK -->[\s\S]*?<!-- \/OG_MARK -->[ \t]*\r?\n?/,
      () => tags + '\n'
    );
    html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${esc(title + ' - ' + SITE_NAME)}</title>`);
  }

  const headers = new Headers(htmlRes.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.set('x-og-inject', inject);
  headers.set('cache-control', 'public, max-age=0, must-revalidate');

  return new Response(html, { status: 200, headers });
}

/** 相对路径 → 绝对 URL；已是 http(s) 的保持原样 */
function absUrl(p, origin) {
  const s = String(p || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return origin + (s.startsWith('/') ? s : '/' + s);
}

/** HTML 属性转义 + 去掉换行（属性值里的真实换行会让部分解析器截断） */
function esc(s) {
  return String(s)
    .replace(/[\r\n]+/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** 去 HTML 标签 → 压缩空白 → 截断 */
function cleanText(s, max) {
  let t = String(s || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (max && t.length > max) t = t.slice(0, max - 1) + '…';
  return t;
}
