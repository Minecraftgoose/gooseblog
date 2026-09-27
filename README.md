# GooseBlog（Hexo 版）

原 GooseBlog 是 **Cloudflare Pages（SPA 静态壳）+ Pages Functions 透传 + Worker 查 Supabase** 的动态架构。
这一版把它改成了**纯静态 Hexo 站**：后端删除、UI 换成 `hexo-theme-redefine`，**资源一件不丢**。

| | 旧 | 新 |
| --- | --- | --- |
| 生成 | 运行时 `fetch('/api/posts')` | `hexo generate` 构建期 |
| 数据 | Supabase `posts` 表 | `source/_posts/*.md` |
| 主题 | 自写紫色玻璃风 SPA | hexo-theme-redefine 2.9.0 |
| 后端 | Worker + Pages Functions 查库 | 仅一个抓 og:图的代理 Worker（不连库） |
| 部署 | `wrangler pages deploy blog/` | `hexo g` → `wrangler pages deploy public` |
| 域名 | blog.goose.cc.cd | 不变 |

## 保留下来的东西

**资源（原文件直接搬，未重新生成）**

- `background.webp` / `background-1920.webp` / `background-1280.webp` —— 三档响应式壁纸
- `avatar.webp`（导航栏 Logo + 侧栏头像）、`avatar-256.webp`（favicon）、`og-default.jpg`
- `vendor/prism/` —— 原站 prism 与 18 个语言包（**保留但未启用**：Redefine 用 highlight.js 的类名，与 prism 的 token 类名不兼容，所以实际高亮由 Hexo 内置 highlight 负责）

**功能**

| 原功能 | 现在的落点 |
| --- | --- |
| 首页发文热力图 | `scripts/generate-heatmap.js` 构建期算好 → `source/js/goose/heatmap.js` 渲染，零请求 |
| 复制链接 / 生成海报悬浮球 | `source/js/goose/share.js`（海报仍走 html2canvas + quickchart 二维码） |
| 链接社交媒体卡片 | `source/js/goose/link-card.js`，去掉后端抓取，改为域名 + favicon + 链接标题 |
| 侧栏《流浪地球》台词打字机 | 81 句台词写进主题配置 `home_banner.subtitle.text`，零网络请求 |
| 公告横幅 | 主题配置 `home.sidebar.announcement` |
| 归档 / 标签 / 友链 / 项目 / 关于 | Hexo 原生归档标签 + `source/friends`、`source/projects`、`source/about` |
| 代码高亮、复制按钮、TOC、字数统计 | 主题自带（Hexo 内置 highlight.js，原 `code-copy.js` / `toc-ball.js` 由主题承接） |
| OG / Twitter 卡片 | 主题 `open_graph`，默认图 = `og-default.jpg` |
| 阅读进度条、站内搜索 | 主题自带（原站没有搜索，静态站补上了） |
| **评论（新增）** | giscus → GitHub Discussions，配置见下文 |

导航栏与首页侧栏统一用英文（HOME / ARCHIVES / TAGS / CATEGORIES / PROJECTS / FRIENDS / ABOUT），
文字写在 `navbar.links[*].text` 和 `home.sidebar.links[*].text`，想改回中文直接改 `text`。

## 目录结构

```
.
├── _config.yml                 站点配置（url / permalink / 分页 6 篇 / marked 对齐旧站）
├── package.json
├── scripts/                    ⚠️ Hexo 会把这里的文件当插件加载，只能放 .js
│   ├── generate-heatmap.js     构建期生成热力图数据
│   ├── generate-self-links.js  构建期生成站内文章索引（链接卡片用，零请求解析站内链接）
│   └── extra-assets.js         把 source/_headers 带进 public/（hexo 默认忽略 _ 开头）
├── tools/
│   └── import-from-csv.mjs     从自备 CSV 恢复文章/友链/关于页/公告（含分类映射）
├── worker/
│   └── link-preview/           ★ 全站唯一保留的 Worker：抓外链 og:图（不连数据库）
├── source/
│   ├── _posts/                 ★ 15 篇旧文章（Markdown，只有 drive 是 HTML）
│   ├── _headers                Cloudflare Pages 缓存头
│   ├── _data/links.yml         友链（导出脚本生成，主题自动读取）
│   ├── about/  friends/  projects/  tags/  categories/
│   ├── images/                 ★ Goose 原站图片资源
│   ├── vendor/prism/           ★ prism 与语言包
│   ├── css/goose-skin.css      Goose 组件皮肤（热力图/分享球/海报/链接卡片）
│   └── js/goose/               Goose 组件脚本
└── themes/redefine/            hexo-theme-redefine（源码内置，含 Goose 定制 _config.yml）
```

## 本地跑

```bash
npm install
npm run server       # http://localhost:4000
npm run build        # 产物在 public/
```

## 内容迁移

**已完成**：15 篇文章 + 5 条友链 + 关于页 + 公告。
**全部完成**：15 篇文章 + 5 条友链 + 关于页 + 公告 + 项目页（手写）。

和 Supabase 已彻底脱钩 —— 不再需要 `SUPABASE_URL` / `SUPABASE_KEY`，也没有任何脚本会去连它。
数据以后就是仓库里的 Markdown，改完 `git push` 即可。

```bash
# 备查：如果哪天还要从导出的 CSV 重新恢复一遍
npm run import:csv -- --dir=/path/to/csv
```

导入要点：

- **正文**：优先用 `markdown` 原文字段（以后还能继续编辑），只有 `drive` 这篇没存原文，退回用渲染后的 HTML
- **时间**：`created_at` 是 UTC，脚本统一转成东八区再写 front-matter，否则文章时间会比原站早 8 小时
- **友链**：写到 `source/_data/links.yml`，主题在 `generateBefore` 自动读取，**不用手抄进主题配置**
- **分类**：原站 `posts` 表没有 category 字段，15 篇文章的分类是**人工补的**（见下表），写在 `tools/import-from-csv.mjs` 的 `CATEGORY_MAP` 里，重跑导入会自动带上
- 然后 `npm run build` 重新生成即可

### 分类方案

tag 记品牌与类型（GooseHost / 文档 / 教程…），分类记内容域，两者互补。只做单层，不搞层级（避免嵌套 URL）。

| 分类 | 篇数 | 文章 |
| --- | --- | --- |
| 项目 | 7 | GooseHost 教程 / 自托管指南 / CLI 文档、GooseHyperGlass 问题汇总 / 2.0 日志 / 难绷事件、GooseAI 为什么消失 |
| 折腾 | 3 | 驾考模拟器、TimeFreeze、Kimi 发现只读面板 |
| 随笔 | 2 | 九一八事变 95 周年、为什么 Github 正在变差 |
| 教程 | 2 | Markdown 入门、怎么查网站有没有被收录 |
| 建站 | 1 | GooseBlog 升级日志 2026-07-27 |

标签共 9 个：文档(6) / GooseHyperGlass(3) / GooseHost(3) / 教程(2) / 历史 / html小游戏 / GitHub / GooseAI / GooseBlog。
## 部署（Cloudflare Pages）

1. 仓库 Settings → Secrets and variables → Actions 配两个 Secret：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. Pages 项目 `gooseblog` 的 **Production branch** 设为 `production`
3. 推 `main` 或 `production` 分支 → `.github/workflows/deploy.yml` 自动 `npm ci` → `hexo g` → `wrangler pages deploy public`

推其他分支只出 Preview，自定义域名不会变。

> 旧的 `gooseblog-api` Worker 已不再需要，可以在 Cloudflare 后台停掉或删除。

## 主题文件的定制点

改了 Redefine 的 3 个 ejs（升级主题时需要重新打上），目的都是让文字可由配置驱动、不依赖语言文件：

| 文件 | 改动 |
| --- | --- |
| `layout/components/header/navbar.ejs` | 导航项文字优先取 `theme.navbar.links[*].text` |
| `layout/pages/home/home-sidebar.ejs` | 侧栏链接文字优先取 `theme.home.sidebar.links[*].text` |
| `layout/components/sidebar/statistics.ejs` | 侧栏计数标签取 `theme.home.sidebar.statistics_labels` |

## 链接预览 Worker

`worker/link-preview/` 是全站唯一保留的 Worker。原站这套能力挂在 `gooseblog-api` 里，和数据库耦合；现在拆成独立 Worker：

- **做什么**：`GET /api/link-preview?url=...` → 抓目标页的 `og:image` / `og:title` / `og:description`，顺带解析 `<link rel="icon">` 拿 favicon
- **不做什么**：不连数据库、不读任何环境变量、不需要 Secret
- **缓存**：Cloudflare Cache API，24 小时
- **路由**：`blog.goose.cc.cd/api/link-preview*`（只接管这一个路径，其余仍走 Pages）
- **部署**：推 `main` / `production` 时 CI 自动 `wrangler deploy`；也可本地 `npx wrangler@4.141.0 deploy --config worker/link-preview/wrangler.toml`

排错备忘（这几个坑都真实踩过）：

- `wrangler.toml` 里**所有顶层字段必须写在 `[[routes]]` 之前**。TOML 规则：写在表声明后面的顶层字段会被当成那张表的字段，于是 wrangler 报 `Expected "routes" to be an array of ...` 并整个部署失败。
- 自定义域名的 route 必须带 `zone_name`（或 `zone_id`），只写 `pattern` 不行。
- `workers_dev` 是顶层字段，不属于 route。
- wrangler 4.141 起**硬性要求 Node ≥ 22**，低于 22 直接退出、连配置都不解析（所以 CI 里 `NODE_VERSION` 是 22）。

前端 `source/js/goose/link-card.js` 先把卡片渲染出来，再去异步补图，并发上限 4、超时 8 秒。代理挂了也不影响页面。

**站内链接不走 Worker**：原站是让 Worker 发现链接指向自己就去查库（注释写着「绝不走公网回环 fetch」），现在改成构建期生成索引 `js/goose/self-links.js`，前端直接查表 —— 零请求、100% 命中，也彻底避开 Worker 回环 fetch 自己域名被 Cloudflare 拦下的老问题。

换域名（比如改用 `*.workers.dev`）时，改 `themes/redefine/_config.yml` 里 `inject.head` 的 `window.__GOOSE_LINK_PREVIEW__` 一行即可。

## 已知取舍

- **评论**：原站本来就没有评论功能。这次新增 giscus，评论存进 `Minecraftgoose/gooseblog` 的 GitHub Discussions，零后端、免费、支持 Reactions。**已启用**（`comment.enable: true`），分类 = Announcements（只有仓库维护者和 giscus bot 能开帖，防垃圾）。
- **链接卡片**：保留原效果。数据分两路：
  - **站内链接** → `scripts/generate-self-links.js` 构建期生成的 `js/goose/self-links.js` 索引，零网络请求、必定命中，拿到的是本地的标题/摘要/封面（原站靠 Worker 绕开公网回环去查库，现在本地解决，更快也更准）
  - **外站链接** → `worker/link-preview` 纯代理抓 og:图（浏览器直接 fetch 外站会被 CORS 拦死，必须有中转），不连数据库、不需要 Secret
  - 抓不到图就只显示「域名标识 + 标题」，不会开天窗。favicon 由 Worker 从目标站自己的 `<link rel="icon">` 解析，拿不到就画域名首字母标（纯 CSS）——**别用 faviconkit 那类第三方服务**，它们对没 favicon 的站点会返回默认蓝点，卡片上就顶着一个莫名的小蓝点
- **代码高亮**：用 Hexo 内置 highlight.js（构建期生成 `.hljs-*` 类），主题自带 github / vs2015 深浅色主题。`_config.yml` 里 `highlight.enable` 必须为 `true`，否则一块色都没有。注意 highlight.js 对 shell 的 token 类型偏少（只有注释、内置命令如 `cd`、字符串会着色），普通命令名不上色，这是 hljs 的固有行为。
- **写文章**：原来的 `/admin` 后台（Supabase 写库）随后端一起删除，改为本地写 Markdown 后 `git push`。
- **紫色玻璃风 / 钉钉进步体**：按需求弃用。视觉与字体全走 Redefine 原味（Chillax / Geist），只有壁纸、头像、OG 图还是 Goose 的。
