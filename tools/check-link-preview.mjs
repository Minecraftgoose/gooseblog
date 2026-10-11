#!/usr/bin/env node
/**
 * GooseBlog —— 链接预览代理体检脚本
 *
 * 用法（在你自己电脑上跑，沙盒/CI 里访问不了外网的不算）：
 *   node tools/check-link-preview.mjs https://你的备胎域名
 *   node tools/check-link-preview.mjs https://xxx.netlify.app https://github.com
 *   node tools/check-link-preview.mjs                  # 同时体检主站和备胎
 *
 * 干什么：
 *   卡片没图是静默降级 —— fetch 失败前端什么都不报，页面上只看到骨架。
 *   本脚本把"抓图到底挂在哪一环"直接打出来，不用靠猜：
 *
 *     A. 函数有没有部署上去（404 = 没部署 / 路由没生效）
 *     B. 函数活着但抓取失败（200 里带 error：超时、被目标站 403）
 *     C. 函数正常（200 里带 image / title）
 *
 * 会同时探测两条路径：
 *   /api/link-preview          前端实际使用的对外路径
 *   /.netlify/functions/link-preview   函数默认路径
 *   两条结果不一样时，基本就能定位是路由环节还是部署环节的问题。
 */

const args = process.argv.slice(2);
const targets = [];
let probeUrl = 'https://github.com';

for (const a of args) {
  if (/^https?:\/\//i.test(a)) {
    // 带 /api 之类的路径说明是"要抓的目标站"，其余当站点域名
    if (a.includes('/', 8)) targets.push(a);
    else probeUrl = a;
  }
}

const SITES =
  targets.length > 0
    ? []
    : ['https://blog.goose.cc.cd'];

const sites = targets.length > 0 ? targets : SITES;
if (!sites.length) sites.push('https://blog.goose.cc.cd');

const TIMEOUT_MS = 25000;

async function probe(site, path) {
  const url = site.replace(/\/$/, '') + path + '?url=' + encodeURIComponent(probeUrl);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' }
    });
    const text = await res.text();
    const ms = Date.now() - t0;
    clearTimeout(timer);
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      /* 不是 JSON：多半是托管平台返回的 HTML 404 页面 */
    }
    return { ok: true, status: res.status, ms, text, data };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, status: 0, ms: Date.now() - t0, error: String(e && e.message ? e.message : e) };
  }
}

function verdict(r) {
  if (!r.ok) return '❌ 请求失败（超时/网络）：' + r.error;
  if (r.status === 404) return '❌ 404 —— 这一环没部署/没生效';
  if (r.status !== 200) return '⚠️ HTTP ' + r.status;
  if (!r.data) return '⚠️ 返回 200 但不是 JSON（多半是平台 404 页）';
  if (r.data.error) return '⚠️ 200 但带 error：「' + r.data.error + '」—— 函数活着，抓取目标站失败';
  if (!r.data.image && !r.data.title) return '⚠️ 200 但 title/image 全空 —— 目标站没有 og 标签';
  return '✅ 正常';
}

function show(label, r) {
  console.log('  ' + label);
  console.log('    状态: ' + verdict(r));
  if (r.ok) {
    console.log('    耗时: ' + r.ms + 'ms');
    if (r.data) {
      console.log('    title : ' + JSON.stringify(r.data.title || ''));
      console.log('    image : ' + JSON.stringify(r.data.image || ''));
      console.log('    favicon: ' + JSON.stringify(r.data.favicon || ''));
    } else if (r.status !== 200) {
      console.log('    响应体前 200 字: ' + JSON.stringify(r.text.slice(0, 200)));
    }
  }
  console.log('');
}

async function main() {
  console.log('抓图目标: ' + probeUrl);
  console.log('');

  for (const site of sites) {
    console.log('════ ' + site + ' ════');
    const outer = await probe(site, '/api/link-preview');
    const inner = await probe(site, '/.netlify/functions/link-preview');
    show('/api/link-preview（前端实际用的）', outer);
    show('/.netlify/functions/link-preview（函数默认路径）', inner);

    // 给出结论
    if (outer.ok && outer.status === 200 && outer.data && !outer.data.error) {
      console.log('  → 结论：正常，卡片应该有图。若页面仍无图，问题在前端或缓存（硬刷一次再看）。');
    } else if (outer.ok && outer.status === 404 && inner.ok && inner.status === 200) {
      console.log('  → 结论：函数部署了，但 /api/link-preview 没指过去。');
      console.log('     Netlify：检查函数里 export const config = { path: "/api/link-preview" } 还在不在，');
      console.log('             或补一条 _redirects: /api/link-preview /.netlify/functions/link-preview 200');
    } else if (outer.status === 404 && inner.status === 404) {
      console.log('  → 结论：函数根本没部署上去。');
      console.log('     Netlify：deploy 命令必须带 --functions=netlify/functions，');
      console.log('             否则只有静态产物被上传，函数一个都不会有。');
    } else if (outer.data && outer.data.error) {
      console.log('  → 结论：函数活着，但抓 ' + probeUrl + ' 失败。');
      console.log('     常见原因：目标站拒绝数据中心 IP（403）/ 响应太慢触发 5s 超时。');
      console.log('     换几个站试试能区分：全挂多半是出站被限，单个站挂是对方的问题。');
    }
    console.log('');
  }
}

main();
