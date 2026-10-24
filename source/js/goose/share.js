/**
 * GooseBlog —— 分享悬浮球：复制链接 + 生成海报
 * 移植自原站 blog/src/js/share-bar.js + share-float.js
 *
 * 差别：
 *   - 原站海报按钮在文章底部（依赖 admin 渲染）
 *   - 早期移植做成了独立悬浮球（position: fixed + 写死 bottom/right），
 *     跟主题自带的右下角工具栏（齿轮那一列）叠在一起，很格格不入。
 *     现在改成挂进工具栏：layout/utils/side-tools.ejs 里加了一个
 *     #gooseShareTool 项，随齿轮展开，位置由主题统一管理。
 *   - html2canvas 仍走 CDN（原站同款），加载失败时只保留复制链接，不报错
 *   - 只在文章页显示该工具项（非文章页加 .hidden）
 */
(function () {
  var AVATAR = '/images/avatar.webp';
  var SITE = 'blog.goose.cc.cd';
  // 文章既没封面、og 图也没配时的最终兜底
  var DEFAULT_COVER = '/images/og.webp';
  // 主题 lazyload 过滤器给正文图片塞的占位图（after_post_render 里写死的）
  var LAZY_PLACEHOLDER = /loading\.svg$/;

  var ICON_SHARE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
  var ICON_COPY = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6.15 4.02C7.11 4.02 7.88 4.02 8.50 4.08C9.12 4.13 9.66 4.25 10.14 4.53C10.72 4.87 11.20 5.35 11.53 5.92C11.81 6.41 11.93 6.94 11.99 7.57C12.05 8.19 12.05 8.95 12.05 9.92C12.05 10.88 12.05 11.65 11.99 12.26C11.93 12.89 11.81 13.43 11.53 13.91C11.20 14.49 10.72 14.97 10.14 15.30C9.66 15.58 9.12 15.70 8.50 15.76C7.88 15.81 7.11 15.81 6.15 15.81C5.19 15.81 4.42 15.81 3.80 15.76C3.18 15.70 2.64 15.58 2.16 15.30C1.58 14.97 1.10 14.49 0.76 13.91C0.48 13.43 0.37 12.89 0.31 12.26C0.25 11.65 0.25 10.88 0.25 9.92C0.25 8.95 0.25 8.19 0.31 7.57C0.37 6.94 0.48 6.41 0.76 5.92C1.10 5.35 1.58 4.87 2.16 4.53C2.64 4.25 3.18 4.13 3.80 4.08C4.42 4.02 5.19 4.02 6.15 4.02ZM6.15 5.38C5.16 5.38 4.47 5.38 3.93 5.43C3.39 5.47 3.08 5.57 2.84 5.71C2.46 5.92 2.15 6.23 1.94 6.60C1.80 6.85 1.71 7.16 1.66 7.69C1.61 8.23 1.61 8.93 1.61 9.92C1.61 10.90 1.61 11.60 1.66 12.14C1.71 12.67 1.80 12.99 1.94 13.23C2.15 13.60 2.46 13.91 2.84 14.13C3.08 14.27 3.39 14.36 3.93 14.41C4.47 14.46 5.16 14.46 6.15 14.46C7.14 14.46 7.83 14.46 8.37 14.41C8.90 14.36 9.22 14.27 9.46 14.13C9.84 13.91 10.14 13.60 10.36 13.23C10.50 12.99 10.59 12.67 10.64 12.14C10.69 11.60 10.69 10.90 10.69 9.92C10.69 8.93 10.69 8.23 10.64 7.69C10.59 7.16 10.50 6.85 10.36 6.60C10.15 6.23 9.84 5.92 9.46 5.71C9.22 5.57 8.90 5.47 8.37 5.43C7.83 5.38 7.14 5.38 6.15 5.38ZM9.80 0.37C10.76 0.37 11.53 0.37 12.15 0.42C12.77 0.48 13.31 0.60 13.79 0.88C14.37 1.21 14.85 1.69 15.19 2.27C15.47 2.76 15.59 3.29 15.64 3.92C15.70 4.53 15.70 5.30 15.70 6.26V7.83C15.70 8.29 15.70 8.59 15.66 8.85C15.47 10.35 14.40 11.57 12.98 12.00V10.55C13.70 10.19 14.21 9.50 14.32 8.67C14.34 8.52 14.34 8.34 14.34 7.83V6.26C14.34 5.28 14.34 4.58 14.29 4.04C14.24 3.51 14.15 3.19 14.01 2.95C13.80 2.58 13.49 2.27 13.12 2.05C12.87 1.91 12.56 1.82 12.03 1.77C11.48 1.73 10.79 1.73 9.80 1.73H7.71C6.76 1.73 5.93 2.28 5.52 3.08H4.07C4.54 1.51 5.99 0.37 7.71 0.37H9.80Z" fill="currentColor"/></svg>';
  var ICON_POSTER = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

  function toast(msg) {
    var t = document.getElementById('gooseToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'gooseToast';
      t.className = 'goose-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('active');
    clearTimeout(t._tid);
    t._tid = setTimeout(function () { t.classList.remove('active'); }, 2000);
  }

  function copyLink() {
    var url = location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        toast('链接已复制');
      }).catch(function () { toast('复制失败，手动长按链接吧'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('链接已复制'); } catch (e) { toast('复制失败'); }
      document.body.removeChild(ta);
    }
  }

  /**
   * 取图片的**真实**地址。
   *
   * 主题开了 articles.lazyload，after_post_render 过滤器会把正文里的
   * <img src="真实地址"> 改写成 <img lazyload src="/images/loading.svg" data-src="真实地址">。
   * 也就是说：图还没滚进视口时，src 是那张灰白占位图，真图藏在 data-src 里。
   * 直接读 src 会拿到 loading.svg。
   */
  function realImgSrc(img) {
    if (!img) return '';
    var src = img.getAttribute('src') || '';
    if (src && !LAZY_PLACEHOLDER.test(src)) return src;
    return img.getAttribute('data-src') || '';
  }

  /**
   * 取海报用的标题 + 封面。
   *
   * ⚠️ 原来第一行写的是 `document.querySelector('.markdown-body img')` ——
   *    那是**正文第一张图**，压根不是文章封面。叠加上面 lazyload 的问题，
   *    实际拿到的多半是 /images/loading.svg（一张灰白占位图），
   *    或者正文里某张毫不相干的配图。这就是"海报背景不对"的原因。
   *
   *    文章封面有两个可靠来源，按可靠性排序：
   *      1. 文章页顶部那张大图 —— article-content.ejs 渲染，
   *         它在 .article-title 里、不在 .markdown-body 里，没被 lazyload 改写
   *      2. og:image —— head.ejs 取的是 page.og_image，
   *         与 front-matter 的 cover 是同一张（全站 14 篇都一致），且是绝对地址
   */
  function currentMeta() {
    var title = document.title.replace(/\s*\|\s*GooseBlog\s*$/, '') || document.title;
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && ogTitle.getAttribute('content')) title = ogTitle.getAttribute('content');

    var cover = '';

    // 1) 文章页顶部封面（用户眼睛看到的那一张）
    cover = realImgSrc(document.querySelector('.article-title img'));

    // 2) og:image（front-matter 的 og_image，等价于 cover）
    if (!cover) {
      var og = document.querySelector('meta[property="og:image"]');
      cover = (og && og.getAttribute('content')) || '';
    }

    // 3) 最后才退到正文第一张图，且必须剥掉 lazyload 占位图
    if (!cover) cover = realImgSrc(document.querySelector('.markdown-body img'));

    return { title: title, cover: cover || DEFAULT_COVER };
  }

  // ==================================================================
  // 海报素材：全部先拉成本地 data: URL 再进 DOM
  // ==================================================================

  // 二维码仍用 quickchart.io（国内可达性实测最好，别换）。
  // 它跟封面一样是外链，所以同样要过一遍 base64 —— 反正要转，顺手一起解决。
  var QR_API = 'https://quickchart.io/qr?size=240&margin=1&text=';

  // 海报专用字体（ttf）。用户提供的字体到位后填这两项：
  //   POSTER_FONT_URL  站内路径，如 '/fonts/poster/GoosePoster.ttf'
  //   POSTER_FONT_NAME @font-face 里的 family 名
  // 留空则用系统字体栈，海报照出，只是字体不一样。
  var POSTER_FONT_URL = '';
  var POSTER_FONT_NAME = 'GoosePoster';
  var POSTER_FONT_WEIGHT = 700;

  // 单张图的抓取上限。图床偶尔会挂住，超时就当它不存在，
  // 别把整个海报拖到天荒地老 —— 少一张封面好过按钮一直转圈。
  var IMG_FETCH_TIMEOUT = 8000;

  var b64Cache = Object.create(null);
  var b64Inflight = Object.create(null);

  function isLocalUrl(url) {
    if (!url) return true;
    if (/^data:/i.test(url)) return true;
    if (/^\/\//.test(url)) return false;          // 协议相对，肯定外站
    if (/^\//.test(url)) return true;             // 站内绝对路径
    if (/^https?:/i.test(url)) {
      try { return new URL(url).origin === location.origin; }
      catch (e) { return false; }
    }
    return true;
  }

  /**
   * 外链图片 → data: URL。
   *
   * ⚠️ 这是"海报导出失败"的根因所在，别再指望 useCORS 了。
   *    html2canvas 的 useCORS 要生效，必须同时满足两件事：
   *      1. <img> 上写了 crossorigin="anonymous"
   *      2. 对方服务器回了 Access-Control-Allow-Origin
   *    第 2 条我们控制不了 —— 图床和 quickchart.io 都不保证给这个头。
   *    于是图照样显示（浏览器不管 CORS），但 canvas 被标记为 tainted，
   *    调 toDataURL() 当场抛 SecurityError，掉进 catch 变成一句"生成失败"。
   *
   *    拉回字节、转成 data: URL 之后，页面上根本没有外链了，
   *    canvas 想污染都污染不了，useCORS 加不加都无所谓。
   *
   * ⚠️ 失败时**不要回退原链接**（很多教程这么写，是错的）：
   *    原链接正是污染源，留着它这张海报一定导出失败。
   *    返回 null，让调用方把那张 <img> 摘掉 —— 宁可海报少个元素，
   *    也别整张废掉。做减法比做废片强。
   */
  function toBase64(url, force) {
    if (!url) return Promise.resolve(null);

    // 站内资源（头像 /images/avatar.webp、兜底 og.webp）同源，天生不污染，
    // 没必要多绕一趟网络。
    // 但字体是例外：它不进 canvas 的 img，而是要被内联成 data: 喂给
    // @font-face，所以调用方会传 force=true 强制转换。
    if (!force && isLocalUrl(url)) return Promise.resolve(url);

    if (b64Cache[url] !== undefined) return Promise.resolve(b64Cache[url]);
    if (b64Inflight[url]) return b64Inflight[url];

    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = null;

    var p = fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.blob();
      })
      .then(function (blob) {
        // 图床挂了经常是 200 + 一段 HTML，不判的话会转出一个"图片"，
        // 插进 DOM 里触发 error，看着像随机失败
        if (blob.type && blob.type.indexOf('image/') !== 0) {
          throw new Error('not an image: ' + blob.type);
        }
        return new Promise(function (resolve, reject) {
          var fr = new FileReader();
          fr.onloadend = function () { resolve(fr.result); };
          fr.onerror = function () { reject(new Error('FileReader failed')); };
          fr.readAsDataURL(blob);
        });
      })
      .catch(function () { return null; })
      .then(function (v) {
        if (timer) clearTimeout(timer);
        delete b64Inflight[url];
        b64Cache[url] = v;
        return v;
      });

    if (ctrl) {
      timer = setTimeout(function () { ctrl.abort(); }, IMG_FETCH_TIMEOUT);
    }
    b64Inflight[url] = p;
    return p;
  }

  /**
   * 等海报里的图片真正解码完再截图。
   *
   * html2canvas 只画"已经解码完"的图。src 刚赋值就截图，
   * 结果是海报顶部一块纯色 —— 看着像"背景图不对"，其实图还没到。
   *
   * 用 decode() 而不是 load 事件：decode() 保证像素已经可用，
   * 而 load 只说明字节下完了，某些浏览器上大图还会差一帧。
   * 老浏览器没有 decode()，退回 complete + naturalWidth 判断。
   */
  function waitPosterImages(root) {
    var imgs = [].slice.call(root.querySelectorAll('img'));
    return Promise.all(imgs.map(function (img) {
      if (!img.getAttribute('src')) return Promise.resolve();
      if (img.decode) {
        return img.decode().catch(function () {});
      }
      if (img.complete && img.naturalWidth) return Promise.resolve();
      return new Promise(function (resolve) {
        var done = false;
        var fin = function () { if (!done) { done = true; resolve(); } };
        img.addEventListener('load', fin);
        img.addEventListener('error', fin);
        setTimeout(fin, 6000);
      });
    }));
  }

  var fontInjected = false;

  /**
   * 海报字体就位。
   *
   * ⚠️ html2canvas 对 @font-face 的支持很弱，常见表现是：页面上明明是
   *    自定义字体，截图里却变成了系统默认字体 —— 且**不报错**，
   *    你只会觉得"这个海报看着不对劲"。
   *
   *    两道坎，都得迈过去：
   *
   *    1. 字体必须真的加载完。@font-face 是懒加载的：没有元素用到它，
   *       浏览器一个字节都不下。所以得显式 document.fonts.load() 催一下。
   *
   *    2. 字体得是 html2canvas 拿得到的形式。让它去按 URL 现拉一份 ttf
   *       很容易落空（时机 + 解析都不靠谱）。所以这里干脆把 ttf 读成
   *       base64、内联进 @font-face 的 src —— 字模就在样式表里，
   *       它爱怎么读怎么读，不存在"字体还没到"这一说。
   */
  function ensurePosterFont() {
    if (!POSTER_FONT_URL) return Promise.resolve();
    if (!document.fonts || !document.fonts.load) return Promise.resolve();

    var spec = POSTER_FONT_WEIGHT + ' 32px "' + POSTER_FONT_NAME + '"';

    var inject = fontInjected
      ? Promise.resolve()
      : toBase64(POSTER_FONT_URL, true).then(function (b64) {
          if (!b64) return;
          var st = document.createElement('style');
          st.textContent =
            '@font-face{font-family:"' + POSTER_FONT_NAME + '";' +
            'src:url(' + b64 + ') format("truetype");' +
            'font-weight:' + POSTER_FONT_WEIGHT + ';' +
            'font-style:normal;font-display:block}';
          document.head.appendChild(st);
          fontInjected = true;
        });

    return inject
      .then(function () { return document.fonts.load(spec).catch(function () {}); })
      .then(function () {
        // 字体到了但布局可能还按旧字体算的，check 一次强制刷新度量
        if (document.fonts.check) {
          try { document.fonts.check(spec); } catch (e) {}
        }
      });
  }

  /**
   * 加载截图库。
   *
   * ⚠️ 必须用 html2canvas-pro，不能用原版 html2canvas 1.4.1。
   *
   *    主题 Redefine 用的是 Tailwind v4，它的颜色值全是 oklch() ——
   *    `--color-gray-200: oklch(92.8% .006 264.531)` 这种。原版
   *    html2canvas 1.4.1 的色彩解析器只认 rgb()/hsl()/十六进制，
   *    撞上 oklch 当场抛：
   *        Error: Attempting to parse an unsupported color function "oklch"
   *    注意它是在**解析整页样式**时就炸的，不是画到海报才炸 —— 所以哪怕
   *    海报本身一个 oklch 都没用，只要页面上别处有，一样失败。
   *
   *    html2canvas-pro 是原版的活跃分支，补上了 oklch/oklab/lab/lch/color()
   *    这些现代色彩空间，API 完全兼容，换 CDN 地址即可，调用代码一行不用改。
   *
   * ⚠️ 两个坑：
   *    1. CDN 用 @latest 会在作者发新版时悄悄换实现，哪天出个回归
   *       你这边毫无征兆。锁死大版本号更稳。
   *    2. 国内访问 jsdelivr 偶发抽风，所以配了 bootcdn 兜底。
   *       两个都挂了才提示失败 —— 功能降级，不影响页面其它部分。
   */
  var H2C_CDN = [
    'https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js',
    'https://cdn.bootcdn.net/ajax/libs/html2canvas-pro/1.5.8/html2canvas-pro.min.js'
  ];

  // 解析出来的真正可用的截图函数（见 resolveH2C）
  var h2cFn = null;

  /**
   * 取出可用的截图函数。
   *
   * ⚠️ 不能直接 `window.html2canvas(...)` 就完事 —— 这个 fork 的 UMD 包
   *    在不同版本里挂的形状不一样：
   *      有的版本：window.html2canvas 就是函数本身（跟原版一样）
   *      有的版本：window.html2canvas 是模块命名空间对象，真函数在 .default 上
   *    裸调用撞上后者会报 "window.html2canvas is not a function"，
   *    一眼看上去像是"库没加载成功"，很容易误判方向。
   *    两种形状都认，取不到就返回 null 让上层明确报错。
   */
  function resolveH2C() {
    var g = window.html2canvas;
    if (typeof g === 'function') return g;
    if (g && typeof g.default === 'function') return g.default;
    return null;
  }

  function loadHtml2Canvas(cb) {
    var f = resolveH2C();
    if (f) { h2cFn = f; return cb(); }

    var i = 0;
    function next() {
      if (i >= H2C_CDN.length) { cb(new Error('load fail')); return; }
      var s = document.createElement('script');
      s.src = H2C_CDN[i++];
      s.onload = function () {
        var fn = resolveH2C();
        if (fn) { h2cFn = fn; cb(); }
        else next();               // 加载成功但没挂上全局，换下一个源
      };
      s.onerror = next;
      document.head.appendChild(s);
    }
    next();
  }

  function genPoster() {
    var meta = currentMeta();
    var qrSrc = QR_API + encodeURIComponent(location.href);

    var poster = document.createElement('div');
    poster.className = 'goose-poster-html';
    if (POSTER_FONT_URL) poster.classList.add('goose-poster-has-font');
    // 封面 img 先不带 src，下面用 setAttribute 填：URL 走属性赋值不会被引号截断，
    // 文章标题同理用 textContent，标题里带 < > 也不会把结构打断。
    poster.innerHTML =
      '<div class="goose-poster-html-bg">' +
        '<img class="goose-poster-html-cover" alt="">' +
        '<div class="goose-poster-html-gradient"></div>' +
      '</div>' +
      '<div class="goose-poster-html-title"></div>' +
      '<div class="goose-poster-html-divider"></div>' +
      '<div class="goose-poster-html-footer">' +
        '<div class="goose-poster-html-user">' +
          '<img class="goose-poster-html-avatar" alt="">' +
          '<div class="goose-poster-html-meta">' +
            '<span class="goose-poster-html-domain">' + SITE + '</span>' +
            '<span class="goose-poster-html-hint">扫码阅读这篇文章</span>' +
          '</div>' +
        '</div>' +
        '<img class="goose-poster-html-qr" alt="QR">' +
      '</div>';

    var titleEl = poster.querySelector('.goose-poster-html-title');
    if (titleEl) titleEl.textContent = meta.title;

    var coverEl = poster.querySelector('.goose-poster-html-cover');
    var avatarEl = poster.querySelector('.goose-poster-html-avatar');
    var qrEl = poster.querySelector('.goose-poster-html-qr');

    var overlay = document.createElement('div');
    overlay.className = 'goose-poster-overlay';
    var wrap = document.createElement('div');
    wrap.className = 'goose-poster-box';
    var close = document.createElement('button');
    close.className = 'goose-poster-close';
    close.innerHTML = '&times;';
    var dl = document.createElement('a');
    dl.className = 'goose-poster-download';
    dl.href = '#';
    dl.textContent = '准备中...';
    // 素材没转完不给点，避免点到一半导出一张没有封面的半成品
    dl.setAttribute('aria-disabled', 'true');

    wrap.appendChild(poster);
    wrap.appendChild(dl);
    wrap.appendChild(close);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('active'); });

    // 素材没备好之前，下载按钮点了也不走（见下面 click 里的 !ready 判断）
    var ready = false;

    /**
     * 素材准备：字体 → 三张图并发转 base64 → 填 src → 等解码。
     *
     * 全部走本地化之后，海报里再没有一个字节来自外站，canvas 不可能被污染。
     * 任何一张图失败就把它摘掉，让剩下的部分继续出图。
     */
    function prepare() {
      return ensurePosterFont().then(function () {
        return Promise.all([
          toBase64(meta.cover),
          toBase64(AVATAR),
          toBase64(qrSrc)
        ]);
      }).then(function (res) {
        var coverB64 = res[0], avatarB64 = res[1], qrB64 = res[2];

        if (coverB64 && coverEl) coverEl.setAttribute('src', coverB64);
        else if (coverEl) coverEl.remove();

        if (avatarB64 && avatarEl) avatarEl.setAttribute('src', avatarB64);
        else if (avatarEl) avatarEl.remove();

        if (qrB64 && qrEl) qrEl.setAttribute('src', qrB64);
        else if (qrEl) {
          qrEl.remove();
          toast('二维码加载失败，海报已省略');
        }

        return waitPosterImages(poster);
      });
    }

    prepare().then(function () {
      dl.textContent = '下载海报';
      dl.removeAttribute('aria-disabled');
      ready = true;
    }).catch(function () {
      dl.textContent = '素材加载失败';
    });

    dl.addEventListener('click', function (e) {
      e.preventDefault();
      if (!ready) return;
      loadHtml2Canvas(function (err) {
        // 用 resolveH2C 解析出来的函数，不要直接摸 window.html2canvas
        if (err || !h2cFn) { toast('海报组件加载失败'); return; }
        dl.textContent = '生成中...';
        waitPosterImages(poster).then(function () {
          return h2cFn(poster, {
            backgroundColor: '#15131f',
            scale: 2,
            useCORS: true,          // 兜底：万一有漏网的外链
            logging: false
          });
        }).then(function (c) {
            var a = document.createElement('a');
            a.href = c.toDataURL('image/png');
            a.download = 'gooseblog-poster.png';
            a.click();
            dl.textContent = '下载海报';
          })
          .catch(function (err2) {
            dl.textContent = '下载海报';
            // 到这一步基本只剩"canvas 被污染"一种可能：说明还有外链没被
            // 本地化。把 src 打出来，下次改代码时一眼能找到漏的那个。
            console.error('[goose] 海报导出失败', err2);
            toast('生成失败');
          });
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === close) overlay.remove();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
    });
  }

  /**
   * 面板贴着工具栏按钮的左侧弹出，跟着按钮走，不写死坐标。
   * 按钮不可见（工具栏收起 / 刚被 swup 换掉）时 rect 全 0，
   * 这时给个右下角兜底位置 —— 原版直接 return，面板会停在 body 末尾的
   * 静态位置（页面底部），看着像"面板没弹出来"。
   */
  function placePanel(ball, panel) {
    var r = ball && ball.isConnected ? ball.getBoundingClientRect() : null;
    if (!r || (!r.width && !r.height)) {
      panel.style.right = '78px';
      panel.style.bottom = '16px';
      return;
    }
    panel.style.right = (window.innerWidth - r.left + 10) + 'px';
    panel.style.bottom = (window.innerHeight - r.bottom) + 'px';
  }

  /**
   * 判断当前是不是文章页。
   *
   * ⚠️ 原来靠 `.article-title` 判断，但 Redefine 文章页的标题实际是
   *    `.article-title-cover`（有封面）/ `.article-title-regular`（无封面），
   *    CSS 类选择器是整串匹配，`.article-title` 永远选不中；
   *    兜底又去看 og:type，而主题调 open_graph() 时没传 type，
   *    hexo 默认输出的是 website 而不是 article —— 两条路都走不通，
   *    于是文章页也被判成"非文章页"。
   *
   *    改用 `.post-page-container`：它是 article-content.ejs 的根元素，
   *    而那个 partial 只在 is_post() 为真时渲染，是这篇文章页独有的特征。
   */
  function isPostPage() {
    if (document.querySelector('.post-page-container')) return true;
    var meta = document.querySelector('meta[property="og:type"]');
    return !!meta && meta.getAttribute('content') === 'article';
  }

  function ballEl() {
    return document.getElementById('gooseShareTool');
  }

  function build() {
    // ⚠️ 这个脚本带 data-swup-reload-script，swup 每次站内换页都会重新执行它。
    //    旧版用「panel 是否已存在」判断是否已初始化：panel 挂在 body 上、
    //    不在 swup 的替换范围内，换页后它还在 → 脚本直接 return，
    //    可工具栏在 #swup 里、已经被整块换成了新的按钮，新按钮从没绑过事件。
    //    表现就是：从首页点进文章，分享按钮看得见、点了没反应（直接刷新文章页却正常）。
    //
    //    现在改成：初始化只做一次（幂等标记），点击走 document 事件委托，
    //    每次点击动态取当前的按钮 —— 工具栏换多少次都不会失效。
    if (window.__gooseShareReady) return;

    // 分享按钮挂在主题自带的右下角工具栏里（layout/utils/side-tools.ejs）。
    // 找不到就说明工具栏还没渲染出来（或主题结构变了）：先不置位幂等标记，
    // 下次换页再试。不回退去造独立悬浮球 —— 那玩意儿位置写死，
    // 跟齿轮那一列挤在一起很难看。
    if (!ballEl()) return;
    window.__gooseShareReady = true;

    var panel = document.createElement('div');
    panel.id = 'gooseSharePanel';
    panel.className = 'goose-share-panel';
    panel.innerHTML =
      '<button class="goose-share-item" id="gooseCopyLink">' + ICON_COPY + '<span>复制链接</span></button>' +
      '<button class="goose-share-item" id="gooseGenPoster">' + ICON_POSTER + '<span>生成海报</span></button>';

    document.body.appendChild(panel);

    var active = false;
    function setActive(v) {
      active = v;
      if (v) placePanel(ballEl(), panel);
      panel.classList.toggle('active', v);
    }

    // 事件委托：不管工具栏被 swup 换成多少个新按钮，点击都能命中当前那一个
    document.addEventListener('click', function (e) {
      var ball = ballEl();
      if (!ball) return;
      if (ball.contains(e.target)) { setActive(!active); return; }
      if (active && !panel.contains(e.target)) setActive(false);
    });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && active) setActive(false); });
    window.addEventListener('resize', function () { if (active) placePanel(ballEl(), panel); });

    panel.querySelector('#gooseCopyLink').addEventListener('click', function () { copyLink(); setActive(false); });
    panel.querySelector('#gooseGenPoster').addEventListener('click', function () { genPoster(); setActive(false); });

    function check() {
      var ball = ballEl();
      if (!ball) return;
      var show = isPostPage();
      ball.classList.toggle('hidden', !show);
      if (!show) setActive(false);
    }

    // ⚠️ 观察 body 而不是 #swup：swup 换页用的是 element.replaceWith()，
    //    换掉的是 #swup 这个元素本身，旧引用立刻失效，挂在它上面的
    //    MutationObserver 从此再也不触发。body 才是换页全程都在的稳定锚点。
    //    加个节流：懒加载图片、swup 动画会短时间塞进几十个节点，
    //    不节流的话一次换页能把 check() 刷几十遍。
    var pending = null;
    function scheduleCheck() {
      if (pending) return;
      pending = setTimeout(function () { pending = null; check(); }, 120);
    }
    if (window.MutationObserver) {
      var mo = new MutationObserver(scheduleCheck);
      mo.observe(document.body, { childList: true, subtree: true });
    }

    function onPageView() { setTimeout(check, 80); }
    if (window.swup && window.swup.hooks) {
      window.swup.hooks.on('page:view', onPageView);
    } else {
      window.addEventListener('redefine:swup:ready', function (e) {
        var swup = e.detail && e.detail.swup;
        if (swup && swup.hooks) swup.hooks.on('page:view', onPageView);
      });
    }

    check();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
