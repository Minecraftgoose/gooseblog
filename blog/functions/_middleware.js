/**
 * GooseBlog — Pages Function Middleware
 *
 * 职责：
 *   - /api/* → 透传给后端 Worker（env.ROOM service binding）
 *   - /post/* → 从 Worker 取文章数据，服务端注入 og:meta 标签，
 *               使微信/QQ 等不执行 JS 的爬虫也能拿到文章专属社交预览
 *   - 其他 → next() 走静态资源
 */

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // /api/* → 代理到后端 Worker
  if (url.pathname.startsWith('/api/')) {
    if (!env.ROOM) {
      return new Response(JSON.stringify({ error: 'Service unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    try {
      const workerUrl = `https://internal${url.pathname}${url.search}`;
      const workerReq = new Request(workerUrl, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
      });
      const workerRes = await env.ROOM.fetch(workerReq);
      return new Response(workerRes.body, {
        status: workerRes.status,
        statusText: workerRes.statusText,
        headers: workerRes.headers,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // /post/* — 服务端注入文章专属 og 标签（针对不执行 JS 的爬虫）
  const postMatch = url.pathname.match(/^\/post\/(.+)$/);
  if (postMatch && env.ROOM) {
    let slug = postMatch[1];
    try { slug = decodeURIComponent(slug); } catch { /* 保留原值 */ }
    // 先拿静态 HTML（这个很快）
    const htmlRes = await next();
    let html = await htmlRes.text();
    // 再试着从 Worker 取文章数据（可能冷启动慢，但爬虫会等）
    try {
      const postReq = new Request(`https://internal/api/posts/${encodeURIComponent(slug)}`);
      const postRes = await env.ROOM.fetch(postReq);
      if (postRes.ok) {
        const post = await postRes.json();
        if (post && post.title) {
          const img = post.cover_url || '/avatar.webp';
          const desc = post.excerpt || post.title || 'GooseBlog';
          const tags = `
  <meta property="og:title" content="${escapeAttr(post.title)}">
  <meta property="og:description" content="${escapeAttr(desc)}">
  <meta property="og:image" content="${escapeAttr(img)}">
  <meta property="og:url" content="https://blog.goose.cc.cd/post/${escapeAttr(slug)}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${escapeAttr(img)}">`;
          // 把 index.html 的通用 og 标签整块替换掉（只匹配 OG 块，不吃掉其他 head 内容）
          html = html.replace(
            /<!-- OG_MARK -->[\s\S]*?<!-- \/OG_MARK -->/,
            tags
          );
        }
      }
    } catch { /* 取文章失败则用 index.html 的通用 og 标签 */ }

    // 返回新 Response，清掉原 Content-Length 头（body 长度已变）
    const newHeaders = new Headers(htmlRes.headers);
    newHeaders.delete('content-length');
    newHeaders.delete('content-encoding');
    return new Response(html, {
      status: htmlRes.status,
      headers: newHeaders,
    });
  }

  // 其他 → 静态资源
  return next();
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/* ogfix */
