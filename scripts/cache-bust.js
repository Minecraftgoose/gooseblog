#!/usr/bin/env node
/**
 * GooseBlog —— 静态资源内容指纹（cache-bust）
 *
 * 干什么：
 *   构建完成后扫一遍 public/，把 HTML / CSS 里引用到的站内静态资源
 *   （/js/app.js、/css/main.css、/images/og.webp……）改写成
 *   /js/app.js?v=3f2a9c1b 的形式，v 取文件内容的 md5 前 10 位。
 *
 * 为什么必须先做这一步才能加长缓存：
 *   本站所有资源文件名都是固定的、不带 hash。直接给 /js/* 设一年的强缓存，
 *   下次改了 link-card.js，老访客浏览器里那份还是旧的 —— URL 没变它就不会
 *   重新下载，于是新的 HTML 配旧的 JS，卡片结构对不上就是一片乱。
 *   加了指纹之后：内容不变 → v 不变 → 缓存继续命中；内容一变 → URL 变 →
 *   浏览器当新资源下载。这样才敢写 max-age=31536000, immutable。
 *
 * ⚠️ 顺序不能反：先 hexo generate，再跑本脚本。
 *    改的是已经落到 public/ 的产物，不是源码。
 *
 * ⚠️ 只处理 .html 和 .css 两类文件：
 *    · HTML 里的 <script src> / <link href> / <img src> / 内联 style 的 url()
 *    · CSS 里的 url()（字体、背景图）
 *    search.xml / atom.xml 里的图片链接不影响浏览器缓存，不处理。
 *
 * ⚠️ 只认以单个 / 开头的站内绝对路径。外链（https://…）和协议相对地址
 *    （//cdn.xxx/a.png）一律不动 —— 在别人家的 URL 上挂 ?v= 是帮倒忙。
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

/** 需要加指纹的资源扩展名 */
const ASSET_EXT = 'js|css|woff2?|ttf|otf|eot|webp|png|jpe?g|gif|svg|ico';

/** 要扫描并改写的文件类型 */
const SCAN_EXT = /\.(html|css)$/i;

/**
 * 匹配：引号或括号 + / + 站内路径 + 扩展名 + 可选的旧 ?v= + 引号或括号
 *
 * 首字符刻意排除了 / —— 否则 //cdn.xxx/a.js 会被当成 /cdn.xxx/a.js，
 * 给外链挂上 ?v= 是实打实的破坏。
 * 中间字符集不含 ? # " ' ) 空格 —— 不会跨出当前这个属性值吃掉后面的内容。
 *
 * 尾部那个可选的 (?:\?v=…)? 是为了**可重复执行**：
 *   不带 clean 的 generate 会在已经加过指纹的 HTML 上再跑一次，
 *   如果认不出旧的 ?v=，这条引用就永远停在第一次算出来的值上 ——
 *   文件改了 URL 不改，长缓存反而变成了"永远推不到新版"。
 *   认出旧值并整体覆盖，重复跑多少次结果都一样。
 *   注意只认纯 ?v=十六进制 这一种形态；带其它参数（?v=x&y=1）的
 *   会匹配失败、原样保留，不会写坏。
 */
const REF_RE = new RegExp(
  '(["\'\\(])' +
    '\\/([A-Za-z0-9_\\-.~%][A-Za-z0-9_\\-.~%\\/]*?\\.(?:' +
    ASSET_EXT +
    '))' +
    '(?:\\?v=[0-9a-f]+)?' +
    '(["\\)])',
  'gi'
);

function md5File(file) {
  const buf = fs.readFileSync(file);
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, 10);
}

/** 递归收集 public/ 下所有待扫描文件 */
function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else if (SCAN_EXT.test(name)) {
      out.push(full);
    }
  }
  return out;
}

/** 路径 → public 下的真实文件（处理 URL 编码） */
function resolveAsset(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    decoded = urlPath;
  }
  return path.join(PUBLIC, decoded);
}

function main() {
  if (!fs.existsSync(PUBLIC)) {
    console.error('[cache-bust] 找不到 public/，是不是还没 generate？');
    process.exit(1);
  }

  const files = walk(PUBLIC, []);
  const versionCache = Object.create(null); // 路径 → v，算过一次就不重复读盘
  const missing = new Set();

  let changedFiles = 0;
  let totalRefs = 0;

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');

    const out = src.replace(REF_RE, (all, open, urlPath, close) => {
      const key = '/' + urlPath;

      let v = versionCache[key];
      if (v === undefined) {
        const abs = resolveAsset(urlPath);
        if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
          v = md5File(abs);
          versionCache[key] = v;
        } else {
          v = null;
          versionCache[key] = null;
          missing.add(key);
        }
      }
      if (!v) return all; // 产物里没这个文件，保持原样，别把 URL 写坏

      totalRefs++;
      return open + key + '?v=' + v + close;
    });

    if (out !== src) {
      fs.writeFileSync(file, out, 'utf8');
      changedFiles++;
    }
  }

  console.log(
    '[cache-bust] 扫描 ' +
      files.length +
      ' 个文件，改写 ' +
      changedFiles +
      ' 个，共 ' +
      totalRefs +
      ' 处资源引用加上指纹'
  );
  if (missing.size) {
    console.warn(
      '[cache-bust] 以下引用在 public/ 里找不到实体文件，已跳过（不影响页面）：'
    );
    for (const m of missing) console.warn('  - ' + m);
  }
}

main();
