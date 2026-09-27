/**
 * GooseBlog × Hexo —— 把下划线开头的静态文件带进产物
 *
 * Hexo 默认忽略 source/ 下以 _ 开头的文件（_posts / _data 除外），
 * 于是 source/_headers 不会出现在 public/ 里，Cloudflare Pages 的缓存头就丢了。
 *
 * 这里用 generator 手动把它注册成路由，保证 public/_headers 一定存在。
 */
const fs = require('fs');
const path = require('path');

// 注意：hexo.source_dir 已经是 .../source，这里用相对路径
const FILES = [
  { src: '_headers', dest: '_headers' },
  { src: '_redirects', dest: '_redirects' }
];

hexo.extend.generator.register('goose-extra-assets', function () {
  const out = [];
  for (const item of FILES) {
    const abs = path.join(hexo.source_dir, item.src);
    if (!fs.existsSync(abs)) continue;
    out.push({
      path: item.dest,
      data: fs.readFileSync(abs)
    });
  }
  return out;
});
