---
title: 项目
type: page
layout: page
comment: false
---

<div class="goose-projects">

<h2><i class="fa-regular fa-star"></i> Goose 系列</h2>
<div class="goose-project-grid">

<div class="goose-project-card">
  <div class="goose-project-name"><i class="fa-solid fa-rocket"></i> GooseHost</div>
  <div class="goose-project-desc">静态网站托管平台，把 HTML 变成一条链接。带 CLI、自托管方案。</div>
  <div class="goose-project-link"><a href="https://host.goose.cc.cd/" target="_blank" rel="noopener">查看详情 <i class="fa-solid fa-arrow-right"></i></a></div>
</div>

<div class="goose-project-card">
  <div class="goose-project-name"><i class="fa-solid fa-cube"></i> GooseHyperGlass CDN</div>
  <div class="goose-project-desc">液态玻璃 UI 组件库，基于 Apache 2.0 的 liquid-glass-webgl 二次开发，CDN 直接引入。</div>
  <div class="goose-project-link"><a href="/posts/ghg2-log/">看看开发记录 <i class="fa-solid fa-arrow-right"></i></a></div>
</div>

<div class="goose-project-card">
  <div class="goose-project-name"><i class="fa-solid fa-blog"></i> GooseBlog</div>
  <div class="goose-project-desc">就是这个站。Hexo + Redefine，纯静态。</div>
  <div class="goose-project-link"><a href="/posts/gooseblog-update-20260727/">升级日志 <i class="fa-solid fa-arrow-right"></i></a></div>
</div>

<div class="goose-project-card">
  <div class="goose-project-name"><i class="fa-solid fa-robot"></i> GooseAI</div>
  <div class="goose-project-desc">已融合进 GooseHost，Copilot 形态继续提供原来的能力。</div>
  <div class="goose-project-link"><a href="/posts/why-gooseai-disappear/">为什么消失了 <i class="fa-solid fa-arrow-right"></i></a></div>
</div>

</div>

<h2><i class="fa-regular fa-th-large"></i> 其他项目</h2>
<div class="goose-project-grid">

<div class="goose-project-card">
  <div class="goose-project-name"><i class="fa-solid fa-snowflake"></i> TimeFreeze</div>
  <div class="goose-project-desc">Minecraft 服务器插件：最后一个玩家离开时冻结时间与天气，回来无缝继续。</div>
  <div class="goose-project-link"><a href="/posts/TimeFreeze/">查看详情 <i class="fa-solid fa-arrow-right"></i></a></div>
</div>

<div class="goose-project-card">
  <div class="goose-project-name"><i class="fa-solid fa-car"></i> 驾考模拟器</div>
  <div class="goose-project-desc">纯 HTML 小游戏，在浏览器里练科目一。</div>
  <div class="goose-project-link"><a href="/posts/drive/">直接在文章里玩 <i class="fa-solid fa-arrow-right"></i></a></div>
</div>

</div>

</div>

<!--
  项目卡片手写维护（原站存在 Supabase gc_projects 表，现已彻底脱钩）。
  格式：

  <div class="goose-project-card">
    <div class="goose-project-name"><i class="fa-solid fa-cube"></i> 项目名</div>
    <div class="goose-project-desc">一句话介绍</div>
    <div class="goose-project-link"><a href="https://..." target="_blank" rel="noopener">查看详情 <i class="fa-solid fa-arrow-right"></i></a></div>
  </div>

  说明：
   - 图标用 Font Awesome 6（主题内置），fa-solid / fa-regular 都行
   - 没有外链的项目可以链到站内文章（像上面几张卡那样），不用硬凑 URL
   - 加卡片直接复制上面的块，往 .goose-project-grid 里塞就行
-->
