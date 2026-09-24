/**
 * GooseBlog — 文章卡片图端点  /og/<slug>.jpg
 *
 * 干的事：把文章自己填的封面（不管是你自己的图床、对象存储，还是后台"随机"抓来的图）
 * 包装成一个对社交平台绝对友好的地址：
 *
 *   og:image = https://blog.goose.cc.cd/og/<slug>.jpg
 *
 * 特点：同域、绝对 URL、.jpg 结尾、无查询串、无 & ，并做 7 天边缘缓存。
 * 顺手挡掉几类会让卡片退化成「一行链接」的情况：
 *   - 封面是相对路径（后台填了 /uploads/a.jpg 而不是完整 URL）
 *   - 封面 URL 里带 & → 写进 HTML 变 &amp;，微信/QQ 不还原实体，抓不到图
 *   - 图床带防盗链 / 限 UA → 这里用浏览器 UA 抓取，绕过一部分 403/429
 *   - 外链图床抽风或图片被删 → 边缘缓存里那份还在，旧文章卡片不会突然变没图
 *
 * 抓不到封面（文章没填 / 上游 404 / 不是图片 / 超时 / 内网地址）→
 * 直接以 200 吐出 /og-default.jpg 的图片字节（不 302：社交爬虫不跟跳转，
 * 会当成无图退化成一行链接），绝不给爬虫返回非图片内容。
 *
 * 排查：curl -sI https://blog.goose.cc.cd/og/<slug>.jpg
 *   X-OG-Source: cover      = 出的是文章封面
 *   X-OG-Source: fallback   = 拿不到封面，用的是站级默认图
 *   X-OG-Source: edge-cache = 命中边缘缓存
 *   X-OG-Cover 会带出实际去抓的那个封面地址，方便定位是哪一步出问题
 */

const API_TIMEOUT_MS = 4000;
const IMG_TIMEOUT_MS = 6000;
const EDGE_CACHE_TTL = 604800;      // 7 天
const FALLBACK_IMAGE = '/og-default.jpg';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;   // 超过 8MB 就别代理了，微信抓大图会超时
const FETCH_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const ORIGIN = url.origin;

  // [slug] 可能带 .jpg 尾巴（我们就是这么引用的），剥掉
  let slug = String((params && params.slug) || '').replace(/\.(jpe?g|png|webp)$/i, '');
  try { slug = decodeURIComponent(slug); } catch { /* 保留原值 */ }

  const cache = caches.default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });

  // 1) 命中边缘缓存直接回（上游哪天挂了，这里照样出图）
  try {
    const hit = await cache.match(cacheKey);
    if (hit) return tag(hit, 'edge-cache', '');
  } catch { /* 缓存不可用就跳过 */ }

  // 2) 取文章封面
  let cover = '';
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
        const post = await res.json();
        if (post && post.cover_url) cover = String(post.cover_url).trim();
      }
    } catch { /* 取不到就走兜底 */ }
  }

  // 3) 抓封面（相对路径按本站拼；只放行公网 http(s)）
  let coverUrl = '';
  if (cover) {
    if (!/^https?:\/\//i.test(cover)) {
      coverUrl = ORIGIN + (cover.startsWith('/') ? cover : '/' + cover);
    } else if (isSafeHttpUrl(cover)) {
      coverUrl = cover;
    }
  }

  if (coverUrl) {
    // 双保险：先带本站 Referer 抓（自家图床有防盗链时必须有），失败再不带 Referer 试一次
    // （有些图床反过来禁止带 Referer）。社交爬虫抓图从不带 Referer，所以这一步必须在服务端做。
    for (const withReferer of [true, false]) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), IMG_TIMEOUT_MS);
        const headers = {
          'User-Agent': FETCH_UA,
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        };
        if (withReferer) headers.Referer = `${ORIGIN}/`;
        const imgRes = await fetch(coverUrl, {
          headers,
          redirect: 'follow',
          signal: ctrl.signal,
        });
        clearTimeout(timer);

        const type = (imgRes.headers.get('content-type') || '').toLowerCase();
        const len = Number(imgRes.headers.get('content-length') || 0);
        const oversize = len > 0 && len > MAX_IMAGE_BYTES;

        if (imgRes.ok && type.startsWith('image/') && imgRes.body && !oversize) {
          const out = new Response(imgRes.body, {
            status: 200,
            headers: {
              'Content-Type': type,
              'Cache-Control': `public, max-age=${EDGE_CACHE_TTL}, immutable`,
            },
          });
          try { context.waitUntil(cache.put(cacheKey, out.clone())); } catch { /* 写缓存失败无所谓 */ }
          return tag(out, withReferer ? 'cover+referer' : 'cover', coverUrl);
        }
      } catch { /* 换下一种方式再试 */ }
    }
  }

  // 4) 兜底：站级默认卡片（直接 200 返回图片字节，绝不 302）
  try {
    const fb = await env.ASSETS.fetch(new URL(FALLBACK_IMAGE, url).toString());
    if (fb.ok) {
      const buf = await fb.arrayBuffer();
      const out = new Response(buf, {
        status: 200,
        headers: {
          'Content-Type': fb.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
        },
      });
      return tag(out, 'fallback', coverUrl);
    }
  } catch { /* 落最后一道保险 */ }

  // 最后一道保险：1x1 透明 PNG，永远 200（防止 ASSETS 也拿不到）
  const px = Uint8Array.from(atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  ), c => c.charCodeAt(0));
  return tag(
    new Response(px, {
      status: 200,
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
    }),
    'fallback',
    coverUrl
  );
}

/** 补上诊断头，方便一眼看出这条卡片图走的是哪条路 */
function tag(res, src, coverUrl) {
  const h = new Headers(res.headers);
  h.set('X-OG-Source', src);
  if (coverUrl) h.set('X-OG-Cover', coverUrl);
  return new Response(res.body, { status: res.status, headers: h });
}

/** 只放行公网 http(s)，挡掉内网 / 本地 / 非 http 协议（防 SSRF） */
function isSafeHttpUrl(u) {
  try {
    const p = new URL(u);
    if (p.protocol !== 'https:' && p.protocol !== 'http:') return false;
    let h = p.hostname.toLowerCase();
    if (h.startsWith('[') && h.endsWith(']')) h = h.slice(1, -1);
    if (h === 'localhost' || h === '::1' || h.endsWith('.localhost') || h.endsWith('.internal')) return false;
    if (/^127\./.test(h) || /^0\./.test(h) || /^10\./.test(h)) return false;
    if (/^192\.168\./.test(h) || /^169\.254\./.test(h)) return false;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return false;
    return true;
  } catch {
    return false;
  }
}
