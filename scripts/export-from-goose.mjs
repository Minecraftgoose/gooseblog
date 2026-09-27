#!/usr/bin/env node
/**
 * GooseBlog —— 从旧站导出内容到 Hexo
 *
 * 旧站的文章 / 友链 / 站点页面（关于、公告）都存在 Supabase，
 * 由 Worker（gooseblog-api）暴露。这个脚本直接连 Supabase 把它们导出成
 * Hexo 能吃的 Markdown 和 YAML，实现「资源不变、内容不变、只换前端」。
 *
 * 用法：
 *   export SUPABASE_URL=https://xxxx.supabase.co
 *   export SUPABASE_KEY=<service_role 或 anon key>
 *   node scripts/export-from-goose.mjs
 *
 * 可选参数：
 *   --out=source/_posts        文章输出目录（默认 source/_posts）
 *   --only=posts|friends|pages 只导出某一类
 *
 * 输出：
 *   source/_posts/<slug>.md            每篇文章（含 front-matter：title/date/tags/cover/pinned）
 *   source/_data/friends.yml           友链（也可直接粘进 themes/redefine/_config.yml 的 links）
 *   source/about/index.md              关于页
 *   source/_data/announcement.txt      公告文本
 *
 * 注意：文章正文是 Worker 用 marked 渲染过的 HTML，Hexo 也吃 HTML，
 * 直接落盘即可；如果更想维护 Markdown，把 content 字段换成 raw 字段（有的话）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

const args = process.argv.slice(2);
const arg = (k, d) => {
  const hit = args.find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.split('=').slice(1).join('=') : d;
};
const ONLY = arg('only', 'all');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('缺少环境变量：SUPABASE_URL / SUPABASE_KEY');
  console.error('示例：SUPABASE_URL=https://xxx.supabase.co SUPABASE_KEY=xxx node scripts/export-from-goose.mjs');
  process.exit(1);
}

async function sb(pathname) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`Supabase ${pathname} → ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const yamlStr = (s) => {
  if (s == null) return "''";
  const str = String(s);
  // 需要引号的情况：含特殊字符或纯数字之外，一律用单引号包起来
  if (/^[a-zA-Z0-9_\-\.\/ ]+$/.test(str) && str.trim() === str && str !== '') return str;
  return "'" + str.replace(/'/g, "''") + "'";
};

function frontMatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      v.forEach((item) => lines.push(`  - ${yamlStr(item)}`));
    } else if (typeof v === 'boolean' || typeof v === 'number') {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${yamlStr(v)}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

async function exportPosts() {
  const outDir = path.resolve(ROOT, arg('out', 'source/_posts'));
  fs.mkdirSync(outDir, { recursive: true });

  const posts = await sb('posts?select=*&order=created_at.asc');
  console.log(`文章 ${posts.length} 篇`);

  let n = 0;
  for (const p of posts) {
    const tags = (p.tag || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const categories = (p.category || p.categories || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const fm = frontMatter({
      title: p.title || p.slug,
      date: p.created_at,
      updated: p.updated_at,
      tags,
      categories: categories.length ? categories : undefined,
      cover: p.cover_url || undefined,
      og_image: p.cover_url || undefined,
      excerpt: p.excerpt || undefined,
      sticky: p.pinned ? true : undefined,
      slug: p.slug,
      description: p.excerpt || undefined
    });

    const body = p.content || p.raw || `<p>${p.excerpt || ''}</p>`;
    fs.writeFileSync(path.join(outDir, `${p.slug}.md`), fm + '\n' + body + '\n', 'utf-8');
    n++;
  }
  console.log(`✔ 已写出 ${n} 篇文章 → ${path.relative(ROOT, outDir)}`);
}

async function exportFriends() {
  const friends = await sb('friends?select=*&order=created_at.asc');
  const outDir = path.resolve(ROOT, 'source/_data');
  fs.mkdirSync(outDir, { recursive: true });

  const lines = [
    '# 由 scripts/export-from-goose.mjs 从旧站 friends 表导出',
    '# 用法二选一：',
    '#   1) 粘贴到 themes/redefine/_config.yml 的 links: 段',
    '#   2) 保持本文件，在主题配置 links 里读不到时手动同步',
    'friends:'
  ];
  friends.forEach((f) => {
    lines.push(`  - name: ${yamlStr(f.name)}`);
    lines.push(`    link: ${yamlStr(f.url)}`);
    if (f.avatar) lines.push(`    avatar: ${yamlStr(f.avatar)}`);
    if (f.description) lines.push(`    description: ${yamlStr(f.description)}`);
  });
  fs.writeFileSync(path.join(outDir, 'friends.yml'), lines.join('\n') + '\n', 'utf-8');
  console.log(`✔ 已导出 ${friends.length} 条友链 → source/_data/friends.yml`);
}

async function exportPages() {
  const pages = await sb('site_pages?select=*');
  const about = pages.find((p) => p.slug === 'about');
  const ann = pages.find((p) => p.slug === 'announcement');

  if (about) {
    const dir = path.resolve(ROOT, 'source/about');
    fs.mkdirSync(dir, { recursive: true });
    const fm = frontMatter({ title: '关于', type: 'about', layout: 'page' });
    fs.writeFileSync(path.join(dir, 'index.md'), fm + '\n' + (about.html || about.content || '') + '\n', 'utf-8');
    console.log('✔ 已导出关于页 → source/about/index.md');
  }
  if (ann && ann.content) {
    const dir = path.resolve(ROOT, 'source/_data');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'announcement.txt'), String(ann.content).trim() + '\n', 'utf-8');
    console.log('✔ 已导出公告 → source/_data/announcement.txt');
    console.log('  把它填进 themes/redefine/_config.yml 的 home.sidebar.announcement');
  }
}

(async () => {
  try {
    if (ONLY === 'all' || ONLY === 'posts') await exportPosts();
    if (ONLY === 'all' || ONLY === 'friends') await exportFriends();
    if (ONLY === 'all' || ONLY === 'pages') await exportPages();
    console.log('\n完成。接下来：npx hexo clean && npx hexo g');
  } catch (e) {
    console.error('导出失败：', e.message);
    process.exit(1);
  }
})();
