#!/usr/bin/env node
/**
 * GooseBlog —— 项目页导出
 *
 * 旧站「项目」页是运行时从 Supabase 的 gc_projects 表拉的
 * （applicant_name=eq.Minecraft_goose，按 sort_order 排序，分 goose / other 两类）。
 * 静态站改成：导出成 source/projects/index.md，构建期固定下来。
 *
 * 用法：
 *   export SUPABASE_URL=https://xxxx.supabase.co
 *   export SUPABASE_KEY=<service_role 或 anon key>
 *   node scripts/export-projects.mjs
 *
 * 不联网也能用：手动编辑 source/projects/index.md 里的卡片即可，格式见该文件注释。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(ROOT, 'source/projects/index.md');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function card(p) {
  return [
    '<div class="goose-project-card">',
    `  <div class="goose-project-name"><i class="${esc(p.icon || 'fa-regular fa-code')}"></i> ${esc(p.name)}</div>`,
    `  <div class="goose-project-desc">${esc(p.description || '')}</div>`,
    p.url
      ? `  <div class="goose-project-link"><a href="${esc(p.url)}" target="_blank" rel="noopener">查看详情 <i class="fa-solid fa-arrow-right"></i></a></div>`
      : '',
    '</div>'
  ]
    .filter(Boolean)
    .join('\n');
}

function page(goose, other) {
  return `---
title: 项目
type: page
layout: page
comment: false
---

<div class="goose-projects">

<h2><i class="fa-regular fa-star"></i> Goose 系列</h2>
<div class="goose-project-grid">
${goose.length ? goose.map(card).join('\n') : '<p class="goose-project-empty">还没有项目</p>'}
</div>

<h2><i class="fa-regular fa-th-large"></i> 其他项目</h2>
<div class="goose-project-grid">
${other.length ? other.map(card).join('\n') : '<p class="goose-project-empty">还没有项目</p>'}
</div>

</div>

<!--
  本文件由 scripts/export-projects.mjs 生成（数据来自旧站 Supabase gc_projects 表）。
  也可以直接手写卡片，格式：
  <div class="goose-project-card">
    <div class="goose-project-name"><i class="fa-regular fa-cube"></i> 项目名</div>
    <div class="goose-project-desc">一句话介绍</div>
    <div class="goose-project-link"><a href="https://..." target="_blank" rel="noopener">查看详情</a></div>
  </div>
-->
`;
}

(async () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('缺少 SUPABASE_URL / SUPABASE_KEY，跳过线上拉取。');
    console.error('若 source/projects/index.md 已存在，本次不做改动；否则请先配置后重跑。');
    if (!fs.existsSync(OUT)) {
      fs.mkdirSync(path.dirname(OUT), { recursive: true });
      fs.writeFileSync(OUT, page([], []), 'utf-8');
      console.log('已生成空模板 → source/projects/index.md');
    }
    process.exit(0);
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/gc_projects?select=*&applicant_name=eq.Minecraft_goose&order=sort_order.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) throw new Error(`Supabase gc_projects → ${res.status}`);
  const projects = await res.json();

  const goose = projects.filter((p) => p.category === 'goose');
  const other = projects.filter((p) => p.category === 'other');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, page(goose, other), 'utf-8');
  console.log(`✔ 已导出 ${goose.length + other.length} 个项目 → source/projects/index.md`);
})();
