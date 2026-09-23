/**
 * GooseBlog — 国际化模块接口
 * 供 ES 模块 import 使用。全局功能见 i18n-core.js。
 */
export function t(key) {
  return window.__ ? window.__(key) : key;
}
export function setLocale(loc) {
  if (window.__setLocale) window.__setLocale(loc);
}
export function locale() {
  return localStorage.getItem('gooseblog_lang') || (
    (navigator.language || '').startsWith('zh') ? 'zh' : 'en'
  );
}
