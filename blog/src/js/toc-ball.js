/**
 * GooseBlog 鈥?鎮?诞鐞冪偣鍑诲睍寮€文章鐩?綍
 * 鍙?湪文章椤碉紙.post-content 瀛樺湪鏃讹級鏄剧ず
 */
(function() {
  if (window._tocBallInit) return;
  window._tocBallInit = true;

  // ---- 鍒涘缓 DOM ----
  var ball = document.createElement('button');
  ball.className = 'toc-ball hidden';
  ball.setAttribute('aria-label', (window.__ ? window.__('toc.label') : '文章鐩?綍'));
  ball.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'toc-panel';

  document.body.appendChild(ball);
  document.body.appendChild(panel);

  var active = false;

  // ---- 鏋勫缓鐩?綍 ----
  function buildTOC() {
    var aiContent = document.querySelector('.post-content');
    if (!aiContent) {
      ball.classList.add('hidden');
      return;
    }

    var headings = aiContent.querySelectorAll('h1, h2, h3');
    if (headings.length === 0) {
      ball.classList.add('hidden');
      return;
    }

    ball.classList.remove('hidden');

    var html = '<div class="toc-panel-title">' + (window.__ ? window.__('toc.label') : '鐩?綍') + '</div>';
    headings.forEach(function(h, i) {
      if (!h.id) h.id = 'toc-heading-' + i;
      var level = h.tagName.toLowerCase();
      var text = h.textContent.trim().substring(0, 60);
      html += '<button class="toc-item toc-' + level + '" data-target="' + h.id + '">' + text + '</button>';
    });
    panel.innerHTML = html;

    // 缁戠偣鍑昏烦杞?
    panel.querySelectorAll('.toc-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var target = document.getElementById(this.getAttribute('data-target'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActive(false);
      });
    });
  }

  function setActive(v) {
    active = v;
    panel.classList.toggle('active', v);
  }

  // ---- 浜嬩欢 ----
  ball.addEventListener('click', function() {
    buildTOC(); // 姣忔?鎵撳紑刷新锛圫PA 切换鏃跺唴瀹瑰彲鑳藉彉浜嗭級
    setActive(!active);
  });

  document.addEventListener('click', function(e) {
    if (active && !ball.contains(e.target) && !panel.contains(e.target)) {
      setActive(false);
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && active) setActive(false);
  });

  // ---- SPA 璺?敱切换妫€娴?----
  var rootEl = document.getElementById('root') || document.body;
  var mo = new MutationObserver(function() {
    var hasContent = !!document.querySelector('.post-content');
    if (!hasContent) {
      ball.classList.add('hidden');
      setActive(false);
    } else {
      buildTOC();
    }
  });
  mo.observe(rootEl, { childList: true, subtree: true });

  // 棣栧睆妫€鏌?
  buildTOC();
})();
