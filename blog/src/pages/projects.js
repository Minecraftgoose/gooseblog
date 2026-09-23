/**
 * GooseBlog — 项目展示页
 * 从 GooseCode 的 Supabase 动态加载 Minecraft_goose 的项目数据
 */
export function renderProjects(container) {
  container.innerHTML = `
    <div class="page-hero">
      <h1>${window.__ ? window.__('projects.title') : '项目'}</h1>
      <p>${window.__ ? window.__('projects.subtitle') : 'Minecraft_goose 正在跑的项目'}</p>
    </div>
    <div id="gooseProjects" class="project-section">
      <h2 class="project-cat-title"><i class="fas fa-star"></i> ${window.__ ? window.__('projects.series') : 'Goose 系列'}</h2>
      <div class="project-grid" id="gooseGrid"></div>
    </div>
    <div id="otherProjects" class="project-section">
      <h2 class="project-cat-title"><i class="fas fa-th-large"></i> ${window.__ ? window.__('projects.other') : '其他项目'}</h2>
      <div class="project-grid" id="otherGrid"></div>
    </div>
    <div id="projectsLoading" class="state-msg">
      <div class="spinner"></div>
      <p>${window.__ ? window.__('projects.loading') : '加载项目中...'}</p>
    </div>
  `;

  loadProjects();
}

async function loadProjects() {
  try {
    // 只取 Minecraft_goose 的项目
    const res = await fetch(
      "https://apewxkpsviopumcitakg.supabase.co/rest/v1/gc_projects?select=*&applicant_name=eq.Minecraft_goose&order=sort_order.asc",
      {
        headers: {
          'apikey': 'sb_publishable_LShDumbhQWeCs2cgwtAJlw_nMi-olNP',
          'Authorization': 'Bearer sb_publishable_LShDumbhQWeCs2cgwtAJlw_nMi-olNP',
        }
      }
    );
    if (!res.ok) throw new Error(window.__ ? window.__('error.failed') : '加载失败');
    const projects = await res.json();

    document.getElementById('projectsLoading').style.display = 'none';

    const goose = projects.filter(p => p.category === 'goose');
    const other = projects.filter(p => p.category === 'other');

    renderGrid('gooseGrid', goose);
    renderGrid('otherGrid', other);
  } catch (err) {
    document.getElementById('projectsLoading').innerHTML = `
      <p style="color:var(--danger);">加载项目失败: ${err.message}</p>
      <button class="retry-btn" onclick="location.reload()">${window.__ ? window.__('projects.retry') : '重试'}</button>
    `;
  }
}

function renderGrid(id, projects) {
  const grid = document.getElementById(id);
  if (!grid) return;

  if (projects.length === 0) {
    grid.style.display = 'none';
    // 隐藏对应的 section 标题
    const section = grid.closest('.project-section');
    if (section) section.style.display = 'none';
    return;
  }

  grid.innerHTML = projects.map(p => `
    <div class="project-card">
      <div class="project-name"><i class="${p.icon || 'fas fa-code'}"></i> ${escapeHtml(p.name)}</div>
      <div class="project-desc">${escapeHtml(p.description || '')}</div>
      <div class="project-link"><a href="${escapeHtml(p.url)}" target="_blank" rel="noopener"><i class="fas fa-arrow-right"></i> ${window.__ ? window.__('projects.viewDetail') : '查看详情'}</a></div>
    </div>
  `).join('');
  if (window._springIn) setTimeout(function() { window._springIn(grid); }, 50);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
