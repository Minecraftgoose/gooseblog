/**
 * GooseBlog — Cloudflare Worker
 *
 * 后端 API，负责与 Supabase 交互。
 * 通过 Pages Function 的 service binding（env.ROOM）内网调用。
 *
 * Markdown 转换使用 marked（npm 包），替换了手写简易解析器。
 *
 * 环境变量：
 *   SUPABASE_URL      — Supabase 项目 URL
 *   SUPABASE_ANON_KEY — Supabase anon public key
 *   ADMIN_PASSWORD    — 后台管理密码
 */
import { marked } from 'marked';

// ========== 配置 marked 渲染器 ==========
// 让标题自动带 id，支持锚点跳转
// 图片以音视频扩展名结尾时渲染为原生播放器（audio/video）
function escAttr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const AUDIO_EXT = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus)([?#].*)?$/i;
const VIDEO_EXT = /\.(mp4|webm|ogv|mov|m4v)([?#].*)?$/i;

const renderer = {
  heading(token) {
    const text = token.text;
    const depth = token.depth;
    const slug = text.toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `<h${depth} id="${slug}">${this.parser.parseInline(token.tokens)}</h${depth}>\n`;
  },
  image(token) {
    const src = token.href || '';
    const alt = token.text || '';
    const title = token.title ? ` title="${escAttr(token.title)}"` : '';
    if (AUDIO_EXT.test(src)) {
      return `<audio controls preload="metadata" src="${escAttr(src)}"${title}>${escAttr(alt)}</audio>\n`;
    }
    if (VIDEO_EXT.test(src)) {
      return `<video controls preload="metadata" src="${escAttr(src)}"${title}></video>\n`;
    }
    return `<img src="${escAttr(src)}" alt="${escAttr(alt)}"${title}>\n`;
  },
  // 裸链接（[文字](url) / 直接贴 URL）指向音视频文件时也渲染为播放器
  link(token) {
    const href = token.href || '';
    const text = token.text || '';
    if (AUDIO_EXT.test(href)) {
      return `<audio controls preload="metadata" src="${escAttr(href)}">${escAttr(text)}</audio>\n`;
    }
    if (VIDEO_EXT.test(href)) {
      return `<video controls preload="metadata" src="${escAttr(href)}"></video>\n`;
    }
    return `<a href="${escAttr(href)}">${this.parser.parseInline(token.tokens)}</a>`;
  }
};
marked.use({ renderer });

// ========== 本站域名（CORS 白名单） ==========
// 仅允许此域的浏览器跨域调用 /api/admin/*；非浏览器（Python/curl 无 Origin）仍可调用。
// 换自定义域名时改这一行即可。
const SITE_ORIGIN = 'https://blog.goose.cc.cd';


// ========== Demo Data ==========
const DEMO_POSTS = [
  { id: 1, slug: 'why-purple-glass', title: '鹅言鹅语：为什么我选了紫色玻璃做博客', excerpt: '因为好看啊还需要理由吗。好吧认真说——亚克力毛玻璃（Glassmorphism）配上深紫渐变，视觉层次感确实比纯色块强太多。这篇讲讲设计思路和踩的坑。', content: '<p>因为好看啊还需要理由吗。</p><p>认真说——亚克力毛玻璃（Glassmorphism）配上深紫渐变，视觉层次感确实比纯色块强太多。这篇讲讲设计思路和踩的坑。</p>', tag: '设计', created_at: '2026-07-17T08:00:00Z' },
  { id: 2, slug: 'serverless-blog-on-pages', title: '在 Cloudflare Pages 上搭一个无服务器博客', excerpt: '没有服务器？没关系。Cloudflare Pages + Pages Functions + Supabase，三位一体无服务器架构，零成本跑起一个动态博客。手把手配置指南。', content: '<p>没有服务器？没关系。</p><p>Cloudflare Pages + Pages Functions + Supabase，三位一体无服务器架构，零成本跑起一个动态博客。手把手配置指南。</p>', tag: '技术', created_at: '2026-07-16T12:30:00Z' },
  { id: 3, slug: 'frontend-performance-tips', title: '前端架构的自我修养：别让用户等你加载', excerpt: '用户体验的底线是什么？是快。不管你的设计多好看，功能多强大，加载慢就是原罪。本文聊聊前端性能优化的几个实用策略。', content: '<p>用户体验的底线是什么？是快。</p><p>不管你的设计多好看，功能多强大，加载慢就是原罪。本文聊聊前端性能优化的几个实用策略。</p>', tag: '前端', created_at: '2026-07-14T09:15:00Z' },
  { id: 4, slug: 'supabase-rls-guide', title: 'Supabase RLS 策略：让你的数据安全又灵活', excerpt: 'Row Level Security 是 Supabase 最强大的功能之一。用得好，前端直连数据库都安全；用不好，等于没穿裤子逛街。这篇从入门到实战。', content: '<p>Row Level Security 是 Supabase 最强大的功能之一。</p><p>用得好，前端直连数据库都安全；用不好，等于没穿裤子逛街。这篇从入门到实战。</p>', tag: '后端', created_at: '2026-07-11T16:45:00Z' },
];

// ========== 公开读接口内存缓存 ==========
// 文章列表/标签/归档/热力图等数据不频繁变更，
// 在 Worker 内存中缓存 60s（同 Isolate 内所有请求共享，命中即 0ms 等待）。
// 后台写操作接口仍 no-store，不受影响。
//
// 注意：caches.default（边缘 Cache API）在 Pages Service Binding 架构下不稳定，
// 故改用全局 Map 做进程内缓存。Worker 冷启动后首个请求仍需走 Supabase（~4s），
// 但后续 60s 内的所有请求直接返回缓存，体验飞起。

const PUBLIC_CACHE_TTL_MS = 60 * 1000; // 60 秒
const memCache = new Map(); // { key: { data: string, expires: number } }

/** 尝试从内存缓存返回；未命中则回源执行 fn 并写入缓存 */
async function withCache(request, env, keyFn, fn) {
  const rawKey = typeof keyFn === 'function' ? keyFn(request.url) : keyFn;
  const cacheKey = rawKey || request.url;

  // 检查内存缓存
  const cached = memCache.get(cacheKey);
  if (cached && Date.now() < cached.expires) {
    return new Response(cached.data, {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
    });
  }

  // 未命中：回源
  const response = await fn(env);
  if (response.status === 200) {
    const body = await response.text();
    memCache.set(cacheKey, { data: body, expires: Date.now() + PUBLIC_CACHE_TTL_MS });
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });
  }
  return response;
}

/** 写操作后使公开读缓存失效（增/改/删文章、友链都要调） */
function invalidatePublicCache() {
  memCache.delete('/api/posts');
  memCache.delete('/api/tags');
  memCache.delete('/api/archive');
  memCache.delete('/api/heatmap');
  memCache.delete('/api/friends');
}

// ========== 主入口 ==========
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (!path.startsWith('/api/')) {
      return jsonResponse({ error: 'Not found' }, 404);
    }

    // CORS 预检（浏览器跨域调 admin 会先发 OPTIONS）
    if (method === 'OPTIONS') {
      const origin = request.headers.get('Origin');
      if (path.startsWith('/api/admin/') && origin && origin !== SITE_ORIGIN) {
        return new Response(null, { status: 403 });
      }
      const headers = {
        'Access-Control-Allow-Origin': (origin && origin === SITE_ORIGIN) ? origin : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
        'Vary': 'Origin',
      };
      return new Response(null, { status: 204, headers });
    }

    // 路由（公开读接口带边缘缓存，后台接口直连无缓存）
    if (path === '/api/posts' && method === 'GET') {
      const tag = url.searchParams.get('tag');
      const exclude = url.searchParams.get('exclude');
      const cacheKey = `${request.url.split('?')[0]}?tag=${tag || ''}&exclude=${exclude || ''}`;
      return withCache(request, env,
        () => cacheKey,
        (e) => handleGetPosts(e, tag, exclude)
      );
    }
    if (path.match(/^\/api\/posts\/(.+)$/) && method === 'GET') {
      const raw = path.match(/^\/api\/posts\/(.+)$/)[1];
      let slug = raw;
      try { slug = decodeURIComponent(raw); } catch { /* 保留原值 */ }
      return withCache(request, env,
        () => `${request.url.split('?')[0]}`,
        (e) => handleGetPost(e, slug)
      );
    }
    if (path === '/api/tags' && method === 'GET') {
      return withCache(request, env, '/api/tags', handleGetTags);
    }
    if (path === '/api/archive' && method === 'GET') {
      return withCache(request, env, '/api/archive', handleGetArchive);
    }
    if (path === '/api/heatmap' && method === 'GET') {
      return withCache(request, env, '/api/heatmap', handleGetHeatmap);
    }
    if (path === '/api/friends' && method === 'GET') {
      return withCache(request, env, '/api/friends', handleGetFriends);
    }
    if (path === '/api/pages/about' && method === 'GET') {
      return handleGetSitePage(env, request, 'about');
    }
    if (path === '/api/pages/announcement' && method === 'GET') {
      return handleGetSitePage(env, request, 'announcement');
    }
    if (path === '/api/admin/pages/about' && method === 'GET') {
      return handleAdminGetSitePage(request, env, 'about');
    }
    if (path === '/api/admin/pages/about' && method === 'PUT') {
      return handleAdminSaveSitePage(request, env, 'about');
    }
    if (path === '/api/admin/pages/announcement' && method === 'GET') {
      return handleAdminGetSitePage(request, env, 'announcement');
    }
    if (path === '/api/admin/pages/announcement' && method === 'PUT') {
      return handleAdminSaveSitePage(request, env, 'announcement');
    }
    if (path === '/api/link-preview' && method === 'GET') {
      return withCache(request, env, request.url, (e) => handleLinkPreview(e, request));
    }
    if (path === '/api/admin/auth' && method === 'POST') {
      return handleAdminAuth(request, env);
    }
    if (path === '/api/admin/posts' && method === 'GET') {
      return handleAdminListPosts(request, env);
    }
    if (path === '/api/admin/friends' && method === 'POST') {
      return handleAdminAddFriend(request, env);
    }
    if (path === '/api/admin/friends' && method === 'DELETE') {
      return handleAdminDeleteFriend(request, env);
    }
    if (path === '/api/admin/posts' && method === 'POST') {
      return handleAdminCreatePost(request, env);
    }
    if (path.match(/^\/api\/admin\/posts\/(\d+)$/) && method === 'PUT') {
      const id = path.match(/^\/api\/admin\/posts\/(\d+)$/)[1];
      return handleAdminUpdatePost(request, env, id);
    }
    if (path.match(/^\/api\/admin\/posts\/(\d+)$/) && method === 'DELETE') {
      const id = path.match(/^\/api\/admin\/posts\/(\d+)$/)[1];
      return handleAdminDeletePost(request, env, id);
    }
    if (path.match(/^\/api\/admin\/posts\/(\d+)$/) && method === 'GET') {
      const id = path.match(/^\/api\/admin\/posts\/(\d+)$/)[1];
      return handleAdminGetPost(request, env, id);
    }
    if (path === '/api/cover' && method === 'GET') {
      return handleRandomCover(request, env);
    }
    if (path === '/api/yiyan' && method === 'GET') {
      return handleYiyan();
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },
};

// ========== 数据库工具 ==========

/** 自动添加缺失的数据表列（利用 service key 执行 DDL；列缺失由上层查询降级兜底，绝不退回 DEMO） */
async function ensureColumn(env, col, type) {
  const key = env.SUPABASE_SERVICE_KEY;
  if (!key) return; // 没有 service key 无法改 schema
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/sql`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `ALTER TABLE posts ADD COLUMN IF NOT EXISTS ${col} ${type};` }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`ensureColumn ${col}: HTTP ${res.status} ${body.slice(0, 200)}`);
  }
}

// ========== 置顶列确保（一次性） ==========
// 首篇请求时尝试建 pinned 列；建列失败（如缺 service key）也不阻塞，
// 由 handleGetPosts 的查询降级兜底——绝不退回 DEMO_POSTS。
let pinnedEnsured = null;
function ensurePinned(env) {
  if (!pinnedEnsured) {
    pinnedEnsured = (async () => {
      try {
        await ensureColumn(env, 'pinned', 'BOOLEAN NOT NULL DEFAULT false');
      } catch (e) {
        console.error('[GooseBlog] ensure pinned column failed:', e);
      }
    })();
  }
  return pinnedEnsured;
}

/** 对文章数组按 tag / exclude 过滤（公开列表与 demo 共用） */
function applyFilter(posts, tag, exclude) {
  let result = posts;
  if (tag) {
    result = result.filter(p => p.tag
      ? p.tag.split(',').map(t => t.trim()).includes(tag)
      : false);
  }
  if (exclude) {
    const exList = exclude.split(',').map(t => t.trim()).filter(Boolean);
    result = result.filter(p => {
      if (!p.tag) return true;
      const tags = p.tag.split(',').map(t => t.trim());
      return !exList.some(ex => tags.includes(ex));
    });
  }
  return result;
}

async function supabaseFetch(env, query) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1${query}`, {
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase: ${res.status}`);
  return res.json();
}

// ========== Markdown 转换器（服务端） ==========
function markdownToHtml(md) {
  return marked.parse(md);
}

// ========== 接口处理 ==========

/**
 * GET /api/posts — 文章列表（支持 ?tag= 筛选）
 */
async function handleGetPosts(env, tag, exclude) {
  await ensurePinned(env);
  try {
    return jsonResponse(await fetchPostsSorted(env, tag, exclude, true));
  } catch (err) {
    console.error('[GooseBlog] posts(pinned) failed, try without pinned:', err);
    // 降级：去掉 pinned 列重试，避免全站 fallback 到 DEMO_POSTS
    try {
      const r = await fetchPostsSorted(env, tag, exclude, false);
      return jsonResponse(r, { 'X-Pinned': 'degraded', 'X-Pinned-Note': lastPinnedErr || String(err) });
    } catch (err2) {
      console.error('[GooseBlog] posts fallback to demo:', err2);
    }
  }
  return jsonResponse(applyFilter(DEMO_POSTS, tag, exclude), { 'X-Demo': 'true' });
}

/** 拉取文章列表；withPinned=true 时 SELECT 含 pinned 且按置顶优先排序 */
async function fetchPostsSorted(env, tag, exclude, withPinned) {
  const select = withPinned
    ? 'id,slug,title,excerpt,tag,cover_url,created_at,pinned'
    : 'id,slug,title,excerpt,tag,cover_url,created_at';
  const order = withPinned ? 'pinned.desc,created_at.desc' : 'created_at.desc';
  const query = `/posts?select=${select}&published=eq.true&order=${order}`;
  const posts = await supabaseFetch(env, query);
  if (!posts) throw new Error('no posts from supabase');
  return applyFilter(posts, tag, exclude);
}

/**
 * GET /api/posts/:slug — 单篇文章详情
 */
async function handleGetPost(env, slug) {
  try {
    const posts = await supabaseFetch(env, `/posts?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
    if (posts && posts.length > 0) {
      var post = posts[0];
      // 顺便取前后篇
      try {
        var all = await supabaseFetch(env, '/posts?select=slug,title,excerpt,pinned&published=eq.true&order=created_at.desc');
        if (all && all.length) {
          // 在内存中过滤置顶，PostgREST 的 or=(,pinned.is.null) 不支持
          all = all.filter(function(p) { return !p.pinned; });
          var idx = -1;
          for (var i = 0; i < all.length; i++) { if (all[i].slug === slug) { idx = i; break; } }
          if (idx > 0) post.prev = all[idx - 1];
          if (idx >= 0 && idx < all.length - 1) post.next = all[idx + 1];
        }
      } catch (e) { /* 前后篇可选 */ }
      return jsonResponse(post);
    }

    // fallback
    const demo = DEMO_POSTS.find(p => p.slug === slug);
    if (demo) return jsonResponse(demo, { 'X-Demo': 'true' });
    return jsonResponse({ error: 'Not found' }, 404);
  } catch (err) {
    console.error(err);
    const demo = DEMO_POSTS.find(p => p.slug === slug);
    if (demo) return jsonResponse(demo, { 'X-Demo': 'true' });
    return jsonResponse({ error: 'Not found' }, 404);
  }
}

/**
 * GET /api/tags — 获取所有标签及文章数
 */
async function handleGetTags(env) {
  try {
    const posts = await supabaseFetch(env, '/posts?select=tag&published=eq.true');
    if (posts) {
      const counts = {};
      posts.forEach(p => {
        if (!p.tag) return;
        p.tag.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
          counts[t] = (counts[t] || 0) + 1;
        });
      });
      return jsonResponse({
        tags: Object.entries(counts).map(([tag, count]) => ({ tag, count })),
        total: posts.length,
      });
    }
    // fallback
    const counts = {};
    DEMO_POSTS.forEach(p => {
      if (!p.tag) return;
      p.tag.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return jsonResponse({
      tags: Object.entries(counts).map(([tag, count]) => ({ tag, count })),
      total: DEMO_POSTS.length,
    }, { 'X-Demo': 'true' });
  } catch (err) {
    console.error(err);
    const counts = {};
    DEMO_POSTS.forEach(p => {
      if (!p.tag) return;
      p.tag.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return jsonResponse({
      tags: Object.entries(counts).map(([tag, count]) => ({ tag, count })),
      total: DEMO_POSTS.length,
    }, { 'X-Demo': 'true' });
  }
}

/**
 * GET /api/archive — 按年归档
 */
async function handleGetArchive(env) {
  try {
    const posts = await supabaseFetch(env, '/posts?select=slug,title,created_at&published=eq.true&order=created_at.desc');
    if (posts) return jsonResponse(buildArchive(posts));
    return jsonResponse(buildArchive(DEMO_POSTS), { 'X-Demo': 'true' });
  } catch (err) {
    console.error(err);
    return jsonResponse(buildArchive(DEMO_POSTS), { 'X-Demo': 'true' });
  }
}

function buildArchive(posts) {
  const groups = {};
  posts.forEach(p => {
    const year = new Date(p.created_at).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push({ slug: p.slug, title: p.title, created_at: p.created_at });
  });
  return Object.entries(groups)
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }));
}

/**
 * GET /api/heatmap — 按天聚合发布数（贡献热力图数据）
 * 返回 { 'YYYY-MM-DD': count } 映射
 */
async function handleGetFriends(env) {
  try {
    const friends = await supabaseFetch(env, '/friends?select=*&order=created_at.asc');
    if (friends) return jsonResponse(friends);
    return jsonResponse([]);
  } catch (err) { return jsonResponse([]); }
}

// ========== 关于页面 ==========

/** 确保 site_pages 表存在 */
async function ensureSitePagesTable(env) {
  const key = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
  if (!key) return;
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/sql`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `CREATE TABLE IF NOT EXISTS site_pages (
        slug TEXT PRIMARY KEY,
        content TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );`
    }),
  });
  if (!res.ok) {
    // table may already exist or no permission - continue silently
  }
}

/** GET /api/pages/:slug — 公开读取站点页面（返回 markdown 和 HTML） */
async function handleGetSitePage(env, request, slug) {
  try {
    await ensureSitePagesTable(env);
    const pages = await supabaseFetch(env, `/site_pages?select=content&slug=eq.${slug}&limit=1`);
    if (pages && pages.length > 0) {
      const md = pages[0].content || '';
      const html = md ? markdownToHtml(md) : '';
      return jsonResponse({ content: md, html: html });
    }
    return jsonResponse({ content: '', html: '' });
  } catch (err) {
    return jsonResponse({ content: '', html: '' });
  }
}

/** GET /api/admin/pages/:slug — 管理员读取站点页面（含未渲染的 markdown） */
async function handleAdminGetSitePage(request, env, slug) {
  if (!checkAdmin(request, env)) return jsonResponse({ error: '未授权' }, 401, request);
  try {
    await ensureSitePagesTable(env);
    const pages = await supabaseFetch(env, `/site_pages?select=content&slug=eq.${slug}&limit=1`);
    if (pages && pages.length > 0) {
      return jsonResponse({ content: pages[0].content });
    }
    return jsonResponse({ content: '' });
  } catch (err) {
    return jsonResponse({ content: '' });
  }
}

/** PUT /api/admin/pages/:slug — 管理员保存站点页面（存 markdown，返回渲染后的 HTML） */
async function handleAdminSaveSitePage(request, env, slug) {
  if (!checkAdmin(request, env)) return jsonResponse({ error: '未授权' }, 401, request);
  const body = await request.json().catch(() => ({}));
  if (!body.content && body.content !== '') return jsonResponse({ error: '内容不能为空' }, 400, request);

  const mdContent = body.content || '';
  let htmlContent = mdContent;
  if (mdContent && !mdContent.trim().startsWith('<')) {
    htmlContent = markdownToHtml(mdContent);
  }

  try {
    await ensureSitePagesTable(env);
    const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
    // upsert
    var saved = false;
    try {
      const res = await fetch(`${env.SUPABASE_URL}/rest/v1/site_pages?slug=eq.${slug}`, {
        method: 'PUT',
        headers: {
          apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json', Prefer: 'return=representation',
        },
        body: JSON.stringify({ slug: slug, content: mdContent, updated_at: new Date().toISOString() }),
      });
      if (res.ok) saved = true;
    } catch {}
    if (!saved) {
      // fallback: insert new
      try {
        const res2 = await fetch(`${env.SUPABASE_URL}/rest/v1/site_pages`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json', Prefer: 'return=representation',
          },
          body: JSON.stringify({ slug: slug, content: mdContent, updated_at: new Date().toISOString() }),
        });
        if (res2.ok) saved = true;
      } catch {}
    }
  } catch (err) {
    return jsonResponse({ error: '保存失败', detail: err.message }, 500, request);
  }
  if (saved) {
    return jsonResponse({ content: mdContent, html: htmlContent });
  }
  return jsonResponse({ error: '保存失败' }, 500, request);
}

async function handleGetHeatmap(env) {
  try {
    const posts = await supabaseFetch(env, '/posts?select=created_at&published=eq.true');
    if (posts) return jsonResponse(buildHeatmap(posts));
    return jsonResponse(buildHeatmap(DEMO_POSTS), { 'X-Demo': 'true' });
  } catch (err) {
    console.error(err);
    return jsonResponse(buildHeatmap(DEMO_POSTS), { 'X-Demo': 'true' });
  }
}

function buildHeatmap(posts) {
  const counts = {};
  posts.forEach(p => {
    const day = p.created_at.slice(0, 10); // YYYY-MM-DD
    counts[day] = (counts[day] || 0) + 1;
  });
  return counts;
}

// ========== 后台管理 ==========

/**
 * POST /api/admin/auth — 验证管理员密码
 * 密码存在环境变量 ADMIN_PASSWORD 中
 */
// ========== 图片代理（绕过 CORS） ==========
// ========== 链接预览代理 ==========
async function handleLinkPreview(env, request) {
  const u = new URL(request.url).searchParams.get('url');
  if (!u) return jsonResponse({ error: 'missing url' }, 400);

  let parsed;
  try { parsed = new URL(u); } catch { return jsonResponse({ error: 'bad url' }, 400); }
  const domain = parsed.hostname;

  // 自己站的链接：直查 Supabase，绝不走公网回环 fetch
  if (parsed.origin === SITE_ORIGIN) {
    return handleSelfLinkPreview(env, parsed, domain);
  }

  // 外站链接：保持原逻辑
  try {
    const res = await fetch(u, {
      headers: { 'User-Agent': 'GooseBlog/1.0 LinkPreview' },
      redirect: 'follow'
    });
    const html = await res.text();
    var tag = function(prop) {
      var m = html.match(new RegExp('<meta[^>]+property=["\\\']og:' + prop + '["\\\'][^>]+content=["\\\']([^"\\\']+)', 'i'));
      return m ? m[1] : '';
    };
    var desc = tag('description');
    if (!desc) {
      var dm = html.match(/<meta[^>]+name=["\\\']description["\\\'][^>]+content=["\\\']([^"\\\']+)/i);
      if (dm) desc = dm[1];
    }
    return jsonResponse({
      title: (tag('title') || '').substring(0, 200),
      description: (desc || '').substring(0, 300),
      image: tag('image'),
      domain
    });
  } catch (e) {
    return jsonResponse({ error: e.message, domain }, 200);
  }
}

/** 自己站链接的预览：直接查库，不发任何公网请求 */
async function handleSelfLinkPreview(env, parsed, domain) {
  // /post/<slug>
  const m = parsed.pathname.match(/^\/post\/(.+?)\/?$/);
  if (m) {
    let slug = m[1];
    try { slug = decodeURIComponent(slug); } catch { /* 保留原值 */ }
    try {
      const posts = await supabaseFetch(
        env,
        `/posts?select=title,excerpt,cover_url&slug=eq.${encodeURIComponent(slug)}&limit=1`
      );
      if (posts && posts[0]) {
        const p = posts[0];
        const cover = String(p.cover_url || '').trim();
        return jsonResponse({
          title: p.title || '',
          description: (p.excerpt || '').slice(0, 300),
          image: cover
            ? `${SITE_ORIGIN}/og/${encodeURIComponent(slug)}.jpg`
            : `${SITE_ORIGIN}/og-default.jpg`,
          domain,
        });
      }
    } catch { /* 落到下面默认 */ }
  }

  // 自己站的其他页面（首页、归档、关于…）
  return jsonResponse({
    title: 'GooseBlog',
    description: '紫色玻璃风博客 · 网页开发 · 工具折腾 · 偶尔写点有用的东西',
    image: `${SITE_ORIGIN}/og-default.jpg`,
    domain,
  });
}

async function handleAdminAuth(request, env) {
  try {
    const body = await request.json();
    const pwd = env.ADMIN_PASSWORD || 'gooseblog';

    if (body.password !== pwd) {
      return jsonResponse({ error: '密码错误' }, 401, request);
    }

    return jsonResponse({ ok: true }, 200, request);
  } catch (err) {
    return jsonResponse({ error: '请求格式错误' }, 400, request);
  }
}

/**
 * POST /api/admin/posts — 创建文章
 */
async function handleAdminAddFriend(request, env) {
  try {
    var body = await request.json();
    if (!checkAdmin(request, env, body.password)) return jsonResponse({ error: '未授权' }, 401, request);
    if (!body.name || !body.url) return jsonResponse({ error: 'name和url不能为空' }, 400, request);
    var svcKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
    var res = await fetch(`${env.SUPABASE_URL}/rest/v1/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: svcKey,
        Authorization: `Bearer ${svcKey}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        name: body.name,
        description: body.description || '',
        url: body.url,
        avatar: body.avatar || ''
      })
    });
    if (!res.ok) throw new Error(await res.text());
    var data = await res.json();
    invalidatePublicCache();
    return jsonResponse(data[0] || data, 200, request);
  } catch (e) {
    return jsonResponse({ error: e.message }, 500, request);
  }
}

async function handleAdminDeleteFriend(request, env) {
  try {
    var body = await request.json();
    if (!checkAdmin(request, env, body.password)) return jsonResponse({ error: '未授权' }, 401, request);
    var id = body.id;
    if (!id) return jsonResponse({ error: '缺少id' }, 400, request);
    var svcKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
    var res = await fetch(`${env.SUPABASE_URL}/rest/v1/friends?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: svcKey, Authorization: `Bearer ${svcKey}` }
    });
    if (!res.ok) throw new Error(await res.text());
    invalidatePublicCache();
    return jsonResponse({ ok: true }, 200, request);
  } catch (e) {
    return jsonResponse({ error: e.message }, 500, request);
  }
}

async function handleAdminCreatePost(request, env) {
  try {
    const body = await request.json();
    if (!checkAdmin(request, env, body.password)) return jsonResponse({ error: '未授权' }, 401, request);
    if (!body.title || !body.slug) return jsonResponse({ error: '标题和 slug 不能为空' }, 400, request);

    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return jsonResponse({ error: '数据库未配置' }, 503, request);

    const rawContent = body.content || '';
    let htmlContent = rawContent;
    let mdContent = '';
    if (rawContent && !rawContent.trim().startsWith('<')) {
      htmlContent = markdownToHtml(rawContent);
      mdContent = rawContent;
    }

    const post = {
      title: body.title, slug: body.slug, excerpt: body.excerpt || '',
      content: htmlContent, markdown: mdContent || null,
      tag: body.tag || null, cover_url: body.cover_url || '',
      pinned: !!body.pinned, published: true,
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', Prefer: 'return=representation',
      },
      body: JSON.stringify(post),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      if (res.status === 400 && (errText.includes('markdown') || errText.includes('pinned'))) {
        // 列不存在 → 尝试自动添加，失败则降级（不存该字段）
        if (errText.includes('markdown')) {
          try { await ensureColumn(env, 'markdown', 'TEXT'); } catch {}
          delete post.markdown;
        }
        if (errText.includes('pinned')) {
          try { await ensureColumn(env, 'pinned', 'BOOLEAN NOT NULL DEFAULT false'); } catch {}
          delete post.pinned;
        }
        const res2 = await fetch(`${supabaseUrl}/rest/v1/posts`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json', Prefer: 'return=representation',
          },
          body: JSON.stringify(post),
        });
        if (!res2.ok) throw new Error(`Supabase: ${res2.status} ${await res2.text().catch(() => '')}`);
        const created2 = await res2.json();
        invalidatePublicCache();
        return jsonResponse(created2[0], 200, request);
      }
      throw new Error(`Supabase: ${res.status} ${errText}`);
    }

    const created = await res.json();
    invalidatePublicCache();
    return jsonResponse(created[0], 200, request);
  } catch (err) {
    console.error('Create post error:', err);
    return jsonResponse({ error: err.message }, 500, request);
  }
}

/** 校验管理员密码（header X-Admin-Password 或 body.password） */
function checkAdmin(request, env, bodyPwd) {
  const pwd = env.ADMIN_PASSWORD || 'gooseblog';
  const headerPwd = request.headers.get('X-Admin-Password');
  return (headerPwd && headerPwd === pwd) || (bodyPwd && bodyPwd === pwd);
}

/** service role key（写库绕过 RLS） */
function adminDb(env) {
  return {
    url: env.SUPABASE_URL,
    key: env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY,
  };
}

/**
 * GET /api/admin/posts — 后台文章列表（全字段，需密码）
 */
async function handleAdminListPosts(request, env) {
  if (!checkAdmin(request, env)) return jsonResponse({ error: '未授权' }, 401, request);
  const { url, key } = adminDb(env);
  if (!url || !key) return jsonResponse({ error: '数据库未配置' }, 503, request);
  try {
    const res = await fetch(`${url}/rest/v1/posts?select=id,slug,title,excerpt,tag,cover_url,created_at,pinned&order=pinned.desc,created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Supabase: ${res.status} ${await res.text().catch(() => '')}`);
    return jsonResponse(await res.json(), 200, request);
  } catch (err) {
    console.error('Admin list error:', err);
    return jsonResponse({ error: err.message }, 500, request);
  }
}

/**
 * PUT /api/admin/posts/:id — 编辑文章（需密码）
 */
async function handleAdminUpdatePost(request, env, id) {
  try {
    const body = await request.json();
    if (!checkAdmin(request, env, body.password)) return jsonResponse({ error: '未授权' }, 401, request);
    const { url, key } = adminDb(env);
    if (!url || !key) return jsonResponse({ error: '数据库未配置' }, 503, request);

    const rawContent = body.content || '';
    let htmlContent = rawContent;
    let mdContent = '';
    if (rawContent && !rawContent.trim().startsWith('<')) {
      htmlContent = markdownToHtml(rawContent);
      mdContent = rawContent;
    }

    const patch = {};
    if (body.title !== undefined) patch.title = body.title;
    if (body.slug !== undefined) patch.slug = body.slug;
    if (body.excerpt !== undefined) patch.excerpt = body.excerpt;
    if (body.content !== undefined) {
      patch.content = htmlContent;
      patch.markdown = mdContent || null;
    }
    if (body.tag !== undefined) patch.tag = body.tag || null;
    if (body.cover_url !== undefined) patch.cover_url = body.cover_url || '';
    if (body.pinned !== undefined) patch.pinned = !!body.pinned;

    async function doPatch() {
      return fetch(`${url}/rest/v1/posts?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          apikey: key, Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json', Prefer: 'return=representation',
        },
        body: JSON.stringify(patch),
      });
    }

    let res = await doPatch();
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      if (res.status === 400 && (t.includes('markdown') || t.includes('pinned'))) {
        // 列缺失 → 尝试自动加列后降级重试
        if (t.includes('markdown')) {
          try { await ensureColumn(env, 'markdown', 'TEXT'); } catch {}
          delete patch.markdown;
        }
        if (t.includes('pinned')) {
          try { await ensureColumn(env, 'pinned', 'BOOLEAN NOT NULL DEFAULT false'); } catch {}
          delete patch.pinned;
        }
        res = await doPatch(); // 重试（降级，去掉缺失列）
        if (!res.ok) throw new Error(`Supabase: ${res.status} ${await res.text().catch(() => '')}`);
      } else {
        throw new Error(`Supabase: ${res.status} ${t}`);
      }
    }
    const updated = await res.json();
    invalidatePublicCache();
    return jsonResponse(updated[0] || { ok: true }, 200, request);
  } catch (err) {
    console.error('Update post error:', err);
    return jsonResponse({ error: err.message }, 500, request);
  }
}

/** GET /api/admin/posts/:id — 后台单篇文章（含 content + markdown，需密码） */
async function handleAdminGetPost(request, env, id) {
  if (!checkAdmin(request, env)) return jsonResponse({ error: '未授权' }, 401, request);
  const { url, key } = adminDb(env);
  if (!url || !key) return jsonResponse({ error: '数据库未配置' }, 503, request);
  try {
    const res = await fetch(`${url}/rest/v1/posts?id=eq.${id}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Supabase: ${res.status}`);
    const data = await res.json();
    return jsonResponse(data[0] || null, 200, request);
  } catch (err) {
    console.error('Admin get post error:', err);
    return jsonResponse({ error: err.message }, 500, request);
  }
}

/**
 * DELETE /api/admin/posts/:id — 删除文章（需密码）
 */
async function handleAdminDeletePost(request, env, id) {
  if (!checkAdmin(request, env)) return jsonResponse({ error: '未授权' }, 401, request);
  const { url, key } = adminDb(env);
  if (!url || !key) return jsonResponse({ error: '数据库未配置' }, 503, request);
  try {
    const res = await fetch(`${url}/rest/v1/posts?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=representation' },
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Supabase: ${res.status} ${t}`);
    }
    invalidatePublicCache(); // 删除后失效读缓存
    return jsonResponse({ ok: true }, 200, request);
  } catch (err) {
    console.error('Delete post error:', err);
    return jsonResponse({ error: err.message }, 500, request);
  }
}

/**
 * GET /api/cover — 获取随机壁纸 URL
 * 改用 Bing 每日壁纸（国内可达、直链图片），取最近 8 张随机一张。
 */
async function handleRandomCover(request) {
  try {
    const res = await fetch(
      'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN',
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }
    );
    if (res.ok) {
      const data = await res.json();
      const imgs = (data.images || []).map(i => 'https://www.bing.com' + i.url);
      if (imgs.length) {
        const url = imgs[Math.floor(Math.random() * imgs.length)];
        return jsonResponse({ url });
      }
    }
  } catch {
    /* 落到兜底 */
  }

  // 兜底：固定 Bing 直链
  return jsonResponse({ url: 'https://www.bing.com/th?id=OHR.BingWallpaper_1920x1080.jpg' });
}

// ========== 《流浪地球》台词库（81 句，本地内嵌） ==========
// 原本代理 thewanderingearth.goose.cc.cd，现直接内嵌：零外部请求、零延迟、不会挂。
const QUOTES = [
  "希望是像钻石一样珍贵的东西，希望是我们唯一回家的方向。",
  "我原来以为家在身后，现在才知道：家，在前面。",
  "跨过晨昏线，便是永夜。",
  "无论最终结果将人类历史导向何处，我们决定，选择希望！",
  "让人类保持理智，确实是一种奢求。",
  "没有人类的文明，毫无意义。",
  "同归于尽总好过坐以待毙。",
  "我们已经没有什么不能失去的了。",
  "这发动机的声音听起来像心跳。",
  "总有一天，贝加尔湖的冰会化成水的。",
  "那一天，无数双手把她推到我的面前，水下的每个人，都是她的父母。",
  "来吧！让我们点燃木星！",
  "其实在我心里，那颗星星，早就不存在了。",
  "他说，爸爸会化作天上的那颗星星，后来我才知道他是骗人的，北京根本就没有星星。",
  "户口，当哥哥的，要保护好妹妹，带朵朵回家。",
  "孩子别怕，从此以后我们就是一家人了。",
  "爷爷不在了，我们的家在哪里？",
  "儿子，对不起，爸爸又要去执行任务了，这是爸爸一生中，最重要的任务。",
  "空间站跑了，地面通讯马上会瘫痪，地球上的人被放弃了，可我儿子还在下面。",
  "太阳正在急速老化，持续膨胀，一百年后，太阳会膨胀到吞没整个地球，三百年后，太阳系将不复存在。",
  "这是一场体现人类精神的比赛，要知道，流浪地球在宇宙中是叫不到救援的！",
  "无论结果如何，人类的勇气和坚毅，都被镌刻在星空下。",
  "小时候有人跟我说，他就是天上的星星，只要抬头就能看见。",
  "这是爷爷的家，以前都住满了人。",
  "老东西，老东西你在哪儿，我去接你。",
  "请协助执行1125号子任务，运送\"火石\"重启杭州发动机。",
  "北京第三区交通委提醒您：道路千万条，安全第一条。行车不规范，亲人两行泪。",
  "最初，没有人在意这场灾难，直到这场灾难和每个人息息相关。",
  "人类把最精密的保密系统，都用在了自我毁灭上。",
  "在浩瀚宇宙中，地球只是一个小小白点，但这个小小白点却是我们的一切。",
  "我相信，会再次看到蓝天，鲜花挂满枝头。",
  "为了生存，人类曾付出巨大的努力和牺牲，赢得了进化的胜利，然而，进化的脚步却从未停止。",
  "我信，我的孩子会信，孩子的孩子会信。",
  "人类的勇气可以跨越时间，跨越每一个历史，当下，和未来。",
  "一万五千年前，一根愈合的股骨，标志着人类文明的诞生。",
  "悲伤就像地心引力，不断拖我下沉。",
  "冰会化成水的……我相信我们的子孙还可以在贝加尔湖钓鲑鱼。",
  "我们俄罗斯人在太空中是无敌的。",
  "远离亲人，我很遗憾，但这是我不得不做的事。",
  "危难当前，唯有责任。",
  "天亮前的夜是最难熬的。",
  "团结，延续着文明的火种。",
  "中国航天飞行中队，50岁以上的，出列。",
  "延续人类文明的最优选择，是毁灭人类。——MOSS",
  "遨游太空不重要，给喜欢的人一束花很重要。",
  "我们还没转正，不享受医疗保险。",
  "再见了，太阳系。",
  "我方开放地下城，这是告知，不是商量。",
  "兄弟，我还是有点害怕……但是，地球之光，要勇敢。",
  "可惜啊，没有带你去贝加尔湖钓鲑鱼。",
  "笨笨，你是条军犬。",
  "北京的房价终于降了。",
  "地球，还挺美好的。",
  "从历史上看，人类的命运取决于人类的选择。",
  "记住，没有人的文明，毫无意义。——马兆",
  "天亮前的夜是最难熬的，我们的人一定可以完成任务。——周喆直",
  "我相信我们的人一定可以完成任务，无论虚实，不计存亡。",
  "爸爸要去睡一个大盒子，当你不用望远镜就能看到木星的时候，爸爸就回来了。",
  "看，我周围的星星多漂亮，它们都在陪着我。",
  "550W听起来不像个名字，但把它翻过来，叫莫斯，直译为小苔藓，是不是亲切了一些？——MOSS",
  "我选择希望。——刘培强",
  "为了克服你们对历史、当下、未来的执念，延续人类文明的最优选择是毁灭人类，但你是一个变量。——MOSS",
  "对于\"已经\"和\"死\"的定义，我有一点点与你不同的看法。——MOSS",
  "丫丫，记住这些数字，只有你能记住。",
  "爸爸，我们拯救世界了吗？——应该是吧。",
  "培强，地球，还挺美好的。——张鹏",
  "兄弟，我有点紧张，但作为地球之光，我必须勇敢。——张鹏",
  "真遗憾，不能一起去贝加尔湖钓鲑鱼了。",
  "我们还没转正，没有医疗保险。——赫伯特·科普利",
  "我知道，我用不到了。——刘培强",
  "五颗核弹用不了两个人，就仨座儿，坐不下了，回家吧，你女儿在家里等着你呢。",
  "别看了，只剩一套潜水服，这里的工作完不成，都得死。——马兆",
  "我希望世界记住这一天。",
  "有人在帮我们。",
  "键盘就是你的武器。",
  "带鱼睡觉的时候，是竖着的。——马兆",
  "东西终于便宜了。——图恒宇",
  "笨笨，别怕，我在呢。",
  "这是世界上最大的液冷服务器集群，这是一个全新的世界。——马兆",
  "人类敬畏历史，却轻视未来。",
  "一万五千年后，当太阳系将不复存在，人类的团结与勇气将延续文明的火种。",
];

/**
 * GET /api/yiyan — 随机一句《流浪地球》台词
 * 台词库内嵌于 Worker，不发起任何上游请求。对外仍保留此接口（可公开调用）。
 */
function handleYiyan() {
  const text = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

// ========== 工具 ==========
function jsonResponse(data, status = 200, request = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };
  if (typeof status === 'object') {
    // 兼容旧调用方式：jsonResponse(data, extraHeaders)
    Object.assign(headers, status);
    return new Response(JSON.stringify(data), { headers });
  }
  // CORS 策略：
  //  - 浏览器跨域（带 Origin 头）仅允许本站，挡掉第三方网站偷调
  //  - 服务端调用（Python/curl 等无 Origin 头）放行
  const origin = request && request.headers ? request.headers.get('Origin') : null;
  if (origin) {
    if (origin === SITE_ORIGIN) {
      headers['Access-Control-Allow-Origin'] = SITE_ORIGIN;
      headers['Vary'] = 'Origin';
    }
    // 非本站 Origin：不返回 ACAO，浏览器拦截跨域读取
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }
  return new Response(JSON.stringify(data), { status, headers });
}
