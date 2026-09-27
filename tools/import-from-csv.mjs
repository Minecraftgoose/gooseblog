#!/usr/bin/env node
/**
 * GooseBlog —— 从导出的 CSV 恢复内容到 Hexo
 *
 * 用法（CSV 不入库，按需自备；用 --dir 指定目录）：
 *   node tools/import-from-csv.mjs --dir=/path/to/csv
 *
 * 输入文件（Supabase 表导出）：
 *   posts_rows.csv        id,title,slug,excerpt,content,tag,published,created_at,updated_at,cover_url,markdown,pinned
 *   friends_rows.csv      id,name,description,url,avatar,created_at
 *   site_pages_rows.csv   slug,content,updated_at
 *
 * 输出：
 *   source/_posts/<slug>.md     文章（正文优先用 markdown 列，为空才退回 content 的 HTML）
 *   source/_data/links.yml      友链（主题在 generateBefore 自动读取）
 *   source/about/index.md       关于页
 *   主题配置 home.sidebar.announcement   公告
 *
 * 说明：
 *   - created_at 是 UTC，这里统一转成站点时区（Asia/Shanghai）再写进 front-matter，
 *     否则 Hexo 会把 UTC 时间当成东八区时间，文章时间会比原站早 8 小时。
 *   - 原站没有 category 字段，分类由下面的 CATEGORY_MAP 人工补（按 slug 映射）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const arg = (k, d) => {
  const hit = args.find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.split('=').slice(1).join('=') : d;
};
const CSV_DIR = path.resolve(arg('dir', path.join(ROOT, 'csv')));
const TZ_OFFSET_MIN = Number(arg('tz', 8 * 60)); // 站点时区偏移（分钟），默认 +08:00

/* ---------------- CSV 解析（支持引号包裹、字段内换行/逗号/转义双引号） ---------------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      i++;
      continue;
    }
    if (ch === '\r') {
      i++;
      continue;
    }
    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i++;
      continue;
    }
    field += ch;
    i++;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }

  const header = rows.shift();
  return rows
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((h, idx) => [h.trim(), r[idx]])));
}

const readCSV = (name) => {
  const p = path.join(CSV_DIR, name);
  if (!fs.existsSync(p)) {
    console.warn(`⚠ 跳过：找不到 ${p}`);
    return [];
  }
  return parseCSV(fs.readFileSync(p, 'utf-8'));
};

/* ---------------- 工具 ---------------- */
const pad = (n) => String(n).padStart(2, '0');

/** "2026-08-23 14:00:01.259177+00" → "2026-08-23 22:00:01"（东八区） */
function toSiteTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const shifted = new Date(d.getTime() + TZ_OFFSET_MIN * 60 * 1000);
  return (
    shifted.getUTCFullYear() + '-' + pad(shifted.getUTCMonth() + 1) + '-' + pad(shifted.getUTCDate()) +
    ' ' + pad(shifted.getUTCHours()) + ':' + pad(shifted.getUTCMinutes()) + ':' + pad(shifted.getUTCSeconds())
  );
}

/** YAML 标量：能用裸标量就用，否则单引号包裹并转义内部单引号 */
function yamlStr(s) {
  if (s == null) return "''";
  const str = String(s);
  if (str === '') return "''";
  if (/^[A-Za-z0-9_\-\.\/ ]+$/.test(str) && str.trim() === str) return str;
  return "'" + str.replace(/'/g, "''") + "'";
}

function frontMatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      if (!v.length) continue;
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

/* ---------------- 分类映射（原站没有 category 字段，人工补） ----------------
 * tag 记品牌与类型（GooseHost / 文档 / 教程…），分类记内容域，两者互补。
 * 只做单层分类，不搞层级，避免生成嵌套 URL。
 */
const CATEGORY_MAP = {
  // Goose 自家产品
  'goosehost-deploy-yourself': '项目',
  'goosehost-tutorial': '项目',
  'goosehost-cli': '项目',
  'hyper-glass-all': '项目',
  'ghg2-log': '项目',
  'hyper-glass-hahaha': '项目',
  'why-gooseai-disappear': '项目',
  // 教程
  'how-to-write-markdown': '教程',
  'how-to-check-your-website': '教程',
  // 随笔
  '918-95': '随笔',
  'why-github-is-getting-worse': '随笔',
  // 折腾 / 小玩意
  'drive': '折腾',
  'TimeFreeze': '折腾',
  'kimi-web': '折腾',
  // 建站
  'gooseblog-update-20260727': '建站',
};

/* ---------------- 1. 文章 ---------------- */
function importPosts() {
  const rows = readCSV('posts_rows.csv');
  const outDir = path.join(ROOT, 'source/_posts');
  fs.mkdirSync(outDir, { recursive: true });

  let n = 0;
  let skipped = 0;
  const seen = new Set();

  for (const r of rows) {
    // published 为 false 的是草稿，Hexo 默认 render_drafts:false 不会生成，这里直接跳过
    if (String(r.published).toLowerCase() === 'false') {
      skipped++;
      continue;
    }

    const slug = (r.slug || '').trim();
    if (!slug) {
      skipped++;
      continue;
    }
    if (seen.has(slug)) {
      console.warn(`⚠ slug 重复，跳过：${slug}`);
      skipped++;
      continue;
    }
    seen.add(slug);

    const tags = (r.tag || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // 正文：优先 markdown 原文（可继续维护），为空才退回渲染后的 HTML
    const md = (r.markdown || '').trim();
    const html = (r.content || '').trim();
    const body = md || html;
    const bodyKind = md ? 'markdown' : 'html';

    const fm = frontMatter({
      title: r.title || slug,
      date: toSiteTime(r.created_at),
      updated: toSiteTime(r.updated_at),
      tags,
      categories: CATEGORY_MAP[slug] ? [CATEGORY_MAP[slug]] : [],
      cover: r.cover_url || undefined,
      og_image: r.cover_url || undefined,
      excerpt: (r.excerpt || '').trim() || undefined,
      description: (r.excerpt || '').trim() || undefined,
      sticky: String(r.pinned).toLowerCase() === 'true' ? true : undefined,
      slug
    });

    fs.writeFileSync(path.join(outDir, `${slug}.md`), fm + '\n' + body + '\n', 'utf-8');
    n++;
    console.log(`  ✔ ${slug}.md  (${bodyKind}, 分类=${CATEGORY_MAP[slug] || '无'}, ${tags.length ? tags.join('/') : '无标签'})`);
  }

  console.log(`✔ 文章：写出 ${n} 篇，跳过 ${skipped} 篇 → source/_posts/`);
  return n;
}

/* ---------------- 2. 友链 ---------------- */
function importFriends() {
  const rows = readCSV('friends_rows.csv');
  const outDir = path.join(ROOT, 'source/_data');
  fs.mkdirSync(outDir, { recursive: true });

  const lines = [
    '# 由 tools/import-from-csv.mjs 从 friends_rows.csv 生成',
    '# 主题在 generateBefore 会自动读取本文件，无需再粘贴进主题配置',
    ...(rows.length
      ? ['- links_category: 朋友们', '  has_thumbnail: true', '  list:']
      : ['- links_category: 朋友们', '  has_thumbnail: false', '  list: []'])
  ];

  for (const f of rows) {
    lines.push(`    - name: ${yamlStr(f.name)}`);
    lines.push(`      link: ${yamlStr(f.url)}`);
    if (f.avatar) lines.push(`      avatar: ${yamlStr(f.avatar)}`);
    if (f.description) lines.push(`      description: ${yamlStr(f.description)}`);
  }

  fs.writeFileSync(path.join(outDir, 'links.yml'), lines.join('\n') + '\n', 'utf-8');
  console.log(`✔ 友链：${rows.length} 条 → source/_data/links.yml`);
  return rows.length;
}

/* ---------------- 3. 站点页面（关于 / 公告） ---------------- */
function importSitePages() {
  const rows = readCSV('site_pages_rows.csv');
  const bySlug = Object.fromEntries(rows.map((r) => [r.slug, r]));

  // 关于页
  const about = bySlug.about;
  if (about && about.content) {
    const dir = path.join(ROOT, 'source/about');
    fs.mkdirSync(dir, { recursive: true });
    const fm = frontMatter({ title: '关于', type: 'about', layout: 'page', comment: false });
    fs.writeFileSync(path.join(dir, 'index.md'), fm + '\n' + about.content.trim() + '\n', 'utf-8');
    console.log('✔ 关于页 → source/about/index.md');
  }

  // 公告：直接写进主题配置（home.sidebar.announcement）
  const ann = bySlug.announcement;
  if (ann && ann.content) {
    const cfgPath = path.join(ROOT, 'themes/redefine/_config.yml');
    let cfg = fs.readFileSync(cfgPath, 'utf-8');
    const text = ann.content.trim().replace(/\n/g, ' ');
    const re = /^(\s*)announcement:.*$/m;
    if (re.test(cfg)) {
      cfg = cfg.replace(re, `$1announcement: ${yamlStr(text)}`);
      fs.writeFileSync(cfgPath, cfg, 'utf-8');
      console.log('✔ 公告已写入主题配置 home.sidebar.announcement');
    } else {
      console.warn('⚠ 主题配置里没找到 announcement 行，请手动填写：\n  ' + text);
    }
  }
}

/* ---------------- main ---------------- */
console.log(`读取 CSV 目录：${CSV_DIR}\n`);
importPosts();
console.log('');
importFriends();
console.log('');
importSitePages();
console.log('\n完成。接下来：npm run build');
