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
    const slug = post.slug || (post.source || '').replace(/^_posts\//, '').replace(/\.md$/, '');
    if (!slug) return;

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
