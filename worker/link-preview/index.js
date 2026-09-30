/**
 * GooseBlog —— 链接预览代理（Cloudflare Worker）
 *
 * 原站这个能力在 gooseblog-api 里（/api/link-preview），靠 Worker 抓外链的
 * og:image / og:title / og:description，给前端渲染社交媒体卡片。
 * 静态化之后 Supabase 那套后端全删了，但抓图是纯代理能力、跟数据库无关，
 * 所以单独保留成这个 Worker —— 不连库、不读环境变量、零依赖。
 *
 * 为什么必须有个代理：
 *   浏览器直接 fetch 外站 HTML 会被 CORS 拦死，所以只能让服务端去抓。
 *
 * 路由：GET /api/link-preview?url=https://example.com
 * 返回：{ title, description, image, domain }
 */
const OK_TTL = 86400;   // 抓成功的 og 数据缓存 24h（外站 og 基本不变）
const ERR_TTL = 60;     // 抓失败的只留 60s：挡住刷新风暴，又能很快自愈

export default {
  async fetch(request, env, ctx) {
    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }

    const url = new URL(request.url);

    if (url.pathname !== '/api/link-preview') {
      return json({ error: 'Not found' }, 404, request);
    }
    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed' }, 405, request);
    }

    const target = url.searchParams.get('url');
    if (!target) return json({ error: 'missing url' }, 400, request);

    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      return json({ error: 'bad url' }, 400, request);
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return json({ error: 'unsupported protocol' }, 400, request);
    }
    // 别去打内网 / 本机（Worker 跑在公网，但顺手挡一下明显的探测）
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '[::1]' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      // 链路本地地址 169.254.0.0/16，云厂商的元数据服务就挂在这段上
      // （AWS/Azure/GCP/阿里云都是 169.254.169.254）。Worker 跑在公网够不到，
      // 但它是 SSRF 里最常被点名的一段，显式挡掉更省心。
      /^169\.254\./.test(host) ||
      // IPv6 唯一本地地址 fc00::/7 与链路本地 fe80::/10
      /^\[?(?:fc|fd)[0-9a-f]{2}:/i.test(host) ||
      /^\[?fe[89ab][0-9a-f]:/i.test(host)
    ) {
      return json({ error: 'forbidden host' }, 403, request);
    }

    const cache = caches.default;
    const cacheKey = new Request(request.url, { method: 'GET' });

    // 先看缓存：外站 og 图基本不变，成功的结果缓存 24h，省得每次都去抓一遍
    const hit = await cache.match(cacheKey);
    if (hit) {
      const body = new Response(hit.body, hit);
      body.headers.set('Access-Control-Allow-Origin', originOf(request));
      body.headers.set('X-Goose-Cache', 'HIT');
      return body;
    }

    let result;
    try {
      result = await scrape(parsed.toString());
    } catch (e) {
      result = { error: String(e && e.message ? e.message : e) };
    }
    result.domain = parsed.hostname.replace(/^www\./, '');

    // 【Goose】失败的结果只短暂缓存（ERR_TTL），不能跟成功一样存 24h。
    // 原来一律 86400：目标站偶尔 502 或超时一次，这条链接接下来一整天的卡片
    // 都是空的，对方恢复了也不刷新 —— 等于把一个瞬时故障钉成了长期空白。
    // 但也不能完全不缓存：一个死链在页面上被反复刷新就会反复去打对方，
    // 所以折中留 60s，既能挡住刷新风暴，又能很快自愈。
    const failed = Boolean(result.error);
    const ttl = failed ? ERR_TTL : OK_TTL;

    const res = json(result, 200, request);
    res.headers.set('Cache-Control', 'public, max-age=' + ttl);
    res.headers.set('X-Goose-Cache', failed ? 'MISS-ERR' : 'MISS');
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  }
};

/** 抓目标页的 og / meta 信息 */
async function scrape(target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000); // 6s 超时，别拖慢页面

  let html;
  try {
    const res = await fetch(target, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        // 不少站点对默认 UA 直接返回 403 / 给爬虫页，伪装成正常浏览器
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const type = res.headers.get('content-type') || '';
    // 链接指向图片 / pdf 之类的就直接当图用，不解析
    if (type.startsWith('image/')) {
      return { title: '', description: '', image: target };
    }
    if (!type.includes('html') && !type.includes('text')) {
      throw new Error('unsupported content-type: ' + type);
    }

    // 只取前 300KB：meta 一定在 head 里，够用了，省内存省时间
    html = await readCapped(res, 300 * 1024);
  } finally {
    clearTimeout(timer);
  }

  // 先试 og:*，再退回 name=*
  const og = (prop) => {
    const m = html.match(
      new RegExp(
        '<meta[^>]+(?:property|name)=["\\\']og:' + prop + '["\\\'][^>]*content=["\\\']([^"\\\']+)',
        'i'
      )
    );
    if (m) return decode(m[1]);
    // content 写在 property 前面的写法
    const m2 = html.match(
      new RegExp(
        '<meta[^>]+content=["\\\']([^"\\\']+)["\\\'][^>]*(?:property|name)=["\\\']og:' + prop + '["\\\']',
        'i'
      )
    );
    return m2 ? decode(m2[1]) : '';
  };

  const meta = (name) => {
    const m = html.match(
      new RegExp('<meta[^>]+name=["\\\']' + name + '["\\\'][^>]*content=["\\\']([^"\\\']+)', 'i')
    );
    if (m) return decode(m[1]);
    const m2 = html.match(
      new RegExp('<meta[^>]+content=["\\\']([^"\\\']+)["\\\'][^>]*name=["\\\']' + name + '["\\\']', 'i')
    );
    return m2 ? decode(m2[1]) : '';
  };

  let title = og('title');
  if (!title) {
    const tm = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (tm) title = decode(tm[1].replace(/<[^>]+>/g, '').trim());
  }

  let description = og('description');
  if (!description) description = meta('description');

  let image = og('image') || og('image:url') || meta('twitter:image');

  // favicon：直接从目标站自己的 <link rel="icon"> 拿。
  // 不用 api.faviconkit.com 这类第三方服务 —— 它们对没有 favicon 的站点会
  // 返回一个默认的蓝色圆点，卡片上就顶着一个莫名的蓝点。
  // 站点没声明 icon 就返回空，前端改画域名首字母标。
  let favicon = '';
  const iconPatterns = [
    /<link[^>]+rel=["\'](?:shortcut )?icon["\'][^>]*href=["\']([^"\']+)["\']/i,
    /<link[^>]+href=["\']([^"\']+\.ico[^"\']*)["\'][^>]*rel=["\'](?:shortcut )?icon["\']/i,
    /<link[^>]+rel=["\']apple-touch-icon["\'][^>]*href=["\']([^"\']+)["\']/i,
    /<link[^>]+rel=["\']mask-icon["\'][^>]*href=["\']([^"\']+)["\']/i
  ];
  for (const re of iconPatterns) {
    const m = html.match(re);
    if (m && m[1]) { favicon = m[1]; break; }
  }
  if (!favicon) {
    // 什么都没声明，退回站点根目录的 favicon.ico（约定俗成的位置）
    favicon = new URL(target).origin + '/favicon.ico';
  }

  // 相对路径补全成绝对地址
  const base = new URL(target);
  const abs = (u) => {
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    if (/^\/\//.test(u)) return base.protocol + u;     // 协议相对 //cdn.xxx/a.png
    try { return new URL(u, target).toString(); } catch { return ''; }
  };

  image = abs(image);
  favicon = favicon ? favicon.replace(/&amp;/g, '&') : '';
  favicon = abs(favicon);

  return {
    title: (title || '').slice(0, 200),
    description: (description || '').slice(0, 300),
    image: image ? image.slice(0, 1000) : '',
    favicon: favicon ? favicon.slice(0, 500) : ''
  };
}

/** 限制读取字节数，避免有人拿个大文件把 Worker 拖死 */
async function readCapped(res, limit) {
  const reader = res.body.getReader();
  const chunks = [];
  let total = 0;
  while (total < limit) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  await reader.cancel().catch(() => {});
  const all = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    all.set(c, off);
    off += c.length;
  }
  return new TextDecoder('utf-8').decode(all);
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();

function originOf(request) {
  const o = request.headers.get('Origin');
  const allow = ['https://blog.goose.cc.cd', 'http://localhost:4000'];
  if (o && allow.includes(o)) return o;
  return allow[0];
}

function corsHeaders(request) {
  return {
    'Access-Control-Allow-Origin': originOf(request),
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };
}

function json(data, status, request) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    ...corsHeaders(request)
  };
  return new Response(JSON.stringify(data), { status, headers });
}
