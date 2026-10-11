/**
 * GooseBlog —— 链接预览代理（Netlify 备胎版）
 *
 * 主站 blog.goose.cc.cd 的 /api/link-preview 由 Cloudflare Worker 提供
 * （worker/link-preview/index.js）。Netlify 备胎上跑不了 Worker，所以用
 * Netlify Function 实现等价能力。前端 link-card.js 的 API 地址是相对路径，
 * 因此前端代码一行都不用改，主站备胎共用同一份产物。
 *
 * ⚠️ 这份代码是 worker/link-preview/index.js 的**刻意副本**，不是公共模块。
 *    灾备组件和主站必须物理解耦才有意义：抽公共模块的话，一个 bug 会让两边
 *    同时挂掉，备胎就白备了。代价是逻辑重复，所以——
 *    改了这边，请手动同步 worker/link-preview/index.js，反之亦然。
 *
 * 路由：GET /api/link-preview?url=https://example.com
 *      （由下面的 config.path 声明，不需要 _redirects 参与）
 * 返回：{ title, description, image, favicon, domain }
 *       字段与 Worker 版完全一致，前端无需区分站点
 *
 * 为什么必须有这个代理：浏览器直接 fetch 外站 HTML 会被 CORS 拦死。
 */

const OK_TTL = 86400; // og 数据缓存 24h（外站 og 基本不变）
const ERR_TTL = 60; // 失败只留 60s：挡刷新风暴，又能很快自愈

// ⚠️ 5s 而不是 Worker 那边的 6s。同步函数有执行上限，冷启动本身要吃掉
//    1–2s，抓取超时得留出余量，否则偶发超时。
const FETCH_TIMEOUT_MS = 5000;

// 只取前 300KB：meta 一定在 head 里，够用了，省内存省时间
const READ_LIMIT = 300 * 1024;

// 伪装成正常浏览器：不少站点对默认 UA 直接 403 或返回爬虫页
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/**
 * ⚠️⚠️ 路由用 config.path 声明式挂载，不再走 _redirects rewrite。
 *
 *    旧方案是往备胎产物的 _redirects 里追加一条
 *      /api/link-preview  /.netlify/functions/link-preview  200
 *    多一个环节就多一个故障点：rewrite 规则和 function 部署只要有一个没生效，
 *    对外路径就是 404。而前端是静默降级的（fetch 失败就保持骨架），页面上只
 *    表现为"没图"，从前端完全看不出是 404 还是超时，查都没处查。
 *
 *    config.path 是 Netlify 官方的声明式路由：函数部署成功 == 路径可用，
 *    少一环依赖。代价是函数不再出现在 /.netlify/functions/link-preview 上，
 *    所以 CI 里追加 rewrite 的那一步必须一并删掉 —— 让它指向一个不存在的
 *    路径反而会变回 404。
 *
 *    method 必须显式带上 OPTIONS：同源简单 GET 不会预检，但 netlify dev 或
 *    将来从别的域调用时会发预检，漏了 OPTIONS 就是预检 405、整个请求失败。
 */
export const config = {
  path: '/api/link-preview',
  method: ['GET', 'OPTIONS']
};

/** Netlify Function（现代语法：Web Request / Response） */
export default async (req) => {
  const cors = corsHeaders(req);

  // CORS 预检
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  // config.method 已经限了，这里再显式挡一次：
  // 本地 netlify dev / 直接单元测试时不一定走平台的方法路由，
  // 没有这行的话 POST 会一路走到抓取逻辑，白白打一次外网请求。
  if (req.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405, req);
  }

  const url = new URL(req.url);
  const target = url.searchParams.get('url');
  if (!target) return json({ error: 'missing url' }, 400, req);

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return json({ error: 'bad url' }, 400, req);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return json({ error: 'unsupported protocol' }, 400, req);
  }

  // ── SSRF 防护 ──────────────────────────────────────────────────
  // ⚠️ 这一段在 Function 上比在 Worker 上重要得多：
  //    Worker 跑在 Cloudflare 边缘，够不到云厂商元数据；
  //    Netlify Function 跑在 AWS Lambda 里，169.254.169.254（IMDS）
  //    是真实可达的。谁都能传个 ?url= 进来让函数去读实例凭证。
  //    别嫌啰嗦，一行都别删。
  const host = parsed.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host === '[::1]' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost') ||
    // Lambda 自身的环境变量服务 / DNS
    host.endsWith('.amazonaws.com') ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^169\.254\./.test(host) || // 链路本地：AWS/Azure/GCP/阿里云元数据都挂这
    /^\[?(?:fc|fd)[0-9a-f]{2}:/i.test(host) || // IPv6 唯一本地 fc00::/7
    /^\[?fe[89ab][0-9a-f]:/i.test(host) // IPv6 链路本地 fe80::/10
  ) {
    return json({ error: 'forbidden host' }, 403, req);
  }

  let result;
  try {
    result = await scrape(parsed.toString());
  } catch (e) {
    result = { error: String(e && e.message ? e.message : e) };
  }
  result.domain = parsed.hostname.replace(/^www\./, '');

  // 失败的结果不能跟成功一样存 24h：目标站偶尔 502/超时一次，
  // 这条链接接下来一整天卡片都是空的，对方恢复了也不刷新。
  // 但也不能完全不缓存，一个死链被反复刷新会反复去打对方，折中留 60s。
  const failed = Boolean(result.error);
  const ttl = failed ? ERR_TTL : OK_TTL;

  const res = json(result, 200, req);
  res.headers.set('Cache-Control', 'public, max-age=' + ttl);
  // Netlify CDN 对 function 响应的缓存走这个头；能命中就少跑一次 Lambda。
  res.headers.set('CDN-Cache-Control', 'public, max-age=' + ttl);
  res.headers.set('X-Goose-Cache', failed ? 'MISS-ERR' : 'MISS');
  return res;
};

/** 抓目标页的 og / meta 信息 */
async function scrape(target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let html;
  try {
    const res = await fetch(target, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': BROWSER_UA,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const type = res.headers.get('content-type') || '';
    // 链接直接指向图片之类的就当图用，不解析
    if (type.startsWith('image/')) {
      return { title: '', description: '', image: target };
    }
    if (!type.includes('html') && !type.includes('text')) {
      throw new Error('unsupported content-type: ' + type);
    }

    html = await readCapped(res, READ_LIMIT);
  } finally {
    clearTimeout(timer);
  }

  // 先试 og:*，再退回 name=*
  const og = (prop) => {
    const m = html.match(
      new RegExp(
        '<meta[^>]+(?:property|name)=["\']og:' + prop + '["\'][^>]*content=["\']([^"\']+)',
        'i'
      )
    );
    if (m) return decode(m[1]);
    // content 写在 property 前面的写法
    const m2 = html.match(
      new RegExp(
        '<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\']og:' + prop + '["\']',
        'i'
      )
    );
    return m2 ? decode(m2[1]) : '';
  };

  const meta = (name) => {
    const m = html.match(
      new RegExp('<meta[^>]+name=["\']' + name + '["\'][^>]*content=["\']([^"\']+)', 'i')
    );
    if (m) return decode(m[1]);
    const m2 = html.match(
      new RegExp('<meta[^>]+content=["\']([^"\']+)["\'][^>]*name=["\']' + name + '["\']', 'i')
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

  // favicon：从目标站自己的 <link rel="icon"> 拿。
  // 不用 api.faviconkit.com 这类第三方服务 —— 它们对没有 favicon 的站点会
  // 返回一个默认蓝色圆点，卡片上就顶着一个莫名的蓝点。
  // 站点没声明 icon 就返回空，前端改画域名首字母标。
  let favicon = '';
  const iconPatterns = [
    /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+\.ico[^"']*)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]+rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]+rel=["']mask-icon["'][^>]*href=["']([^"']+)["']/i
  ];
  for (const re of iconPatterns) {
    const m = html.match(re);
    if (m && m[1]) {
      favicon = m[1];
      break;
    }
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
    if (/^\/\//.test(u)) return base.protocol + u; // 协议相对 //cdn.xxx/a.png
    try {
      return new URL(u, target).toString();
    } catch {
      return '';
    }
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

/** 限制读取字节数，避免有人拿个大文件把函数拖死 */
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

/**
 * 允许的来源。
 *
 * 第一位放「函数自己被访问时的那个 origin」：备胎换成什么域名（netlify.app、
 * deploy preview、自定义域名）它都跟着变，不用改代码也不用配环境变量。
 * 再拼上 Netlify 给的 DEPLOY_PRIME_URL / URL，最后补两个本地开发端口。
 *
 * 想锁死白名单就在 Netlify 后台设 GOOSE_ALLOWED_ORIGINS（逗号分隔）。
 *
 * 顺带说明：卡片是从备胎自己的页面 fetch 相对路径，属于同源请求，
 * 浏览器根本不检查 CORS —— 这里的白名单主要是给 netlify dev 和
 * 将来可能的跨域调用兜底，不是"没配置就没图"的那种开关。
 */
function allowedOrigins(req) {
  const envList = (process.env.GOOSE_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (envList.length) return envList;

  const list = [];
  try {
    list.push(new URL(req.url).origin);
  } catch {
    /* req.url 理论上恒为合法绝对地址，兜个底而已 */
  }
  for (const v of [
    process.env.DEPLOY_PRIME_URL,
    process.env.URL,
    process.env.DEPLOY_URL
  ]) {
    if (v) list.push(String(v).replace(/\/$/, ''));
  }
  // hexo server 默认 4000，netlify dev 默认 8888
  list.push('http://localhost:4000', 'http://localhost:8888');
  return Array.from(new Set(list));
}

function originOf(req) {
  const allow = allowedOrigins(req);
  const o = req.headers.get('origin') || '';
  if (o && allow.includes(o)) return o;
  return allow[0];
}

function corsHeaders(req) {
  return {
    'Access-Control-Allow-Origin': originOf(req),
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function json(data, status, req) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(req)
    }
  });
}
