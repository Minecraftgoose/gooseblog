/**
 * 生成站内链接索引 —— public/js/goose/self-links.js
 *
 * 供 source/js/goose/link-card.js 查用：正文里出现自己站的链接时，
 * 直接从这个索引取标题 / 摘要 / 封面，零网络请求、必定命中。
 *
 * ⚠️ 两个坑，都踩过：
 *
 *  1. 摘要不能原样丢给前端。
 *     Hexo 里 post.excerpt 可能是渲染过的 HTML（<p>今年是……</p>），
 *     也可能还是原始 Markdown（**粗体**）。前端是 textContent 赋值的，
 *     标签和星号会当场变成可见文字，卡片上直接印出 "<p>…</p>"。
 *     所以这里统一走 toPlainText() 洗成纯文本再截断。
 *     front-matter 里的 description 是手写纯文本，最干净，优先用它。
 *
 *  2. 索引不能只认 slug。
 *     permalink 是 posts/:slug/，哪天改成别的（或加了子目录/前后缀），
 *     前端那句硬编码的 path.match(/^posts\/([^/]+)/) 就全军覆没 ——
 *     站内链接一个个退化成"域名 + 路径末段"的裸卡片。
 *     所以每条额外输出 path（permalink 的 pathname），前端按路径查，
 *     slug 只当兜底。permalink 怎么改都不用再动前端。
 */

/** HTML / Markdown → 纯文本 */
function toPlainText(s) {
  return String(s == null ? '' : s)
    // 整块丢掉的内容
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    // 块级标签先换成空格，免得前后两段粘在一起
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|tr|blockquote|pre)>/gi, ' ')
    // 剩下的行内标签直接抹掉
    .replace(/<[^>]+>/g, '')
    // Markdown 残留（excerpt 未渲染时）
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')        // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')     // 链接，留文字
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')          // 标题
    .replace(/^\s{0,3}[-*+>]\s+/gm, '')          // 列表 / 引用
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')       // 行内 / 块代码
    .replace(/\*\*([^*]+)\*\*/g, '$1')           // 加粗
    .replace(/(^|\s)\*([^*\n]+)\*/g, '$1$2')     // 斜体
    .replace(/~~([^~]+)~~/g, '$1')               // 删除线
    // 实体还原（放在去标签之后，还原出来的 < 不会再被当标签吃掉）
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** 摘要截断：整词切，超长补省略号，绝不切出半截标签 */
function clip(s, max) {
  var t = toPlainText(s);
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/[\s，。、；：,.;:!?！？]*$/, '') + '…';
}

/** 取 URL 的 pathname，去掉首尾斜杠（permalink 恒为绝对路径） */
function pathOf(u) {
  if (!u) return '';
  try {
    return new URL(u).pathname.replace(/^\/+|\/+$/g, '');
  } catch (e) {
    return String(u).replace(/^\/+|\/+$/g, '');
  }
}

/**
 * JSON 要内联进 <script>，光靠 JSON.stringify 不够：
 * 标题里要是出现 </script>，浏览器会当场闭合脚本，整页 JS 全崩。
 * 把 < > & 转成 unicode 转义，语义不变、绝对安全。
 */
function safeInlineJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

hexo.extend.generator.register('goose-self-links', function (locals) {
  const posts = locals.posts && locals.posts.data ? locals.posts.data : locals.posts || [];
  const map = {};

  posts.forEach((post) => {
    const slug = post.slug || (post.source || '').replace(/^_posts\//, '').replace(/\.md$/, '');
    if (!slug) return;

    // description（手写纯文本）> excerpt（可能带标签）> 正文开头
    let excerpt = toPlainText(post.description);
    if (!excerpt) excerpt = clip(post.excerpt, 200);
    if (!excerpt && post.content) excerpt = clip(post.content, 200);

    map[slug] = {
      title: toPlainText(post.title) || slug,
      excerpt: excerpt,
      cover: post.cover || post.og_image || '',
      url: post.permalink,
      path: pathOf(post.permalink),   // ← 前端按这个查，slug 只兜底
      date: post.date ? new Date(post.date).toISOString().slice(0, 10) : ''
    };
  });

  const body = 'window.__GOOSE_SELF_LINKS__ = ' + safeInlineJson(map) + ';';

  return {
    path: 'js/goose/self-links.js',
    data: body
  };
});
