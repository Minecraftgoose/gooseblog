/**
 * GooseBlog — 后台全权管理
 * 登录 → 文章列表（编辑/删除）+ 写文章/编辑
 */
import { escapeHtml, formatDate } from '../js/utils.js';
import { navigate } from '../js/router.js';

const API = '/api';
const PWD_KEY = 'gooseblog_admin_pwd';

export function renderAdmin(container) {
  if (sessionStorage.getItem('gooseblog_admin')) {
    renderManage(container);
  } else {
    renderLogin(container);
  }
}

function authHeaders(extra = {}) {
  return { 'X-Admin-Password': sessionStorage.getItem(PWD_KEY) || '', ...extra };
}

/* ---------- 登录 ---------- */
function renderLogin(container) {
  container.innerHTML = `
    <div class="admin-login-wrap">
      <div class="admin-card">
        <h1 style="margin-bottom:24px;">管理员登录</h1>
        <div class="admin-field">
          <label>密码</label>
          <input type="password" id="admin-pwd" class="admin-input">
        </div>
        <div id="admin-login-error" class="admin-error"></div>
        <button id="admin-login-btn" class="admin-btn admin-btn-primary">登录</button>
      </div>
    </div>
  `;
  document.getElementById('admin-login-btn').addEventListener('click', () => {
    login(document.getElementById('admin-pwd').value);
  });
  document.getElementById('admin-pwd').addEventListener('keydown', e => {
    if (e.key === 'Enter') login(e.target.value);
  });
}

async function login(pwd) {
  const errorEl = document.getElementById('admin-login-error');
  errorEl.style.display = 'none';
  try {
    const res = await fetch(`${API}/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || '密码错误');
    }
    sessionStorage.setItem('gooseblog_admin', 'true');
    sessionStorage.setItem(PWD_KEY, pwd);
    renderManage(document.getElementById('app'));
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.style.display = 'block';
  }
}

function logout(container) {
  sessionStorage.removeItem('gooseblog_admin');
  sessionStorage.removeItem(PWD_KEY);
  renderLogin(container);
}

/* ---------- 管理主界面（文章列表） ---------- */
var adminTab = 'posts';

async function renderManage(container) {
  container.innerHTML = `
    <div class="admin-manage-wrap">
      <div class="admin-manage-header">
        <div class="admin-tabs">
          <button class="admin-tab ${adminTab === 'posts' ? 'active' : ''}" data-tab="posts">文章</button>
          <button class="admin-tab ${adminTab === 'page' ? 'active' : ''}" data-tab="page">关于页</button>
          <button class="admin-tab ${adminTab === 'announcement' ? 'active' : ''}" data-tab="announcement">公告</button>
          <button class="admin-tab ${adminTab === 'friends' ? 'active' : ''}" data-tab="friends">友链</button>
        </div>
        <div class="admin-header-actions">
          <button id="admin-new" class="admin-btn admin-btn-primary" style="${adminTab === 'page' || adminTab === 'announcement' ? 'display:none' : ''}">${adminTab === 'posts' ? '写文章' : '加友链'}</button>
          <button id="admin-logout" class="admin-btn admin-btn-ghost">退出</button>
        </div>
      </div>
      <div id="admin-list" class="admin-post-list">
        <div class="state-msg"><div class="spinner"></div><p>加载中...</p></div>
      </div>
    </div>
  `;

  container.querySelectorAll('.admin-tab').forEach(function(t) {
    t.addEventListener('click', function() {
      adminTab = this.dataset.tab;
      renderManage(container);
    });
  });
  document.getElementById('admin-logout').addEventListener('click', function() { logout(container); });

  if (adminTab === 'friends') {
    var btn = document.getElementById('admin-new');
    if (btn) btn.addEventListener('click', function() { renderFriendForm(container); });
    loadFriendList(container);
  } else if (adminTab === 'page') {
    renderAboutEditor(container);
  } else if (adminTab === 'announcement') {
    renderAnnouncementEditor(container);
  } else {
    document.getElementById('admin-new').addEventListener('click', function() { renderEditor(container, null); });
    loadPostList(container);
  }
}

async function loadPostList(container) {
  const listEl = document.getElementById('admin-list');
  try {
    const res = await fetch(`${API}/admin/posts`, { headers: authHeaders() });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || '加载失败');
    const posts = await res.json();
    if (!posts.length) {
      listEl.innerHTML = `<div class="admin-empty">还没有文章，点右上角「写文章」发第一篇。</div>`;
      return;
    }
    listEl.innerHTML = posts.map(p => `
      <div class="admin-post-row" data-id="${p.id}">
        <div class="admin-post-info">
          <div class="admin-post-title">${escapeHtml(p.title)}</div>
          <div class="admin-post-meta">
            <span>${formatDate(p.created_at)}</span>
            ${p.tag ? `<span>${escapeHtml(p.tag)}</span>` : ''}
            <span class="admin-post-slug">/${escapeHtml(p.slug)}</span>
          </div>
        </div>
        <div class="admin-post-ops">
          <button class="admin-btn admin-btn-ghost admin-btn-sm" data-act="view" data-slug="${escapeHtml(p.slug)}">查看</button>
          <button class="admin-btn admin-btn-ghost admin-btn-sm" data-act="edit" data-id="${p.id}">编辑</button>
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-act="del" data-id="${p.id}" data-title="${escapeHtml(p.title)}">删除</button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const act = btn.dataset.act;
        if (act === 'view') {
          navigate(`/post/${btn.dataset.slug}`);
        } else if (act === 'edit') {
          openEditor(container, btn.dataset.id);
        } else if (act === 'del') {
          if (confirm(`确定删除《${btn.dataset.title}》？此操作不可恢复。`)) {
            await deletePost(btn.dataset.id);
            loadPostList(container);
          }
        }
      });
    });
  } catch (err) {
    listEl.innerHTML = `<div class="admin-empty">加载失败：${escapeHtml(err.message)}</div>`;
  }
}

async function deletePost(id) {
  const res = await fetch(`${API}/admin/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert('删除失败：' + (data.error || res.status));
    return; // 删除失败不清缓存，避免误把旧列表刷掉
  }
  window.dispatchEvent(new Event('home:invalidate'));
}

// 打开编辑器前先拉取完整文章（走 admin 接口，含 markdown）
async function openEditor(container, id) {
  container.innerHTML = `<div class="state-msg"><div class="spinner"></div><p>加载中...</p></div>`;
  try {
    const res = await fetch(`${API}/admin/posts/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('文章加载失败');
    const post = await res.json();
    // 优先展示 markdown 原文
    renderEditor(container, { ...post, content: post.markdown || post.content || '' });
  } catch (err) {
    alert(err.message);
    renderManage(container);
  }
}

/* ---------- 编辑器（新建 / 编辑） ---------- */
function renderEditor(container, post) {
  const editing = !!post;
  const p = post || {};
  container.innerHTML = `
    <div class="admin-editor-wrap">
      <div class="admin-editor-card">
        <div class="admin-editor-header">
          <h1 style="margin:0;">${editing ? '编辑文章' : '写文章'}</h1>
          <button id="admin-back" class="admin-btn admin-btn-ghost">返回列表</button>
        </div>

        <div class="admin-form-grid">
          <!-- 标题 + Slug 横排 -->
          <div class="admin-field"><label>标题</label><input id="admin-title" class="admin-input" placeholder="文章标题" value="${escapeHtml(p.title || '')}"></div>
          <div class="admin-field"><label>Slug（留空自动生成）</label><input id="admin-slug" class="admin-input" placeholder="如: my-first-post" value="${escapeHtml(p.slug || '')}"></div>

          <!-- 摘要 + 标签 横排 -->
          <div class="admin-field"><label>摘要</label><input id="admin-excerpt" class="admin-input" placeholder="一句话摘要" value="${escapeHtml(p.excerpt || '')}"></div>
          <div class="admin-field"><label>标签</label><input id="admin-tag" class="admin-input" placeholder="如: 技术, 设计" value="${escapeHtml(p.tag || '')}"></div>

          <!-- 封面独占整行 -->
          <div class="admin-field admin-form-full">
            <label>封面图片 URL</label>
            <div style="display:flex;gap:8px;">
              <input id="admin-cover" class="admin-input" placeholder="https://..." style="flex:1;" value="${escapeHtml(p.cover_url || '')}">
              <button id="admin-random-cover" class="admin-btn admin-btn-ghost" type="button">随机</button>
            </div>
          </div>

          <!-- 置顶开关 -->
          <div class="admin-field admin-form-full">
            <label class="admin-switch-label">
              <input type="checkbox" id="admin-pinned" ${p.pinned ? 'checked' : ''}>
              <span>置顶文章（显示在列表最前，标题前显示向上箭头图标）</span>
            </label>
          </div>

          <!-- 正文独占整行 -->
          <div class="admin-field admin-form-full">
            <label>正文（支持 Markdown）</label>
            <textarea id="admin-content" class="admin-textarea" placeholder="在这里写 Markdown...">${escapeHtml(p.content || '')}</textarea>
          </div>
        </div>

        <div class="admin-actions">
          <button id="admin-save" class="admin-btn admin-btn-primary">${editing ? '保存修改' : '发布'}</button>
          <div id="admin-status"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('admin-back').addEventListener('click', () => renderManage(container));

  document.getElementById('admin-random-cover').addEventListener('click', async () => {
    const btn = document.getElementById('admin-random-cover');
    btn.textContent = '...';
    btn.disabled = true;
    try {
      const res = await fetch(`${API}/cover`);
      const data = await res.json();
      if (data.url) document.getElementById('admin-cover').value = data.url;
    } catch { /* 静默失败 */ }
    btn.textContent = '随机';
    btn.disabled = false;
  });

  document.getElementById('admin-save').addEventListener('click', () => save(container, editing ? p.id : null));
}

async function save(container, id) {
  const title = document.getElementById('admin-title').value.trim();
  const slugInput = document.getElementById('admin-slug').value.trim();
  const excerpt = document.getElementById('admin-excerpt').value.trim();
  const tag = document.getElementById('admin-tag').value.trim();
  const coverUrl = document.getElementById('admin-cover').value.trim();
  const raw = document.getElementById('admin-content').value;
  const pinnedEl = document.getElementById('admin-pinned');
  const pinned = pinnedEl ? pinnedEl.checked : false;
  let statusEl = document.getElementById('admin-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'admin-status';
    const actions = container.querySelector('.admin-actions');
    if (actions) actions.appendChild(statusEl);
  }

  if (!title) {
    statusEl.innerHTML = '<p class="admin-status-error">标题不能空</p>';
    return;
  }

  const slug = slugInput || title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // 把原始内容发给 Worker，由它来判断是否转 HTML + 存 markdown 原文
  const content = raw;

  statusEl.innerHTML = '<p class="admin-status-msg">保存中...</p>';

  try {
    const editing = id != null;
    const res = await fetch(`${API}/admin/posts${editing ? '/' + id : ''}`, {
      method: editing ? 'PUT' : 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title, slug, excerpt, tag, cover_url: coverUrl, content, pinned }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || '保存失败');
    }
    const saved = await res.json();
    statusEl.innerHTML = `<p class="admin-status-success">${editing ? '已保存' : '发布成功'}！ <a href="/post/${saved.slug || slug}">查看</a></p>`;
    window.dispatchEvent(new Event('home:invalidate'));
    // 稍候回列表
    setTimeout(() => renderManage(container), 700);
  } catch (err) {
    statusEl.innerHTML = `<p class="admin-status-error">${escapeHtml(err.message)}</p>`;
  }
}

/* ---------- 友链管理 ---------- */
async function loadFriendList(container) {
  var listEl = document.getElementById('admin-list');
  try {
    var res = await fetch('/api/friends');
    if (!res.ok) throw new Error('加载失败');
    var friends = await res.json();
    if (!friends || !friends.length) {
      listEl.innerHTML = '<div class="admin-empty">暂无友链，点右上角「加友链」添加。</div>';
      return;
    }
    listEl.innerHTML = friends.map(function(f) {
      return '<div class="admin-post-row">' +
        '<div class="admin-post-info">' +
          '<div class="admin-post-title">' + escapeHtml(f.name) + '</div>' +
          '<div class="admin-post-meta">' +
            '<span>' + escapeHtml(f.url) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="admin-post-ops">' +
          '<button class="admin-btn admin-btn-danger admin-btn-sm" data-del-friend="' + f.id + '">删除</button>' +
        '</div>' +
      '</div>';
    }).join('');

    listEl.querySelectorAll('[data-del-friend]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (confirm('确定删除这条友链？')) {
          fetch('/api/admin/friends', { method: 'DELETE', headers: authHeaders({'Content-Type': 'application/json'}), body: JSON.stringify({id: parseInt(this.dataset.delFriend)}) })
            .then(function(r) { return r.json(); })
            .then(function() { loadFriendList(container); });
        }
      });
    });
  } catch (err) {
    listEl.innerHTML = '<div class="admin-empty">加载失败: ' + escapeHtml(err.message) + '</div>';
  }
}

function renderFriendForm(container) {
  document.getElementById('admin-list').innerHTML =
    '<div class="admin-card" style="max-width:480px;">' +
      '<h2 style="margin-bottom:16px;">添加友链</h2>' +
      '<div class="admin-field"><label>站点名称</label><input id="f-name" class="admin-input" placeholder="站点名称"></div>' +
      '<div class="admin-field"><label>站点描述</label><input id="f-desc" class="admin-input" placeholder="站点描述"></div>' +
      '<div class="admin-field"><label>站点链接</label><input id="f-url" class="admin-input" placeholder="https://..."></div>' +
      '<div class="admin-field"><label>头像链接</label><input id="f-avatar" class="admin-input" placeholder="https://..."></div>' +
      '<div class="admin-actions">' +
        '<button id="f-save" class="admin-btn admin-btn-primary">保存</button>' +
        '<button id="f-cancel" class="admin-btn admin-btn-ghost" style="margin-left:8px;">取消</button>' +
      '</div>' +
      '<div id="f-status" style="margin-top:10px;"></div>' +
    '</div>';

  document.getElementById('f-save').addEventListener('click', function() {
    var name = document.getElementById('f-name').value.trim();
    var url = document.getElementById('f-url').value.trim();
    if (!name || !url) { document.getElementById('f-status').innerHTML = '<p class="admin-status-error">名称和链接不能为空</p>'; return; }
    fetch('/api/admin/friends', {
      method: 'POST',
      headers: authHeaders({'Content-Type': 'application/json'}),
      body: JSON.stringify({
        name: name,
        description: document.getElementById('f-desc').value.trim(),
        url: url,
        avatar: document.getElementById('f-avatar').value.trim()
      })
    }).then(function(r) {
      return r.json().catch(function() { return {}; }).then(function(data) {
        if (!r.ok) throw new Error(data.error || ('保存失败 (' + r.status + ')'));
        return data;
      });
    })
      .then(function() { adminTab = 'friends'; renderManage(container); })
      .catch(function(err) { document.getElementById('f-status').innerHTML = '<p class="admin-status-error">' + escapeHtml(err.message) + '</p>'; });
  });
  document.getElementById('f-cancel').addEventListener('click', function() { adminTab = 'friends'; renderManage(container); });
}

/* ---------- 关于页编辑器 ---------- */

function renderAboutEditor(container) {
  const listEl = document.getElementById('admin-list');
  if (!listEl) return;
  listEl.innerHTML = '<div class="state-msg"><div class="spinner"></div><p>加载中...</p></div>';

  fetch(API + '/admin/pages/about', { headers: authHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var md = data.content || '';
      listEl.innerHTML = '\
        <div class="admin-editor-wrap">\
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600">编辑关于页面</h3>\
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:10px">支持 Markdown 格式。</p>\
          <textarea id="about-editor" style="width:100%;min-height:250px;resize:vertical;padding:12px;font-size:14px;line-height:1.6;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--acrylic-input);color:var(--text);font-family:monospace;box-sizing:border-box">' + escapeHtml(md) + '</textarea>\
          <div style="margin-top:12px;display:flex;gap:8px">\
            <button id="about-save" class="admin-btn admin-btn-primary">保存</button>\
            <span id="about-status" style="font-size:13px;color:var(--text-secondary);margin-left:8px;align-self:center"></span>\
          </div>\
        </div>\
      ';

      document.getElementById('about-save').addEventListener('click', function() { saveAbout(); });
    })
    .catch(function(err) {
      listEl.innerHTML = '<div class="state-msg"><p>加载失败: ' + err.message + '</p></div>';
    });

  function saveAbout() {
    var textarea = document.getElementById('about-editor');
    var statusEl = document.getElementById('about-status');
    if (!textarea || !statusEl) return;
    var md = textarea.value;
    statusEl.textContent = '保存中...';
    fetch(API + '/admin/pages/about', {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ content: md }),
    })
      .then(function(r) { return r.json(); })
      .then(function() {
        statusEl.textContent = '已保存';
        setTimeout(function() { statusEl.textContent = ''; }, 2000);
      })
      .catch(function(err) {
        statusEl.textContent = '保存失败: ' + err.message;
      });
  }
}

/** 公告编辑器（存 site_pages 表 slug=announcement，支持 Markdown，空内容 = 不显示） */
function renderAnnouncementEditor(container) {
  const listEl = document.getElementById('admin-list');
  if (!listEl) return;
  listEl.innerHTML = '<div class="state-msg"><div class="spinner"></div><p>加载中...</p></div>';

  fetch(API + '/admin/pages/announcement', { headers: authHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var md = data.content || '';
      listEl.innerHTML = '\
        <div class="admin-editor-wrap">\
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600">编辑公告</h3>\
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:10px">支持 Markdown。留空则不在站点显示。</p>\
          <textarea id="announcement-editor" style="width:100%;min-height:120px;resize:vertical;padding:12px;font-size:14px;line-height:1.6;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--acrylic-input);color:var(--text);font-family:monospace;box-sizing:border-box">' + escapeHtml(md) + '</textarea>\
          <div style="margin-top:12px;display:flex;gap:8px">\
            <button id="announcement-save" class="admin-btn admin-btn-primary">保存</button>\
            <span id="announcement-status" style="font-size:13px;color:var(--text-secondary);margin-left:8px;align-self:center"></span>\
          </div>\
        </div>\
      ';

      document.getElementById('announcement-save').addEventListener('click', function() { saveAnnouncement(); });
    })
    .catch(function(err) {
      listEl.innerHTML = '<div class="state-msg"><p>加载失败: ' + err.message + '</p></div>';
    });

  function saveAnnouncement() {
    var textarea = document.getElementById('announcement-editor');
    var statusEl = document.getElementById('announcement-status');
    if (!textarea || !statusEl) return;
    var md = textarea.value;
    statusEl.textContent = '保存中...';
    fetch(API + '/admin/pages/announcement', {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ content: md }),
    })
      .then(function(r) { return r.json(); })
      .then(function() {
        statusEl.textContent = '已保存';
        setTimeout(function() { statusEl.textContent = ''; }, 2000);
      })
      .catch(function(err) {
        statusEl.textContent = '保存失败: ' + err.message;
      });
  }
}

/** 简易 markdown → HTML（和后端 marked 保持一致） */
function simpleMarkdown(md) {
  var esc = function(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  // 先保护围栏代码块，避免被后面的行内规则/转义破坏
  var blocks = [];
  var html = String(md == null ? '' : md)
    .replace(/```([a-zA-Z0-9+#_-]*)\r?\n?([\s\S]*?)```/g, function(_, lang, code) {
      var cls = lang ? ' class="language-' + lang.toLowerCase() + '"' : '';
      blocks.push('<pre><code' + cls + '>' + esc(code.replace(/\n$/, '')) + '</code></pre>');
      return '\u0000CODEBLOCK_' + (blocks.length - 1) + '\u0000';
    });
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/\u0000CODEBLOCK_(\d+)\u0000/g, function(_, i) { return blocks[+i]; });
  return html;
}
