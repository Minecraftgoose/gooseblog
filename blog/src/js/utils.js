/**
 * GooseBlog — 通用工具函数
 */

/** 格式化日期 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/** 格式化短日期（归档用） */
export function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    month: '2-digit', day: '2-digit',
  });
}

/** HTML 转义 */
export function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/** 渲染状态消息（加载中 / 错误 / 空） */
export function renderState(container, type, message, onRetry) {
  if (type === 'loading') {
    container.innerHTML = `
      <div class="state-msg">
        <div class="spinner"></div>
        <p>${message || (window.__ ? window.__('error.loading') : '加载中...')}</p>
      </div>`;
  } else if (type === 'error') {
    container.innerHTML = `
      <div class="state-msg error">
        <p>${message || (window.__ ? window.__('error.failed') : '加载失败')}</p>
        ${onRetry ? '<button class="retry-btn">重试</button>' : ''}
      </div>`;
    const btn = container.querySelector('.retry-btn');
    if (btn && onRetry) btn.onclick = onRetry;
  } else if (type === 'empty') {
    container.innerHTML = `
      <div class="state-msg">
        <div class="empty-icon">G</div>
        <p>${message || (window.__ ? window.__('error.empty') : '暂无内容')}</p>
      </div>`;
  }
}
