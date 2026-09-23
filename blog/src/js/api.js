/**
 * GooseBlog — API 客户端
 * 所有后端接口调用集中管理
 *
 * 重要：Cloudflare Worker 有冷启动（国内访问首条请求经常 4~6s），
 * 所有 fetch 均带 AbortController 超时控制（默认 15s），
 * 超时抛出明确错误信息而非无限挂起。
 */
const API_BASE = '/api';
const FETCH_TIMEOUT = 15000; // 15s（覆盖 Worker 冷启动 + 国内到 Supabase 的延迟）

/**
 * 带 abort 超时的 fetch 封装
 * 超时自动取消请求并抛出可读错误；正常返回时清除定时器。
 */
function fetchWithTimeout(url, options = {}, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal }).then((res) => {
    clearTimeout(timer);
    return res;
  }).catch((err) => {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('请求超时，请检查网络后重试');
    throw err;
  });
}

export async function fetchPosts(tag = null, exclude = null) {
  let url = `${API_BASE}/posts`;
  const params = [];
  if (tag) params.push(`tag=${encodeURIComponent(tag)}`);
  if (exclude) params.push(`exclude=${encodeURIComponent(exclude)}`);
  if (params.length) url += '?' + params.join('&');
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(window.__ ? window.__('error.failed') : '加载失败');
  return res.json();
}

export async function fetchPost(slug) {
  const res = await fetchWithTimeout(`${API_BASE}/posts/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(window.__ ? window.__('error.failed') : '加载失败');
  return res.json();
}

export async function fetchTags() {
  const res = await fetchWithTimeout(`${API_BASE}/tags`);
  if (!res.ok) throw new Error(window.__ ? window.__('error.failed') : '加载失败');
  return res.json();
}

export async function fetchArchive() {
  const res = await fetchWithTimeout(`${API_BASE}/archive`);
  if (!res.ok) throw new Error(window.__ ? window.__('error.failed') : '加载失败');
  return res.json();
}

export async function fetchHeatmap() {
  const res = await fetchWithTimeout(`${API_BASE}/heatmap`);
  if (!res.ok) throw new Error(window.__ ? window.__('error.failed') : '加载失败');
  return res.json();
}

export async function fetchFriends() {
  const res = await fetchWithTimeout(`${API_BASE}/friends`);
  if (!res.ok) throw new Error(window.__ ? window.__('error.failed') : '加载失败');
  return res.json();
}
