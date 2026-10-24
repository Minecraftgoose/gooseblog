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
  function toBase64(url) {
    if (!url) return Promise.resolve(null);

    // 站内资源（头像 /images/avatar.webp、兜底 og.webp）同源，天生不污染，
    // 没必要多绕一趟网络。
    if (isLocalUrl(url)) return Promise.resolve(url);

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

  /**
   * 海报字体就位。
   *
   * ⚠️ html2canvas 对 @font-face 的支持很弱，常见表现是：页面上明明是
   *    自定义字体，截图里却变成了系统默认字体 —— 且**不报错**，
   *    你只会觉得"这个海报看着不对劲"。
   *
   *    前提是先让浏览器把字体真正加载完。@font-face 是懒加载的：
   *    没有元素用到它，浏览器一个字节都不会下。所以这里必须显式
   *    document.fonts.load() 催一下，load 完再截图。
   */
  function ensurePosterFont() {
    if (!POSTER_FONT_URL) return Promise.resolve();
    if (!document.fonts || !document.fonts.load) return Promise.resolve();

    var spec = POSTER_FONT_WEIGHT + ' 32px "' + POSTER_FONT_NAME + '"';
    return document.fonts.load(spec).catch(function () {}).then(function () {
      // 再兜一层：title 真正挂上字体后强制一次重排，
      // 免得字体到了但布局还按旧字体算，出现换行错位
      if (document.fonts.check) {
        try { document.fonts.check(spec); } catch (e) {}
      }
    });
  }

  function loadHtml2Canvas(cb) {
    if (window.html2canvas) return cb();
    var s = document.createElement('script');
    s.src = 'https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = function () { cb(); };
    s.onerror = function () { cb(new Error('load fail')); };
    document.head.appendChild(s);
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

    var ready = false;

    dl.addEventListener('click', function (e) {
      e.preventDefault();
      if (!ready) return;
      loadHtml2Canvas(function (err) {
        if (err || !window.html2canvas) { toast('海报组件加载失败'); return; }
        dl.textContent = '生成中...';
        waitPosterImages(poster).then(function () {
          return window.html2canvas(poster, {
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
