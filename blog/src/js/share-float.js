/**
 * GooseBlog 鈥?分享鎮?诞球（鍦ㄧ洰褰曠悆涓婃柟锛? */
(function() {
  if (window._shareFloatInit) return;
  window._shareFloatInit = true;

  // ---- 鍒涘缓 DOM ----
  var ball = document.createElement('button');
  ball.className = 'share-float-ball hidden';
  ball.setAttribute('aria-label', window.__ ? window.__('share.copyLink') : '分享');
  ball.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'share-float-panel';
  panel.innerHTML =
    '<button class="share-float-item" id="floatCopyLink">' +
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6.14929 4.02032C7.11197 4.02032 7.87983 4.02016 8.49597 4.07598C9.12128 4.13269 9.65792 4.25188 10.1415 4.53106C10.7202 4.8653 11.2008 5.3459 11.535 5.92462C11.8142 6.40818 11.9334 6.94481 11.9901 7.57012C12.0459 8.18625 12.0458 8.95419 12.0458 9.9168C12.0458 10.8795 12.0459 11.6473 11.9901 12.2635C11.9334 12.8888 11.8142 13.4254 11.535 13.909C11.2008 14.4877 10.7202 14.9683 10.1415 15.3025C9.65792 15.5817 9.12128 15.7009 8.49597 15.7576C7.87984 15.8134 7.11196 15.8133 6.14929 15.8133C5.18667 15.8133 4.41874 15.8134 3.80261 15.7576C3.1773 15.7009 2.64067 15.5817 2.1571 15.3025C1.5784 14.9683 1.09778 14.4877 0.76355 13.909C0.484366 13.4254 0.365184 12.8888 0.308472 12.2635C0.252649 11.6473 0.252808 10.8795 0.252808 9.9168C0.252808 8.95418 0.252664 8.18625 0.308472 7.57012C0.365184 6.94481 0.484366 6.40818 0.76355 5.92462C1.09777 5.34589 1.57839 4.86529 2.1571 4.53106C2.64067 4.25188 3.1773 4.13269 3.80261 4.07598C4.41874 4.02017 5.18666 4.02032 6.14929 4.02032ZM6.14929 5.37774C5.16181 5.37774 4.46634 5.37761 3.92566 5.42657C3.39434 5.47472 3.07859 5.56574 2.83582 5.70587C2.4632 5.92106 2.15354 6.2307 1.93835 6.60333C1.79823 6.8461 1.70721 7.16185 1.65906 7.69317C1.6101 8.23385 1.61023 8.92933 1.61023 9.9168C1.61023 10.9043 1.61009 11.5998 1.65906 12.1404C1.70721 12.6717 1.79823 12.9875 1.93835 13.2303C2.15356 13.6029 2.46321 13.9126 2.83582 14.1277C3.07859 14.2679 3.39434 14.3589 3.92566 14.407C4.46634 14.456 5.16182 14.4559 6.14929 14.4559C7.13682 14.4559 7.83224 14.456 8.37292 14.407C8.90425 14.3589 9.21999 14.2679 9.46277 14.1277C9.83535 13.9126 10.145 13.6029 10.3602 13.2303C10.5004 12.9875 10.5914 12.6717 10.6395 12.1404C10.6885 11.5998 10.6884 10.9043 10.6884 9.9168C10.6884 8.92934 10.6885 8.23384 10.6395 7.69317C10.5914 7.16185 10.5004 6.8461 10.3602 6.60333C10.1451 6.23071 9.83536 5.92107 9.46277 5.70587C9.21999 5.56574 8.90424 5.47472 8.37292 5.42657C7.83224 5.3776 7.13682 5.37774 6.14929 5.37774ZM9.80164 0.367975C10.7638 0.367975 11.5314 0.36788 12.1473 0.423639C12.7726 0.480307 13.3093 0.598759 13.7928 0.877741C14.3717 1.21192 14.8521 1.69355 15.1864 2.27227C15.4655 2.75574 15.5857 3.29164 15.6425 3.9168C15.6983 4.53301 15.6971 5.3016 15.6971 6.26446V7.82989C15.6971 8.29264 15.6989 8.58993 15.6649 8.84844C15.4668 10.3525 14.401 11.5738 12.9833 11.9988V10.5467C13.6973 10.1903 14.2105 9.49662 14.3192 8.67169C14.3387 8.52347 14.3407 8.3358 14.3407 7.82989V6.26446C14.3407 5.27706 14.3398 4.58149 14.2909 4.04083C14.2428 3.50968 14.1526 3.19372 14.0126 2.95098C13.7974 2.57849 13.4876 2.26869 13.1151 2.05352C12.8724 1.91347 12.5564 1.82237 12.0253 1.77423C11.4847 1.72528 10.7888 1.7254 9.80164 1.7254H7.71472C6.7562 1.72558 5.92665 2.27697 5.52332 3.07891H4.07019C4.54221 1.51132 5.9932 0.368186 7.71472 0.367975H9.80164Z" fill="currentColor"/></svg>' +
      (window.__ ? window.__('share.copyLink') : '澶嶅埗链接') +
    '</button>' +
    '<button class="share-float-item" id="floatGenPoster">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
      (window.__ ? window.__('share.genPoster') : '鐢熸垚娴锋姤') +
    '</button>';

  document.body.appendChild(ball);
  document.body.appendChild(panel);

  // comment
  function updateLang() {
    var lbl = window.__ ? window.__('share.copyLink') : '澶嶅埗链接';
    var pnl = window.__ ? window.__('share.genPoster') : '鐢熸垚娴锋姤';
    var cl = panel.querySelector('#floatCopyLink');
    var gp = panel.querySelector('#floatGenPoster');
    if (cl) { var tn = cl.childNodes; if (tn.length > 1) tn[tn.length-1].textContent = ' ' + lbl; else cl.textContent = lbl; }
    if (gp) { var tn2 = gp.childNodes; if (tn2.length > 1) tn2[tn2.length-1].textContent = ' ' + pnl; else gp.textContent = pnl; }
    if (ball) ball.setAttribute('aria-label', lbl);
  }
  window.addEventListener('langchange', updateLang);

  var active = false;
  function setActive(v) { active = v; panel.classList.toggle('active', v); }

  ball.addEventListener('click', function() { setActive(!active); });
  document.addEventListener('click', function(e) {
    if (active && !ball.contains(e.target) && !panel.contains(e.target)) setActive(false);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && active) setActive(false);
  });

  // ---- 鍔熻兘 ----
  function copyLink() {
    var url = location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function() { toast(window.__ ? window.__('share.copied') : '链接已复制'); })
        .catch(function() { toast(window.__ ? window.__('share.copyFail') : '复制失败'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = url; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      toast(window.__ ? window.__('share.copied') : '链接已复制');
    }
    setActive(false);
  }

  function genPoster() {
    setActive(false);
    // 点击文章底部"生成海报"按钮（触发 share-bar.js 里已有的海报逻辑）?
    var btn = document.getElementById('postGenPoster');
    if (btn) { btn.click(); return; }
    toast(window.__ ? window.__('share.genFail') : '璇锋墦寮€文章鍐嶈瘯');
  }

  function toast(msg) {
    var t = document.getElementById('postToast');
    if (!t) { t = document.createElement('div'); t.id = 'postToast'; t.className = 'post-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('active');
    clearTimeout(t._tid);
    t._tid = setTimeout(function() { t.classList.remove('active'); }, 2000);
  }

  panel.querySelector('#floatCopyLink').addEventListener('click', copyLink);
  panel.querySelector('#floatGenPoster').addEventListener('click', genPoster);

  // ---- 显隐：有 .post-content 且非 about 页时显示 ----
  function check() {
    var hasContent = !!document.querySelector('.post-content') && !location.pathname.startsWith('/about');
    ball.classList.toggle('hidden', !hasContent);
  }

  var rootEl = document.getElementById('root') || document.body;
  var mo = new MutationObserver(check);
  mo.observe(rootEl, { childList: true, subtree: true });
  check();
})();
