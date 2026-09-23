/**
 * GooseBlog — GitHub 风格贡献热力图
 * 纯 SVG 渲染，零依赖
 *
 * 用法：
 *   const heatmap = createHeatmap(container, data, options);
 *   data = { 'YYYY-MM-DD': count, ... }
 *   options: { weeks, cellSize, gap, colorRange }
 */
export function createHeatmap(container, data = {}, options = {}) {
  try {
    renderHeatmap(container, data, options);
  } catch (e) {
    console.error('[GooseBlog] 热力图渲染失败:', e);
    // 绝对兜底：手写一个最小 SVG 保证不空白
    container.innerHTML = `<svg viewBox="0 0 600 100" width="100%" xmlns="http://www.w3.org/2000/svg">
      <text x="300" y="50" text-anchor="middle" fill="rgba(139,92,246,0.6)" font-size="12">${window.__ ? window.__('heatmap.title') : '贡献热力图'}</text>
    </svg>`;
  }
}

function renderHeatmap(container, optionsObj = {}) {
  const {
    weeks = 53,
    cellSize = 11,
    gap = 3,
    colorRange = [
      'rgba(139, 92, 246, 0.12)',
      'rgba(139, 92, 246, 0.3)',
      'rgba(139, 92, 246, 0.5)',
      'rgba(139, 92, 246, 0.72)',
      'rgba(139, 92, 246, 1)',
    ],
    demoFallback = true,
  } = typeof optionsObj === 'object' && !Array.isArray(optionsObj) ? optionsObj : {};

  // optionsObj 可能是第二个参数 data（旧调用方式兼容）
  let data = (typeof arguments[1] === 'object' && arguments[1] && !Array.isArray(arguments[1])) ? arguments[1] : {};

  // 不再填充 demo 假数据，只显示真实文章贡献

  // 响应式周数
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  let displayWeeks = vw < 540 ? 18 : (vw < 900 ? 32 : weeks);

  const counts = Object.values(data).map(Number);
  const max = Math.max(1, ...counts);

  const today = new Date();
  const endSunday = new Date(today);
  endSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);

  // 起始日期（结果为某周一，d=0 对应周一）
  const startDay = new Date(endSunday);
  startDay.setDate(endSunday.getDate() - (displayWeeks * 7 - 1));

  const monthLabelHeight = 16;
  const weekdayLabelWidth = 28;
  const gridWidth = displayWeeks * (cellSize + gap) - gap;
  const gridHeight = 7 * (cellSize + gap) - gap;
  const totalWidth = weekdayLabelWidth + gridWidth;
  const totalHeight = monthLabelHeight + gridHeight;

  // 预生成所有格子（用二维索引，不用 indexOf）
  const rects = [];
  const monthLabels = [];
  let lastMonth = -1;

  for (let w = 0; w < displayWeeks; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + w * 7 + d);

      const x = weekdayLabelWidth + w * (cellSize + gap);
      const y = monthLabelHeight + d * (cellSize + gap);

      // 月份标签（每周第一行检测）
      if (d === 0) {
        const m = date.getMonth();
        if (m !== lastMonth) {
          monthLabels.push(`<text x="${x}" y="11" class="heatmap-month">${monthShort(m)}</text>`);
          lastMonth = m;
        }
      }

      if (date > today) {
        rects.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" class="heatmap-cell-future"/>`);
      } else {
        const key = date.toISOString().slice(0, 10);
        const count = data[key] || 0;
        const color = getColor(count, max, colorRange);
        const dateStr = key;
        const tooltip = count > 0 ? `${dateStr} — ${count} 篇文章` : `${dateStr} — ` + (window.__ ? window.__('heatmap.empty') : '没发东西');
        rects.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" class="heatmap-cell"><title>${tooltip}</title></rect>`);
      }
    }
  }

  // 星期标签：周一开头布局 d=0=周一(Mon), d=2=周三(Wed), d=4=周五(Fri), d=6=周日(Sun)
  const weekdayLabels = ['Mon', 'Wed', 'Fri', 'Sun'];
  const weekdayEls = [0, 2, 4, 6].map(d =>
    `<text x="0" y="${monthLabelHeight + d * (cellSize + gap) + cellSize - 2}" class="heatmap-weekday">${weekdayLabels[[0,2,4,6].indexOf(d)]}</text>`
  ).join('');

  container.innerHTML =
    `<svg class="heatmap" viewBox="0 0 ${totalWidth} ${totalHeight}" width="100%" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">` +
      monthLabels.join('') +
      weekdayEls +
      rects.join('') +
    '</svg>';
}

function getColor(count, max, colorRange) {
  if (count === 0) return colorRange[0];
  const ratio = count / max;
  if (ratio <= 0.25) return colorRange[1];
  if (ratio <= 0.5) return colorRange[2];
  if (ratio <= 0.75) return colorRange[3];
  return colorRange[4];
}

function monthShort(m) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m];
}

function generateDemoData() {
  const data = {};
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (Math.random() < 0.35) {
      data[key] = Math.floor(Math.random() * 4) + 1;
    }
  }
  return data;
}
