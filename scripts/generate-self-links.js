/**
 * GooseBlog × Hexo —— 站内链接索引
 *
 * 解决「自己站解析不出来」的问题。
 *
 * 原站的做法是：Worker 发现链接指向自己，就绕开公网回环 fetch，直查 Supabase
 * （见 gooseblog-api 的 handleSelfLinkPreview，注释写着「绝不走公网回环 fetch」）。
 * 现在没有数据库了，而且 Worker 去 fetch 自己域名同样容易被 Cloudflare 拦下，
 * 所以换个更彻底的办法：**构建期就把站内文章索引生成好**。
 *
 * 生成：
 *   public/js/goose/self-links.js
 *     window.__GOOSE_SELF_LINKS__ = {
 *       "some-slug": { title, excerpt, cover, url, date },
 *       ...
 *     }
 *
 * 前端 link-card.js 遇到自己站的链接，先查这张表 —— 零网络请求、100% 命中、
 * 而且拿到的是本地数据（正文摘要、封面图全都有），比抓 og 标签还准。
 */
function escapeJs(s) {
  return String(s == null ? '' : s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ')
    .trim();
}

hexo.extend.generator.register('goose-self-links', function (locals) {
  const posts = locals.posts && locals.posts.data ? locals.posts.data : locals.posts || [];
  const map = {};

  posts.forEach((post) => {
    // slug 优先用 front-matter 里显式写的，退回 Hexo 自己算的
    const slug = post.slug || (post.source || '').replace(/^_posts\//, '').replace(/\.md$/, '');
    if (!slug) return;

    // 摘要：excerpt → description → 正文开头一段
    let excerpt = post.excerpt || post.description || '';
    if (!excerpt && post.content) {
      const text = String(post.content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      excerpt = text.slice(0, 120);
    }

    map[slug] = {
      title: post.title || slug,
      excerpt: excerpt.slice(0, 160),
      cover: post.cover || post.og_image || '',
      url: post.permalink,
      date: post.date ? new Date(post.date).toISOString().slice(0, 10) : ''
    };
  });

  const json = JSON.stringify(map);
  const body = 'window.__GOOSE_SELF_LINKS__ = ' + json + ';';

  return {
    path: 'js/goose/self-links.js',
    data: body
  };
});
