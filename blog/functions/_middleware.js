/**
 * GooseBlog — Pages Function Middleware
 *
 * 职责（刻意只留一件）：
 *   - /api/*  → 透传给后端 Worker（env.ROOM service binding）
 *   - 其他     → next()，交给路由函数或静态资源
 *
 * 文章页 /post/* 的社交卡片注入已移到 functions/post/[slug].js：
 *   路由函数部署稳定，而改动本文件有时不会进部署产物（踩过一次坑）。
 *   那边注入时会删掉 OG_MARK 标记，所以即便旧版本文件还在运行也不会二次覆盖。
 *
 * 注意：后端 Worker 只处理 GET，用 curl -I（HEAD）探测 /api/* 会拿到 404，属正常。
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

  // 其他 → 路由函数 / 静态资源
  return next();
}
