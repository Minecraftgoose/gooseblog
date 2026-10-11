#!/usr/bin/env node
/**
 * GooseBlog —— 批量体检文章外链的抓图结果
 *
 * 用法（在仓库根目录跑）：
 *   node tools/probe-links.js                                  # 默认打 Netlify 备胎
 *   node tools/probe-links.js https://blog.goose.cc.cd         # 打主站做对照
 *   node tools/probe-links.js https://blog.cyann.top source/_posts
 *
 * 为什么需要它：单测一个 github.com 通，不代表全通。
 * 备胎函数在俄亥俄、且几乎次次冷启动，跨太平洋抓国内站经常超时；
 * 一条条 curl 太慢，这个脚本一次把文章里所有外链排队跑完，
 * 直接列出失败清单 + 耗时，谁超时、谁被 403、谁压根没 og 图，一眼看清。
 *
 * 零依赖：只用 Node 内置 https 模块，Node 12+ 都能跑（老机器没有全局 fetch）。
 */

var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');

var ENDPOINT = process.argv[2] || 'https://blog.cyann.top';
var POSTS_DIR = process.argv[3] || 'source/_posts';
var TIMEOUT_MS = 20000;

/** 收集文章里的行内外链（跳过代码块和站内链接） */
function collectLinks(dir) {
  var links = {};
  var files;
  try {
    files = fs.readdirSync(dir).filter(function (f) { return /\.md$/.test(f); });
  } catch (e) {
    console.error('读不到目录: ' + dir);
    console.error('提示：请在仓库根目录运行，或把第二个参数指向正确的 _posts 路径');
    process.exit(1);
  }
  files.forEach(function (f) {
    var text = fs.readFileSync(path.join(dir, f), 'utf8');
    // 去掉代码块和行内代码，免得把示例里的 URL 也算进去
    var body = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
    var re = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;
    var m;
    while ((m = re.exec(body)) !== null) {
      if (!links[m[1]]) links[m[1]] = [];
      if (links[m[1]].indexOf(f) < 0) links[m[1]].push(f);
    }
  });
  return links;
}

function get(url) {
  return new Promise(function (resolve) {
    var mod = /^https:/i.test(url) ? https : http;
    var t0 = Date.now();
    var req = mod.get(url, { timeout: TIMEOUT_MS, headers: { Accept: 'application/json' } }, function (res) {
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        resolve({ status: res.statusCode, ms: Date.now() - t0, text: Buffer.concat(chunks).toString('utf8') });
      });
    });
    req.on('timeout', function () { req.destroy(); resolve({ ms: Date.now() - t0, err: 'timeout' }); });
    req.on('error', function (e) { resolve({ ms: Date.now() - t0, err: String(e.message || e) }); });
  });
}

async function probe(base, target) {
  var url = base.replace(/\/$/, '') + '/api/link-preview?url=' + encodeURIComponent(target);
  var r = await get(url);
  if (r.err) return { state: 'TIMEOUT', ms: r.ms, note: r.err };
  if (r.status === 404) return { state: 'ROUTE_404', ms: r.ms, note: '函数没部署 / config.path 没生效' };
  var data = null;
  try { data = JSON.parse(r.text); } catch (e) { /* 非 JSON */ }
  if (!data) return { state: 'NOT_JSON', ms: r.ms, note: r.text.slice(0, 80).replace(/\s+/g, ' ') };
  if (data.error) return { state: 'FETCH_FAIL', ms: r.ms, note: data.error };
  if (!data.image) return { state: 'NO_IMAGE', ms: r.ms, note: '目标站没有 og:image' };
  if (data.description === '鹅滴博客嘎嘎')
    return { state: 'OK_BUT', ms: r.ms, note: '描述是站点默认值，不是文章摘要' };
  return { state: 'OK', ms: r.ms, note: '' };
}

async function main() {
  var links = collectLinks(POSTS_DIR);
  var list = Object.keys(links);
  console.log('抓图接口: ' + ENDPOINT);
  console.log('待检外链: ' + list.length + ' 条');
  console.log('');

  if (!list.length) {
    console.log('没找到外链。检查第二个参数是不是指到了 _posts 目录。');
    return;
  }

  var rows = [];
  var i = 0;
  async function worker() {
    while (i < list.length) {
      var u = list[i++];
      var r = await probe(ENDPOINT, u);
      rows.push({ u: u, state: r.state, ms: r.ms, note: r.note });
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);

  var order = { ROUTE_404: 0, NOT_JSON: 1, FETCH_FAIL: 2, TIMEOUT: 3, NO_IMAGE: 4, OK_BUT: 5, OK: 6 };
  rows.sort(function (a, b) { return order[a.state] - order[b.state] || b.ms - a.ms; });

  rows.forEach(function (r) {
    console.log('[' + r.state + '] ' + (r.ms + 'ms').padStart(7) + '  ' + r.u + (r.note ? '\n            -> ' + r.note : ''));
  });

  var ok = rows.filter(function (r) { return r.state === 'OK'; });
  var bad = rows.filter(function (r) { return r.state === 'FETCH_FAIL' || r.state === 'TIMEOUT'; });
  var slow = rows.filter(function (r) { return r.ms > 3000; });

  console.log('');
  console.log('---- 汇总 ----');
  console.log('成功      : ' + ok.length + ' / ' + rows.length);
  console.log('抓取失败  : ' + bad.length);
  console.log('耗时 >3s  : ' + slow.length + '  (这些最贴近超时线，改 region 后应明显下降)');
  if (bad.length) {
    console.log('');
    console.log('失败清单:');
    bad.forEach(function (r) { console.log('  - ' + r.u + '   (' + r.note + ')'); });
  }
}

main();