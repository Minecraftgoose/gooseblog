/**
 * GooseBlog 鈥?图片查看鍣?紙lightbox锛? * 点击 .post-content 内的图片弹出全屏大图
 */
(function() {
  if (window._imageViewerInit) return;
  window._imageViewerInit = true;

  const overlay = document.createElement('div');
  overlay.className = 'image-overlay';
  overlay.innerHTML = '<button class="image-overlay-close" aria-label="' + (window.__ ? window.__('viewer.close') : '关闭') + '">&times;</button><img src="" alt="">';
  document.body.appendChild(overlay);

  const img = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.image-overlay-close');

  function open(src) {
    img.src = src;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function() { img.src = ''; }, 300);
  }

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay || e.target === closeBtn || e.target === img) close();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });

  // 鍏ㄥ眬濮旀墭锛氱偣楦?.post-content 閲岀殑图片
  document.addEventListener('click', function(e) {
    var target = e.target.closest('img');
    if (!target) return;
    // 鍙?湪文章姝ｆ枃鍖哄煙
    if (!target.closest('.post-content')) return;
    // comment
    if (target.naturalWidth < 40 || target.naturalHeight < 40) return;
    // 璺宠繃宸茬粡鏄?摼鎺ュ寘瑁圭殑锛堣?链接璧伴粯璁よ?涓猴級
    if (target.closest('a')) return;
    e.preventDefault();
    e.stopPropagation();
    open(target.src);
  });
})();
