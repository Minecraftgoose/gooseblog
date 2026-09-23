/**
 * GooseBlog — 自定义右键菜单
 * 拦截浏览器默认右键，弹出站内导航菜单。
 * 表单输入区（input/textarea）放行原生菜单，方便复制粘贴。
 */
import { navigate, goBack, goForward, canGoBack, canGoForward } from './router.js';

export function initContextMenu() {
  const menu = document.createElement('div');
  menu.className = 'ctx-menu';
  menu.innerHTML = `
    <button class="ctx-item" data-act="back"><i class="fas fa-arrow-left"></i> ${window.__ ? window.__('context.back') : '后退'}</button>
    <button class="ctx-item" data-act="forward"><i class="fas fa-arrow-right"></i> ${window.__ ? window.__('context.forward') : '前进'}</button>
    <div class="ctx-sep"></div>
    <button class="ctx-item" data-act="home"><i class="fas fa-home"></i> ${window.__ ? window.__('context.home') : '首页'}</button>
    <button class="ctx-item" data-act="archive"><i class="fas fa-archive"></i> ${window.__ ? window.__('context.archive') : '归档'}</button>
    <button class="ctx-item" data-act="about"><i class="fas fa-user"></i> ${window.__ ? window.__('context.about') : '关于'}</button>
  `;
  document.body.appendChild(menu);

  const backItem = menu.querySelector('[data-act="back"]');
  const fwdItem = menu.querySelector('[data-act="forward"]');

  function open(x, y) {
    menu.style.display = 'block';
    const { innerWidth, innerHeight } = window;
    const w = menu.offsetWidth;
    const h = menu.offsetHeight;
    const px = Math.min(x, innerWidth - w - 8);
    const py = Math.min(y, innerHeight - h - 8);
    menu.style.left = px + 'px';
    menu.style.top = py + 'px';
    backItem.classList.toggle('disabled', !canGoBack());
    fwdItem.classList.toggle('disabled', !canGoForward());
  }

  function close() { menu.style.display = 'none'; }

  document.addEventListener('contextmenu', e => {
    // 表单区放行原生菜单（复制粘贴）
    if (e.target.closest('input, textarea, [contenteditable="true"]')) return;
    e.preventDefault();
    open(e.clientX, e.clientY);
  });

  // 点击任意处 / 滚动 / Esc 关闭
  document.addEventListener('click', close);
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  menu.addEventListener('click', e => {
    const item = e.target.closest('.ctx-item');
    if (!item || item.classList.contains('disabled')) return;
    const act = item.dataset.act;
    close();
    if (act === 'back') goBack();
    else if (act === 'forward') goForward();
    else if (act === 'home') navigate('/');
    else if (act === 'archive') navigate('/archive');
    else if (act === 'about') navigate('/about');
  });
}
