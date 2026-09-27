/**
 * GooseBlog × Hexo —— 热力图数据生成
 *
 * 原站首页热力图的数据来自 GET /api/heatmap（Worker 现算 Supabase posts 的 created_at）。
 * 静态站没有后端，这里在 hexo g 时扫描全站文章日期，生成：
 *
 *   public/js/goose/heatmap-data.js  →  window.__GOOSE_HEATMAP__ = { "YYYY-MM-DD": n, ... }
 *
 * 主题配置里 inject.footer 已经引用了这个文件，无需手工维护。
 */
function pad(n) { return String(n).padStart(2, '0'); }

function dayKey(d) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

hexo.extend.generator.register('goose-heatmap', function (locals) {
  const counts = {};
  const posts = locals.posts && locals.posts.data ? locals.posts.data : (locals.posts || []);

  posts.forEach((post) => {
    const d = post.date;
    if (!d) return;
    const key = dayKey(new Date(d));
    counts[key] = (counts[key] || 0) + 1;
  });

  const body = 'window.__GOOSE_HEATMAP__ = ' + JSON.stringify(counts) + ';';

  return {
    path: 'js/goose/heatmap-data.js',
    data: body
  };
});
