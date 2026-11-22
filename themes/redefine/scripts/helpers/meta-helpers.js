hexo.extend.helper.register('generateMeta', function (theme, page) {
  const hexo = this;
  let robots_content="";
  if (page.robots) {
    robots_content = page.robots
  } else if (theme.seo && theme.seo.robots) {
    if (hexo.is_home()) {
      if (page.prev == 0) {
        robots_content=theme.seo.robots.home_first_page
      }else{
        robots_content=theme.seo.robots.home_other_pages
      }
    } else if (hexo.is_archive()) {
      robots_content=theme.seo.robots.archive
    } else if (hexo.is_category()) {
      robots_content=theme.seo.robots.category
    } else if (hexo.is_tag()) {
      robots_content=theme.seo.robots.tag
    }
  }
  if(robots_content){
    return `<meta name="robots" content="${robots_content}">`
  }
});

/**
* hexo-auto-canonical
* https://github.com/hyunseob/hexo-auto-canonical.git
* Copyright (c) 2015, HyunSeob
* Licensed under the MIT license.
*/

hexo.extend.helper.register('autoCanonical', function (config, page) {
  var base_url = config.url;
  if (base_url.charAt(base_url.length - 1) !== '/') base_url += '/';

  // ⚠️ 不要对 path 做 toLowerCase()。
  //   本站 permalink 是 posts/:slug/，slug 允许大写（GooseHost-2026、
  //   TimeFreeze …）。小写化之后 canonical 会指向
  //   /posts/goosehost-2026/ 这种并不存在的地址，而 sitemap.xml、atom.xml
  //   里用的都是 post.permalink 原始大小写。三者对不上 + canonical 落地 404，
  //   搜索引擎会直接放弃收录文章页，表现就是「只收录了根域名」。
  //   需要规范化只处理 host，path 一律保留 Hexo 原样。
  var canonical_path = String(page.canonical_path || '').replace(/index\.html$/, '');

  return '<link rel="canonical" href="' + base_url + canonical_path + '"/>';
});