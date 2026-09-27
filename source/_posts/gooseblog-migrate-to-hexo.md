---
title: GooseBlog 搬家记：从 Cloudflare SPA 到 Hexo 静态站
date: 2026-07-17 16:45:00
updated: 2026-07-17 16:45:00
tags:
  - 折腾
  - 前端
categories:
  - 建站
cover: /images/og-default.jpg
description: 把 GooseBlog 从「Pages + Functions + Supabase」的动态架构换成纯静态 Hexo，后端删掉、UI 换成 Redefine，资源一件不丢。
sticky: true
---

> 这是一篇占位文章，用来确认新站渲染正常。跑完 `npm run export:goose` 把旧文章导进来之后，可以直接删掉它。

## 为什么要搬

旧架构是 Cloudflare Pages 当静态壳 + Pages Functions 做透传 + Worker 查 Supabase。能用，但代价是：

- 首屏要等 Worker 冷启动，国内访问经常 4~6 秒白屏
- 文章在数据库里，改一个错别字都要打开后台
- 动态渲染的 OG 图、社交卡片，全靠一堆边界处理兜底

静态化之后：页面是提前生成好的 HTML，CDN 直接吐，首屏没有数据库往返。

## 换了什么

| | 旧 | 新 |
| --- | --- | --- |
| 生成 | 运行时 fetch | Hexo 构建期 |
| 数据 | Supabase | `source/_posts/*.md` |
| 主题 | 自写紫色玻璃风 SPA | hexo-theme-redefine |
| 后端 | Worker + Pages Functions | 无 |
| 部署 | `wrangler pages deploy blog/` | `hexo g` → `wrangler pages deploy public` |

## 没换什么

- **资源**：`background.webp` 三档响应式壁纸、`avatar.webp`、`avatar-256.webp`、`og-default.jpg`、prism 语言包，原文件直接搬
- **首页发文热力图**：数据改由构建期算好，零请求
- **右下角分享球**：复制链接 + 生成海报，跟原来一样
- **侧栏台词**：那 81 句《流浪地球》还是内嵌的，不联网
- **链接卡片**：独立链接仍会渲染成社交媒体卡片（少了后端抓标题，改成域名 + 标题）

## 代码示例

构建期算热力图的那几行：

```js
hexo.extend.generator.register('goose-heatmap', function (locals) {
  const counts = {};
  locals.posts.data.forEach((post) => {
    const key = dayKey(new Date(post.date));
    counts[key] = (counts[key] || 0) + 1;
  });
  return { path: 'js/goose/heatmap-data.js', data: 'window.__GOOSE_HEATMAP__ = ' + JSON.stringify(counts) + ';' };
});
```

## 旧文章怎么进来

```bash
export SUPABASE_URL=https://xxx.supabase.co
export SUPABASE_KEY=<service_role key>
npm run export:goose
```

脚本会把 `posts` 表导成 `source/_posts/<slug>.md`，`friends` 表导成 `source/_data/friends.yml`，`site_pages` 里的关于页和公告也一起带走。
