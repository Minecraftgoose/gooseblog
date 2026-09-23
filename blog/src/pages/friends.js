/**
 * GooseBlog — 友链页
 */
import { fetchFriends } from '../js/api.js';
import { escapeHtml, renderState } from '../js/utils.js';

export function renderFriends(container) {
  renderState(container, 'loading', '');
  loadFriends(container);
}

async function loadFriends(container) {
  try {
    var friends = await fetchFriends();
    if (!friends || !friends.length) {
      container.innerHTML = '<div class="state-msg"><div class="empty-icon">G</div><p>' + (window.__ ? window.__('friends.empty') : '暂无友链') + '</p></div>';
      return;
    }
    container.innerHTML =
      '<div class="page-hero"><h1>' + (window.__ ? window.__('nav.friends') : '友链') + '</h1><p>' + (window.__ ? window.__('friends.subtitle') : '朋友们的好东西') + '</p></div>' +
      '<div class="friend-grid">' +
        friends.map(function(f) {
          return '<a class="friend-card" href="' + escapeHtml(f.url || '') + '" target="_blank" rel="noopener noreferrer">' +
            '<img class="friend-avatar" src="' + escapeHtml(f.avatar || '') + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<div class="friend-info">' +
              '<div class="friend-name">' + escapeHtml(f.name || '') + '</div>' +
              '<div class="friend-desc">' + escapeHtml(f.description || '') + '</div>' +
            '</div>' +
          '</a>';
        }).join('') +
      '</div>';
    if (window._springIn) window._springIn(container);
  } catch (err) {
    renderState(container, 'error', err.message, function() { loadFriends(container); });
  }
}
